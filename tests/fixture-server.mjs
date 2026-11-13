import { createServer } from "node:http";
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
const server = createServer((req, res) => {
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
