/**
 * Extract import statements from source code and format them for display
 *
 * @param sourceCode - Raw source code string
 * @param filter - Optional filter to only show imports from specific paths (e.g., "@/catalyst-ui")
 * @returns Array of formatted import strings
 */
export function extractImports(sourceCode: string, filter?: string): string[] {
  const lines = sourceCode.split('\n');
  const imports: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      continue;
    }

    // Stop at first non-import line (imports are always at the top)
    if (!trimmed.startsWith('import ') && imports.length > 0) {
      break;
    }

    // Match import statements
    if (trimmed.startsWith('import ')) {
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
