import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",               // frontend request path
        destination: "http://192.168.100.12:4000/:path*", // backend API
      },
    ];
  },
};

export default nextConfig;