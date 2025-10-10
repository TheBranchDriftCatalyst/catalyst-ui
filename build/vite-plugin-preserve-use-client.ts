/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  🌆 VITE PLUGIN: PRESERVE "USE CLIENT" DIRECTIVES 🌆         ║
 * ║                                                               ║
 * ║  ⚡ Next.js App Router Compatibility Layer ⚡                 ║
 * ║  Injects client-side markers into React component bundles    ║
 * ║  to ensure proper hydration in RSC (React Server Components) ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import type { Plugin } from "vite";
import { createPluginLogger } from "./plugin-logger";

/**
 * 🎯 Detection patterns for React client-side code
 *
 * These neon-lit signatures indicate a component needs
 * the "use client" directive for Next.js App Router
 */
const REACT_CLIENT_SIGNATURES = [
  // Direct React imports
  'from "react"',
  "from 'react'",

  // Namespace imports (import * as React from "react")
  /import\s+\*\s+as\s+\w+\s+from\s+['"]react['"]/,

  // React hooks that scream "I'M CLIENT-SIDE!" 🔥
  "useState",
  "useEffect",
  "useContext",
  "useRef",
  "useReducer",
  "useCallback",
  "useMemo",
  "useLayoutEffect",
  "useImperativeHandle",
] as const;

/**
 * 🌃 Vite plugin to preserve "use client" directives in build output
 *
 * **Why this exists:**
 * Next.js App Router uses "use client" to mark components that run
 * in the browser. Without this directive, React hooks and interactive
 * features will crash in production builds.
 *
 * **How it works:**
 * 1. Scans every output chunk for React client-side patterns
 * 2. Injects "use client" directive at the top of the file
 * 3. Ensures Next.js knows to hydrate these components on the client
 *
 * **Enforcement:**
 * Runs in "post" phase to catch all transformed code before final output
 *
 * @returns {Plugin} Vite plugin instance
 */
export default function preserveUseClient(): Plugin {
  const logger = createPluginLogger("vite-plugin-preserve-use-client");
  let markedChunks = 0;

  return {
    name: "vite-plugin-preserve-use-client",
    enforce: "post",

    /**
     * 🚀 Bundle generation hook - where the magic happens
     *
     * Iterates through all chunks and injects "use client" where needed
     */
    generateBundle(_options, bundle) {
      markedChunks = 0; // Reset counter for this build
      // Iterate through the bundle's neon-lit corridors 🌆
      for (const chunk of Object.values(bundle)) {
        // Only process JS/TS chunks with actual code
        if (chunk.type !== "chunk" || !chunk.code) {
          continue;
        }

        // 🔍 Scan for React client-side signatures
        const needsClientDirective = REACT_CLIENT_SIGNATURES.some(signature => {
          if (typeof signature === "string") {
            return chunk.code.includes(signature);
          }
          // Handle regex patterns
          return signature.test(chunk.code);
        });

        if (!needsClientDirective) {
          continue;
        }

        // 🎯 Check if directive already exists
        const trimmedCode = chunk.code.trimStart();
        const hasDirective =
          trimmedCode.startsWith('"use client"') ||
          trimmedCode.startsWith("'use client'");

        if (hasDirective) {
          // Already marked - skip to avoid duplicate directives
          continue;
        }

        // ⚡ Inject the "use client" directive at the top
        // This tells Next.js: "Hey, hydrate this on the client!" 🌊
        chunk.code = '"use client";\n' + chunk.code;
        markedChunks++;
      }

      // 📊 Report build statistics
      if (markedChunks > 0) {
        logger.success(`Marked ${markedChunks} chunk${markedChunks === 1 ? "" : "s"} with "use client" directive`);
      }
    },
  };
}
