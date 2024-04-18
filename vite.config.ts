import react from "@vitejs/plugin-react";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // libInjectCss(),
    dts({ include: ["lib"], exclude: ["**/*.stories.tsx"] }),
  ],
  build: {
    copyPublicDir: false,
    cssMinify: false,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob
          .sync("lib/**/*.{ts,tsx,css}")
          .filter((path) => !path.endsWith(".stories.tsx"))
          .map((file) => [
            // 1. The name of the entry point
            // lib/nested/foo.js becomes nested/foo
            relative("lib", file.slice(0, file.length - extname(file).length)),
            // 2. The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'styles/catalyst.css';
          }
          return 'assets/[name][extname]';
        },
        entryFileNames: "[name].js",
        sourcemap: true,
      },
    },
  },
});
