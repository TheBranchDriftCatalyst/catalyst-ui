import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  root: "./app",
  publicDir: "../public",
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
  ],
  optimizeDeps: {
    exclude: ['shiki'],
  },
  build: {
    outDir: "../dist/app",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep shiki in its own chunk to avoid WASM loading issues
          if (id.includes('node_modules/shiki')) {
            return 'shiki';
          }
        },
      },
    },
  },
});
