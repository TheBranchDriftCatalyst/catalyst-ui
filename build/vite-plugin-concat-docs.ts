/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  🌆 VITE PLUGIN: DOCUMENTATION CONCATENATOR 🌆               ║
 * ║                                                               ║
 * ║  ⚡ Cyberpunk Knowledge Aggregator ⚡                         ║
 * ║  Fuses all markdown docs into a single neon-lit artifact     ║
 * ║  for seamless LLM consumption and context loading            ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";
import { createPluginLogger } from "./plugin-logger";

// ⏰ Timestamp of last generation - prevents infinite feedback loops
let lastGeneratedAt = 0;

/**
 * 🌃 Documentation concatenation plugin
 *
 * **Mission:**
 * Scan the repository for all markdown files and merge them into
 * a single combined document optimized for Large Language Models.
 *
 * **Features:**
 * - 📚 Auto-generates table of contents with anchor links
 * - 🔄 Live reload during development
 * - 🎯 Intelligent file prioritization (README → CLAUDE → CHANGELOG → rest)
 * - 🚫 Ignores build artifacts and node_modules
 * - ⚡ Debounced file watching for performance
 *
 * **Output:**
 * Generates `public/docs-combined.md` with all repository documentation
 *
 * @returns {Plugin} Vite plugin instance
 */
export default function concatDocsPlugin() {
  const logger = createPluginLogger("vite-plugin-concat-docs");

  return {
    name: "vite-plugin-concat-docs",
    enforce: "pre" as const,

    /**
     * 🚀 Build start hook - generate docs at build time
     */
    async buildStart() {
      await generateCombinedDocs();
    },

    /**
     * 🔥 Dev server hook - enable live reloading of docs
     */
    async configureServer(server) {
      // Generate at dev server start - light up the docs! 💡
      await generateCombinedDocs();

      const repoRoot = process.cwd();
      const docsDir = path.resolve(repoRoot, "docs");
      const outputPath = path.resolve(repoRoot, "public", "docs-combined.md");

      // 👀 Watch for markdown changes in the neon city
      server.watcher.add(docsDir);
      server.watcher.add(path.resolve(repoRoot, "*.md"));

      // ⏱️ Debounce rapid file events (1000ms cooldown)
      // Increased from 500ms to 1000ms to reduce excessive HMR reloads
      let debounceTimer: NodeJS.Timeout | null = null;
      const DEBOUNCE_MS = 1000;

      server.watcher.on("change", (file) => {
        try {
          const normalized = path.resolve(file);

          // 🚫 Ignore changes to our own output file (prevent infinite loops)
          if (normalized === outputPath) {
            return;
          }

          // 📝 Only process markdown files
          if (!file.endsWith(".md")) {
            return;
          }

          // ⏸️ Reset the debounce timer
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          debounceTimer = setTimeout(async () => {
            debounceTimer = null;
            logger.info("Detected markdown changes - regenerating combined docs...");
            await generateCombinedDocs();
          }, DEBOUNCE_MS);
        } catch (err) {
          // Silently ignore watcher errors - don't crash the dev server
        }
      });
    },
  };

  /**
   * 🎯 Core documentation generation function
   *
   * **Process:**
   * 1. Scan repository for all `.md` files
   * 2. Sort by priority (README → CLAUDE → CHANGELOG → alphabetical)
   * 3. Build table of contents with anchor links
   * 4. Concatenate all files with headers and separators
   * 5. Write to `public/docs-combined.md`
   *
   * **Exclusions:**
   * - node_modules/
   * - dist/
   * - gh-pages/
   * - coverage/
   * - The output file itself
   */
  async function generateCombinedDocs() {
    try {
      const repoRoot = process.cwd();
      const outputPath = path.resolve(repoRoot, "public", "docs-combined.md");

      // 🔍 Scan the codebase for markdown knowledge artifacts
      const markdownFiles = await glob("**/*.md", {
        cwd: repoRoot,
        ignore: [
          "node_modules/**",
          "dist/**",
          "gh-pages/**",
          "coverage/**",
          "public/docs-combined.md", // Don't include ourselves!
        ],
        absolute: true,
      });

      // 📊 Sort files with intelligent prioritization
      markdownFiles.sort((a, b) => {
        /**
         * 🎯 Priority ranking system:
         * 0 = README.md (project overview)
         * 1 = CLAUDE.md (AI instructions)
         * 2 = CHANGELOG.md (version history)
         * 3 = Everything else (alphabetical)
         */
        const priority = (file: string) => {
          const basename = path.basename(file);
          if (basename === "README.md") return 0;
          if (basename === "CLAUDE.md") return 1;
          if (basename === "CHANGELOG.md") return 2;
          return 3;
        };

        const priorityDiff = priority(a) - priority(b);
        if (priorityDiff !== 0) return priorityDiff;

        // Within same priority level, sort alphabetically
        return a.localeCompare(b);
      });

      // 🔨 Construct the combined document
      const parts: string[] = [];

      // 📋 Header - explain the purpose for LLMs
      parts.push(
        "# Combined Documentation",
        "",
        "> **Note**: This document is auto-generated for LLM consumption.",
        "> It concatenates all markdown files in the repository for easier context loading.",
        "> Generated at: " + new Date().toISOString(),
        "",
        "---",
        ""
      );

      // 🗂️ Table of Contents - create anchor links for navigation
      parts.push("## Table of Contents", "");
      markdownFiles.forEach((file) => {
        const relativePath = path.relative(repoRoot, file);
        parts.push(`- [${relativePath}](#${pathToAnchor(relativePath)})`);
      });
      parts.push("", "---", "");

      // 📚 Concatenate all markdown files
      for (const file of markdownFiles) {
        const relativePath = path.relative(repoRoot, file);
        const content = await fs.readFile(file, "utf-8");

        // Each file gets its own section with:
        // - A heading with the file path
        // - An anchor for TOC navigation
        // - The file content wrapped in a markdown code block
        // - A separator for visual clarity
        parts.push(
          "",
          `## ${relativePath}`,
          "",
          `<a id="${pathToAnchor(relativePath)}"></a>`,
          "",
          "```markdown",
          content.trim(),
          "```",
          "",
          "---",
          ""
        );
      }

      const combinedContent = parts.join("\n");

      // 📁 Ensure output directory exists
      const publicDir = path.dirname(outputPath);
      await fs.mkdir(publicDir, { recursive: true });

      // 💾 Write the combined documentation
      await fs.writeFile(outputPath, combinedContent, "utf-8");

      // 🕐 Record generation timestamp
      lastGeneratedAt = Date.now();

      // 📊 Calculate metrics
      const sizeBytes = Buffer.byteLength(combinedContent, "utf-8");
      const sizeKB = (sizeBytes / 1024).toFixed(2);
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);

      // Estimate token count (~4 chars per token for English text)
      // This is a rough approximation - actual tokenization varies by model
      const estimatedTokens = Math.ceil(combinedContent.length / 4);
      const tokensFormatted = estimatedTokens.toLocaleString();

      // 📊 Report success with detailed stats
      const sizeDisplay = sizeBytes < 1024 * 1024
        ? `${sizeKB} KB`
        : `${sizeMB} MB`;

      logger.success(
        `Combined ${markdownFiles.length} markdown files into docs-combined.md | ` +
        `${sizeDisplay} | ~${tokensFormatted} tokens`
      );
    } catch (err) {
      logger.error("Failed to generate combined docs", err);
    }
  }

  /**
   * 🔗 Convert file path to HTML anchor ID
   *
   * Transforms: `docs/architecture/README.md`
   * Into:      `docs-architecture-readme-md`
   *
   * @param filePath - Relative file path
   * @returns Sanitized anchor ID (lowercase, hyphenated)
   */
  function pathToAnchor(filePath: string): string {
    return filePath
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
