"use client";

import * as React from "react";
import { cn } from "@/catalyst-ui/utils";
import { CodeBlock, CodeBlockProps } from "@/catalyst-ui/components/CodeBlock";
import { CodeBlockHeader } from "@/catalyst-ui/components/CodeBlock/CodeBlockHeader";
import { CardContent } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { RotateCcw, Code2 } from "lucide-react";
import { processSourceCode, LineRange, LineRangeTuple } from "./utils";
import { CardProvider } from "@/catalyst-ui/contexts/Card";
import { CardWithContext } from "@/catalyst-ui/components/Card";
import { AnimatedFlip } from "@/catalyst-ui/components/AnimationHOC";

export interface CodeFlipCardProps
  extends Omit<CodeBlockProps, "code" | "language"> {
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

    // Type-safe handling of child element
    const childElement = children as React.ReactElement<{
      className?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
    }>;

    // Compose front face (child component with flip button)
    const frontFace = React.cloneElement(childElement, {
      className: cn(childElement.props.className, "relative"),
      children: (
        <>
          {childElement.props.children}
          {/* Flip Button overlaid on card */}
          {flipTrigger === "click" && (
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity shadow-lg z-10"
              onClick={() => setIsFlipped(true)}
              title="View source code"
            >
              <Code2 className="h-4 w-4" />
            </Button>
          )}
        </>
      ),
    });

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
                onClick={() => setIsFlipped(false)}
                title="Back to component"
              >
                <RotateCcw className="h-4 w-4" />
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
    );
  }
);

CodeFlipCard.displayName = "CodeFlipCard";

export default CodeFlipCard;
