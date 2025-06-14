import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcional: también ignorar errores de TypeScript
    ignoreBuildErrors: true,
  },
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