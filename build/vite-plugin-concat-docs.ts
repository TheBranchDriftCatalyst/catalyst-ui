import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";

// Track last generation time to avoid infinite loops
let lastGeneratedAt = 0;

export default function concatDocsPlugin() {
  return {
    name: "vite-plugin-concat-docs",
    enforce: "pre" as const,

    async buildStart() {
      await generateCombinedDocs();
    },

    async configureServer(server) {
      // Generate at dev server start
      await generateCombinedDocs();

      const repoRoot = process.cwd();
      const docsDir = path.resolve(repoRoot, "docs");
      const outputPath = path.resolve(repoRoot, "public", "docs-combined.md");

      // Watch docs directory and root markdown files
      server.watcher.add(docsDir);
      server.watcher.add(path.resolve(repoRoot, "*.md"));

      // Debounce file changes
      let debounceTimer: NodeJS.Timeout | null = null;
      const DEBOUNCE_MS = 500;

      server.watcher.on("change", (file) => {
        try {
          const normalized = path.resolve(file);

          // Ignore changes to the output file itself
          if (normalized === outputPath) {
            return;
          }

          // Only process .md files
          if (!file.endsWith(".md")) {
            return;
          }

          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          debounceTimer = setTimeout(async () => {
            debounceTimer = null;
            await generateCombinedDocs();
          }, DEBOUNCE_MS);
        } catch (err) {
          // Ignore watcher errors
        }
      });
    },
  };

  async function generateCombinedDocs() {
    try {
      const repoRoot = process.cwd();
      const outputPath = path.resolve(repoRoot, "public", "docs-combined.md");

      // Find all markdown files, excluding node_modules, dist, gh-pages, and the output file
      const markdownFiles = await glob("**/*.md", {
        cwd: repoRoot,
        ignore: [
          "node_modules/**",
          "dist/**",
          "gh-pages/**",
          "coverage/**",
          "public/docs-combined.md",
        ],
        absolute: true,
      });

      // Sort files for consistent ordering
      markdownFiles.sort((a, b) => {
        // Prioritize certain files at the top
        const priority = (file: string) => {
          const basename = path.basename(file);
          if (basename === "README.md") return 0;
          if (basename === "CLAUDE.md") return 1;
          if (basename === "CHANGELOG.md") return 2;
          return 3;
        };

        const priorityDiff = priority(a) - priority(b);
        if (priorityDiff !== 0) return priorityDiff;

        return a.localeCompare(b);
      });

      // Build the combined document
      const parts: string[] = [];

      // Header message for LLMs
      parts.push(
        "# Combined Documentation",
        "",
        "> **Note**: This document is auto-generated for LLM consumption. It concatenates all markdown files in the repository for easier context loading.",
        "> Generated at: " + new Date().toISOString(),
        "",
        "---",
        ""
      );

      // Table of contents
      parts.push("## Table of Contents", "");
      markdownFiles.forEach((file) => {
        const relativePath = path.relative(repoRoot, file);
        parts.push(`- [${relativePath}](#${pathToAnchor(relativePath)})`);
      });
      parts.push("", "---", "");

      // Concatenate all files
      for (const file of markdownFiles) {
        const relativePath = path.relative(repoRoot, file);
        const content = await fs.readFile(file, "utf-8");

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

      // Ensure public directory exists
      const publicDir = path.dirname(outputPath);
      await fs.mkdir(publicDir, { recursive: true });

      // Write the combined file
      await fs.writeFile(outputPath, combinedContent, "utf-8");

      lastGeneratedAt = Date.now();

      // eslint-disable-next-line no-console
      console.info(
        `[vite-plugin-concat-docs] Generated ${outputPath} — combined ${markdownFiles.length} markdown files`
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[vite-plugin-concat-docs] Failed to generate combined docs:", err);
    }
  }

  function pathToAnchor(filePath: string): string {
    return filePath
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
