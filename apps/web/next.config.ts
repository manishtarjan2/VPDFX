import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve(__dirname, "../.."),
    resolveAlias: {
      "pdf-lib": "pdf-lib/lib/index.js",
    },
  },
};

export default nextConfig;
