import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hotel/room/retreat photos live on the API host (and flag icons on a
    // CDN), which aren't in remotePatterns — without this, next/image
    // refuses those srcs at runtime and the images never render. We serve
    // originals everywhere, matching the ad-hoc `unoptimized` props already
    // used across the app.
    unoptimized: true,
  },
};

export default nextConfig;
