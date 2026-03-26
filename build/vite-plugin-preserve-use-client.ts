/**
 * Vite plugin to preserve "use client" directives in build output.
 *
 * Next.js App Router uses "use client" to mark components that run
 * in the browser. Without this directive, React hooks and interactive
 * features will crash in RSC (React Server Components) builds.
 *
 * Strategy: Track which source modules have "use client" at the top,
 * then ensure every output chunk that includes code from those modules
 * also has the directive. This is more reliable than heuristic detection.
 */

import type { Plugin } from "vite";
import { createPluginLogger } from "./plugin-logger";

/** Heuristic patterns for React client-side code (fallback detection) */
const REACT_CLIENT_SIGNATURES = [
  'from "react"',
  "from 'react'",
  'from "react/jsx-runtime"',
  "from 'react/jsx-runtime'",
  'from "react/jsx-dev-runtime"',
  "from 'react/jsx-dev-runtime'",
  /import\s+\*\s+as\s+\w+\s+from\s+['"]react['"]/,
  "useState",
  "useEffect",
  "useContext",
  "useRef",
  "useReducer",
  "useCallback",
  "useMemo",
  "useLayoutEffect",
  "useImperativeHandle",
  "forwardRef",
  "createContext",
] as const;

export default function preserveUseClient(): Plugin {
  const logger = createPluginLogger("vite-plugin-preserve-use-client");
  const clientModules = new Set<string>();
  let markedChunks = 0;

  return {
    name: "vite-plugin-preserve-use-client",
    enforce: "post",

    /**
     * Transform hook: detect "use client" directives in source modules
     * and track them so we can re-apply in the output.
     */
    transform(code, id) {
      const trimmed = code.trimStart();
      if (
        trimmed.startsWith('"use client"') ||
        trimmed.startsWith("'use client'")
      ) {
        clientModules.add(id);
      }
      return null; // don't transform, just observe
    },

    /**
     * Bundle generation: ensure output chunks that originate from
     * "use client" source modules retain the directive.
     */
    generateBundle(_options, bundle) {
      markedChunks = 0;

      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk" || !chunk.code) continue;

        const trimmedCode = chunk.code.trimStart();
        const hasDirective =
          trimmedCode.startsWith('"use client"') ||
          trimmedCode.startsWith("'use client'");

        if (hasDirective) continue;

        // Check if any source module in this chunk had "use client"
        const hasClientModule =
          chunk.moduleIds?.some((id) => clientModules.has(id)) ??
          Object.keys(chunk.modules).some((id) => clientModules.has(id));

        // Fallback: heuristic detection for chunks without tracked modules
        const hasClientSignature = REACT_CLIENT_SIGNATURES.some((sig) =>
          typeof sig === "string"
            ? chunk.code.includes(sig)
            : sig.test(chunk.code),
        );

        if (hasClientModule || hasClientSignature) {
          chunk.code = '"use client";\n' + chunk.code;
          markedChunks++;
        }
      }

      if (markedChunks > 0) {
        logger.success(
          `Marked ${markedChunks} chunk${markedChunks === 1 ? "" : "s"} with "use client" directive`,
        );
      }

      // Log tracked client modules for debugging
      if (clientModules.size > 0) {
        logger.success(
          `Tracked ${clientModules.size} source module${clientModules.size === 1 ? "" : "s"} with "use client"`,
        );
      }
    },
  };
}
