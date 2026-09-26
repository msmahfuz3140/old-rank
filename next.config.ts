import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary CDN - product images
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Unsplash - placeholder/demo images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Other common image CDNs
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Allow cross-origin requests from deployed backend
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
