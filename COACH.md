# Wellbeing Coach v0 dashboard

`WellbeingCoach` adds a daily brief and conversation to `/app` without redesigning the
existing dashboard. Its initial data is read server-side after the existing dashboard/insight
refresh, so no mount-time background server action races with navigation. A coach outage
is caught separately and cannot remove existing metrics; explicit actions can retry.
Coach reads have a five-second fetch deadline; chat has thirty seconds for the provider's
bounded request. Existing non-coach API behavior is unchanged.

`app/app/coach-actions.ts` uses WorkOS `currentUser()` and the existing server-only API
client. No browser user ID, external-auth header or provider key is trusted or forwarded.
Next server actions retain their origin protections. Responses use no-store backend fetches.

The UI displays the exact backend facts/trends, evidence, coverage/freshness, qualified
hypotheses, suggestions and one follow-up. Optional historical dates are bounded by the
backend. Garmin attribution accompanies derived output; manual context is not called a
measured activity. English matches the existing dashboard language.

Chat stays in component memory (maximum six exchanges) and can be cleared. It is not
persisted in localStorage, browser recordings or a transcript table. After Anthropic consent, up to four previous user questions and assistant summaries provide conversation context to Anthropic; saved raw notes are not sent. Explicitly confirmed notes are separately saved, reviewable and removable.

The AI transparency panel shows provider processing/retention and the absence of guaranteed
EU processing. Consent is unchecked by default, requires explicit confirmation and can be
revoked. Revocation also clears visible conversation. When provider configuration is missing,
AI enabling is unavailable and the UI honestly labels evidence-only mode. Failed requests
show a controlled retry state; no backend response payload is logged.

Only the existing backend URL/internal key and WorkOS settings belong here. Anthropic credentials
and operator review flags are backend-only. No real-provider or production configuration is
changed by adding this UI; the backend must have the additive coach migration applied.

Tests use fabricated Alice/Bob accounts and a local fixture server. `pnpm test:e2e` includes
brief/chat consistency, explicit AI consent/revocation, confirmed note lifecycle, stale data,
and identity-spoof rejection, plus existing dashboard/privacy tests. No real Anthropic/Garmin
calls, health recordings, traces, screenshots or video artifacts are required by CI.

Run `pnpm typecheck`, `pnpm quality`, `pnpm test:e2e`, then `pnpm build` (sequentially with
E2E because both use `.next`). Real WorkOS + real LLM verification requires a configured
backend and explicit provider-specific consent; synthetic fixtures are not proof of that flow.

Task 4.1: Anthropic consent explicitly covers questions, recent conversation summaries and summarized health
evidence being processed by Anthropic. Saved notes are not sent verbatim. Do not put identifiers,
locations or credentials into questions. Chat fetch deadline is thirty seconds for bounded retrieval
and synthesis. No automatic consent grant or authentication bypass is introduced.

Real-provider status (2026-11-16): backend Haiku 5.5 passed a three-turn synthetic Croatian
conversation. The displayed coverage label describes measurement coverage, not certainty
about causes. WorkOS-to-real-Garmin-to-LLM remains unverified and disabled pending separate
owner consent. Playwright uses mocked provider responses and is not a real-provider test.

## Task 4.3

Chat displays a concise conversational answer; full measurements and limitations remain expandable. Ephemeral previous assistant answers include follow-up questions for continuity. No transcript is persisted. Real WorkOS staging login is verified locally with development bypass off. UI consent remains owner-controlled and can be recorded while AI is paused. No real health questions are sent until separate explicit consent and usage approval. Backend evaluations include twenty synthetic Haiku/Sonnet pairs and Croatian multi-turn repeats.
