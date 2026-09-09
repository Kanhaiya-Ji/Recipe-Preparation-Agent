/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only NEXT_PUBLIC_ prefixed vars are exposed to the browser.
  // IBM credentials must NEVER have that prefix — they stay server-only.
  env: {
    // Non-secret public app config only:
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Recipe Preparation Agent",
  },
  // Treat the node-fetch / https modules as server-external (safe default)
  experimental: {},
};

module.exports = nextConfig;
