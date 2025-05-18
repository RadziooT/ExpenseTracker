import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
//
// export default nextConfig;

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: false,
});

export default withSerwist({
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
});

// import type { NextConfig } from "next";
//
// const withPWA = require("next-pwa")({
//   dest: "public",
//   sw: "sw-pwa.js",
// });
//
// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   output: "standalone",
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };
//
// module.exports = withPWA(nextConfig);
