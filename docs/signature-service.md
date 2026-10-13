# Signature routing service

This public repository contains generic routing and receipt validation only.
The registry, schema migrations, verification evidence and reports belong to the
separate private operations repository and its private Postgres database. Never
copy that inventory, credentials or report artifacts into this repository.

## Runtime configuration

Set these server-only variables in Vercel production:

- `SIGNATURE_DATABASE_URL`: Neon connection string for a login granted only the
  `signatures_runtime` role. It may execute the two signature functions; it must
  not read registry or reporting tables or own the database.
- `SIGNATURE_SIGNING_SECRET`: a generated secret with at least 32 random characters.
- `SIGNATURE_TRACKING_ENABLED=true`: also requires `VERCEL_ENV=production` and an
  HTTPS request to the canonical `vntagencia.com` origin. Development and previews
  cannot record production events even if the feature flag is set.

Provision and migrate the database before deploying the central service. Supply
separate preview credentials if database-backed previews are needed. Never use
the operations administrator connection as a web runtime credential. A signing
key rotation expires pending receipts (maximum ten minutes); navigation continues.

## Database contract

The private schema provides:

```sql
signatures.resolve_destination(project_id text)
-- destination_url text, track_visits boolean, is_internal boolean

signatures.record_metric(event_id uuid, project_id text,
                         event_kind text, occurred_at timestamptz)
-- boolean; event_kind is access or arrival
```

Only active registrations resolve. Each `(event_id, event_kind)` can increment its
UTC daily aggregate once. Arrival and access can reach the database in either
order; both use the receipt issue time. The database rejects stale/future events
and untracked, inactive or internal projects. Public users cannot query totals.

## Requests and failure behavior

- `GET /r/<id>` resolves a single identifier, returns 307 and disables browser/CDN
  caching. It ignores visitor-provided destination parameters and validates the
  stored destination against a small fixed allowlist.
- `HEAD /r/<id>` checks routing without counting anything.
- Eligible production document navigations schedule access recording with
  Next.js `after`. Database lookup has a 1.5-second timeout, recording 2.5 seconds.
  Lookup failure redirects to `/es` without attribution; a missing/inactive ID is 404.
- VNT destinations receive a ten-minute HMAC receipt as `#vnt_ref=...`. This avoids
  sending the token in HTTP referrers or access-log query strings. The browser
  removes it and confirms after the destination document becomes visible.
- `POST /api/signature-arrival` accepts only bounded text receipts, the canonical
  Origin and valid HMAC/expiry. Responses disclose neither inventory nor receipt
  validity. The database deduplicates replayed receipts.
- A failed write never blocks redirect or page loading. Counters are best effort,
  not a billing ledger. Ad blockers, disabled JavaScript and failed requests can
  reduce confirmed arrivals. Recognized bot filtering is approximate.

No visitor IP, full user agent, cookie, referrer or fingerprint is stored by this
service. Infrastructure providers still operate their own access logs. The
private operations job retains receipt IDs for two days, checks for 90 days and
daily aggregates for 13 months. It does not publish reports or send messages.

## Delivery and verification

1. Configure private storage and runtime grants, then deploy VNT first.
2. Check HEAD redirects, invalid identifiers, unavailable-store fallback and
   rejected destinations. Confirm private data is absent from public bundles.
3. Validate one test registration and receipt in an isolated database or clearly
   excluded test project; do not inflate client production counters.
4. Migrate clients only after central routing is verified. Preserve local assets
   and layout; change href, accessible label and `data-vnt-signature` together.
5. Run each repository's checks and inspect mobile/desktop and enlarged text.
6. Enable the private daily verifier only after credentials and registry are ready.
   Verify only the registered paths; do not crawl, authenticate or click Instagram.

The private report separates deployment status, observed signature status,
measurement availability, accesses and arrivals. Network errors are unverifiable,
not evidence of removal; no visits are not evidence of a missing signature.

Run `pnpm test`, `pnpm lint`, `pnpm typecheck` and `pnpm build` here. SQL permissions,
deduplication, retention, verification and report tests run in the private repo.
