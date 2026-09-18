import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

// import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
// OpenNext dev hook disabled — site is now fully static-exported and served
// from Cloudflare Workers as plain HTML + assets (no Worker runtime).
