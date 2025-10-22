import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import tabsManifestPlugin from "./build/vite-plugin-tabs-manifest";
import concatDocsPlugin from "./build/vite-plugin-concat-docs";
import preserveUseClient from "./build/vite-plugin-preserve-use-client";
import { i18nApiPlugin } from "./build/vite-plugin-i18n-api";
import sitemapPlugin from "./build/vite-plugin-sitemap";
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

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
  root: "./app",
  publicDir: "../public",
  define: {
    // Maybe move these to a build utils function???
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(gitHash),
    __LAST_COMMIT__: JSON.stringify(lastCommit),
    // Map non-prefixed env vars to VITE_ prefixed ones for PaperTradarr
    "import.meta.env.VITE_POLYGON_API_KEY": JSON.stringify(
      process.env.VITE_POLYGON_API_KEY || process.env.POLYGON_API_KEY || ""
    ),
  },
  plugins: [
    tabsManifestPlugin(), // Generates manifest + OG images (includes export validation)
    sitemapPlugin({
      // Use env variable from CI, fallback to GitHub Pages URL for dev
      baseUrl: process.env.VITE_BASE_URL || "https://thebranchdriftcatalyst.github.io/catalyst-ui",
      defaultChangefreq: "weekly",
      defaultPriority: 0.8,
    }),
    concatDocsPlugin(),
    i18nApiPlugin(),
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
}));
