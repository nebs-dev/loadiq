import * as Sentry from "@sentry/nextjs";
import { euDsn, scrubEvent } from "./privacy";
export function initializeMonitoring(dsn: string | undefined) {
  const verified = euDsn(dsn);
  if (!verified || process.env.LOADIQ_E2E_MODE === "true") return;
  Sentry.init(monitoringOptions(verified));
}
export function reportFailure(error?: unknown) {
  Sentry.captureException(
    error instanceof Error ? error : new Error("LoadIQ application failure"),
    {
      tags: { operation: "frontend" },
    },
  );
}

export function monitoringOptions(
  dsn: string,
): NonNullable<Parameters<typeof Sentry.init>[0]> {
  return {
    dsn,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "development",
    defaultIntegrations: false,
    tracePropagationTargets: [],
    maxBreadcrumbs: 0,
    dataCollection: {
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      mcp: { inputs: false, outputs: false },
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      databaseQueryData: false,
      queues: false,
      stackFrameVariables: false,
      frameContextLines: 0,
    },
    beforeSendLog: () => null,
    beforeSendMetric: () => null,
    tracesSampleRate: 0,

    beforeSend: (event, hint) => {
      hint.attachments = [];
      return scrubEvent(event);
    },
  };
}
