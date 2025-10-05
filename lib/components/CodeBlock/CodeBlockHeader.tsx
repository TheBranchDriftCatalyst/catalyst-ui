import { cn } from "@/catalyst-ui/utils";
import { Check, Copy, Hash, Palette, Pencil, Eye } from "lucide-react";
import * as React from "react";
import { Button } from "@/catalyst-ui/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/catalyst-ui/ui/select";
import { Toggle } from "@/catalyst-ui/ui/toggle";

export interface CodeBlockHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
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
}

export const AVAILABLE_THEMES = [
  { value: "catalyst", label: "Catalyst" },
  { value: "vitesse-dark", label: "Vitesse Dark" },
  { value: "vitesse-light", label: "Vitesse Light" },
  { value: "github-dark", label: "GitHub Dark" },
  { value: "github-light", label: "GitHub Light" },
  { value: "nord", label: "Nord" },
  { value: "dracula", label: "Dracula" },
  { value: "monokai", label: "Monokai" },
  { value: "one-dark-pro", label: "One Dark Pro" },
  { value: "min-dark", label: "Min Dark" },
  { value: "min-light", label: "Min Light" },
  { value: "slack-dark", label: "Slack Dark" },
  { value: "slack-ochin", label: "Slack Ochin" },
  { value: "solarized-dark", label: "Solarized Dark" },
  { value: "solarized-light", label: "Solarized Light" },
] as const;

const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({
    fileName,
    language,
    code,
    showCopyButton = true,
    interactive = false,
    editable = false,
    isEditMode = false,
    currentTheme = "vitesse-dark",
    showLineNumbers = true,
    onThemeChange,
    onLineNumbersChange,
    onEditModeChange,
    className,
    ...props
  }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between px-4 py-2 bg-card border-b border-border",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {fileName && (
            <span className="text-sm text-foreground font-mono">{fileName}</span>
          )}
          <span className="text-xs text-muted-foreground font-mono uppercase px-2 py-0.5 bg-muted rounded">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {interactive && onThemeChange && !isEditMode && (
            <Select value={currentTheme} onValueChange={onThemeChange}>
              <SelectTrigger className="h-8 w-[160px] bg-muted border-border text-foreground text-xs">
                <Palette className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_THEMES.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value} className="text-xs">
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {interactive && onLineNumbersChange && !isEditMode && (
            <Toggle
              pressed={showLineNumbers}
              onPressedChange={onLineNumbersChange}
              size="sm"
              className="h-8 px-2 data-[state=on]:bg-accent text-muted-foreground hover:text-foreground"
              aria-label="Toggle line numbers"
            >
              <Hash className="h-4 w-4" />
            </Toggle>
          )}

          {editable && onEditModeChange && (
            <Toggle
              pressed={isEditMode}
              onPressedChange={onEditModeChange}
              size="sm"
              className="h-8 px-2 data-[state=on]:bg-accent text-muted-foreground hover:text-foreground"
              aria-label="Toggle edit mode"
            >
              {isEditMode ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Toggle>
          )}

          {showCopyButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

CodeBlockHeader.displayName = "CodeBlockHeader";

export { CodeBlockHeader };
export default CodeBlockHeader;
