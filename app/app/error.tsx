"use client";
import { useEffect } from "react";
import { reportFailure } from "@/lib/monitoring/sentry";
export default function DashboardError({
  reset,
  error,
}: {
  reset: () => void;
  error: Error;
}) {
  useEffect(() => {
    reportFailure(error);
  }, [error]);
  return (
    <main role="alert">
      <h1>Dashboard unavailable</h1>
      <p>Please try again later.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
