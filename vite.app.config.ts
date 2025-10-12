import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import concatDocsPlugin from "./build/vite-plugin-concat-docs";
import { execSync } from "child_process";
import { readFileSync } from "fs";

// Get version from package.json
const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

// Get git hash (short), fallback to 'dev' if not in git repo
let gitHash = "dev";
try {
  gitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  console.warn("Could not get git hash, using 'dev'");
}

// Get last commit message
let lastCommit = "Development build";
try {
  lastCommit = execSync("git log -1 --pretty=%B").toString().trim();
} catch (error) {
  console.warn("Could not get last commit message");
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  root: "./app",
  publicDir: "../public",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(gitHash),
    __LAST_COMMIT__: JSON.stringify(lastCommit),
  },
  plugins: [
    // Only run concatDocsPlugin during build, not in dev mode
    // This prevents unnecessary HMR triggers from markdown file changes
    ...(process.env.NODE_ENV === "production" ? [concatDocsPlugin()] : []),
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
  ],
  server: {
    watch: {
      // Ignore generated files and annotation syncs to prevent excessive HMR
      ignored: [
        "**/annotations.json",
        "**/docs-combined.md",
        "**/.tabs.manifest.json",
        "**/.locale/*.i18n.json", // Ignore i18n translation files - loaded eagerly at startup
      ],
      // Stabilize file watching to ignore transient file system events (like atime updates)
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
    },
  },
  optimizeDeps: {
    // shiki is dynamically imported, no need to exclude anymore
  },
  build: {
    outDir: "../dist/app",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep shiki in its own chunk to avoid WASM loading issues
          if (id.includes("node_modules/shiki")) {
            return "shiki";
          }
        },
      },
    },
  },
});
