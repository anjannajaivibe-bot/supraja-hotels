import type { NextConfig } from "next";

const publicSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const adminSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "no-store, no-cache, max-age=0, must-revalidate" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: publicSecurityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: adminSecurityHeaders,
      },
      {
        source: "/api/admin/:path*",
        headers: adminSecurityHeaders,
      },
      {
        source: "/api/admin-login",
        headers: adminSecurityHeaders,
      },
      {
        source: "/api/admin-logout",
        headers: adminSecurityHeaders,
      },
    ];
  },
};

export default nextConfig;
