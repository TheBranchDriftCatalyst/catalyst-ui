import { cn } from "@/catalyst-ui/utils";

export type Section = "home" | "catalyst" | "projects";

export interface SectionNavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  className?: string;
}

/**
 * SectionNavigation - Top-level section switcher with subtle underline style
 *
 * Renders section buttons: "Home", "Catalyst UI", and "Projects"
 * Active section is indicated by a sharp underline
 */
export function SectionNavigation({
  activeSection,
  onSectionChange,
  className,
}: SectionNavigationProps) {
  return (
    <nav className={cn("flex gap-6", className)}>
      <button
        onClick={() => onSectionChange("home")}
        className={cn(
          "relative px-1 py-2 text-sm font-medium transition-colors",
          "hover:text-foreground",
          activeSection === "home"
            ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary"
            : "text-muted-foreground"
        )}
      >
        Home
      </button>
      <button
        onClick={() => onSectionChange("catalyst")}
        className={cn(
          "relative px-1 py-2 text-sm font-medium transition-colors",
          "hover:text-foreground",
          activeSection === "catalyst"
            ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary"
            : "text-muted-foreground"
        )}
      >
        Catalyst UI
      </button>
      <button
        onClick={() => onSectionChange("projects")}
        className={cn(
          "relative px-1 py-2 text-sm font-medium transition-colors",
          "hover:text-foreground",
          activeSection === "projects"
            ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary"
            : "text-muted-foreground"
        )}
      >
        Projects
      </button>
    </nav>
  );
}
