import { spawnSync } from "node:child_process";
import { test, expect } from "@playwright/test";
import { scrubEvent, euDsn } from "../lib/monitoring/privacy";
import { e2eEnabled } from "../lib/e2e-mode";
test("monitoring strips all sensitive event context", () => {
  const event = {
    event_id: "a".repeat(32),
    request: {
      headers: { Authorization: "synthetic-secret" },
      cookies: "synthetic-cookie",
      data: { hrv: 999 },
    },
    user: {
      email: "private@example.invalid",
      id: "synthetic-private-id",
      username: "synthetic-private-name",
      ip_address: "203.0.113.42",
    },
    extra: { gps: [45, 16] },
    exception: { values: [{ value: "synthetic-private-error" }] },
  };
  const serialized = JSON.stringify(scrubEvent(event));
  for (const value of [
    "synthetic-secret",
    "synthetic-cookie",
    "999",
    "private@example.invalid",
    "gps",
    "synthetic-private-error",
  ])
    expect(serialized).not.toContain(value);
  expect(euDsn("https://synthetic@o1.ingest.us.sentry.io/1")).toBeUndefined();
});
test("test authentication cannot activate in production", () => {
  const original = { ...process.env };
  try {
    Object.assign(process.env, {
      NODE_ENV: "production",
      LOADIQ_E2E_MODE: "true",
      LOADIQ_E2E_SECRET: "synthetic-e2e-local-only",
      LOADIQ_API_BASE_URL: "http://127.0.0.1:4319",
    });
    expect(e2eEnabled()).toBe(false);
    const build = spawnSync(
      process.execPath,
      ["-e", 'require("./next.config.js")'],
      { env: process.env, encoding: "utf8" },
    );
    expect(build.status).not.toBe(0);
    expect(build.stderr).toContain(
      "E2E authentication is forbidden in production",
    );
  } finally {
    process.env = original;
  }
});

test("frontend SDK initialization scrubs its transport envelope", async () => {
  const Sentry = await import("@sentry/nextjs");
  const { monitoringOptions } = await import("../lib/monitoring/sentry");
  const envelopes: unknown[] = [];
  Sentry.init({
    ...monitoringOptions("https://synthetic@o1.ingest.de.sentry.io/1"),
    integrations: [],
    transport: () => ({
      send: (envelope: unknown) => {
        envelopes.push(envelope);
        return Promise.resolve({ statusCode: 200 });
      },
      flush: () => Promise.resolve(true),
    }),
  });
  const original = new TypeError("synthetic-private-error");
  original.stack =
    "TypeError: synthetic-private-error\n    at render (https://private.invalid/_next/static/chunks/app/app/page-1234abcd.js:123:7)";
  Sentry.captureException(original, {
    user: {
      email: "private@example.invalid",
      id: "synthetic-private-id",
      username: "synthetic-private-name",
      ip_address: "203.0.113.42",
    },
    extra: { Authorization: "synthetic-secret", gps: [45, 16] },
  });
  await Sentry.flush(2000);
  expect(envelopes).toHaveLength(1);
  const serialized = JSON.stringify(envelopes);
  for (const value of [
    "synthetic-private-error",
    "private@example.invalid",
    "synthetic-secret",
    "gps",
    "synthetic-private-name",
    "203.0.113.42",
  ])
    expect(serialized).not.toContain(value);
  expect(serialized).toContain("Application operation failed");
  expect(serialized).toContain("_next/static/chunks/app/app/page-1234abcd.js");
  expect(serialized).not.toContain("private.invalid");
  expect(serialized).toContain("TypeError");
  expect(serialized).not.toContain("synthetic-private-id");
  await Sentry.close();
});

test("retains useful technical diagnostics without runtime or personal context", () => {
  const input = {
    event_id: "a".repeat(32),
    tags: { operation: "frontend", userId: "synthetic-private-id" },
    exception: {
      values: [
        {
          type: "TypeError",
          value: "synthetic-secret hrv=999 gps=45,16",
          stacktrace: {
            frames: [
              {
                filename:
                  "/Users/synthetic-private-id/project/components/product/dashboard-page.tsx?token=synthetic-secret",
                lineno: 123,
                colno: 7,
                function: "synthetic-private-function",
                vars: { hrv: 999 },
                pre_context: ["synthetic-secret"],
              },
              {
                filename:
                  "https://private.invalid/uploads/synthetic-private-id/activity.fit",
                lineno: 10,
              },
              {
                filename:
                  "https://private.invalid/_next/static/chunks/123-abcd.js?token=synthetic-secret",
                lineno: 456,
                colno: 8,
              },
            ],
          },
        },
      ],
    },
  };
  const safe = scrubEvent(input);
  expect(safe.exception.values[0].type).toBe("TypeError");
  expect(safe.exception.values[0].stacktrace.frames).toEqual([
    {
      filename: "components/product/dashboard-page.tsx",
      lineno: 123,
      colno: 7,
      in_app: true,
    },
    {
      filename: "_next/static/chunks/123-abcd.js",
      lineno: 456,
      colno: 8,
      in_app: true,
    },
  ]);
  expect((safe as unknown as { fingerprint: string[] }).fingerprint).toEqual([
    "{{ default }}",
    "frontend",
    "TypeError",
  ]);
  const serialized = JSON.stringify(safe);
  for (const secret of [
    "synthetic-secret",
    "999",
    "45,16",
    "synthetic-private-id",
    "private.invalid",
    "synthetic-private-function",
    "pre_context",
  ])
    expect(serialized).not.toContain(secret);
});
test("rejects arbitrary categories, filenames and invalid frame positions", () => {
  const safe = scrubEvent({
    event_id: "a".repeat(32),
    exception: {
      values: [
        {
          type: "private-health-category",
          value: "private-health",
          stacktrace: {
            frames: [
              {
                filename: "components/product/dashboard-page.tsx",
                lineno: NaN,
                colno: Infinity,
              },
              { filename: "src/not-reviewed-user-file.ts", lineno: 123 },
            ],
          },
        },
      ],
    },
  });
  expect(safe.exception.values[0].type).toBe("Error");
  expect(safe.exception.values[0].stacktrace.frames).toEqual([
    {
      filename: "components/product/dashboard-page.tsx",
      lineno: undefined,
      colno: undefined,
      in_app: true,
    },
  ]);
});
