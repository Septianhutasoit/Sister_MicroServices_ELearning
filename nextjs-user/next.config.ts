import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Batasi root directory Turbopack hanya pada folder frontend ini
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
