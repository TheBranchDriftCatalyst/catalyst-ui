/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  🌆 VITE PLUGIN: TABS MANIFEST GENERATOR 🌆                  ║
 * ║                                                               ║
 * ║  ⚡ Dynamic Tab Registry System ⚡                            ║
 * ║  Auto-discovers tab components and generates navigation      ║
 * ║  metadata with cyberpunk-level precision                     ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import { promises as fs } from "fs";
import path from "path";
import { createCanvas, SKRSContext2D } from "@napi-rs/canvas";
import { createPluginLogger } from "./plugin-logger";
import yaml from "yaml";

/**
 * 🕐 Track last generation times per file
 *
 * Maps file paths to timestamps to differentiate between:
 * - Changes we made (ignore these)
 * - Changes the user made (regenerate on these)
 *
 * This prevents infinite regeneration loops 🔄
 */
const lastGeneratedAt = new Map<string, number>();

/**
 * Theme-based gradient colors for OG images
 */
const THEME_GRADIENTS: Record<string, [string, string]> = {
  catalyst: ["#00ffff", "#ff00ff"], // Cyan to magenta
  dracula: ["#bd93f9", "#ff79c6"], // Purple to pink
  gold: ["#ffd700", "#ff8c00"], // Gold to dark orange
  laracon: ["#ff2d20", "#ff6b6b"], // Red gradient
  nature: ["#22c55e", "#86efac"], // Green gradient
  netflix: ["#e50914", "#b20710"], // Netflix red
  nord: ["#88c0d0", "#5e81ac"], // Nordic blue
};

/**
 * Icon/emoji mapping for different tab types
 */
const TAB_ICONS: Record<string, string> = {
  overview: "🏠",
  cards: "🃏",
  components: "🎨",
  animations: "✨",
  forcegraph: "🕸️",
  forms: "📝",
  observability: "📊",
  githubprofile: "👤",
  resume: "📄",
  rbmkreactor: "⚛️",
  changelog: "📋",
  tokens: "🎭",
  typography: "🔤",
  display: "🖼️",
};

/**
 * Get icon for a tab value
 */
function getTabIcon(tabValue: string): string {
  return TAB_ICONS[tabValue] || "⚡";
}

/**
 * Generate OG image using Node.js Canvas API
 */
async function generateOGImage(
  title: string,
  subtitle: string,
  theme: keyof typeof THEME_GRADIENTS,
  icon: string
): Promise<Buffer> {
  // Create canvas (1200x630 - recommended OG image size)
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d") as SKRSContext2D;

  // Get gradient colors
  const [color1, color2] = THEME_GRADIENTS[theme];

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGradient.addColorStop(0, color1);
  bgGradient.addColorStop(1, color2);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Dark overlay for better text contrast
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, 1200, 630);

  // Grid pattern overlay (cyberpunk aesthetic)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < 1200; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 630);
    ctx.stroke();
  }
  for (let y = 0; y < 630; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1200, y);
    ctx.stroke();
  }

  // Icon/Emoji at top
  ctx.font = "120px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(icon, 600, 180);

  // Title
  ctx.font = "bold 72px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Word wrap title if too long
  const maxWidth = 1000;
  const words = title.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Draw title lines
  const lineHeight = 80;
  const startY = 340 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, 600, startY + index * lineHeight);
  });

  // Subtitle
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillText(subtitle, 600, startY + lines.length * lineHeight + 40);

  // Decorative line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 530);
  ctx.lineTo(900, 530);
  ctx.stroke();

  // Convert to PNG buffer
  return canvas.toBuffer("image/png");
}

/**
 * 🌃 Tabs manifest generation plugin
 *
 * **Mission:**
 * Automatically discover tab components in `app/tabs/` and generate
 * a manifest file (.tabs.manifest.json) with metadata for navigation.
 * Also generates Open Graph images for each tab.
 *
 * **Discovery Pattern:**
 * - Scans for files matching: `[Name]Tab.tsx`
 * - Example: `ComponentsTab.tsx` → tab value "components", label "Components"
 *
 * **Metadata Extraction:**
 * Parses each tab file for optional metadata exports:
 * - `TAB_ORDER` - Sort position (number)
 * - `TAB_LABEL` - Display label (string)
 * - `TAB_SECTION` - Category grouping (string, default: "catalyst")
 * - `TAB_META` - Unified metadata object (order, label, section)
 *
 * **Features:**
 * - 🔄 Live reload during development
 * - 🎯 Intelligent duplicate detection
 * - ⚡ Debounced file watching (500ms)
 * - 📊 Validation warnings for conflicts
 * - 🖼️ Auto-generates OG images (1200x630)
 *
 * **Output:**
 * - Generates `app/.tabs.manifest.yaml` (hidden dotfile)
 * - Generates `public/og/{tab-value}.png` for each tab
 *
 * @returns {Plugin} Vite plugin instance
 */
export default function tabsManifestPlugin() {
  const logger = createPluginLogger("vite-plugin-tabs-manifest");

  return {
    name: "vite-plugin-tabs-manifest",
    enforce: "pre" as const,

    /**
     * 🚀 Build start hook - generate manifest at build time
     */
    async buildStart() {
      await generateManifest();
    },

    /**
     * 🔥 Dev server hook - enable live manifest regeneration
     */
    async configureServer(server) {
      // Generate at dev server start - power up the tabs! ⚡
      await generateManifest();

      // 📂 Setup file watching
      const tabsDir = path.resolve(process.cwd(), "app", "tabs");
      const manifestPath = path.resolve(process.cwd(), "app", ".tabs.manifest.yaml");

      server.watcher.add(tabsDir);
      server.watcher.add(manifestPath);

      // ⏱️ Debounce rapid file events (500ms cooldown)
      // Bulk edits across multiple files only trigger ONE regeneration
      // Increased from 250ms to 500ms to reduce excessive HMR reloads
      let debounceTimer: NodeJS.Timeout | null = null;
      const pending = new Set<string>();
      const DEBOUNCE_MS = 500;

      server.watcher.on("change", (file) => {
        try {
          const normalized = path.resolve(file);
          pending.add(normalized);

          // ⏸️ Reset the debounce timer
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          debounceTimer = setTimeout(async () => {
            const toProcess = Array.from(pending);
            pending.clear();
            debounceTimer = null;

            try {
              // 🚫 Check if manifest was manually edited
              if (toProcess.some((p) => p === manifestPath)) {
                const last = lastGeneratedAt.get(manifestPath) ?? 0;
                const now = Date.now();

                if (now - last > 1000) {
                  // User edited the manifest directly - warn them!
                  logger.warn(
                    ".tabs.manifest.yaml was modified manually. " +
                    "Note: it will be overwritten on next regeneration."
                  );
                }

                // Don't regenerate when user edits manifest directly
                return;
              }

              // ♻️ Regenerate if any tab file changed
              if (toProcess.some((p) => p.startsWith(tabsDir))) {
                logger.info("Detected tab file changes - regenerating manifest...");
                await generateManifest();
              }
            } catch (err) {
              // Ignore errors from change handling
            }
          }, DEBOUNCE_MS);
        } catch (err) {
          // Ignore watcher errors
        }
      });
    },
  };

  /**
   * 🎯 Core manifest generation function
   *
   * **Process:**
   * 1. Scan `app/tabs/` for files matching `[Name]Tab.tsx`
   * 2. Extract metadata from each file (order, label, section)
   * 3. Generate manifest entries with computed values
   * 4. Sort by priority (explicit order → alphabetical)
   * 5. Validate for duplicates
   * 6. Write to `app/.tabs.manifest.yaml`
   *
   * **Manifest Entry Structure:**
   * ```json
   * {
   *   "compKey": "ComponentsTab",
   *   "name": "Components",
   *   "value": "components",
   *   "label": "Components",
   *   "order": 0,
   *   "section": "catalyst"
   * }
   * ```
   */
  async function generateManifest() {
    try {
      const repoRoot = process.cwd();
      const tabsDir = path.resolve(repoRoot, "app", "tabs");
      const outFile = path.join(repoRoot, "app", ".tabs.manifest.yaml");

      // 🔍 Scan for tab files matching the pattern
      let files: string[];
      try {
        files = (await fs.readdir(tabsDir)).filter((f) => /^[A-Za-z0-9_]+Tab\.tsx$/.test(f));
      } catch (err) {
        // No tabs directory - skip silently
        return;
      }

      // 🎨 Label overrides for special cases (e.g., "Typography" → "Type")
      const labelOverride: Record<string, string> = { Typography: "Type" };

      // 📊 Extract metadata from each tab file
      const entries: Array<any> = [];
      const validationErrors: string[] = [];

      for (const file of files) {
        const filePath = path.join(tabsDir, file);
        const src = await fs.readFile(filePath, "utf8");

        // 📝 Parse filename to extract component name
        const nameMatch = file.match(/^([A-Za-z0-9_]+)Tab\.tsx$/);
        if (!nameMatch) {
          continue;
        }

        const name = nameMatch[1]; // e.g., "Components"
        const compKey = `${name}Tab`; // e.g., "ComponentsTab"

        // ✅ VALIDATE: Check for required named export
        const hasNamedExport = new RegExp(`export\\s+(function|const)\\s+${compKey}`).test(src);
        const hasNamedReExport = new RegExp(`export\\s*{[^}]*${compKey}[^}]*}\\s*from`).test(src);

        if (!hasNamedExport && !hasNamedReExport) {
          const hasDefaultExport = /export\s+default/.test(src);
          validationErrors.push(
            `\n❌ ${file}\n` +
            `   Expected: export function ${compKey}() { ... }\n` +
            `   Or: export { ${compKey} } from "..."\n` +
            `   ${hasDefaultExport ? 'Found: export default (change to named export)' : 'Missing named export'}`
          );
        }

        // 🔤 Split camelCase name into words (e.g., "ComponentsTab" → ["Components", "Tab"])
        const parts = name.split(/(?=[A-Z])/).filter(Boolean);
        const value = parts.join("").toLowerCase(); // e.g., "components"

        // 🏷️ Determine display label (override or computed)
        let label = labelOverride[name] ?? parts.join(" ");

        // 📍 Default order is file index (order discovered)
        let order = files.indexOf(file);

        // 🔍 Extract metadata from file content

        // Option 1: TAB_ORDER export (legacy single-value export)
        const orderMatch = src.match(/export\s+const\s+TAB_ORDER\s*=\s*([0-9]+)/);
        if (orderMatch) {
          order = Number(orderMatch[1]);
        }

        // Option 2: TAB_LABEL export (legacy single-value export)
        const labelMatch = src.match(/export\s+const\s+TAB_LABEL\s*=\s*['"`]([^'"`]+)['"`]/);
        if (labelMatch) {
          label = labelMatch[1];
        }

        // Option 3: TAB_SECTION export (determines grouping - supports dot notation for nesting)
        // Examples: "catalyst", "projects", "projects.misc"
        let section = "catalyst"; // Default section
        const sectionMatch = src.match(/export\s+const\s+TAB_SECTION\s*=\s*['"`]([^'"`]+)['"`]/);
        if (sectionMatch) {
          section = sectionMatch[1]; // Can be "projects.misc" for nested sections
        }

        // Option 4: TAB_META export (unified metadata object - preferred)
        // Example: export const TAB_META = { order: 0, label: "Home", section: "catalyst" }
        // Supports nested sections: section: "projects.misc"
        const metaMatch = src.match(/export\s+const\s+TAB_META\s*=\s*{([\s\S]*?)}/m);
        if (metaMatch) {
          const body = metaMatch[1];

          // Extract individual properties from the object
          const mOrder = body.match(/order\s*:\s*([0-9]+)/);
          const mLabel = body.match(/label\s*:\s*['"`]([^'"`]+)['"`]/);
          const mSection = body.match(/section\s*:\s*['"`]([^'"`]+)['"`]/);

          if (mOrder) {
            order = Number(mOrder[1]);
          }
          if (mLabel) {
            label = mLabel[1];
          }
          if (mSection) {
            section = mSection[1]; // Can be "projects.misc" for nested sections
          }
        }

        // ✅ Add entry to manifest with dot notation for nested sections
        entries.push({ compKey, name, value, label, order, section });
      }

      // ❌ FAIL FAST: If validation errors found, throw immediately
      if (validationErrors.length > 0) {
        const errorMessage =
          `\n${"=".repeat(80)}\n` +
          `❌ TAB EXPORT VALIDATION FAILED (Build Time)\n` +
          `${"=".repeat(80)}\n` +
          `\n` +
          `All tab components must use NAMED exports, not default exports.\n` +
          `\n` +
          `Failed components:${validationErrors.join('')}\n` +
          `\n` +
          `Fix: Change "export default function" to "export function"\n` +
          `     Or use: export { ComponentName } from "./path"\n` +
          `${"=".repeat(80)}\n`;

        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // 📊 Sort entries by priority
      // Primary: order (ascending)
      // Secondary: name (alphabetical)
      entries.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

      // 💾 Write manifest to file (only if content changed)
      // Read existing manifest to compare
      let shouldWrite = true;
      try {
        const existingContent = await fs.readFile(outFile, "utf8");
        // Remove header comments for comparison (lines starting with #)
        const existingData = existingContent
          .split("\n")
          .filter(line => !line.startsWith("#"))
          .join("\n");
        const newData = yaml.stringify(entries);

        // Only write if actual data changed (ignore timestamp)
        shouldWrite = existingData.trim() !== newData.trim();
      } catch (err) {
        // File doesn't exist, write it
        shouldWrite = true;
      }

      if (shouldWrite) {
        const timestamp = new Date().toISOString();
        const header = `# Auto-generated by vite-plugin-tabs-manifest\n# Generated: ${timestamp}\n# DO NOT EDIT - Changes will be overwritten\n\n`;
        const yamlContent = header + yaml.stringify(entries);
        await fs.writeFile(outFile, yamlContent, "utf8");

        // 🕐 Record generation timestamp to ignore our own watcher events
        lastGeneratedAt.set(outFile, Date.now());
      }

      // 📊 Report success with stats
      logger.stats({
        scanned: files.length,
        entries: entries.length,
      });

      // 🔍 Validation: detect duplicates
      const dupValues = entries.map((e) => e.value).filter((v, i, a) => a.indexOf(v) !== i);
      const dupCompKeys = entries.map((e) => e.compKey).filter((k, i, a) => a.indexOf(k) !== i);

      if (dupValues.length || dupCompKeys.length) {
        const uniqueDupValues = Array.from(new Set(dupValues));
        const uniqueDupCompKeys = Array.from(new Set(dupCompKeys));

        // ⚠️ Warn about duplicates (this can break navigation!)
        logger.warn(
          `Validation failed: duplicate entries detected!\n` +
          `  Duplicate values: ${JSON.stringify(uniqueDupValues)}\n` +
          `  Duplicate compKeys: ${JSON.stringify(uniqueDupCompKeys)}`
        );
      }

      // 🖼️ Generate OG images for all tabs
      try {
        const ogDir = path.join(repoRoot, "public", "og");
        await fs.mkdir(ogDir, { recursive: true });

        let ogGenerated = 0;
        for (const entry of entries) {
          const topSection = entry.section.split(".")[0];
          const theme = topSection === "projects" ? "laracon" : "catalyst";
          const icon = getTabIcon(entry.value);

          // Generate OG image
          const imageBuffer = await generateOGImage(
            entry.label,
            "Catalyst UI Component Library",
            theme as keyof typeof THEME_GRADIENTS,
            icon
          );

          // Save to public/og/{tab-value}.png
          const outputPath = path.join(ogDir, `${entry.value}.png`);
          await fs.writeFile(outputPath, imageBuffer);
          ogGenerated++;
        }

        logger.info(`Generated ${ogGenerated} OG images`);
      } catch (ogErr) {
        logger.error("Failed to generate OG images", ogErr);
      }
    } catch (err) {
      // Don't crash the build on manifest generation errors
      logger.error("Failed to generate manifest", err);
    }
  }
}
