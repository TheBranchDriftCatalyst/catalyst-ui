import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import yamlPlugin from "@rollup/plugin-yaml";
import concatDocsPlugin from "./build/vite-plugin-concat-docs";
import tabsManifestPlugin from "./build/vite-plugin-tabs-manifest";
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
    yamlPlugin(),
    // Auto-discover tabs in app/tabs/*Tab.tsx and regenerate
    // .tabs.manifest.yaml on dev-server start + file change. Was
    // previously present-but-unregistered (op-css-scan follow-up).
    tabsManifestPlugin(),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
  ],
  server: {
    // LLM Playground tab wraps its client tree in <LLMConfigProvider>
    // which fetches /api/llm/config. When the operator is running,
    // proxy this dev server's /api → operator:9090 so the playground
    // reports source: 'operator' and picks up the yaml file's values.
    // Set VITE_OPERATOR_URL to point at a different operator instance
    // (empty/unset = no proxy = standalone with defaults banner).
    proxy:
      process.env.VITE_OPERATOR_URL !== ""
        ? {
            "/api": {
              target: process.env.VITE_OPERATOR_URL || "http://localhost:9090",
              changeOrigin: true,
              ws: true,
            },
          }
        : undefined,
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
