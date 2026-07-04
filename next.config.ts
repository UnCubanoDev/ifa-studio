import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/ifa-studio",
  trailingSlash: true,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
