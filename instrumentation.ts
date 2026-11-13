export async function register() {
  const { initializeMonitoring } = await import("./lib/monitoring/sentry");
  initializeMonitoring(process.env.SENTRY_DSN);
}
export async function onRequestError(error: unknown) {
  const { reportFailure } = await import("./lib/monitoring/sentry");
  reportFailure(error);
}
