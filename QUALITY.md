# Engineering quality — final review (2026-11-13)

Keep these repositories separate. Use Node22 and the existing pnpm10.15.1 lockfile:
`corepack pnpm@10.15.1 --ignore-workspace install --frozen-lockfile`.
The pnpm lockfile is authoritative; the pre-existing frontend package-lock.json is not used by CI.
No dependencies or infrastructure were added in Task3.1.

## Quality gates
`pnpm quality` runs ESLint and Prettier without fixing files.
Lint debt fingerprints include file, rule, message hash, source hash, severity and occurrence count.
New/changed findings, severity upgrades and increased counts fail. Fatal parser errors always fail.
Obsolete debt was pruned without accepting new findings. Baseline generation is forbidden on CI.
A review must approve any manual debt change; never regenerate a baseline to hide a failed PR.
Formatting exceptions apply only to exact unchanged hashes of old files.
The optional `.githooks/pre-commit` runs checks without modifying files; no hooksPath was set automatically.

## Sentry diagnostics and privacy
Separate API/web projects must belong to an EU Sentry organization. Empty DSNs disable monitoring.
Server: SENTRY_DSN. Web browser: NEXT_PUBLIC_SENTRY_DSN (public DSN, never an API/auth secret).
Only HTTPS EU ingestion DSNs without password/query/fragment are accepted.
Events are reconstructed from an allowlist: generic message, approved error category, environment,
static operation, event ID/time and reviewed code locations with bounded line/column numbers.
`monitoring/source-files.json` lists approved repository paths. Review/update it when adding modules;
unlisted paths are dropped. Backend dist aliases and strictly named Next hashed chunks are supported.
Absolute prefixes, URL hosts/query strings, function names, original error messages, source context,
locals, user identities, cookies, headers, bodies, health/GPS data, extras and attachments are discarded.
Grouping uses Sentry's default sanitized-stack grouping plus operation/category, rather than one global bucket.
Handled ingestion failures and framework/browser error handlers now retain the original technical stack
through the sanitizer. No raw message or stack context is sent. Replay, tracing, logs and metrics are disabled.
Both actual SDK envelopes are tested through an in-memory transport; no network delivery is claimed.
Before enabling DSNs, configure server-side scrubbing, prevention of IP-address storage and IP-derived
geography scrubbing in Sentry. SDK scrubbing cannot control ingestion-side metadata.
Live Sentry delivery remains unverified until EU DSNs are configured. Hosted CI status is recorded in the feature pull request checks.

## External services
GitHub Actions YAML was parsed and structurally validated locally. Feature branches run the same checks on GitHub; inspect the latest PR checks for the hosted result.
Actions are enabled (allowed_actions=all) on both repositories; no enablement change is needed.
No Garmin API credentials, personal data or WorkOS production credentials are required in CI.
There is no artifact upload. Playwright screenshots/video/traces are disabled.
CodeRabbit configuration excludes sensitive paths; installation status is unverified (API403).
Do not grant a new review app access to personal-data history without an owner decision.

## Frontend checks
```
pnpm quality
pnpm build
pnpm typecheck
pnpm exec playwright install chromium
pnpm test:e2e
```
Playwright: 13 passing tests. Coverage includes dashboard/metric units/recommendations, limited historical data,
API errors, unauthenticated redirects, two-user isolation, production auth refusal, and useful private SDK diagnostics.
Build/typecheck and quality gates pass. Production build was verified with empty auth/Sentry credentials.
The development-only test adapter requires NODE_ENV=development, explicit mode+secret, exact fixture backend URL
and loopback host. Production builds/servers reject the flag and production auth still uses WorkOS.
Local Next4318 and fixture backend4319 use only fabricated users/data. Actual WorkOS login/callback is not verified.
Build and E2E run sequentially because both use .next. Historical lint is enforced by a separate mandatory gate,
not by Next build; no new lint fingerprints are accepted. No production login was weakened.
