/**
 * @thebranchdriftcatalyst/catalyst-ui — Vite plugin
 *
 * A single-import plugin for downstream Vite consumers that removes several
 * per-app wiring chores:
 *
 *   1. **React deduplication**  — auto-adds `react`, `react-dom`, and
 *      `react/jsx-runtime` to `resolve.dedupe`. Required whenever the
 *      library is consumed via `yarn link` (workspace sibling) because
 *      otherwise two React instances collide and hooks throw.
 *
 *   2. **Tailwind @source hint**  — exposes a virtual CSS module
 *      `virtual:catalyst-ui/tailwind-source` that emits a resolved absolute
 *      `@source` line pointing at whichever `node_modules/@thebranchdriftcatalyst/catalyst-ui/dist`
 *      the project actually loaded (linked OR installed). Consumers can
 *      import that virtual module from their entry stylesheet if they'd
 *      rather not rely on the fallback `@source` inside `setup.css`.
 *
 *   3. **(Opt-in) auto-inject setup.css**  — when `injectSetupCss: true`
 *      is passed, the plugin adds an implicit `@import "@thebranchdriftcatalyst/catalyst-ui/setup"`
 *      into the app's entry stylesheet so consumers don't even need a CSS
 *      import. Off by default because most apps prefer an explicit import.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from "vite";
 * import react from "@vitejs/plugin-react";
 * import tailwindcss from "@tailwindcss/vite";
 * import { catalystPlugin } from "@thebranchdriftcatalyst/catalyst-ui/vite";
 *
 * export default defineConfig({
 *   plugins: [react(), tailwindcss(), catalystPlugin()],
 * });
 * ```
 */

import type { Plugin, ResolvedConfig } from "vite";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import { renderNoFlashScript, type NoFlashScriptOptions } from "../contexts/noFlash";

/**
 * Configuration surface for {@link catalystPlugin}.
 *
 * @public
 */
export interface CatalystPluginOptions {
  /**
   * Extra module IDs to add to `resolve.dedupe`. The plugin ALWAYS dedupes
   * `react`, `react-dom`, and `react/jsx-runtime` — this list is additive
   * for consumers that use additional shared singletons (e.g. `zod`).
   */
  dedupe?: string[];

  /**
   * When true, the plugin injects `@import "@thebranchdriftcatalyst/catalyst-ui/setup"`
   * into the resolved app entry CSS via a virtual module. Off by default —
   * most consumers prefer an explicit import in their `index.css`.
   */
  injectSetupCss?: boolean;

  /**
   * When set, the plugin injects a no-flash-of-wrong-theme script into
   * every `index.html` `<head>`. Pass either:
   *
   *   - `true` — inject with default options (dark default, no legacy migration).
   *   - An {@link NoFlashScriptOptions} object — pass through to
   *     {@link renderNoFlashScript} (e.g. `{ legacyStorageKey: "boomtime-theme" }`).
   *
   * Leave undefined to skip injection. The script is idempotent — if you
   * already hand-injected it, the plugin looks for a marker and skips.
   */
  noFlash?: boolean | NoFlashScriptOptions;
}

const VIRTUAL_TAILWIND_SOURCE = "virtual:catalyst-ui/tailwind-source";
const RESOLVED_VIRTUAL_TAILWIND_SOURCE = "\0" + VIRTUAL_TAILWIND_SOURCE + ".css";

const REACT_SINGLETONS = ["react", "react-dom", "react/jsx-runtime"] as const;

const PACKAGE_NAME = "@thebranchdriftcatalyst/catalyst-ui";

/**
 * Resolve the actual on-disk location of the library's `dist` directory,
 * honoring `yarn link` symlinks / workspaces / hoisted installs. Falls back
 * to `undefined` if the package can't be resolved from `configRoot` — the
 * plugin degrades gracefully in that case (the fallback `@source` inside
 * `setup.css` still works when the package is at the expected relative
 * `node_modules/` path).
 *
 * Two-stage resolution:
 *   1. Try `require.resolve("<pkg>/package.json")` — the classic path, but
 *      it only works when the package's `exports` map explicitly lists
 *      `./package.json` (many published packages don't).
 *   2. Fall back to walking upward from `configRoot`, checking each
 *      `node_modules/<pkg>` directly. This handles yarn-link symlinks,
 *      hoisted workspaces, and packages whose exports lock out
 *      `package.json`.
 *
 * @internal
 */
function resolveDistDir(configRoot: string): string | undefined {
  // Stage 1: node's own resolver, respecting exports.
  try {
    const req = createRequire(resolve(configRoot, "package.json"));
    const pkgJsonPath = req.resolve(`${PACKAGE_NAME}/package.json`);
    const dist = resolve(dirname(pkgJsonPath), "dist");
    if (existsSync(dist)) return dist;
  } catch {
    // Fall through to stage 2.
  }

  // Stage 2: walk up looking for node_modules/<pkg>/dist. Follows symlinks
  // transparently (yarn link works fine).
  let cur = configRoot;
  for (let i = 0; i < 20; i++) {
    const candidate = resolve(cur, "node_modules", PACKAGE_NAME, "dist");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return undefined;
}

/**
 * `catalystPlugin` — the Vite plugin. See module docs for details.
 *
 * @public
 */
const NO_FLASH_MARKER = "catalyst-ui:no-flash";

export function catalystPlugin(options: CatalystPluginOptions = {}): Plugin {
  const extraDedupe = options.dedupe ?? [];
  const injectSetupCss = options.injectSetupCss ?? false;
  const noFlashOpts: NoFlashScriptOptions | null =
    options.noFlash === true
      ? {}
      : options.noFlash && typeof options.noFlash === "object"
        ? options.noFlash
        : null;

  let resolvedRoot = process.cwd();
  let distDir: string | undefined;

  return {
    name: "catalyst-ui",
    enforce: "pre",

    config(userConfig) {
      // Merge dedupe list. Vite's `resolve.dedupe` is an array of package
      // ids — we union our React singletons + any extras with whatever the
      // user already set.
      const existing = userConfig.resolve?.dedupe ?? [];
      const merged = Array.from(new Set([...existing, ...REACT_SINGLETONS, ...extraDedupe]));
      return {
        resolve: {
          dedupe: merged,
        },
      };
    },

    configResolved(config: ResolvedConfig) {
      resolvedRoot = config.root;
      distDir = resolveDistDir(resolvedRoot);
      if (!distDir && config.command === "serve" && config.logger) {
        // Not fatal — just a hint for someone debugging missing utility
        // classes inside library components during `vite dev`.
        config.logger.warn(
          `[catalyst-ui] Could not locate '${PACKAGE_NAME}/dist' from ${resolvedRoot}. ` +
            `Tailwind's JIT may miss classes used inside library components. ` +
            `If you're using \`yarn link\`, ensure the linked package is present ` +
            `under node_modules or point Tailwind at the linked source via @source.`
        );
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_TAILWIND_SOURCE) {
        return RESOLVED_VIRTUAL_TAILWIND_SOURCE;
      }
      return null;
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_TAILWIND_SOURCE) return null;
      // Emit a CSS module containing a single Tailwind v4 `@source` line
      // pointing at the resolved dist. Absolute paths are legal in
      // `@source`. If we couldn't resolve dist, emit an empty stylesheet
      // rather than an invalid `@source ""`.
      if (!distDir) return "/* catalyst-ui: dist path not resolved */\n";
      const importParts = injectSetupCss ? [`@import "${PACKAGE_NAME}/setup";`] : [];
      return [
        `/* Injected by catalystPlugin() — do not edit. */`,
        `@source "${distDir}";`,
        ...importParts,
        "",
      ].join("\n");
    },

    // Transform the app's `index.html`. Two independent injections:
    //
    //   1. When `injectSetupCss` is on, add a module-shim that pulls the
    //      virtual CSS entry (which re-emits `@source` + optionally the
    //      library setup.css `@import`).
    //   2. When `noFlash` is set, inject the no-flash-of-wrong-theme
    //      synchronous script into `<head>` so the initial paint uses the
    //      correct dark/light class before React mounts.
    //
    // Both are idempotent-guarded so double-inclusion doesn't happen if a
    // consumer already pasted the same thing manually.
    transformIndexHtml(html) {
      let out = html;

      if (noFlashOpts && !out.includes(NO_FLASH_MARKER)) {
        const scriptTag = renderNoFlashScript(noFlashOpts).replace(
          "<script>",
          `<script data-source="${NO_FLASH_MARKER}">`
        );
        if (out.includes("</head>")) {
          out = out.replace("</head>", `  ${scriptTag}\n  </head>`);
        } else {
          out = `${scriptTag}\n${out}`;
        }
      }

      if (injectSetupCss) {
        const tag = `<script type="module">import "${VIRTUAL_TAILWIND_SOURCE}";</script>`;
        if (out.includes("</head>")) {
          out = out.replace("</head>", `  ${tag}\n  </head>`);
        } else {
          out = `${tag}\n${out}`;
        }
      }

      return out;
    },
  };
}

export default catalystPlugin;
