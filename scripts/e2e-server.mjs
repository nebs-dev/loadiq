import { spawn } from "node:child_process";
const env = {
  ...process.env,
  NODE_ENV: "development",
  LOADIQ_E2E_MODE: "true",
  LOADIQ_E2E_SECRET: "synthetic-e2e-local-only",
  LOADIQ_API_BASE_URL: "http://127.0.0.1:4319",
  LOADIQ_INTERNAL_API_KEY: "synthetic-internal",
  NEXT_TELEMETRY_DISABLED: "1",
  WORKOS_API_KEY: "",
  WORKOS_CLIENT_ID: "",
  WORKOS_COOKIE_PASSWORD: "",
  SENTRY_DSN: "",
  NEXT_PUBLIC_SENTRY_DSN: "",
};
const children = [
  spawn(process.execPath, ["tests/fixture-server.mjs"], {
    stdio: "inherit",
    env,
  }),
  spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      "4318",
    ],
    { stdio: "inherit", env },
  ),
];
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  children.forEach((child) => child.kill("SIGTERM"));
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
children.forEach((child) =>
  child.on("exit", (code) => {
    if (!stopping) {
      stop();
      process.exitCode = code || 1;
    }
  }),
);
