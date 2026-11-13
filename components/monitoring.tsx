"use client";
import { useEffect } from "react";
import { initializeMonitoring, reportFailure } from "@/lib/monitoring/sentry";
export function Monitoring() {
  useEffect(() => {
    initializeMonitoring(process.env.NEXT_PUBLIC_SENTRY_DSN);
    const onError = (event: ErrorEvent) => reportFailure(event.error);
    const onRejection = (event: PromiseRejectionEvent) =>
      reportFailure(event.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
