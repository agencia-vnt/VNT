import "server-only";
import { neon } from "@neondatabase/serverless";
import { after } from "next/server";
import type {
  SignatureDependencies,
  SignatureDestination,
  SignatureReceipt,
} from "@/lib/signature";

function database() {
  const connection = process.env.SIGNATURE_DATABASE_URL;
  if (!connection) throw new Error("Signature database is not configured");
  return neon(connection);
}

async function resolve(id: string): Promise<SignatureDestination | null> {
  const rows = await database().query(
    "select * from signatures.resolve_destination($1)",
    [id],
    { fetchOptions: { signal: AbortSignal.timeout(1500), cache: "no-store" } },
  );
  return (rows[0] as SignatureDestination | undefined) ?? null;
}

async function record(receipt: SignatureReceipt, kind: "access" | "arrival") {
  await database().query(
    "select signatures.record_metric($1::uuid, $2, $3, $4::timestamptz)",
    [receipt.event, receipt.project, kind, new Date(receipt.issued * 1000).toISOString()],
    { fetchOptions: { signal: AbortSignal.timeout(2500), cache: "no-store" } },
  );
}

export function signatureDependencies(): SignatureDependencies {
  return {
    resolve,
    record,
    schedule: after,
    secret: process.env.SIGNATURE_SIGNING_SECRET ?? "",
    enabled: process.env.SIGNATURE_TRACKING_ENABLED === "true",
    production: process.env.VERCEL_ENV === "production",
    onError: (operation) => console.warn(`Signature ${operation} unavailable`),
  };
}
