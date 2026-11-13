import { test, expect } from "@playwright/test";
const session = { "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice" };
test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const target = new URL(route.request().url());
    return target.origin === "http://127.0.0.1:4318"
      ? route.continue()
      : route.abort();
  });
  await page.setExtraHTTPHeaders(session);
});
test("dashboard loads fixture data", async ({ page }) => {
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { name: "Welcome back, alice" }),
  ).toBeVisible();
  await expect(page.getByText("Alice fixture week")).toBeVisible();
});
test("daily signals are displayed with units", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByText("8000", { exact: true })).toBeVisible();
  await expect(page.getByText("420 min", { exact: true })).toBeVisible();
  await expect(page.getByText("56 bpm", { exact: true })).toBeVisible();
});
test("insights display deterministic recommendations", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByText("Keep training intensity easy")).toBeVisible();
});
test("missing and historical data remains limited", async ({ page }) => {
  await page.setExtraHTTPHeaders({
    ...session,
    "x-loadiq-e2e-scenario": "limited",
  });
  await page.goto("/app");
  await expect(page.getByText("Limited data", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Historical data only; current recovery is unknown."),
  ).toBeVisible();
  await expect(page.getByText("No recent wearable data")).toBeVisible();
});
test("API failure is controlled", async ({ page }) => {
  await page.setExtraHTTPHeaders({
    ...session,
    "x-loadiq-e2e-scenario": "error",
  });
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { name: "Dashboard unavailable" }),
  ).toBeVisible();
});
test("protected route redirects without a session", async ({ request }) => {
  const result = await request.get("/app", { maxRedirects: 0 });
  expect([302, 303, 307, 308]).toContain(result.status());
  expect(result.headers().location).toContain("/signin");
});
test("identity cannot be overridden by query or client user headers", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    ...session,
    "x-loadiq-external-auth-id": "synthetic-bob",
  });
  await page.goto("/app?userId=synthetic-bob");
  await expect(page.getByText("Alice fixture week")).toBeVisible();
  await expect(page.getByText("Bob fixture week")).toHaveCount(0);
});
test("second isolated session sees only its own fixtures", async ({ page }) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:bob",
  });
  await page.goto("/app");
  await expect(page.getByText("Bob fixture week")).toBeVisible();
  await expect(page.getByText("Alice fixture week")).toHaveCount(0);
});
