import type { Plugin } from "vite";
import { handleI18nUpdate } from "../server/api/i18n";
import { handleAnnotationsSync } from "../server/api/annotations";
import { createPluginLogger } from "./plugin-logger";

/**
 * Vite plugin to add i18n and annotation API endpoints to dev server
 *
 * Registers middleware for:
 * - POST /api/i18n/update - Update translation values
 * - POST /api/annotations/sync - Sync annotations to file
 *
 * **Dev mode only** - These endpoints are not available in production builds
 *
 * @example
 * // vite.config.ts
 * import { i18nApiPlugin } from './build/vite-plugin-i18n-api';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     i18nApiPlugin(),
 *     // ...
 *   ],
 * });
 */
export function i18nApiPlugin(): Plugin {
  const logger = createPluginLogger("vite-plugin-i18n-api");

  return {
    name: "vite-plugin-i18n-api",

    /**
     * Configure dev server middleware
     * Adds POST endpoints for i18n updates and annotation sync
     */
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only handle POST requests to our API routes
        if (req.method !== "POST") {
          return next();
        }

        // Route: POST /api/i18n/update
        if (req.url === "/api/i18n/update") {
          logger.info("Handling i18n update request");
          await handleI18nUpdate(req, res);
          return;
        }

        // Route: POST /api/annotations/sync
        if (req.url === "/api/annotations/sync") {
          logger.info("Handling annotations sync request");
          await handleAnnotationsSync(req, res);
          return;
        }

        // Not our route, pass to next middleware
        next();
      });

      logger.success("API endpoints registered");
    },
  };
}
