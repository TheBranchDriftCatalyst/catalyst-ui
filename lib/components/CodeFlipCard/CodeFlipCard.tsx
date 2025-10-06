"use client";

import * as React from "react";
import { cn } from "@/catalyst-ui/utils";
import { CodeBlock, CodeBlockProps } from "@/catalyst-ui/components/CodeBlock";
import { Button } from "@/catalyst-ui/ui/button";
import { RotateCcw, Code2 } from "lucide-react";
import { processSourceCode, LineRange, LineRangeTuple } from "./utils";

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
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [processedCode, setProcessedCode] = React.useState("");
    const [computedStartLine, setComputedStartLine] = React.useState(1);

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

    const handleFlip = () => {
      if (flipTrigger === "click") {
        setIsFlipped(!isFlipped);
      }
    };

    const handleMouseEnter = () => {
      if (flipTrigger === "hover") {
        setIsFlipped(true);
      }
    };

    const handleMouseLeave = () => {
      if (flipTrigger === "hover") {
        setIsFlipped(false);
      }
    };

    const containerStyle: React.CSSProperties = {
      position: "relative",
      minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      perspective: "1500px",
      width: "100%",
    };

    const flipperStyle: React.CSSProperties = {
      transition: `transform ${flipDuration}ms`,
      transformStyle: "preserve-3d",
      position: "relative",
      width: "100%",
      minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      transform: isFlipped
        ? flipDirection === "horizontal"
          ? "rotateY(180deg)"
          : "rotateX(180deg)"
        : "none",
    };

    const faceStyle: React.CSSProperties = {
      width: "100%",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      cursor: flipTrigger === "click" ? "pointer" : "default",
    };

    const frontFaceStyle: React.CSSProperties = {
      ...faceStyle,
      // Front face: visible when not flipped, use relative positioning to establish height
      position: isFlipped ? "absolute" : "relative",
      top: isFlipped ? 0 : undefined,
      left: isFlipped ? 0 : undefined,
    };

    const backFaceStyle: React.CSSProperties = {
      ...faceStyle,
      // Back face: hidden when not flipped (absolute), visible when flipped (relative)
      position: isFlipped ? "relative" : "absolute",
      top: isFlipped ? undefined : 0,
      left: isFlipped ? undefined : 0,
      transform:
        flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)",
    };

    const childWrapperStyle: React.CSSProperties = {
      pointerEvents: flipTrigger === "click" ? "auto" : "none",
    };

    return (
      <div
        ref={ref}
        className={cn("code-flip-card-container", className)}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div className="code-flip-card-flipper" style={flipperStyle}>
          {/* Front Face - Rendered Component */}
          <div
            className="code-flip-card-front"
            style={frontFaceStyle}
            onClick={handleFlip}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={childWrapperStyle}
            >
              {children}
              {/* Flip Indicator */}
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                  flipTrigger === "click" && "opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                title="View source code"
              >
                <Code2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Back Face - Source Code */}
          <div
            className="code-flip-card-back"
            style={backFaceStyle}
            onClick={handleFlip}
          >
            <div
              className="relative w-full h-full"
              style={childWrapperStyle}
            >
              <div className="absolute top-2 right-2 z-10">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  title="Back to component"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-full overflow-auto">
                <CodeBlock
                  code={processedCode}
                  language={language}
                  fileName={fileName}
                  theme={theme}
                  showLineNumbers={showLineNumbers}
                  showCopyButton={showCopyButton}
                  startLineNumber={startLineNumber ?? computedStartLine}
                  interactive={interactive}
                  editable={editable}
                  onThemeChange={onThemeChange}
                  onLineNumbersChange={onLineNumbersChange}
                  onCodeChange={onCodeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CodeFlipCard.displayName = "CodeFlipCard";

export default CodeFlipCard;
