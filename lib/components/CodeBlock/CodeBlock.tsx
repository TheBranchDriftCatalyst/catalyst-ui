import { cn } from "@/catalyst-ui/utils";
import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from "shiki";
import * as React from "react";
import CodeBlockHeader from "./CodeBlockHeader";
import { catalystTheme } from "./catalyst-theme";
import { CardContext } from "@/catalyst-ui/contexts/Card";

/**
 * Internal component that registers CodeBlock header elements in CardContext
 */
const CodeBlockHeaderInCard: React.FC<{
  fileName?: string;
  language: string;
  code: string;
  showCopyButton?: boolean;
  interactive?: boolean;
  editable?: boolean;
  isEditMode?: boolean;
  currentTheme?: string;
  showLineNumbers?: boolean;
  onThemeChange?: (theme: string) => void;
  onLineNumbersChange?: (show: boolean) => void;
  onEditModeChange?: (editMode: boolean) => void;
}> = (props) => {
  const { registerHeaderComponent } = React.useContext(CardContext);

  React.useEffect(() => {
    const headerElement = (
      <div className="flex-1">
        <CodeBlockHeader {...props} className="border-0 px-0 py-0 bg-transparent" />
      </div>
    );

    const cleanup = registerHeaderComponent(headerElement);
    return cleanup;
  }, [props, registerHeaderComponent]);

  return null;
};

// Cache for the highlighter instance to avoid recreation
let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;
const loadedLanguages = new Set<string>();
const loadedThemes = new Set<string>();

// Get or create the highlighter with lazy-loaded languages (singleton pattern)
async function getHighlighter() {
  // If already created, return it immediately
  if (highlighterInstance) {
    return highlighterInstance;
  }

  // If creation is in progress, wait for it
  if (highlighterPromise) {
    return highlighterPromise;
  }

  // Start creation and cache the promise
  highlighterPromise = createHighlighter({
    themes: [],
    langs: [],
  }).catch((error) => {
    console.warn('Shiki WASM loading failed, falling back to basic highlighting:', error);
    // Reset so it can retry
    highlighterPromise = null;
    highlighterInstance = null;
    throw error;
  });

  highlighterInstance = await highlighterPromise;
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
  /** Whether to use CardContext for header registration (default: true) */
  useCardContext?: boolean;
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
      useCardContext = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [html, setHtml] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditMode, setIsEditMode] = React.useState(false);

    // Check if we should use CardContext
    const cardContext = React.useContext(CardContext);
    const shouldUseCardContext = React.useMemo(() => {
      // Only use if explicitly enabled and we're in a real provider
      return useCardContext && Array.isArray(cardContext.headerComponents);
    }, [useCardContext, cardContext]);

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

    const headerProps = {
      fileName,
      language,
      code,
      showCopyButton,
      interactive,
      editable,
      isEditMode,
      currentTheme: theme,
      showLineNumbers,
      onThemeChange,
      onLineNumbersChange,
      onEditModeChange: setIsEditMode,
    };

    return (
      <div
        ref={ref}
        className={cn("catalyst-code-block rounded-lg overflow-hidden", className)}
        {...props}
      >
        {/* If using CardContext, register header to context; otherwise render inline */}
        {(fileName || showCopyButton || interactive || editable) && (
          shouldUseCardContext ? (
            <CodeBlockHeaderInCard {...headerProps} />
          ) : (
            <CodeBlockHeader {...headerProps} />
          )
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
