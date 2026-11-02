import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// Which commit this build is, shown in Settings so it's easy to tell whether
// the site you're looking at is the latest deploy.
function commit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "local";
  }
}

// Static export so the demo can be hosted on GitHub Pages (or any static host).
// NEXT_PUBLIC_BASE_PATH is set to "/farsi-pen" by the Pages workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BUILD_COMMIT: commit(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  // The Piper phonemizer (Emscripten) has a Node-only branch that requires
  // "fs"; it never runs in the browser, so stub it out for the bundler.
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/lib/empty-module.ts" },
    },
  },
};

export default nextConfig;
