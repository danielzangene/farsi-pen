import type { NextConfig } from "next";

// Static export so the demo can be hosted on GitHub Pages (or any static host).
// NEXT_PUBLIC_BASE_PATH is set to "/farsi-pen" by the Pages workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // The Piper phonemizer (Emscripten) has a Node-only branch that requires
  // "fs"; it never runs in the browser, so stub it out for the bundler.
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/lib/empty-module.ts" },
    },
  },
};

export default nextConfig;
