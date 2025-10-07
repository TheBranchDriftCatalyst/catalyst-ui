"use client";

import * as React from "react";
import { CodeBlock, CodeBlockProps } from "@/catalyst-ui/components/CodeBlock";
import { CodeBlockHeader } from "@/catalyst-ui/components/CodeBlock/CodeBlockHeader";
import { CardContent } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { RotateCcw, Code2 } from "lucide-react";
import { processSourceCode, LineRange, LineRangeTuple } from "./utils";
import { CardProvider } from "@/catalyst-ui/contexts/Card";
import { CardWithContext } from "@/catalyst-ui/components/Card";
import { AnimatedFlip } from "@/catalyst-ui/effects";

export interface CodeFlipCardProps extends Omit<CodeBlockProps, "code" | "language"> {
  /** The rendered component to display on the front */
  children: React.ReactNode;
  /** Raw source code string (use ?raw import) */
  sourceCode: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** File name to display in CodeBlock header */
  fileName?: string;

  // Line range options
  /** Extract specific line range from source code */
  lineRange?: LineRangeTuple | LineRange;

  // Code transformations
  /** Remove import statements from source */
  stripImports?: boolean;
  /** Remove comments from source */
  stripComments?: boolean;
  /** Extract only a specific function/component */
  extractFunction?: string;

  // Flip animation configuration
  /** How to trigger the flip animation */
  flipTrigger?: "click" | "hover";
  /** Direction of flip animation */
  flipDirection?: "horizontal" | "vertical";
  /** Animation duration in milliseconds */
  flipDuration?: number;

  // Container customization
  /** Additional class names for the flip card container */
  className?: string;
  /** Minimum height for the card container */
  minHeight?: number | string;
}

export const CodeFlipCard = React.forwardRef<HTMLDivElement, CodeFlipCardProps>(
  (
    {
      children,
      sourceCode,
      language = "tsx",
      fileName,
      lineRange,
      stripImports = false,
      stripComments = false,
      extractFunction,
      flipTrigger = "click",
      flipDirection = "horizontal",
      flipDuration = 600,
      className,
      minHeight = 400,
      // CodeBlock props
      theme = "catalyst",
      showLineNumbers = true,
      showCopyButton = true,
      startLineNumber,
      interactive = false,
      editable = false,
      onThemeChange,
      onLineNumbersChange,
      onCodeChange,
      ...props
    },
    ref
  ) => {
    const [processedCode, setProcessedCode] = React.useState("");
    const [computedStartLine, setComputedStartLine] = React.useState(1);
    const [isFlipped, setIsFlipped] = React.useState(false);
    const unflipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Process source code when options change
    React.useEffect(() => {
      const result = processSourceCode(sourceCode, {
        lineRange,
        stripImports,
        stripComments,
        extractFunction,
      });
      setProcessedCode(result.code);
      setComputedStartLine(result.startLineNumber);
    }, [sourceCode, lineRange, stripImports, stripComments, extractFunction]);

    // Auto-unflip on mouse leave with delay
    const handleMouseLeave = () => {
      if (isFlipped && flipTrigger === "click") {
        unflipTimeoutRef.current = setTimeout(() => {
          setIsFlipped(false);
        }, 500); // 500ms delay before unflipping
      }
    };

    const handleMouseEnter = () => {
      // Cancel auto-unflip if mouse re-enters
      if (unflipTimeoutRef.current) {
        clearTimeout(unflipTimeoutRef.current);
        unflipTimeoutRef.current = null;
      }
    };

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (unflipTimeoutRef.current) {
          clearTimeout(unflipTimeoutRef.current);
        }
      };
    }, []);

    // Compose front face (child component with flip button overlaid)
    const frontFace = (
      <div className="relative group/flip">
        {children}
        {/* Flip Button overlaid on card */}
        {flipTrigger === "click" && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover/flip:opacity-70 hover:opacity-100 transition-all duration-200 bg-background/60 backdrop-blur-sm z-10"
            onClick={e => {
              e.stopPropagation();
              setIsFlipped(true);
            }}
            title="View source code"
          >
            <Code2 className="h-3.5 w-3.5 text-primary/80 transition-all duration-200 hover:drop-shadow-[0_0_6px_rgba(var(--primary-rgb),0.6)]" />
          </Button>
        )}
      </div>
    );

    // Compose back face (code view with header)
    const backFace = (
      <CardProvider>
        <CardWithContext
          interactive={false}
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <CodeBlockHeader
                  fileName={fileName}
                  language={language}
                  code={processedCode}
                  showCopyButton={showCopyButton}
                  interactive={interactive}
                  editable={editable}
                  currentTheme={theme}
                  showLineNumbers={showLineNumbers}
                  onThemeChange={onThemeChange}
                  onLineNumbersChange={onLineNumbersChange}
                  className="border-0 px-0 py-0 bg-transparent"
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-70 hover:opacity-100 transition-all duration-200 bg-background/60 backdrop-blur-sm"
                onClick={() => setIsFlipped(false)}
                title="Back to component"
              >
                <RotateCcw className="h-3.5 w-3.5 text-primary/80 transition-all duration-200 hover:drop-shadow-[0_0_6px_rgba(var(--primary-rgb),0.6)]" />
              </Button>
            </div>
          }
        >
          <CardContent className="p-0">
            <CodeBlock
              code={processedCode}
              language={language}
              theme={theme}
              showLineNumbers={showLineNumbers}
              startLineNumber={startLineNumber ?? computedStartLine}
              interactive={interactive}
              editable={editable}
              onThemeChange={onThemeChange}
              onLineNumbersChange={onLineNumbersChange}
              onCodeChange={onCodeChange}
              useCardContext={false}
              showCopyButton={false}
              fileName={undefined}
            />
          </CardContent>
        </CardWithContext>
      </CardProvider>
    );

    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <AnimatedFlip
          ref={ref}
          front={frontFace}
          back={backFace}
          trigger={flipTrigger}
          direction={flipDirection}
          duration={flipDuration}
          className={className}
          isFlipped={isFlipped}
          onFlipChange={setIsFlipped}
          {...props}
        />
      </div>
    );
  }
);

CodeFlipCard.displayName = "CodeFlipCard";

export default CodeFlipCard;
