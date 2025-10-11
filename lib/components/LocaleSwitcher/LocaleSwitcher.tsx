import { useTranslation } from "react-i18next";
import { Button } from "@/catalyst-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
] as const;

/**
 * LocaleSwitcher component for changing language via URL params
 *
 * Changes the ?locale=XX URL parameter and reloads the page
 * to apply the new language across all components.
 *
 * @example
 * ```tsx
 * import { LocaleSwitcher } from '@/catalyst-ui/components/LocaleSwitcher';
 *
 * function Header() {
 *   return (
 *     <div>
 *       <LocaleSwitcher />
 *     </div>
 *   );
 * }
 * ```
 */
export function LocaleSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (languageCode: string) => {
    if (typeof window === "undefined") return;

    // Save to localStorage for persistence
    try {
      localStorage.setItem("catalyst-ui-locale", languageCode);
    } catch (error) {
      console.warn("[LocaleSwitcher] Failed to save locale to localStorage:", error);
    }

    // Update URL param
    const params = new URLSearchParams(window.location.search);
    params.set("locale", languageCode);

    // Reload page with new locale
    window.location.search = params.toString();
  };

  const currentLabel = LANGUAGES.find(lang => lang.code === currentLanguage)?.label || "English";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage === language.code ? "bg-accent" : ""}
          >
            {language.label}
            {currentLanguage === language.code && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
