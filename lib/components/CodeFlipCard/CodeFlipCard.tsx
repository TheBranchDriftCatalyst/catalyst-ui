"use client";

import * as React from "react";
import { cn } from "@/catalyst-ui/utils";
import { CodeBlock, CodeBlockProps } from "@/catalyst-ui/components/CodeBlock";
import { Card, CardContent } from "@/catalyst-ui/ui/card";
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
      perspective: "1500px",
      display: "block",
    };

    const flipperStyle: React.CSSProperties = {
      transition: `transform ${flipDuration}ms`,
      transformStyle: "preserve-3d",
      position: "relative",
      transform: isFlipped
        ? flipDirection === "horizontal"
          ? "rotateY(180deg)"
          : "rotateX(180deg)"
        : "none",
    };

    const faceStyle: React.CSSProperties = {
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    };

    const frontFaceStyle: React.CSSProperties = {
      ...faceStyle,
      position: isFlipped ? "absolute" : "relative",
      top: isFlipped ? 0 : undefined,
      left: isFlipped ? 0 : undefined,
    };

    const backFaceStyle: React.CSSProperties = {
      ...faceStyle,
      position: isFlipped ? "relative" : "absolute",
      top: isFlipped ? undefined : 0,
      left: isFlipped ? undefined : 0,
      transform:
        flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)",
    };

    // Type-safe handling of child element
    const childElement = children as React.ReactElement<{
      className?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
    }>;

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
          {/* Front Face - Card with flip styles applied directly */}
          {React.cloneElement(childElement, {
            className: cn(childElement.props.className, "code-flip-card-front relative"),
            style: {
              ...childElement.props.style,
              ...frontFaceStyle,
            },
            children: (
              <>
                {childElement.props.children}
                {/* Flip Button overlaid on card */}
                {flipTrigger === "click" && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity shadow-lg z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    title="View source code"
                  >
                    <Code2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            ),
          })}

          {/* Back Face - Card with CodeBlock */}
          <Card
            className="code-flip-card-back relative"
            style={backFaceStyle}
            onClick={handleFlip}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              title="Back to component"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <CardContent className="p-0">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);

CodeFlipCard.displayName = "CodeFlipCard";

export default CodeFlipCard;
