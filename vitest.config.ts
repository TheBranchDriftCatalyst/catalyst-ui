import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Test environment
    environment: "jsdom",

    // Global test APIs (describe, it, expect, etc.)
    globals: true,

    // Setup files to run before each test file
    setupFiles: ["./test/setup.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov", "json-summary"],

      // Files to include in coverage
      include: ["lib/**/*.{ts,tsx}"],

      // Files to exclude from coverage
      exclude: [
        "**/*.stories.tsx",
        "**/*.test.tsx",
        "**/*.spec.tsx",
        "**/index.ts",
        "**/types.ts",
        "**/*.d.ts",
        "**/vite-env.d.ts",
        "lib/types/**",
      ],

      // Coverage thresholds
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },

      // Cleanup coverage results
      clean: true,
      cleanOnRerun: true,
    },

    // Test file patterns
    include: ["**/*.{test,spec}.{ts,tsx}"],

    // Exclude patterns
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],

    // CSS handling
    css: true,

    // Watch options
    watch: false,

    // Reporters
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["default", "html"],

    // Test timeout
    testTimeout: 10000,

    // Hook timeout
    hookTimeout: 10000,

    // Retry failed tests
    retry: process.env.CI ? 2 : 0,
  },

  resolve: {
    alias: {
      "@/catalyst-ui": path.resolve(__dirname, "./lib"),
    },
  },
});
