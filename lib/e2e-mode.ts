// Both checks are required. A production build rejects this flag in next.config.js.
export function e2eEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.LOADIQ_E2E_MODE === "true" &&
    Boolean(process.env.LOADIQ_E2E_SECRET) &&
    process.env.LOADIQ_API_BASE_URL === "http://127.0.0.1:4319"
  );
}
