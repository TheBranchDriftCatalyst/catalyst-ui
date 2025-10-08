import { promises as fs } from "fs";
import path from "path";

// track last generation times so we can ignore our own writes
const lastGeneratedAt = new Map<string, number>();

export default function tabsManifestPlugin() {
  return {
    name: "vite-plugin-tabs-manifest",
    enforce: "pre" as const,
    async buildStart() {
      await generateManifest();
    },
    async configureServer(server) {
      // generate at dev server start as well
      await generateManifest();

      // Watch for changes under app/tabs and the manifest itself
      const tabsDir = path.resolve(process.cwd(), "app", "tabs");
    const manifestPath = path.resolve(process.cwd(), "app", ".tabs.manifest.json");

      server.watcher.add(tabsDir);
    server.watcher.add(manifestPath);

      // Debounce rapid file events so bulk edits only trigger a single regen.
      // 250ms is a reasonable midpoint between 200-300ms.
      let debounceTimer: NodeJS.Timeout | null = null;
      const pending = new Set<string>();
      const DEBOUNCE_MS = 250;

      server.watcher.on("change", (file) => {
        try {
          const normalized = path.resolve(file);
          pending.add(normalized);

          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          debounceTimer = setTimeout(async () => {
            const toProcess = Array.from(pending);
            pending.clear();
            debounceTimer = null;

            try {
              // If the manifest was changed manually (not by us), warn the user
              if (toProcess.some((p) => p === manifestPath)) {
                const last = lastGeneratedAt.get(manifestPath) ?? 0;
                const now = Date.now();
                  if (now - last > 1000) {
                    // eslint-disable-next-line no-console
                    console.warn("[vite-plugin-tabs-manifest] Warning: .tabs.manifest.json was modified on disk. If you edited it manually, note it will be overwritten on next regen.");
                }
                // don't regenerate when user edited manifest directly
                return;
              }

              // If any tab file changed, regenerate manifest once
              if (toProcess.some((p) => p.startsWith(tabsDir))) {
                await generateManifest();
              }
            } catch (err) {
              // ignore errors from change handling
            }
          }, DEBOUNCE_MS);
        } catch (err) {
          // ignore watcher errors
        }
      });
    },
  };

  async function generateManifest() {
    try {
      const repoRoot = process.cwd();
  const tabsDir = path.resolve(repoRoot, "app", "tabs");
  // Hidden dotfile to indicate generated artifact. Place alongside App.tsx.
  const outFile = path.join(repoRoot, "app", ".tabs.manifest.json");

      let files: string[];
      try {
        files = (await fs.readdir(tabsDir)).filter((f) => /^[A-Za-z0-9_]+Tab\.tsx$/.test(f));
      } catch (err) {
        // no tabs dir
        return;
      }

      const labelOverride: Record<string, string> = { Typography: "Type" };

      const entries: Array<any> = [];
      for (const file of files) {
        const filePath = path.join(tabsDir, file);
        const src = await fs.readFile(filePath, "utf8");
        const nameMatch = file.match(/^([A-Za-z0-9_]+)Tab\.tsx$/);
        if (!nameMatch) {
          continue;
        }
        const name = nameMatch[1];
        const compKey = `${name}Tab`;
        const parts = name.split(/(?=[A-Z])/).filter(Boolean);
        const value = parts.join("").toLowerCase();
        let label = labelOverride[name] ?? parts.join(" ");
        let order = files.indexOf(file);

        const orderMatch = src.match(/export\s+const\s+TAB_ORDER\s*=\s*([0-9]+)/);
        if (orderMatch) {
          order = Number(orderMatch[1]);
        }

        const labelMatch = src.match(/export\s+const\s+TAB_LABEL\s*=\s*['"`]([^'"`]+)['"`]/);
        if (labelMatch) {
          label = labelMatch[1];
        }

        const metaMatch = src.match(/export\s+const\s+TAB_META\s*=\s*{([\s\S]*?)}/m);
        if (metaMatch) {
          const body = metaMatch[1];
          const mOrder = body.match(/order\s*:\s*([0-9]+)/);
          const mLabel = body.match(/label\s*:\s*['"`]([^'"`]+)['"`]/);
          if (mOrder) {
            order = Number(mOrder[1]);
          }
          if (mLabel) {
            label = mLabel[1];
          }
        }

        entries.push({ compKey, name, value, label, order });
      }

      entries.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

      const jsonContent = JSON.stringify(entries, null, 2) + "\n";
  await fs.writeFile(outFile, jsonContent, "utf8");
  // record when we generated the manifest to ignore our own watcher events
  lastGeneratedAt.set(outFile, Date.now());
  // Log a concise summary for devs: how many files scanned and entries written
  // eslint-disable-next-line no-console
  console.info(`[vite-plugin-tabs-manifest] wrote ${outFile} — scanned ${files.length} files, wrote ${entries.length} entries`);

  // lightweight validation: detect duplicate values or compKeys
  const dupValues = entries.map((e) => e.value).filter((v, i, a) => a.indexOf(v) !== i);
  const dupCompKeys = entries.map((e) => e.compKey).filter((k, i, a) => a.indexOf(k) !== i);
  if (dupValues.length || dupCompKeys.length) {
    const uniqueDupValues = Array.from(new Set(dupValues));
    const uniqueDupCompKeys = Array.from(new Set(dupCompKeys));
    // eslint-disable-next-line no-console
    console.warn(`[vite-plugin-tabs-manifest] validation: duplicate entries found. values: ${JSON.stringify(uniqueDupValues)}, compKeys: ${JSON.stringify(uniqueDupCompKeys)}`);
  }
      // console.log(`[vite-plugin-tabs-manifest] wrote ${outFile}`);
    } catch (err) {
      // don't crash the build on manifest generation errors
      // eslint-disable-next-line no-console
      console.warn("vite-plugin-tabs-manifest: failed to generate manifest", err);
    }
  }
}
