import fs from "fs/promises";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

interface I18nUpdateRequest {
  namespace: string;
  locale: string;
  key: string;
  value: string;
}

/**
 * Parse JSON request body from IncomingMessage
 */
async function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Set a value in a nested object using a dot-separated key path
 * Example: setNestedValue({}, "app.title", "Catalyst") → { app: { title: "Catalyst" } }
 */
function setNestedValue(obj: any, keyPath: string, value: string): any {
  const keys = keyPath.split(".");
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Handle i18n translation updates
 * POST /api/i18n/update
 *
 * Request body:
 * {
 *   namespace: string,    // e.g., "OverviewTab", "common", "components"
 *   locale: string,       // e.g., "en", "es"
 *   key: string,          // e.g., "welcome_message" or "app.title" (nested)
 *   value: string         // The new translation value
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   file: string,         // Path to updated file
 *   error?: string
 * }
 */
export async function handleI18nUpdate(req: IncomingMessage, res: ServerResponse) {
  try {
    // Parse request body
    const body: I18nUpdateRequest = await parseRequestBody(req);
    const { namespace, locale, key, value } = body;

    // Validate required fields
    if (!namespace || !locale || !key || value === undefined) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          success: false,
          error: "Missing required fields: namespace, locale, key, value",
        })
      );
      return;
    }

    const repoRoot = process.cwd();

    // Determine file path - try co-located file first
    // Pattern 1: app/tabs/.locale/[ComponentName].en.i18n.json
    // Pattern 2: app/tabs/.locale/[ComponentName].es.i18n.json
    // Pattern 3: lib/components/.locale/[ComponentName].en.i18n.json
    // Pattern 4: locales/[locale]/[namespace].json (global fallback)

    let filePath: string | null = null;
    let translations: Record<string, any> = {};

    // Build filename - always include locale suffix
    const filename = `${namespace}.${locale}.i18n.json`;

    // Try co-located patterns with .locale folder at directory level
    const colocatedPatterns = [
      path.join(repoRoot, "app", "tabs", ".locale", filename),
      path.join(repoRoot, "app", "demos", ".locale", filename),
      path.join(repoRoot, "lib", "components", ".locale", filename),
    ];

    // Check if any co-located file exists
    for (const pattern of colocatedPatterns) {
      try {
        const content = await fs.readFile(pattern, "utf-8");
        translations = JSON.parse(content);
        filePath = pattern;
        break;
      } catch {
        // File doesn't exist, continue
      }
    }

    // Fallback to global locale files
    if (!filePath) {
      filePath = path.join(repoRoot, "locales", locale, `${namespace}.json`);

      try {
        const content = await fs.readFile(filePath, "utf-8");
        translations = JSON.parse(content);
      } catch {
        // File doesn't exist, will be created
        console.log(`[i18n API] Creating new translation file: ${filePath}`);
      }
    }

    // Update the translation (supports nested keys like "app.title")
    translations = setNestedValue(translations, key, value);

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write back with pretty formatting
    await fs.writeFile(filePath, JSON.stringify(translations, null, 2) + "\n", "utf-8");

    console.log(
      `[i18n API] ✅ Updated ${locale}:${namespace}.${key} in ${path.relative(repoRoot, filePath)}`
    );

    // Send success response
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        file: path.relative(repoRoot, filePath),
      })
    );
  } catch (error) {
    console.error("[i18n API] ❌ Error updating translation:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      })
    );
  }
}
