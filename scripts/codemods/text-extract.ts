#!/usr/bin/env node

/**
 * Text Extraction Codemod
 *
 * Automatically wraps hardcoded text in JSX with EditableText components
 * and generates translation keys.
 *
 * Usage:
 *   yarn text-extract [directory] [options]
 *
 * Options:
 *   --dry-run          Preview changes without modifying files
 *   --interactive      Prompt before each transformation
 *   --namespace=NAME   Specify translation namespace (default: components)
 *   --skip-imports     Don't add EditableText imports
 *   --min-length=N     Only wrap text with N+ characters (default: 3)
 *
 * Examples:
 *   yarn text-extract app/tabs --dry-run
 *   yarn text-extract lib/components --interactive --namespace=common
 */

import jscodeshift from "jscodeshift";
import fs from "fs";
import path from "path";
import { glob } from "glob";

// ============================================================================
// Configuration
// ============================================================================

interface Config {
  dryRun: boolean;
  interactive: boolean;
  namespace: string;
  skipImports: boolean;
  minLength: number;
  targetDir: string;
}

const DEFAULT_CONFIG: Omit<Config, "targetDir"> = {
  dryRun: false,
  interactive: false,
  namespace: "components",
  skipImports: false,
  minLength: 3,
};

// ============================================================================
// Translation Key Generation
// ============================================================================

/**
 * Convert text to snake_case translation key
 * "Hello World!" -> "hello_world"
 */
function generateTranslationKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 50); // Max 50 chars
}

/**
 * Check if text should be wrapped
 */
function shouldWrapText(text: string, minLength: number): boolean {
  const trimmed = text.trim();

  // Skip empty or whitespace-only
  if (!trimmed) return false;

  // Skip if too short
  if (trimmed.length < minLength) return false;

  // Skip if it's a number
  if (!isNaN(Number(trimmed))) return false;

  // Skip if it's a single character punctuation
  if (/^[^\w\s]$/.test(trimmed)) return false;

  // Skip if it looks like a variable (camelCase, UPPER_CASE)
  if (/^[a-z][a-zA-Z0-9]*$/.test(trimmed) || /^[A-Z_][A-Z0-9_]*$/.test(trimmed)) {
    return false;
  }

  return true;
}

// ============================================================================
// Translation Storage
// ============================================================================

interface TranslationEntry {
  key: string;
  value: string;
  namespace: string;
  file: string;
}

const extractedTranslations: TranslationEntry[] = [];

function addTranslation(key: string, value: string, namespace: string, file: string) {
  extractedTranslations.push({ key, value, namespace, file });
}

async function updateTranslationFiles(config: Config) {
  const translationsByFile = new Map<string, Record<string, string>>();

  // Group by source file
  for (const entry of extractedTranslations) {
    if (!translationsByFile.has(entry.file)) {
      translationsByFile.set(entry.file, {});
    }
    translationsByFile.get(entry.file)![entry.key] = entry.value;
  }

  // Update each translation file (co-located at directory level in .locale folder)
  for (const [sourceFile, translations] of translationsByFile) {
    // Generate translation file path in .locale folder
    // e.g., tabs/MyComponent.tsx -> tabs/.locale/MyComponent.en.i18n.json
    const dir = path.dirname(sourceFile);
    const basename = path.basename(sourceFile, path.extname(sourceFile));
    const localeDir = path.join(dir, ".locale");
    const translationFilePath = path.join(localeDir, `${basename}.en.i18n.json`);

    let existingData: Record<string, any> = {};
    if (fs.existsSync(translationFilePath)) {
      existingData = JSON.parse(fs.readFileSync(translationFilePath, "utf-8"));
    }

    // Merge new translations
    const merged = { ...existingData, ...translations };

    // Write back
    if (!config.dryRun) {
      // Ensure .locale directory exists
      fs.mkdirSync(localeDir, { recursive: true });
      fs.writeFileSync(translationFilePath, JSON.stringify(merged, null, 2) + "\n");
      console.log(
        `✓ Updated ${path.relative(process.cwd(), translationFilePath)} with ${Object.keys(translations).length} new keys`
      );
    } else {
      console.log(
        `[DRY RUN] Would update ${path.relative(process.cwd(), translationFilePath)} with ${Object.keys(translations).length} new keys`
      );
    }
  }
}

// ============================================================================
// File Processing
// ============================================================================

async function processFile(filePath: string, config: Config): Promise<boolean> {
  const source = fs.readFileSync(filePath, "utf-8");
  const j = jscodeshift.withParser("tsx");
  const root = j(source);
  let hasChanges = false;
  let needsImport = false;

  // Auto-detect namespace from file path
  // e.g., lib/components/MyComponent/MyComponent.tsx -> MyComponent
  // or scripts/test-sample.tsx -> test-sample
  const basename = path.basename(filePath, path.extname(filePath));
  const namespace = basename;

  // Find JSX text nodes
  root.find(j.JSXText).forEach((path: any) => {
    const text = path.value.value;

    if (!shouldWrapText(text, config.minLength)) {
      return;
    }

    const trimmedText = text.trim();
    const translationKey = generateTranslationKey(trimmedText);

    // Store translation
    addTranslation(translationKey, trimmedText, namespace, filePath);

    // Create EditableText wrapper
    const editableTextElement = j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier("EditableText"), [
        j.jsxAttribute(j.jsxIdentifier("id"), j.stringLiteral(translationKey)),
        j.jsxAttribute(j.jsxIdentifier("namespace"), j.stringLiteral(namespace)),
      ]),
      j.jsxClosingElement(j.jsxIdentifier("EditableText")),
      [j.jsxText(trimmedText)]
    );

    // Replace text node with wrapped element
    path.replace(editableTextElement);
    hasChanges = true;
    needsImport = true;
  });

  // Add import if needed and not skipped
  if (needsImport && !config.skipImports && hasChanges) {
    const editableTextImport = j.importDeclaration(
      [j.importSpecifier(j.identifier("EditableText"))],
      j.stringLiteral("@/catalyst-ui/components/EditableText")
    );

    // Check if import already exists
    const existingImports = root.find(j.ImportDeclaration, {
      source: { value: "@/catalyst-ui/components/EditableText" },
    });

    if (existingImports.length === 0) {
      // Add after last import
      const lastImport = root.find(j.ImportDeclaration).at(-1);
      if (lastImport.length > 0) {
        lastImport.insertAfter(editableTextImport);
      } else {
        // No imports exist, add at top
        root.get().node.program.body.unshift(editableTextImport);
      }
    }
  }

  // Write changes if not dry run
  if (hasChanges) {
    const newSource = root.toSource();
    if (!config.dryRun) {
      fs.writeFileSync(filePath, newSource);
      console.log(`✓ Transformed ${path.relative(process.cwd(), filePath)}`);
    } else {
      console.log(`[DRY RUN] Would transform ${path.relative(process.cwd(), filePath)}`);
    }
  }

  return hasChanges;
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const config: Config = {
    ...DEFAULT_CONFIG,
    targetDir: args.find(arg => !arg.startsWith("--")) || "scripts",
    dryRun: args.includes("--dry-run"),
    interactive: args.includes("--interactive"),
    namespace: args.find(arg => arg.startsWith("--namespace="))?.split("=")[1] || "components",
    skipImports: args.includes("--skip-imports"),
    minLength: parseInt(args.find(arg => arg.startsWith("--min-length="))?.split("=")[1] || "3"),
  };

  // Validate target directory or file
  const targetPath = path.join(process.cwd(), config.targetDir);
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${config.targetDir}`);
    process.exit(1);
  }

  console.log("\n🔍 Text Extraction Codemod");
  console.log("=".repeat(50));
  console.log(`Target:     ${config.targetDir}`);
  console.log(`Namespace:  ${config.namespace}`);
  console.log(`Min Length: ${config.minLength}`);
  console.log(`Mode:       ${config.dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("=".repeat(50) + "\n");

  // Find all TSX/JSX files
  let files: string[];
  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    files = [targetPath];
  } else {
    const pattern = `${targetPath}/**/*.{tsx,jsx}`;
    files = await glob(pattern, { ignore: ["**/node_modules/**", "**/dist/**"] });
  }

  if (files.length === 0) {
    console.log("⚠️  No TSX/JSX files found.");
    process.exit(0);
  }

  console.log(`Found ${files.length} file(s) to process\n`);

  // Process each file
  let processedCount = 0;
  for (const file of files) {
    try {
      const changed = await processFile(file, config);
      if (changed) {
        processedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log("\n📊 Summary");
  console.log("=".repeat(50));
  console.log(`Files found: ${files.length}`);
  console.log(`Files changed: ${processedCount}`);
  console.log(`Translations extracted: ${extractedTranslations.length}`);
  console.log("=".repeat(50) + "\n");

  // Update translation files
  if (extractedTranslations.length > 0) {
    await updateTranslationFiles(config);

    if (!config.dryRun) {
      console.log("\n✅ Done! Your text has been automatically wrapped.");
      console.log("   Run 'yarn dev' to see the changes with edit icons.\n");
    } else {
      console.log("\n✅ Dry run complete. Use without --dry-run to apply changes.\n");
    }
  } else {
    console.log("\n⚠️  No text found to wrap. Try:");
    console.log("   - Lowering --min-length");
    console.log("   - Checking if files contain JSX text\n");
  }
}

main().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
