import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads (100MB videos)
  experimental: {
    serverActions: {
      bodySizeLimit: "110mb",
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=self, microphone=self",
          },
        ],
      },
    ];
  },

  // Suppress source maps in production for security
  productionBrowserSourceMaps: false,
};

export default nextConfig;
