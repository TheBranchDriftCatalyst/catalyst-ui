/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  🗺️ VITE PLUGIN: SITEMAP GENERATOR 🗺️                        ║
 * ║                                                               ║
 * ║  ⚡ Automatic Sitemap Generation ⚡                           ║
 * ║  Generates sitemap.xml from tabs manifest for SEO            ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import { promises as fs } from "fs";
import path from "path";
import { createPluginLogger } from "./plugin-logger";

/**
 * Sitemap configuration
 */
interface SitemapConfig {
  baseUrl: string;
  defaultChangefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  defaultPriority?: number;
}

/**
 * Tab manifest entry
 */
interface TabManifestEntry {
  compKey: string;
  name: string;
  value: string;
  label: string;
  order: number;
  section: string;
}

/**
 * Sitemap URL entry
 */
interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Escape XML special characters
 */
const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

/**
 * Generate sitemap XML from URLs
 */
const generateSitemapXml = (urls: SitemapUrl[]): string => {
  const urlEntries = urls
    .map(url => {
      const parts: string[] = [`    <url>`, `      <loc>${escapeXml(url.loc)}</loc>`];

      if (url.lastmod) {
        parts.push(`      <lastmod>${url.lastmod}</lastmod>`);
      }

      if (url.changefreq) {
        parts.push(`      <changefreq>${url.changefreq}</changefreq>`);
      }

      if (url.priority !== undefined) {
        parts.push(`      <priority>${url.priority.toFixed(1)}</priority>`);
      }

      parts.push(`    </url>`);
      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

/**
 * Get current date in ISO format
 */
const getCurrentDateISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * 🌃 Sitemap Generation Plugin
 *
 * **Mission:**
 * Automatically generate sitemap.xml from tabs manifest for SEO.
 *
 * **Features:**
 * - 🗺️ Generates sitemap.xml with all tab pages
 * - ⚡ Runs during build process
 * - 📊 Outputs to public/sitemap.xml
 * - 🔄 Regenerates when tabs manifest changes
 *
 * **Output:**
 * Creates public/sitemap.xml
 */
export default function sitemapPlugin(config: SitemapConfig) {
  const logger = createPluginLogger("vite-plugin-sitemap");
  const { baseUrl, defaultChangefreq = "weekly", defaultPriority = 0.8 } = config;

  return {
    name: "vite-plugin-sitemap",
    enforce: "pre" as const,

    /**
     * 🚀 Build start hook - generate sitemap at build time
     */
    async buildStart() {
      await generateSitemap();
    },

    /**
     * 🔥 Dev server hook - generate sitemap on dev server start
     */
    async configureServer(server) {
      // Generate at dev server start
      await generateSitemap();

      // Watch manifest for changes
      const manifestPath = path.resolve(process.cwd(), "app", ".tabs.manifest.yaml");
      server.watcher.add(manifestPath);

      // Regenerate when manifest changes
      server.watcher.on("change", async (file) => {
        if (path.resolve(file) === manifestPath) {
          logger.info("Tabs manifest changed - regenerating sitemap...");
          await generateSitemap();
        }
      });
    },
  };

  /**
   * 🎯 Core sitemap generation function
   *
   * **Process:**
   * 1. Read tabs manifest
   * 2. Generate sitemap URLs for all tabs
   * 3. Write to public/sitemap.xml
   */
  async function generateSitemap() {
    try {
      const repoRoot = process.cwd();
      const manifestPath = path.join(repoRoot, "app", ".tabs.manifest.yaml");
      const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");

      // Read tabs manifest
      let manifest: TabManifestEntry[];
      try {
        // Import yaml dynamically since it's used at build time
        const yaml = await import("yaml");
        const manifestContent = await fs.readFile(manifestPath, "utf8");
        manifest = yaml.default.parse(manifestContent);
      } catch (err) {
        logger.warn("Tabs manifest not found - skipping sitemap generation");
        return;
      }

      // Generate sitemap URLs
      const lastmod = getCurrentDateISO();
      const urls: SitemapUrl[] = [
        // Homepage (highest priority)
        {
          loc: baseUrl,
          lastmod,
          changefreq: "daily",
          priority: 1.0,
        },
        // Tab pages (use top-level section only for URL)
        ...manifest.map(tab => {
          const topSection = tab.section.split(".")[0]; // Use only first part before dot
          return {
            loc: `${baseUrl}/${topSection}/${tab.value}`,
            lastmod,
            changefreq: defaultChangefreq,
            priority: defaultPriority,
          };
        }),
      ];

      // Generate XML content
      const sitemapXml = generateSitemapXml(urls);

      // Write to file
      await fs.writeFile(sitemapPath, sitemapXml, "utf8");

      // Report success
      logger.stats({
        urls: urls.length,
        tabs: manifest.length,
      });
    } catch (err) {
      logger.error("Failed to generate sitemap", err);
    }
  }
}
