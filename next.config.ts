import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare Workers has no free built-in image optimizer; images are already sized at the source.
  images: { unoptimized: true },
};

export default nextConfig;

initOpenNextCloudflareForDev();
