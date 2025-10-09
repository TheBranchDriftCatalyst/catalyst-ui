import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
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

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  root: "./app",
  publicDir: "../public",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(gitHash),
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
  ],
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
