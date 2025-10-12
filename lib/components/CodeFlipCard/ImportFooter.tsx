import { CardFooter } from "@/catalyst-ui/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { getMainImport } from "./utils";

/**
 * Props for the ImportFooter component
 *
 * @interface ImportFooterProps
 */
interface ImportFooterProps {
  /**
   * The component or components to import (manual mode)
   *
   * @example
   * ```tsx
   * imports="Button" // Single import
   * imports="Button, Input, Card" // Multiple imports
   * ```
   */
  imports?: string;

  /**
   * The import path (manual mode)
   *
   * @example
   * ```tsx
   * from="@/catalyst-ui/ui/button"
   * ```
   */
  from?: string;

  /**
   * Raw source code to automatically extract imports from (automatic mode)
   *
   * When provided, the component will parse the source code and extract
   * the main import statement matching the filter criteria
   *
   * @example
   * ```tsx
   * import sourceCode from './MyComponent.tsx?raw';
   * <ImportFooter sourceCode={sourceCode} />
   * ```
   */
  sourceCode?: string;

  /**
   * Filter to only show imports from specific paths (automatic mode)
   *
   * Only import statements that include this string in their path will be displayed
   *
   * @default "@/catalyst-ui"
   *
   * @example
   * ```tsx
   * <ImportFooter sourceCode={code} filter="@/catalyst-ui/ui" />
   * // Only shows: import { Button } from "@/catalyst-ui/ui/button"
   * // Ignores: import React from "react"
   * ```
   */
  filter?: string;
}

/**
 * ImportFooter - Interactive footer displaying import statements with copy functionality
 *
 * A reusable footer component that displays import statements with one-click copying.
 * Used across component demos to show developers how to import and use components.
 *
 * Supports two modes:
 * 1. **Manual Mode**: Explicitly provide `imports` and `from` props
 * 2. **Automatic Mode**: Pass `sourceCode` to auto-extract imports (recommended)
 *
 * Features:
 * - One-click copy to clipboard
 * - Visual feedback on copy (checkmark animation)
 * - Hover effects with smooth transitions
 * - Automatic import extraction from source code
 * - Configurable path filtering
 *
 * @param props - Component props
 * @returns Rendered footer with import statement, or null if no valid imports
 *
 * @example
 * Manual mode:
 * ```tsx
 * <Card>
 *   <CardContent>...</CardContent>
 *   <ImportFooter
 *     imports="Button, Input"
 *     from="@/catalyst-ui/ui/button"
 *   />
 * </Card>
 * ```
 *
 * @example
 * Automatic mode (recommended):
 * ```tsx
 * import sourceCode from './MyComponent.tsx?raw';
 *
 * <Card>
 *   <CardContent>...</CardContent>
 *   <ImportFooter sourceCode={sourceCode} />
 * </Card>
 * // Automatically extracts: import { Button } from "@/catalyst-ui/ui/button";
 * ```
 *
 * @example
 * Custom filter:
 * ```tsx
 * <ImportFooter
 *   sourceCode={sourceCode}
 *   filter="@/catalyst-ui/effects"
 * />
 * // Only shows imports from the effects directory
 * ```
 */
export function ImportFooter({
  imports,
  from,
  sourceCode,
  filter = "@/catalyst-ui",
}: ImportFooterProps) {
  const [copied, setCopied] = useState(false);

  let displayText: string;

  if (sourceCode) {
    // Automatic mode: extract imports from source code
    const extracted = getMainImport(sourceCode, filter);
    if (!extracted) {
      return null; // No matching imports found
    }
    displayText = extracted;
  } else if (imports && from) {
    // Manual mode: use provided imports and from
    displayText = `import { ${imports} } from '${from}';`;
  } else {
    // No valid props provided
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CardFooter
      className="border-t flex items-center justify-between gap-2 cursor-pointer hover:bg-accent/5 transition-colors duration-200 group/import px-2 py-0.5"
      onClick={handleCopy}
    >
      <code className="text-xs text-muted-foreground flex-1 select-none">{displayText}</code>
      <div className="h-6 w-6 flex items-center justify-center opacity-0 group-hover/import:opacity-70 transition-all duration-200 pointer-events-none">
        {copied ? (
          <Check className="h-3 w-3 text-primary/80 drop-shadow-[0_0_6px_rgba(var(--primary-rgb),0.6)]" />
        ) : (
          <Copy className="h-3 w-3 text-primary/80 transition-all duration-200 group-hover/import:drop-shadow-[0_0_6px_rgba(var(--primary-rgb),0.6)]" />
        )}
      </div>
    </CardFooter>
  );
}
