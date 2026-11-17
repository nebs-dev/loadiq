import { test, expect } from "@playwright/test";
import acceptance from "./fixtures/coach-conversation.json";
test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).origin === "http://127.0.0.1:4318"
      ? route.continue()
      : route.abort(),
  );
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
  });
});
test("failed backend chat request explicitly says the Croatian answer could not be completed", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-e2e-scenario": "coach_chat_error",
  });
  await page.goto("/app");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await coach
    .getByLabel("Ask your Wellbeing Coach")
    .fill("Zašto mi je HRV niži?");
  await coach.getByRole("button", { name: "Ask coach", exact: true }).click();
  await expect(coach.getByRole("alert")).toContainText("nije moguće dovršiti");
  await expect(coach.getByLabel("Coach answer")).toHaveCount(0);
});
test("all five Croatian acceptance questions retain context and fulfil their specific intent", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-e2e-scenario": "coach_five_turn",
  });
  await page.goto("/app");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  for (let i = 0; i < acceptance.questions.length; i++) {
    await coach
      .getByLabel("Ask your Wellbeing Coach")
      .fill(acceptance.questions[i].question);
    await coach.getByRole("button", { name: "Ask coach", exact: true }).click();
    const answer = coach.getByLabel("Coach answer").last();
    await expect(answer).toHaveText(acceptance.questions[i].answer);
    if (i === 3) {
      await expect(answer).toContainText("1.");
      await expect(answer).toContainText("2.");
      await expect(answer).toContainText("3.");
      await expect(answer).toContainText("Razlog:");
    }
    if (i === 4) {
      await expect(answer).toContainText("Glavna radna pretpostavka");
      await expect(answer).toContainText("penjanje");
      await expect(answer).toContainText("kasnije odlaske");
      await expect(answer).toContainText("Još ne znam");
      expect(((await answer.innerText()).match(/\?/g) ?? []).length).toBe(1);
    }
  }
  await expect(coach.getByRole("alert")).toHaveCount(0);
});
test("Croatian validation fallback is explicit and technical details stay collapsed", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-e2e-scenario": "coach_validation",
  });
  await page.goto("/app");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await coach
    .getByLabel("Ask your Wellbeing Coach")
    .fill("Zašto mi je HRV niži?");
  await coach.getByRole("button", { name: "Ask coach", exact: true }).click();
  await expect(coach.getByLabel("Coach answer")).toContainText(
    "AI odgovor nije dovršen",
  );
  await expect(
    coach.getByText("Odgovor iz podataka — bez AI objašnjenja", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    coach.getByText("Tehnička kategorija neuspjeha", { exact: false }),
  ).not.toBeVisible();
  await expect(
    coach.getByText("Zadnji uvezeni dan: 2020-01-07", { exact: false }),
  ).toBeVisible();
  await coach
    .getByText("Mjerenja, dokazi i ograničenja", { exact: true })
    .click();
  await expect(
    coach.getByText("Tehnička kategorija neuspjeha", { exact: false }),
  ).toContainText("narrative_validation");
});
test("brief and chat display the same factual data with evidence", async ({
  page,
}) => {
  await page.goto("/app");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await expect(
    coach.getByText("Stored daily HRV: mean 40 ms (synthetic fixture)."),
  ).toBeVisible();
  await page
    .getByLabel("Ask your Wellbeing Coach")
    .fill("Why has my HRV dropped?");
  await page.getByRole("button", { name: "Ask coach", exact: true }).click();
  await expect(
    coach.getByText("Stored daily HRV: mean 40 ms (synthetic fixture)."),
  ).toHaveCount(3);
  await expect(
    coach.getByText("Has your sleep routine changed?"),
  ).toBeVisible();
  await coach
    .getByText("Measurements, evidence & limitations", { exact: true })
    .click();
  await coach.getByText("Evidence hrv:fact", { exact: true }).click();
  await expect(coach.getByText("Dates: 2020-01-06")).toBeVisible();
});
test("AI requires explicit consent and can be revoked", async ({ page }) => {
  await page.goto("/app");
  await page.getByText(/AI processing & privacy/).click();
  const enable = page.getByRole("button", { name: "Enable AI processing" });
  await expect(enable).toBeDisabled();
  await page.getByLabel(/I explicitly consent/).check();
  await enable.click();
  await expect(
    page.getByRole("button", { name: "Revoke AI consent" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Revoke AI consent" }).click();
  await expect(page.getByText(/off; evidence-only mode/)).toBeVisible();
});
test("personal context is saved only after confirmation, reviewed and removed", async ({
  page,
}) => {
  await page.goto("/app");
  await page.getByText("Personal context — review, confirm or remove").click();
  await page
    .getByLabel("Context to remember")
    .fill("My goal is to sleep better.");
  const save = page.getByRole("button", { name: "Save confirmed context" });
  await expect(save).toBeDisabled();
  await page.getByLabel(/I confirm that I want to save/).check();
  await save.click();
  await expect(
    page.getByText("My goal is to sleep better.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Remove saved context" }).click();
  await expect(page.getByText("No saved personal context.")).toBeVisible();
});
test("browser identity override cannot change coach ownership", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-external-auth-id": "synthetic-bob",
  });
  await page.goto("/app?userId=synthetic-bob");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await expect(
    coach.getByText("Stored daily HRV: mean 40 ms (synthetic fixture)."),
  ).toBeVisible();
  await expect(
    coach.getByText("Stored daily HRV: mean 70 ms (synthetic fixture)."),
  ).toHaveCount(0);
});
test("coach failure is isolated from the dashboard and retry recovers", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-e2e-scenario": "coach_error",
  });
  await page.goto("/app");
  await expect(page.getByText("Alice fixture week")).toBeVisible();
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await expect(coach.getByRole("alert")).toContainText("Coach unavailable");
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
  });
  await page.getByRole("button", { name: "Retry coach" }).click();
  await expect(
    page
      .getByRole("region", { name: "Wellbeing Coach" })
      .getByText("Stored daily HRV: mean 40 ms (synthetic fixture)."),
  ).toBeVisible();
  await expect(coach.getByRole("alert")).toHaveCount(0);
});
test("stale data cannot be described as current readiness", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-e2e-scenario": "limited",
  });
  await page.goto("/app");
  await expect(
    page
      .getByRole("region", { name: "Wellbeing Coach" })
      .getByText("Current recovery is unknown."),
  ).toBeVisible();
});

test("consented conversational prose retains evidence and revocation stops AI mode", async ({
  page,
}) => {
  await page.goto("/app");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await coach.getByText(/AI processing & privacy/).click();
  await expect(
    coach.getByText(/questions, recent conversation summaries/),
  ).toBeVisible();
  await coach.getByLabel(/I explicitly consent/).check();
  await coach.getByRole("button", { name: "Enable AI processing" }).click();
  await coach
    .getByLabel("Ask your Wellbeing Coach")
    .fill("Could my sleep schedule explain fatigue?");
  await coach.getByRole("button", { name: "Ask coach", exact: true }).click();
  await expect(coach.getByLabel("Coach answer")).toContainText(
    "Sleep timing could be relevant, but these summaries cannot establish a cause.",
  );
  await coach
    .getByText("Measurements, evidence & limitations", { exact: true })
    .click();
  await coach.getByText("Evidence conversation:0", { exact: true }).click();
  await expect(
    coach
      .getByText("Evidence conversation:0", { exact: true })
      .locator("..")
      .getByText("Supporting evidence: hrv:fact", { exact: true }),
  ).toBeVisible();
  await coach.getByRole("button", { name: "Revoke AI consent" }).click();
  await expect(
    coach.getByText(
      "Sleep timing could be relevant, but these summaries cannot establish a cause.",
    ),
  ).toHaveCount(0);
});

test("consent can be recorded while operator AI activation remains paused", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "x-loadiq-e2e-session": "synthetic-e2e-local-only:alice",
    "x-loadiq-e2e-scenario": "coach_paused",
  });
  await page.goto("/app");
  const coach = page.getByRole("region", { name: "Wellbeing Coach" });
  await coach.getByText(/AI processing & privacy/).click();
  await expect(coach.getByText(/AI is paused/)).toBeVisible();
  await coach.getByLabel(/I explicitly consent/).check();
  await coach.getByRole("button", { name: "Record AI consent" }).click();
  await expect(
    coach.getByRole("button", { name: "Revoke AI consent" }),
  ).toBeVisible();
  await expect(coach.getByText(/off; evidence-only mode/)).toBeVisible();
  await coach.getByLabel("Ask your Wellbeing Coach").fill("Why HRV?");
  await coach.getByRole("button", { name: "Ask coach", exact: true }).click();
  await expect(
    coach.getByText(
      "Sleep timing could be relevant, but these summaries cannot establish a cause.",
    ),
  ).toHaveCount(0);
  await coach.getByRole("button", { name: "Revoke AI consent" }).click();
  await expect(
    coach.getByRole("button", { name: "Record AI consent" }),
  ).toBeVisible();
});
