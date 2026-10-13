import assert from "node:assert/strict";
import { test } from "node:test";
import {
  allowedSignatureDestination,
  SIGNATURE_FALLBACK,
  signatureArrival,
  signatureRedirect,
  signSignatureReceipt,
  verifySignatureReceipt,
} from "../src/lib/signature.ts";

const secret = "test-only-signing-key-that-is-never-used-in-production";
const now = Date.UTC(2026, 9, 13, 15);
const receipt = {
  v: 1,
  project: "example-site",
  event: "12345678-1234-4234-8234-123456789abc",
  issued: Math.floor(now / 1000),
};
const browserHeaders = {
  "user-agent": "Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36",
  accept: "text/html,application/xhtml+xml",
  "sec-fetch-mode": "navigate",
};

function harness(overrides = {}) {
  const events = [];
  const tasks = [];
  const errors = [];
  return {
    events,
    errors,
    flush: async () => {
      for (const task of tasks.splice(0)) await task();
    },
    deps: {
      resolve: async () => ({
        destination_url: SIGNATURE_FALLBACK,
        track_visits: true,
        is_internal: false,
      }),
      record: async (value, kind) => events.push({ value, kind }),
      schedule: (task) => tasks.push(task),
      secret,
      enabled: true,
      production: true,
      now: () => now,
      onError: (operation) => errors.push(operation),
      ...overrides,
    },
  };
}

function access(options = {}) {
  return new Request("https://vntagencia.com/r/example-site", {
    headers: browserHeaders,
    ...options,
  });
}

function arrival(token, options = {}) {
  return new Request("https://vntagencia.com/api/signature-arrival", {
    method: "POST",
    headers: {
      "user-agent": browserHeaders["user-agent"],
      "content-type": "text/plain;charset=UTF-8",
      origin: "https://vntagencia.com",
    },
    body: token,
    ...options,
  });
}

test("destinations exclude open redirects, credentials, recursive routes and arbitrary pages", () => {
  for (const url of [
    "https://vntagencia.com/es",
    "https://vntagencia.com/en/proyectos/example-site",
    "https://www.instagram.com/vnt.agencia/",
  ])
    assert.ok(allowedSignatureDestination(url), url);
  for (const url of [
    "//evil.example",
    "javascript:alert(1)",
    "https://vntagencia.com.evil.example/es",
    "https://vntagencia.com@evil.example/es",
    "https://user:pass@vntagencia.com/es",
    "https://vntagencia.com/r/example-site",
    "https://vntagencia.com/api/private",
    "https://vntagencia.com/es?redirect=evil",
    "https://vntagencia.com/es#test",
    "https://www.instagram.com/other/",
    "http://vntagencia.com/es",
  ])
    assert.equal(allowedSignatureDestination(url), null, url);
});

test("signed receipts reject tampering, expiry, future times and wrong keys", () => {
  const token = signSignatureReceipt(receipt, secret);
  assert.deepEqual(verifySignatureReceipt(token, secret, now), receipt);
  assert.equal(verifySignatureReceipt(token, `${secret}wrong`, now), null);
  assert.equal(verifySignatureReceipt(token, secret, now + 601_000), null);
  assert.equal(verifySignatureReceipt(token, secret, now - 31_000), null);
  assert.equal(verifySignatureReceipt(`a${token}`, secret, now), null);
  assert.equal(verifySignatureReceipt(`${token}.extra`, secret, now), null);
  assert.equal(verifySignatureReceipt("!invalid", secret, now), null);
  assert.throws(() => signSignatureReceipt(receipt, "short"));
});

test("redirect ignores destination query input, is uncached, and defers access recording", async () => {
  const h = harness();
  const response = await signatureRedirect(
    new Request("https://vntagencia.com/r/example-site?url=https://evil.example", {
      headers: browserHeaders,
    }),
    "example-site",
    h.deps,
  );
  assert.equal(response.status, 307);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  const target = new URL(response.headers.get("location"));
  assert.equal(`${target.origin}${target.pathname}`, SIGNATURE_FALLBACK);
  assert.equal(target.search, "");
  const token = target.hash.slice("#vnt_ref=".length);
  assert.equal(verifySignatureReceipt(token, secret, now).project, "example-site");
  assert.equal(h.events.length, 0);
  await h.flush();
  assert.equal(h.events[0].kind, "access");
  const confirmed = await signatureArrival(arrival(token), h.deps);
  assert.equal(confirmed.status, 204);
  await h.flush();
  assert.equal(h.events[1].kind, "arrival");
  assert.equal(h.events[0].value.event, h.events[1].value.event);
});

test("HEAD, automation, prefetch, disabled environments and internal credits never count", async () => {
  const cases = [
    [access({ method: "HEAD" }), {}],
    [
      access({
        headers: { ...browserHeaders, "user-agent": "VNT-Signature-Verifier/1.0" },
      }),
      {},
    ],
    [access({ headers: { ...browserHeaders, "sec-purpose": "prefetch;prerender" } }), {}],
    [access({ headers: { ...browserHeaders, "next-router-prefetch": "1" } }), {}],
    [access({ headers: { ...browserHeaders, "sec-fetch-mode": "cors" } }), {}],
    [access(), { production: false }],
    [access(), { enabled: false }],
    [access(), { secret: "" }],
    [
      new Request("https://preview.vercel.app/r/example-site", {
        headers: browserHeaders,
      }),
      {},
    ],
    [
      access(),
      {
        resolve: async () => ({
          destination_url: SIGNATURE_FALLBACK,
          track_visits: true,
          is_internal: true,
        }),
      },
    ],
    [
      access(),
      {
        resolve: async () => ({
          destination_url: SIGNATURE_FALLBACK,
          track_visits: false,
          is_internal: false,
        }),
      },
    ],
  ];
  for (const [request, overrides] of cases) {
    const h = harness(overrides);
    const response = await signatureRedirect(request, "example-site", h.deps);
    assert.equal(response.headers.get("location"), SIGNATURE_FALLBACK);
    await h.flush();
    assert.equal(h.events.length, 0);
  }
});

test("Instagram records only access and carries no arrival token", async () => {
  const h = harness({
    resolve: async () => ({
      destination_url: "https://www.instagram.com/vnt.agencia/",
      track_visits: true,
      is_internal: false,
    }),
  });
  const response = await signatureRedirect(access(), "example-site", h.deps);
  assert.equal(
    response.headers.get("location"),
    "https://www.instagram.com/vnt.agencia/",
  );
  await h.flush();
  assert.deepEqual(
    h.events.map(({ kind }) => kind),
    ["access"],
  );
});

test("missing registry uses a safe fallback; unknown identifiers are not enumerable", async () => {
  const h = harness({
    resolve: async () => {
      throw new Error("secret-provider-detail");
    },
  });
  const response = await signatureRedirect(access(), "example-site", h.deps);
  assert.equal(response.headers.get("location"), SIGNATURE_FALLBACK);
  assert.equal(response.headers.get("x-vnt-signature"), "unavailable");
  assert.equal(await response.text(), "");
  assert.deepEqual(h.errors, ["lookup"]);
  await h.flush();
  assert.equal(h.events.length, 0);
  assert.equal(
    (
      await signatureRedirect(
        access(),
        "unknown",
        harness({ resolve: async () => null }).deps,
      )
    ).status,
    404,
  );
  assert.equal(
    (await signatureRedirect(access(), "../private", harness().deps)).status,
    404,
  );
});

test("invalid configured destination falls back without measuring", async () => {
  const h = harness({
    resolve: async () => ({
      destination_url: "https://evil.example",
      track_visits: true,
      is_internal: false,
    }),
  });
  const response = await signatureRedirect(access(), "example-site", h.deps);
  assert.equal(response.headers.get("location"), SIGNATURE_FALLBACK);
  await h.flush();
  assert.equal(h.events.length, 0);
});

test("measurement outages cannot change successful navigation", async () => {
  const h = harness({
    record: async () => {
      throw new Error("database unavailable");
    },
  });
  const response = await signatureRedirect(access(), "example-site", h.deps);
  assert.equal(response.status, 307);
  await h.flush();
  assert.deepEqual(h.errors, ["access"]);
});

test("arrival ignores cross-origin, invalid and oversized receipts", async () => {
  const token = signSignatureReceipt(receipt, secret);
  const h = harness();
  const requests = [
    arrival(token, {
      headers: {
        origin: "https://evil.example",
        "content-type": "text/plain",
        "user-agent": browserHeaders["user-agent"],
      },
    }),
    arrival(`${token}invalid`),
    arrival(token, {
      headers: {
        origin: "https://vntagencia.com",
        "content-type": "application/json",
        "user-agent": browserHeaders["user-agent"],
      },
    }),
    arrival(token, {
      headers: {
        origin: "https://vntagencia.com",
        "content-type": "text/plain",
        "user-agent": "VNT-Signature-Verifier/1.0",
      },
    }),
  ];
  for (const request of requests)
    assert.equal((await signatureArrival(request, h.deps)).status, 204);
  assert.equal((await signatureArrival(arrival("x".repeat(513)), h.deps)).status, 413);
  await h.flush();
  assert.equal(h.events.length, 0);
});
