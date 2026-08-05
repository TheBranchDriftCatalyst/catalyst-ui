/**
 * ESLint flat config (ESLint 9+).
 *
 * Wires the already-installed legacy-style packages manually:
 * - @typescript-eslint/parser + eslint-plugin (v8)
 * - eslint-plugin-react-hooks (v6)
 * - eslint-plugin-react-refresh
 *
 * Scope: TypeScript sources only. Build outputs, docs, and tooling dirs are ignored.
 */
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "storybook-static/**",
      "coverage/**",
      "docs/**",
      "public/**",
      "etc/**",
      "gh-pages/**",
      ".beads/**",
      ".beads.bak-fix/**",
      ".codex/**",
      "**/*.config.{js,ts,mjs,cjs}",
      "**/*.stories.tsx",
      ".storybook/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // TEMPORARILY warn: 6 pre-existing conditional-hook violations tracked in beads
      // (CatalystHeader, CodeFlipCard, ForceGraph FilterPanel). Restore to "error"
      // once that bead is closed.
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // Legacy codebase baseline: surface without blocking. The lint script's
      // --max-warnings ratchet fails the build if NEW warnings are introduced.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },
];
