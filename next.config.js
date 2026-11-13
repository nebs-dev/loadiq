/** @type {import('next').NextConfig} */
if (
  process.env.NODE_ENV === "production" &&
  process.env.LOADIQ_E2E_MODE === "true"
) {
  throw new Error(
    "E2E authentication is forbidden in production builds and servers",
  );
}
const nextConfig = {
  // The separate quality gate rejects new findings while tracking the existing backlog.
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
