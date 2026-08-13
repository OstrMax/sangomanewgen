import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repo = "sangomanewgen";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
