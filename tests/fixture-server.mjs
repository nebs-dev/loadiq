import { createServer } from "node:http";
import { readFileSync } from "node:fs";
const acceptance = JSON.parse(
  readFileSync(
    new URL("./fixtures/coach-conversation.json", import.meta.url),
    "utf8",
  ),
);
const date = "2020-01-06";
function summary(limited, bob) {
  return {
    asOfDate: date,
    daily: {
      date,
      summary: {
        headline: limited ? "Limited data" : "Recovery signals stable",
        status: limited ? "limited_data" : "stable",
        narrative: [
          limited
            ? "Historical data only; current recovery is unknown."
            : "Synthetic recovery summary.",
        ],
        nextActions: limited ? [] : ["Choose an easy workout"],
      },
      coverage: {
        insufficientData: limited,
        insufficientReasons: limited ? ["No recent wearable data"] : [],
      },
      states: [],
      recommendations: limited
        ? []
        : [
            {
              recommendationType: "RECOVERY",
              confidence: 0.8,
              priority: 1,
              payloadJson: { actions: ["Keep training intensity easy"] },
            },
          ],
    },
    weekly: {
      period: { from: "2019-12-31", to: date, anchorDate: date },
      summary: {
        headline: bob ? "Bob fixture week" : "Alice fixture week",
        narrative: ["Synthetic weekly summary"],
        nextActions: [],
        metrics: {
          coverage: { weightDays: 0, wearableDays: limited ? 0 : 7 },
          body: {
            latestWeightKg: null,
            averageWeightKg: null,
            weightChangeKg: null,
          },
          recovery: {
            averageRestingHr: limited ? null : 56,
            averageSleepDurationMin: limited ? null : 420,
            averageStressScore: limited ? null : 25,
          },
          activity: {
            totalSteps: limited ? 0 : 56000,
            averageSteps: limited ? null : 8000,
            totalCaloriesBurned: 0,
          },
          activitySessions: {
            sessionCount: 0,
            totalSessionDurationMin: 0,
            totalSessionCalories: 0,
          },
        },
      },
      coverage: {},
      highlights: [],
    },
    latestWeight: null,
    latestWearable: limited
      ? null
      : { date, sourceType: "synthetic", sourceRef: "fixture" },
    imports: { recentCount: 0, latest: null },
  };
}
const coachUsers = new Map();
function coachReply(limited, bob) {
  return {
    headline: limited
      ? "Historical signals — current wellbeing is unknown"
      : "Your recent wellbeing signals",
    period: { from: "2019-12-31", to: date, days: 7 },
    today: date,
    timezone: "Europe/Zagreb",
    confidence: "limited",
    latestWearableDate: limited ? null : date,
    mode: "evidence_only",
    blocks: limited
      ? [
          {
            id: "freshness",
            kind: "UNKNOWN",
            text: "Current recovery is unknown.",
            supports: [],
          },
        ]
      : [
          {
            id: "hrv:fact",
            kind: "FACT",
            text: `Stored daily HRV: mean ${bob ? 70 : 40} ms (synthetic fixture).`,
            dates: [date],
            values: [bob ? 70 : 40],
            supports: [],
          },
          {
            id: "hrv:trend",
            kind: "TREND",
            text: "Synthetic HRV comparison; no cause is established.",
            supports: ["hrv:fact"],
          },
        ],
    followUp: "Has your sleep routine changed?",
    answer: limited
      ? "Current recovery is unknown."
      : `Stored daily HRV: mean ${bob ? 70 : 40} ms (synthetic fixture).\n\nHas your sleep routine changed?`,
    attribution: "Synthetic Garmin-compatible fixture; no personal data.",
    context: { states: [], recommendations: [] },
  };
}
const server = createServer(async (req, res) => {
  if (req.url === "/health") return res.end("ok");
  if (
    req.headers["x-loadiq-internal-api-key"] !== "synthetic-internal" ||
    !["synthetic-alice", "synthetic-bob"].includes(
      req.headers["x-loadiq-external-auth-id"],
    )
  ) {
    res.writeHead(403);
    return res.end();
  }
  if (req.headers["x-loadiq-e2e-scenario"] === "error") {
    res.writeHead(503);
    return res.end();
  }
  const limited = req.headers["x-loadiq-e2e-scenario"] === "limited";
  const bob = req.headers["x-loadiq-external-auth-id"] === "synthetic-bob";
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname.startsWith("/api/coach/")) {
    if (
      req.headers["x-loadiq-e2e-scenario"] === "coach_chat_error" &&
      url.pathname.endsWith("/chat")
    ) {
      res.writeHead(503);
      return res.end();
    }
    if (req.headers["x-loadiq-e2e-scenario"] === "coach_error") {
      res.writeHead(503);
      return res.end();
    }
    const identity = req.headers["x-loadiq-external-auth-id"];
    const stateKey =
      identity + ":" + (req.headers["x-loadiq-e2e-scenario"] ?? "normal");
    if (!coachUsers.has(stateKey))
      coachUsers.set(stateKey, { consented: false, notes: [] });
    const state = coachUsers.get(stateKey);
    const paused = req.headers["x-loadiq-e2e-scenario"] === "coach_paused";
    const status = () => ({
      configured: !paused,
      providerReady: true,
      consented: state.consented,
      policyVersion: "synthetic-policy-v1",
      provider: "Synthetic provider",
      notice:
        "Synthetic AI consent fixture. No external LLM is called. Revocation stops new requests.",
    });
    let input = {};
    if (req.method === "POST") {
      let text = "";
      for await (const part of req) text += part;
      input = JSON.parse(text || "{}");
    }
    let result;
    if (url.pathname.endsWith("/status")) result = status();
    else if (url.pathname.endsWith("/consent")) {
      state.consented = input.enabled === true;
      result = status();
    } else if (url.pathname.endsWith("/brief"))
      result = coachReply(limited, bob);
    else if (url.pathname.endsWith("/chat"))
      result = {
        ...coachReply(limited, bob),
        mode: state.consented && !paused ? "ai_selected" : "evidence_only",
        ...(state.consented && !paused
          ? {
              answer: `Stored daily HRV: mean ${bob ? 70 : 40} ms (synthetic fixture).\n\nSleep timing could be relevant, but these summaries cannot establish a cause.\n\nHas your sleep routine changed?`,
              blocks: [
                {
                  id: "conversation:0",
                  kind: "HYPOTHESIS",
                  text: "Sleep timing could be relevant, but these summaries cannot establish a cause.",
                  supports: ["hrv:fact"],
                },
                ...coachReply(limited, bob).blocks,
              ],
            }
          : {}),
      };
    else if (req.method === "DELETE") {
      state.notes = state.notes.filter(
        (n) => n.id !== url.pathname.split("/").at(-1),
      );
      result = { removed: true };
    } else if (req.method === "POST") {
      if (!input.confirmed) {
        res.writeHead(400);
        return res.end();
      }
      result = {
        id: `${identity}-${state.notes.length}`,
        text: input.text,
        confirmedAt: "2020-01-06T12:00:00Z",
      };
      state.notes.push(result);
    } else result = state.notes;
    if (
      req.headers["x-loadiq-e2e-scenario"] === "coach_validation" &&
      url.pathname.endsWith("/chat")
    ) {
      result = {
        ...coachReply(limited, bob),
        mode: "provider_unavailable",
        completion: "evidence_only",
        latestImportedDate: "2020-01-07",
        failure: {
          category: "narrative_validation",
          stage: "synthesis",
          retryable: true,
        },
        answer:
          "AI odgovor nije dovršen. Slijedi odgovor iz provjerenih podataka, bez AI objašnjenja.\n\nPodaci pokazuju opisnu promjenu HRV-a; njegov uzrok nije utvrđen. Za zaključak su važni i san, stres te vaš osjećaj oporavka.",
      };
    }
    if (
      req.headers["x-loadiq-e2e-scenario"] === "coach_five_turn" &&
      (url.pathname.endsWith("/brief") || url.pathname.endsWith("/chat"))
    ) {
      const index = url.pathname.endsWith("/brief")
        ? 0
        : acceptance.questions.findIndex((q) => q.question === input.message);
      if (
        index < 0 ||
        (url.pathname.endsWith("/chat") &&
          JSON.stringify(input.previousQuestions ?? []) !==
            JSON.stringify(
              acceptance.questions.slice(0, index).map((q) => q.question),
            ))
      ) {
        res.writeHead(400);
        return res.end();
      }
      const turn = acceptance.questions[index];
      if (
        url.pathname.endsWith("/chat") &&
        index > 0 &&
        JSON.stringify(input.conversationContext) !==
          JSON.stringify(
            acceptance.questions[index - 1].reply.conversationContext,
          )
      ) {
        res.writeHead(400);
        return res.end();
      }
      result = turn.reply;
    }
    const contractScenario = req.headers["x-loadiq-e2e-scenario"];
    if (
      url.pathname.endsWith("/chat") &&
      typeof contractScenario === "string" &&
      contractScenario.startsWith("contract_")
    ) {
      result =
        acceptance.contracts[contractScenario.slice("contract_".length)] ??
        result;
    }
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result));
  }
  const body = url.pathname.endsWith("/summary")
    ? summary(limited, bob)
    : url.pathname.endsWith("/timeline")
      ? {
          range: { days: 28, from: "2019-12-10", to: date },
          points: limited
            ? []
            : [
                {
                  date,
                  weightKg: null,
                  steps: bob ? 3000 : 8000,
                  sleepDurationMin: 420,
                  restingHr: 56,
                  stressScore: 25,
                },
              ],
        }
      : [];
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
});
server.listen(4319, "127.0.0.1");
process.on("SIGTERM", () => server.close());
