import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pbs.twimg.com"], // Twitter画像のドメインを許可
  },
};

export default nextConfig;
