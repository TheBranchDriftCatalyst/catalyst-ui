import { useState } from "react";
import { Button } from "@/catalyst-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Code2, Languages } from "lucide-react";
import { isDevUtilsEnabled } from "../utils/devMode";

interface DevModeToggleProps {
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /**
   * Button size
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * DevModeToggle - Main entry point for all dev mode utilities
 *
 * Features:
 * - I18n utilities (view dirty translations, export)
 *
 * @example
 * ```tsx
 * <DevModeToggle variant="outline" size="icon" />
 * ```
 */
export function DevModeToggle({ variant = "outline", size = "icon" }: DevModeToggleProps) {
  // I18n state (placeholder for now)
  const [i18nListOpen, setI18nListOpen] = useState(false);

  const handleI18nClick = () => {
    setI18nListOpen(true);
  };

  if (!isDevUtilsEnabled()) {
    return null; // Only show when dev utils are enabled
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} title="Dev Mode Utilities">
            <Code2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Dev Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* I18n Section */}
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2">
            Internationalization
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={handleI18nClick}>
            <Languages className="mr-2 h-4 w-4" />
            View Translations
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* I18n List Sheet (placeholder - to be implemented) */}
      {i18nListOpen && <div>I18n translations sheet - to be implemented</div>}
    </>
  );
}
