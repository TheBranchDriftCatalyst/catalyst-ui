import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "./app",
  publicDir: "../public",
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
  ],
  build: {
    outDir: "../dist-app",
    emptyOutDir: true,
    sourcemap: true,
  },
});
