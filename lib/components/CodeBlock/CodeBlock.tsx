import { cn } from "@/catalyst-ui/utils";
import { codeToHtml } from "shiki";
import * as React from "react";
import CodeBlockHeader from "./CodeBlockHeader";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language: string;
  theme?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  fileName?: string;
  startLineNumber?: number;
  interactive?: boolean;
  editable?: boolean;
  onThemeChange?: (theme: string) => void;
  onLineNumbersChange?: (show: boolean) => void;
  onCodeChange?: (code: string) => void;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language,
      theme = "vitesse-dark",
      showLineNumbers = true,
      showCopyButton = true,
      fileName,
      startLineNumber = 1,
      interactive = false,
      editable = false,
      onThemeChange,
      onLineNumbersChange,
      onCodeChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [html, setHtml] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditMode, setIsEditMode] = React.useState(false);

    React.useEffect(() => {
      const highlight = async () => {
        try {
          setIsLoading(true);
          const highlighted = await codeToHtml(code, {
            lang: language,
            theme: theme,
            transformers: showLineNumbers
              ? [
                  {
                    line(node, line) {
                      node.properties["data-line"] = line;
                      if (startLineNumber > 1) {
                        node.properties["data-line-number"] = line + startLineNumber - 1;
                      }
                    },
                  },
                ]
              : undefined,
          });
          setHtml(highlighted);
        } catch (error) {
          console.error("Shiki highlighting error:", error);
          setHtml(`<pre><code>${code}</code></pre>`);
        } finally {
          setIsLoading(false);
        }
      };

      highlight();
    }, [code, language, theme, showLineNumbers, startLineNumber]);

    return (
      <div
        ref={ref}
        className={cn("catalyst-code-block rounded-lg overflow-hidden", className)}
        {...props}
      >
        {(fileName || showCopyButton || interactive || editable) && (
          <CodeBlockHeader
            fileName={fileName}
            language={language}
            code={code}
            showCopyButton={showCopyButton}
            interactive={interactive}
            editable={editable}
            isEditMode={isEditMode}
            currentTheme={theme}
            showLineNumbers={showLineNumbers}
            onThemeChange={onThemeChange}
            onLineNumbersChange={onLineNumbersChange}
            onEditModeChange={setIsEditMode}
          />
        )}
        {isEditMode && editable && onCodeChange ? (
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className={cn(
              "w-full p-4 bg-[#1e1e1e] text-gray-100 font-mono text-sm resize-none outline-none border-none",
              "focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            )}
            style={{ minHeight: "200px" }}
            spellCheck={false}
          />
        ) : isLoading ? (
          <div className="p-4 bg-[#1e1e1e] text-gray-400 animate-pulse">
            Loading...
          </div>
        ) : (
          <div
            className={cn(
              "shiki-wrapper overflow-x-auto",
              showLineNumbers && "shiki-line-numbers",
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        <style>{`
          .shiki-wrapper pre {
            margin: 0;
            padding: 1rem;
            background: transparent !important;
          }

          .shiki-line-numbers pre code .line::before {
            content: attr(data-line);
            display: inline-block;
            width: 2.5rem;
            margin-right: 1.5rem;
            text-align: right;
            color: #6e7681;
            user-select: none;
          }

          .shiki-line-numbers pre code .line[data-line-number]::before {
            content: attr(data-line-number);
          }
        `}</style>
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
export default CodeBlock;
