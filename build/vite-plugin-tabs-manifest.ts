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
import { createPluginLogger } from "./plugin-logger";

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
 * 🌃 Tabs manifest generation plugin
 *
 * **Mission:**
 * Automatically discover tab components in `app/tabs/` and generate
 * a manifest file (.tabs.manifest.json) with metadata for navigation.
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
 * - ⚡ Debounced file watching (250ms)
 * - 📊 Validation warnings for conflicts
 *
 * **Output:**
 * Generates `app/.tabs.manifest.json` (hidden dotfile)
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
      const manifestPath = path.resolve(process.cwd(), "app", ".tabs.manifest.json");

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
                    ".tabs.manifest.json was modified manually. " +
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
   * 6. Write to `app/.tabs.manifest.json`
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
      const outFile = path.join(repoRoot, "app", ".tabs.manifest.json");

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

        // Option 3: TAB_SECTION export (determines grouping)
        let section = "catalyst"; // Default section
        const sectionMatch = src.match(/export\s+const\s+TAB_SECTION\s*=\s*['"`]([^'"`]+)['"`]/);
        if (sectionMatch) {
          section = sectionMatch[1];
        }

        // Option 4: TAB_META export (unified metadata object - preferred)
        // Example: export const TAB_META = { order: 0, label: "Home", section: "catalyst" }
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
            section = mSection[1];
          }
        }

        // ✅ Add entry to manifest
        entries.push({ compKey, name, value, label, order, section });
      }

      // 📊 Sort entries by priority
      // Primary: order (ascending)
      // Secondary: name (alphabetical)
      entries.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

      // 💾 Write manifest to file
      const jsonContent = JSON.stringify(entries, null, 2) + "\n";
      await fs.writeFile(outFile, jsonContent, "utf8");

      // 🕐 Record generation timestamp to ignore our own watcher events
      lastGeneratedAt.set(outFile, Date.now());

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
    } catch (err) {
      // Don't crash the build on manifest generation errors
      logger.error("Failed to generate manifest", err);
    }
  }
}
