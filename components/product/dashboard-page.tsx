import type { ReactNode } from "react";
import { ArrowRight, CalendarRange, Download, Footprints, HeartPulse, Scale, ShieldAlert, TimerReset, Zap } from "lucide-react";
import { signOut, withAuth } from "@workos-inc/authkit-nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getDashboardSummary,
  getDashboardTimeline,
  getRecentActivity,
  getRecentImports,
  type ActivitySessionRecord,
  type DashboardSummaryResponse,
  type DashboardTimelineResponse,
  type ImportRecord,
} from "@/lib/loadiq-api";
import { TrendPanel } from "./trend-panel";

export async function DashboardPage() {
  const [{ user }, summary, timeline, recentActivity, recentImports] = await Promise.all([
    withAuth({ ensureSignedIn: true }),
    getDashboardSummary(),
    getDashboardTimeline("28d"),
    getRecentActivity("14d"),
    getRecentImports(5),
  ]);

  const greetingName = user.firstName ?? user.email.split("@")[0];
  const activeStates = summary.daily.states.filter((state) => state.status !== "RESOLVED");
  const recommendationActions = summary.daily.recommendations.flatMap((recommendation) =>
    recommendation.payloadJson?.actions ?? [],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#E0FFF3,transparent_28%),radial-gradient(circle_at_top_right,#DBEAFE,transparent_22%),linear-gradient(180deg,#F8FAFC_0%,#EEF4FB_100%)] text-[#0F172A]">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F8F63]">
              LoadIQ App
            </p>
            <h1 className="font-nacelle text-2xl font-semibold tracking-[-0.03em]">
              Welcome back, {greetingName}
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Your latest physiology snapshot anchored to {summary.asOfDate}.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ returnTo: "/" });
            }}
          >
            <Button variant="secondary">Sign out</Button>
          </form>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-hidden border-white/70 bg-[linear-gradient(135deg,#0F172A_0%,#11304A_55%,#0F8F63_100%)] text-white">
            <CardHeader className="pb-4">
              <Badge className="w-fit bg-white/14 text-white" variant="neutral">
                Weekly Summary
              </Badge>
              <CardTitle className="max-w-2xl text-3xl text-white">
                {summary.weekly.summary.headline}
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-slate-200">
                {summary.weekly.summary.narrative.join(" ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <StatPill
                icon={<CalendarRange className="h-4 w-4" />}
                label="Wearable days"
                value={String(summary.weekly.summary.metrics.coverage.wearableDays)}
              />
              <StatPill
                icon={<Footprints className="h-4 w-4" />}
                label="Average steps"
                value={formatNullable(summary.weekly.summary.metrics.activity.averageSteps)}
              />
              <StatPill
                icon={<Zap className="h-4 w-4" />}
                label="Sessions"
                value={String(summary.weekly.summary.metrics.activitySessions.sessionCount)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge
                className="w-fit"
                variant={mapSummaryStatus(summary.daily.summary.status)}
              >
                Daily status
              </Badge>
              <CardTitle>{summary.daily.summary.headline}</CardTitle>
              <CardDescription>
                {summary.daily.summary.narrative.join(" ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <KeyDatum
                  icon={<Scale className="h-4 w-4" />}
                  label="Latest weight"
                  value={
                    summary.latestWeight
                      ? `${summary.latestWeight.weightKg.toFixed(1)} kg`
                      : "No entry"
                  }
                />
                <KeyDatum
                  icon={<Download className="h-4 w-4" />}
                  label="Recent imports"
                  value={String(summary.imports.recentCount)}
                />
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                  Next actions
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#334155]">
                  {summary.daily.summary.nextActions.slice(0, 3).map((action) => (
                    <li key={action} className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4 text-[#0F8F63]" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            title="Key Highlights"
            icon={<Zap className="h-4 w-4" />}
            items={summary.weekly.highlights.slice(0, 4).map((highlight) => highlight.message)}
            emptyMessage="Highlights will appear after enough recovery and activity data comes in."
          />
          <InsightCard
            title="Detected States"
            icon={<ShieldAlert className="h-4 w-4" />}
            items={activeStates.map((state) => formatLabel(state.stateType))}
            emptyMessage="No active states are open right now."
          />
          <InsightCard
            title="Recommendations"
            icon={<TimerReset className="h-4 w-4" />}
            items={recommendationActions.slice(0, 4)}
            emptyMessage="Recommendations will appear when the engine detects a notable signal."
          />
          <InsightCard
            title="Coverage"
            icon={<HeartPulse className="h-4 w-4" />}
            items={
              summary.daily.coverage.insufficientData
                ? summary.daily.coverage.insufficientReasons
                : [
                    `${summary.weekly.summary.metrics.coverage.wearableDays} wearable day(s) in the current week.`,
                    `${summary.weekly.summary.metrics.coverage.weightDays} weight day(s) in the current week.`,
                  ]
            }
            emptyMessage="Coverage is healthy."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Trend Overview</CardTitle>
              <CardDescription>
                Last {timeline.range.days} days of chart-ready normalized signals.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <TrendPanel
                label="Weight"
                value={formatMetricFromTimeline(timeline, "weightKg", "kg")}
                subtitle="Manual body signal"
                values={timeline.points.map((point) => point.weightKg)}
              />
              <TrendPanel
                label="Steps"
                value={formatMetricFromTimeline(timeline, "steps")}
                subtitle="Daily activity volume"
                values={timeline.points.map((point) => point.steps)}
              />
              <TrendPanel
                label="Sleep"
                value={formatMetricFromTimeline(timeline, "sleepDurationMin", "min")}
                subtitle="Wearable recovery signal"
                values={timeline.points.map((point) => point.sleepDurationMin)}
              />
              <TrendPanel
                label="Resting HR"
                value={formatMetricFromTimeline(timeline, "restingHr", "bpm")}
                subtitle="Recovery pulse"
                values={timeline.points.map((point) => point.restingHr)}
              />
              <TrendPanel
                label="Stress"
                value={formatMetricFromTimeline(timeline, "stressScore")}
                subtitle="Daily stress score"
                values={timeline.points.map((point) => point.stressScore)}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <RecentImports imports={recentImports} summary={summary} />
            <RecentActivity sessions={recentActivity} />
          </div>
        </section>
      </main>
    </div>
  );
}

function InsightCard({
  title,
  icon,
  items,
  emptyMessage,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
          <span className="rounded-full bg-[#ECFEF5] p-2 text-[#0F8F63]">{icon}</span>
          {title}
        </div>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3 text-sm text-[#334155]">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#0F8F63]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#64748B]">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}

function RecentImports({
  imports,
  summary,
}: {
  imports: ImportRecord[];
  summary: DashboardSummaryResponse;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Imports</CardTitle>
        <CardDescription>
          Latest upload status plus {summary.imports.recentCount} import(s) in the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {imports.length === 0 ? (
          <p className="text-sm text-[#64748B]">No imports yet.</p>
        ) : (
          imports.map((entry, index) => (
            <div key={entry.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {entry.originalFileName ?? entry.sourceType}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {formatDateTime(entry.createdAt)}
                  </p>
                </div>
                <Badge variant={mapImportVariant(entry.status)}>{entry.status}</Badge>
              </div>
              {entry.error ? (
                <p className="mt-2 text-sm text-[#991B1B]">{entry.error}</p>
              ) : null}
              {index < imports.length - 1 ? <Separator className="mt-4" /> : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivity({ sessions }: { sessions: ActivitySessionRecord[] }) {
  const items = sessions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity Snapshot</CardTitle>
        <CardDescription>
          Compact session view from the last 14 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-[#64748B]">No activity sessions available yet.</p>
        ) : (
          items.map((session, index) => (
            <div key={session.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {formatLabel(session.activityType)}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {new Date(session.startAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right text-sm text-[#334155]">
                  <p>{session.durationMin ? `${session.durationMin} min` : "n/a"}</p>
                  <p className="text-xs text-[#64748B]">
                    {session.caloriesBurned ? `${session.caloriesBurned} kcal` : "No calories"}
                  </p>
                </div>
              </div>
              {index < items.length - 1 ? <Separator className="mt-4" /> : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-200">
        {icon}
        {label}
      </div>
      <p className="font-nacelle text-2xl font-semibold tracking-[-0.03em]">{value}</p>
    </div>
  );
}

function KeyDatum({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-nacelle text-xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function formatMetricFromTimeline(
  timeline: DashboardTimelineResponse,
  key: "weightKg" | "steps" | "sleepDurationMin" | "restingHr" | "stressScore",
  suffix?: string,
) {
  const latest = [...timeline.points].reverse().find((point) => point[key] !== null)?.[key];

  if (latest === undefined || latest === null) {
    return "No data";
  }

  return suffix ? `${latest} ${suffix}` : String(latest);
}

function mapSummaryStatus(status: DashboardSummaryResponse["daily"]["summary"]["status"]) {
  if (status === "attention") {
    return "warning" as const;
  }

  if (status === "stable") {
    return "positive" as const;
  }

  return "neutral" as const;
}

function mapImportVariant(status: string) {
  if (status === "completed") {
    return "positive" as const;
  }

  if (status === "failed") {
    return "negative" as const;
  }

  return "neutral" as const;
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatNullable(value: number | null) {
  return value === null ? "No data" : value.toLocaleString("en-US");
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
