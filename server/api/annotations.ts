import fs from "fs/promises";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

interface Annotation {
  id: string;
  componentName: string;
  note: string;
  type: "todo" | "bug" | "note" | "docs";
  priority: "low" | "medium" | "high";
  timestamp: number;
}

interface AnnotationsSyncRequest {
  annotations: Annotation[];
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
 * Handle annotation sync
 * POST /api/annotations/sync
 *
 * Request body:
 * {
 *   annotations: Annotation[]
 * }
 *
 * Writes all annotations to annotations.json at project root
 *
 * Response:
 * {
 *   success: boolean,
 *   file: string,
 *   count: number,
 *   error?: string
 * }
 */
export async function handleAnnotationsSync(req: IncomingMessage, res: ServerResponse) {
  try {
    // Parse request body
    const body: AnnotationsSyncRequest = await parseRequestBody(req);
    const { annotations } = body;

    // Validate
    if (!Array.isArray(annotations)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ success: false, error: "Invalid request: annotations must be an array" })
      );
      return;
    }

    const repoRoot = process.cwd();
    const filePath = path.join(repoRoot, "annotations.json");

    // Write annotations to file with pretty formatting
    await fs.writeFile(filePath, JSON.stringify(annotations, null, 2) + "\n", "utf-8");

    console.log(
      `[Annotations API] ✅ Synced ${annotations.length} annotations to ${path.relative(repoRoot, filePath)}`
    );

    // Send success response
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        file: path.relative(repoRoot, filePath),
        count: annotations.length,
      })
    );
  } catch (error) {
    console.error("[Annotations API] ❌ Error syncing annotations:", error);
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
