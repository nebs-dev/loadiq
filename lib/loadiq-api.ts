import "server-only";

import { withAuth } from "@workos-inc/authkit-nextjs";

const INTERNAL_API_KEY_HEADER = "x-loadiq-internal-api-key";
const EXTERNAL_AUTH_ID_HEADER = "x-loadiq-external-auth-id";
const USER_EMAIL_HEADER = "x-loadiq-user-email";
const USER_NAME_HEADER = "x-loadiq-user-name";
const AUTH_PROVIDER_HEADER = "x-loadiq-auth-provider";

export interface DashboardSummaryResponse {
  asOfDate: string;
  daily: {
    date: string;
    summary: {
      headline: string;
      status: "attention" | "stable" | "limited_data";
      narrative: string[];
      nextActions: string[];
    };
    coverage: {
      insufficientData: boolean;
      insufficientReasons: string[];
    };
    states: Array<{
      stateType: string;
      status: string;
      confidence: number;
      severity: number;
    }>;
    recommendations: Array<{
      recommendationType: string;
      confidence: number;
      priority: number;
      payloadJson: { actions?: string[] } | null;
    }>;
  };
  weekly: {
    period: {
      from: string;
      to: string;
      anchorDate: string;
    };
    summary: {
      headline: string;
      narrative: string[];
      nextActions: string[];
      metrics: {
        coverage: {
          weightDays: number;
          wearableDays: number;
        };
        body: {
          latestWeightKg: number | null;
          averageWeightKg: number | null;
          weightChangeKg: number | null;
        };
        recovery: {
          averageRestingHr: number | null;
          averageSleepDurationMin: number | null;
          averageStressScore: number | null;
        };
        activity: {
          totalSteps: number;
          averageSteps: number | null;
          totalCaloriesBurned: number;
        };
        activitySessions: {
          sessionCount: number;
          totalSessionDurationMin: number;
          totalSessionCalories: number;
        };
      };
    };
    coverage: Record<string, unknown>;
    highlights: Array<{
      kind: string;
      level: "info" | "positive" | "negative";
      message: string;
    }>;
  };
  latestWeight: {
    date: string;
    weightKg: number;
    note: string | null;
  } | null;
  latestWearable: {
    date: string;
    sourceType: string | null;
    sourceRef: string | null;
  } | null;
  imports: {
    recentCount: number;
    latest: {
      id: string;
      status: string;
      sourceType: string;
      createdAt: string;
      processedAt: string | null;
      error: string | null;
    } | null;
  };
}

export interface DashboardTimelineResponse {
  range: {
    days: number;
    from: string;
    to: string;
  };
  points: Array<{
    date: string;
    weightKg: number | null;
    steps: number | null;
    sleepDurationMin: number | null;
    restingHr: number | null;
    stressScore: number | null;
  }>;
}

export interface ActivitySessionRecord {
  id: string;
  startAt: string;
  endAt: string | null;
  sessionDate: string;
  activityType: string;
  durationMin: number | null;
  caloriesBurned: number | null;
  avgHr: number | null;
}

export interface ImportRecord {
  id: string;
  status: string;
  sourceType: string;
  originalFileName: string | null;
  createdAt: string;
  processedAt: string | null;
  error: string | null;
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function getApiHeaders() {
  const { user } = await withAuth({ ensureSignedIn: true });

  return {
    [INTERNAL_API_KEY_HEADER]: requireEnv("LOADIQ_INTERNAL_API_KEY"),
    [EXTERNAL_AUTH_ID_HEADER]: user.id,
    [USER_EMAIL_HEADER]: user.email,
    [USER_NAME_HEADER]:
      [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    [AUTH_PROVIDER_HEADER]: "workos",
  };
}

async function apiFetch<T>(path: string) {
  const baseUrl = requireEnv("LOADIQ_API_BASE_URL").replace(/\/$/, "");
  const headers = await getApiHeaders();
  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`LoadIQ API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardSummary() {
  return apiFetch<DashboardSummaryResponse>("/api/dashboard/summary");
}

export async function getDashboardTimeline(range = "28d") {
  return apiFetch<DashboardTimelineResponse>(
    `/api/dashboard/timeline?range=${encodeURIComponent(range)}`,
  );
}

export async function getRecentActivity(range = "14d") {
  const to = new Date();
  const from = new Date(to);
  const days = Number(range.replace("d", "")) || 14;
  from.setUTCDate(from.getUTCDate() - (days - 1));

  return apiFetch<ActivitySessionRecord[]>(
    `/api/activities/sessions?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(
      to.toISOString(),
    )}`,
  );
}

export async function getRecentImports(limit = 5) {
  return apiFetch<ImportRecord[]>(`/api/imports?limit=${limit}`);
}
