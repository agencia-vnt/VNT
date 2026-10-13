import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const SIGNATURE_ORIGIN = "https://vntagencia.com";
export const SIGNATURE_FALLBACK = `${SIGNATURE_ORIGIN}/es`;
export const SIGNATURE_TOKEN_TTL = 600;
const idPattern = /^[a-z][a-z0-9-]{1,63}$/;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const automatedAgent =
  /bot|crawler|spider|slurp|preview|headless|playwright|lighthouse|curl|wget|uptime|monitor|vnt-signature-verifier/i;

export type SignatureDestination = {
  destination_url: string;
  track_visits: boolean;
  is_internal: boolean;
};

export type SignatureReceipt = {
  v: 1;
  project: string;
  event: string;
  issued: number;
};

export type SignatureDependencies = {
  resolve: (id: string) => Promise<SignatureDestination | null>;
  record: (receipt: SignatureReceipt, kind: "access" | "arrival") => Promise<void>;
  schedule: (task: () => Promise<void>) => void;
  secret: string;
  enabled: boolean;
  production: boolean;
  now?: () => number;
  onError?: (operation: "lookup" | "access" | "arrival") => void;
};

export function signatureHeaders(): Headers {
  return new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Referrer-Policy": "no-referrer",
  });
}

// This allowlist is independent of the private registry and of request parameters.
export function allowedSignatureDestination(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.href === "https://www.instagram.com/vnt.agencia/") return url;
    if (
      url.origin === SIGNATURE_ORIGIN &&
      /^\/(es|en)(\/proyectos(\/[a-z0-9]+(?:-[a-z0-9]+)*)?)?\/?$/.test(url.pathname)
    ) {
      return url;
    }
  } catch {
    return null;
  }
  return null;
}

export function signSignatureReceipt(receipt: SignatureReceipt, secret: string): string {
  if (secret.length < 32) throw new Error("Signature signing key is not configured");
  const payload = Buffer.from(JSON.stringify(receipt)).toString("base64url");
  const mac = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifySignatureReceipt(
  token: string,
  secret: string,
  now = Date.now(),
): SignatureReceipt | null {
  if (secret.length < 32 || token.length > 512) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part))) {
    return null;
  }
  const expected = createHmac("sha256", secret).update(parts[0]).digest();
  const supplied = Buffer.from(parts[1], "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }
  try {
    const receipt = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const seconds = Math.floor(now / 1000);
    if (
      receipt.v !== 1 ||
      typeof receipt.project !== "string" ||
      !idPattern.test(receipt.project) ||
      typeof receipt.event !== "string" ||
      !uuidPattern.test(receipt.event) ||
      !Number.isSafeInteger(receipt.issued) ||
      receipt.issued > seconds + 30 ||
      receipt.issued < seconds - SIGNATURE_TOKEN_TTL
    ) {
      return null;
    }
    return receipt;
  } catch {
    return null;
  }
}

function isProductionRequest(request: Request, deps: SignatureDependencies): boolean {
  return (
    deps.enabled &&
    deps.production &&
    deps.secret.length >= 32 &&
    new URL(request.url).origin === SIGNATURE_ORIGIN
  );
}

function isAutomated(request: Request): boolean {
  const headers = request.headers;
  const agent = headers.get("user-agent") ?? "";
  return (
    !agent ||
    automatedAgent.test(agent) ||
    /prefetch|prerender|preview/i.test(
      `${headers.get("purpose")} ${headers.get("sec-purpose")} ${headers.get("x-moz")}`,
    ) ||
    headers.has("next-router-prefetch") ||
    headers.get("rsc") === "1"
  );
}

function scheduleMetric(
  deps: SignatureDependencies,
  receipt: SignatureReceipt,
  kind: "access" | "arrival",
) {
  deps.schedule(async () => {
    try {
      await deps.record(receipt, kind);
    } catch {
      // Deliberately omit provider errors, request data, tokens and credentials.
      deps.onError?.(kind);
    }
  });
}

export async function signatureRedirect(
  request: Request,
  id: string,
  deps: SignatureDependencies,
): Promise<Response> {
  const headers = signatureHeaders();
  if (!idPattern.test(id)) return new Response(null, { status: 404, headers });
  let destination: SignatureDestination | null;
  try {
    destination = await deps.resolve(id);
  } catch {
    deps.onError?.("lookup");
    headers.set("Location", SIGNATURE_FALLBACK);
    headers.set("X-VNT-Signature", "unavailable");
    return new Response(null, { status: 307, headers });
  }
  if (!destination) return new Response(null, { status: 404, headers });

  const configured = allowedSignatureDestination(destination.destination_url);
  const target = configured ?? new URL(SIGNATURE_FALLBACK);
  const mode = request.headers.get("sec-fetch-mode");
  const eligible =
    configured &&
    request.method === "GET" &&
    isProductionRequest(request, deps) &&
    !isAutomated(request) &&
    request.headers.get("accept")?.includes("text/html") &&
    (!mode || mode === "navigate") &&
    destination.track_visits &&
    !destination.is_internal;

  if (eligible) {
    const receipt: SignatureReceipt = {
      v: 1,
      project: id,
      event: randomUUID(),
      issued: Math.floor((deps.now?.() ?? Date.now()) / 1000),
    };
    scheduleMetric(deps, receipt, "access");
    // Fragments never reach access logs or HTTP referrers. No browser identifier.
    if (target.origin === SIGNATURE_ORIGIN) {
      target.hash = `vnt_ref=${signSignatureReceipt(receipt, deps.secret)}`;
    }
  }
  headers.set("Location", target.href);
  headers.set("X-VNT-Signature", configured ? "active" : "invalid-destination");
  return new Response(null, { status: 307, headers });
}

export async function signatureArrival(
  request: Request,
  deps: SignatureDependencies,
): Promise<Response> {
  const headers = signatureHeaders();
  if (
    !isProductionRequest(request, deps) ||
    request.headers.get("origin") !== SIGNATURE_ORIGIN ||
    isAutomated(request) ||
    !request.headers.get("content-type")?.startsWith("text/plain")
  ) {
    return new Response(null, { status: 204, headers });
  }
  // Bound streamed bodies as well as Content-Length: neither is trusted.
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 400, headers });
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 512) {
        await reader.cancel();
        return new Response(null, { status: 413, headers });
      }
      chunks.push(value);
    }
  } catch {
    return new Response(null, { status: 400, headers });
  }
  const token = Buffer.concat(chunks).toString("utf8");
  const receipt = verifySignatureReceipt(token, deps.secret, deps.now?.());
  if (receipt) scheduleMetric(deps, receipt, "arrival");
  // Do not turn this endpoint into a receipt-validity or registry lookup API.
  return new Response(null, { status: 204, headers });
}
