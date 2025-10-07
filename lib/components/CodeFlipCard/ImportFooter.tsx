import { CardFooter } from "@/catalyst-ui/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { getMainImport } from "./utils";

interface ImportFooterProps {
  /** The component or components to import, e.g., "Button" or "Button, Input" */
  imports?: string;
  /** The import path, e.g., "@/catalyst-ui/ui/button" */
  from?: string;
  /** Raw source code to automatically extract imports from */
  sourceCode?: string;
  /** Filter to only show imports from specific paths (default: "@/catalyst-ui") */
  filter?: string;
}

/**
 * Reusable footer component that displays import statements
 * Used across all demo sections to show how to import components
 *
 * Supports two modes:
 * 1. Manual: Pass `imports` and `from` props
 * 2. Automatic: Pass `sourceCode` to auto-extract imports
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
      className="border-t pt-4 flex items-center justify-between gap-2 cursor-pointer hover:bg-accent/5 transition-colors duration-200 group/import"
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
