export interface LineRange {
  start: number;
  end: number;
}

export type LineRangeTuple = [number, number];

/**
 * Normalizes line range input to a consistent format
 */
export function normalizeLineRange(range: LineRangeTuple | LineRange): LineRange {
  if (Array.isArray(range)) {
    return { start: range[0], end: range[1] };
  }
  return range;
}

/**
 * Extracts a specific range of lines from source code
 */
export function extractLines(
  code: string,
  range: LineRangeTuple | LineRange
): { code: string; startLineNumber: number } {
  const lines = code.split("\n");
  const { start, end } = normalizeLineRange(range);

  // Clamp to valid range
  const startLine = Math.max(1, Math.min(start, lines.length));
  const endLine = Math.max(startLine, Math.min(end, lines.length));

  const extractedLines = lines.slice(startLine - 1, endLine);

  return {
    code: extractedLines.join("\n"),
    startLineNumber: startLine,
  };
}

/**
 * Removes import statements from code
 */
export function stripImports(code: string): string {
  return code
    .split("\n")
    .filter(line => {
      const trimmed = line.trim();
      return !(
        trimmed.startsWith("import ") ||
        trimmed.startsWith("from ") ||
        trimmed.startsWith("export {") ||
        trimmed.startsWith("export type {") ||
        (trimmed.startsWith("export") &&
          trimmed.includes("from") &&
          !trimmed.includes("export const") &&
          !trimmed.includes("export function") &&
          !trimmed.includes("export class") &&
          !trimmed.includes("export interface") &&
          !trimmed.includes("export type ") &&
          !trimmed.includes("export default"))
      );
    })
    .join("\n");
}

/**
 * Removes comments from code (single-line and multi-line)
 */
export function stripComments(code: string): string {
  // Remove multi-line comments
  let result = code.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove single-line comments (but preserve URLs with //)
  result = result
    .split("\n")
    .map(line => {
      // Check if line contains // but not in a string
      const commentIndex = line.indexOf("//");
      if (commentIndex === -1) return line;

      // Simple check: if // is inside quotes, keep it
      const beforeComment = line.substring(0, commentIndex);
      const singleQuotes = (beforeComment.match(/'/g) || []).length;
      const doubleQuotes = (beforeComment.match(/"/g) || []).length;
      const backticks = (beforeComment.match(/`/g) || []).length;

      // If quotes are balanced, it's a real comment
      if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0 && backticks % 2 === 0) {
        return line.substring(0, commentIndex).trimEnd();
      }

      return line;
    })
    .join("\n");

  return result;
}

/**
 * Extracts a specific function or component from code
 */
export function extractFunction(code: string, functionName: string): string {
  const lines = code.split("\n");
  let startIndex = -1;
  let endIndex = -1;
  let braceCount = 0;
  let inFunction = false;
  let foundBodyStart = false;

  // Patterns to match function/component declarations
  const patterns = [
    new RegExp(`^\\s*export\\s+const\\s+${functionName}\\s*=`),
    new RegExp(`^\\s*const\\s+${functionName}\\s*=`),
    new RegExp(`^\\s*export\\s+function\\s+${functionName}\\s*\\(`),
    new RegExp(`^\\s*function\\s+${functionName}\\s*\\(`),
    new RegExp(`^\\s*export\\s+default\\s+function\\s+${functionName}\\s*\\(`),
    new RegExp(`^\\s*export\\s+class\\s+${functionName}\\s`),
    new RegExp(`^\\s*class\\s+${functionName}\\s`),
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line starts the function
    if (!inFunction && patterns.some(pattern => pattern.test(line))) {
      startIndex = i;
      inFunction = true;

      // Check if it's an arrow function
      const isArrowFunction = line.includes("=>");

      if (isArrowFunction) {
        // For arrow functions, only start counting braces AFTER the =>
        const arrowIndex = line.indexOf("=>");
        const afterArrow = line.substring(arrowIndex + 2);

        // Count braces only in the function body (after =>)
        for (const char of afterArrow) {
          if (char === "{") {
            braceCount++;
            foundBodyStart = true;
          }
          if (char === "}") braceCount--;
        }

        // If it's a one-liner arrow function without braces
        if (!foundBodyStart && afterArrow.trim()) {
          // Look for semicolon or end of statement
          if (line.trim().endsWith(";") || line.trim().endsWith(",")) {
            endIndex = i;
            break;
          }
        }

        // If we found the closing brace on the same line
        if (foundBodyStart && braceCount === 0) {
          endIndex = i;
          break;
        }
      } else {
        // For regular functions/classes, count all braces
        for (const char of line) {
          if (char === "{") braceCount++;
          if (char === "}") braceCount--;
        }

        if (braceCount === 0 && line.includes("{")) {
          endIndex = i;
          break;
        }
      }

      continue;
    }

    // Track braces to find the end
    if (inFunction) {
      for (const char of line) {
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;

        if (braceCount === 0 && startIndex !== -1) {
          endIndex = i;
          break;
        }
      }

      if (endIndex !== -1) break;
    }
  }

  if (startIndex === -1) {
    return code; // Function not found, return original
  }

  if (endIndex === -1) {
    endIndex = lines.length - 1; // Function extends to end of file
  }

  return lines.slice(startIndex, endIndex + 1).join("\n");
}

/**
 * Main processing pipeline for source code
 */
export function processSourceCode(
  code: string,
  options: {
    lineRange?: LineRangeTuple | LineRange;
    stripImports?: boolean;
    stripComments?: boolean;
    extractFunction?: string;
  } = {}
): { code: string; startLineNumber: number } {
  let processedCode = code;
  let startLineNumber = 1;

  // Extract function first (before line range)
  if (options.extractFunction) {
    processedCode = extractFunction(processedCode, options.extractFunction);
  }

  // Strip imports
  if (options.stripImports) {
    processedCode = stripImports(processedCode);
  }

  // Strip comments
  if (options.stripComments) {
    processedCode = stripComments(processedCode);
  }

  // Extract line range last (after other transformations)
  if (options.lineRange) {
    const result = extractLines(processedCode, options.lineRange);
    processedCode = result.code;
    startLineNumber = result.startLineNumber;
  }

  return { code: processedCode, startLineNumber };
}

/**
 * Extract import statements from source code and format them for display
 *
 * @param sourceCode - Raw source code string
 * @param filter - Optional filter to only show imports from specific paths (e.g., "@/catalyst-ui")
 * @returns Array of formatted import strings
 */
export function extractImports(sourceCode: string, filter?: string): string[] {
  const lines = sourceCode.split("\n");
  const imports: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      continue;
    }

    // Stop at first non-import line (imports are always at the top)
    if (!trimmed.startsWith("import ") && imports.length > 0) {
      break;
    }

    // Match import statements
    if (trimmed.startsWith("import ")) {
      // Apply filter if provided
      if (filter && !trimmed.includes(filter)) {
        continue;
      }

      imports.push(trimmed);
    }
  }

  return imports;
}

/**
 * Extract imports and format as a single line for display in ImportFooter
 *
 * @param sourceCode - Raw source code string
 * @param filter - Optional filter to only show imports from specific paths
 * @returns Formatted import string for display
 */
export function getMainImport(sourceCode: string, filter: string = "@/catalyst-ui"): string | null {
  const imports = extractImports(sourceCode, filter);

  if (imports.length === 0) {
    return null;
  }

  // Return the first matching import (usually the most relevant component import)
  return imports[0];
}
