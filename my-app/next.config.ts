import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cualquier hostname con HTTPS
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // Permite cualquier hostname con HTTP (opcional)
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;