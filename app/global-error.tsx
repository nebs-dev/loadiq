"use client";
import { useEffect } from "react";
import { reportFailure } from "@/lib/monitoring/sentry";
export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    reportFailure(error);
  }, [error]);
  return (
    <html>
      <body>
        <h1>LoadIQ is temporarily unavailable</h1>
      </body>
    </html>
  );
}
