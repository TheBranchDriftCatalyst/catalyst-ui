import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
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

// Plugin to preserve "use client" directives in build output
function preserveUseClient() {
  return {
    name: "preserve-use-client",
    enforce: "post" as const,
    generateBundle(_options: any, bundle: any) {
      for (const chunk of Object.values(bundle) as any[]) {
        if (chunk.type === "chunk" && chunk.code) {
          // Add "use client" to any chunk that imports from React
          // This is necessary for Next.js App Router compatibility
          const needsUseClient =
            chunk.code.includes('from "react"') ||
            chunk.code.includes("from 'react'") ||
            (chunk.code.includes("import * as") && chunk.code.includes("react")) ||
            chunk.code.includes("useState") ||
            chunk.code.includes("useEffect") ||
            chunk.code.includes("useContext") ||
            chunk.code.includes("useRef");

          if (needsUseClient) {
            // Prepend "use client" if not already present
            if (
              !chunk.code.trimStart().startsWith('"use client"') &&
              !chunk.code.trimStart().startsWith("'use client'")
            ) {
              chunk.code = '"use client";\n' + chunk.code;
            }
          }
        }
      }
    },
  };
}

/** @type {import('vite').UserConfig} */
export default defineConfig({
  root: "./app",
  publicDir: "../public",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(gitHash),
  },
  plugins: [
    tabsManifestPlugin(),
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
    dts({ include: ["lib"], exclude: ["**/*.stories.tsx"] }),
    preserveUseClient(),
  ],
  build: {
    outDir: "../dist/lib",
    copyPublicDir: false,
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: true,
    manifest: "vite-manifest.json",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ["console.log"],
      },
      format: {
        comments: false,
      },
    },
    lib: {
      entry: resolve(__dirname, "lib/catalyst.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        // Heavy dependencies - let consumers provide these
        "elkjs",
        "elkjs/lib/elk.bundled.js",
        "dagre",
        "shiki",
        "shiki/bundle/web",
        /^shiki\//, // Matches shiki/langs/*, shiki/themes/*, etc.
        "d3",
        /^d3-/, // Matches all d3 submodules (d3-force, d3-selection, etc.)
      ],
      onwarn(warning, defaultHandler) {
        // See this issue, its a non issue just... unfortunate. TL:DR: directives fuck up source maps, vite
        // compares the old and new with the sourcemap and sees a discrepancy and warns us
        // https://github.com/vitejs/vite/issues/15012
        if (warning.code === "SOURCEMAP_ERROR") {
          return;
        }
        defaultHandler(warning);
      },
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob
          .sync("lib/**/*.{ts,tsx,css}")
          .filter(path => !path.endsWith(".stories.tsx"))
          .map(file => [
            // 1. The name of the entry point
            // lib/nested/foo.js becomes nested/foo
            relative("lib", file.slice(0, file.length - extname(file).length)),
            // 2. The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: assetInfo => {
          // if (assetInfo.name.endsWith('.css')) {
          //   return 'styles/catalyst.css';
          // }
          return "assets/[name]-[hash][extname]";
        },
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        // Share common vendor chunks across components
        manualChunks(id) {
          // Only apply to non-externalized dependencies
          if (id.includes("node_modules")) {
            // Group Radix UI components together
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            // Group React ecosystem
            if (id.includes("react-hook-form") || id.includes("@hookform")) {
              return "vendor-forms";
            }
            // Group utility libraries
            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority")
            ) {
              return "vendor-utils";
            }
          }
        },
      },
    },
  },
});
