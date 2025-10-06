import { cn } from "@/catalyst-ui/utils";
import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from "shiki";
import * as React from "react";
import CodeBlockHeader from "./CodeBlockHeader";
import { catalystTheme } from "./catalyst-theme";

// Cache for the highlighter instance to avoid recreation
let highlighterInstance: Highlighter | null = null;
const loadedLanguages = new Set<string>();
const loadedThemes = new Set<string>();

// Get or create the highlighter with lazy-loaded languages
async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: [],
      langs: [],
    });
  }
  return highlighterInstance;
}

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
      theme = "catalyst",
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

          const highlighter = await getHighlighter();

          // Lazy-load language if not already loaded
          if (!loadedLanguages.has(language)) {
            await highlighter.loadLanguage(language as BundledLanguage);
            loadedLanguages.add(language);
          }

          // Use custom theme if "catalyst", otherwise use built-in
          const themeToUse = theme === "catalyst" ? catalystTheme : theme;

          // Lazy-load theme if not "catalyst" and not already loaded
          if (theme !== "catalyst" && !loadedThemes.has(theme)) {
            await highlighter.loadTheme(theme as BundledTheme);
            loadedThemes.add(theme);
          } else if (theme === "catalyst" && !loadedThemes.has("catalyst")) {
            await highlighter.loadTheme(catalystTheme);
            loadedThemes.add("catalyst");
          }

          const highlighted = highlighter.codeToHtml(code, {
            lang: language,
            theme: themeToUse,
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
              "w-full p-4 bg-card text-foreground font-mono text-sm resize-none outline-none border-none",
              "focus:ring-2 focus:ring-primary focus:ring-inset"
            )}
            style={{ minHeight: "200px" }}
            spellCheck={false}
          />
        ) : isLoading ? (
          <div className="p-4 bg-card text-muted-foreground animate-pulse">
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
            color: hsl(var(--muted-foreground));
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
