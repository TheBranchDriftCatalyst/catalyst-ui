import "../../lib/global.css";
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme/ThemeProvider";
import { ToggleVariantButton } from "@/catalyst-ui/contexts/Theme/ToggleDarkMode";
import { ChangeThemeDropdown } from "@/catalyst-ui/contexts/Theme/ChangeThemeDropdown";
import { CatalystHeader } from "@/catalyst-ui/components/CatalystHeader/CatalystHeader";
import { HeaderProvider } from "@/catalyst-ui/components/CatalystHeader/HeaderProvider";
import { Menubar } from "@/catalyst-ui/ui/menubar";
import { Toaster } from "@/catalyst-ui/ui/toaster";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
}

const pages = [
  { id: "overview", name: "Overview", href: "/" },
  { id: "tokens", name: "Tokens", href: "/tokens.html" },
  { id: "typography", name: "Type", href: "/typography.html" },
  { id: "forms", name: "Forms", href: "/forms.html" },
  { id: "components", name: "Components", href: "/components.html" },
  { id: "display", name: "Display", href: "/display.html" },
  { id: "cards", name: "Cards", href: "/cards.html" },
  { id: "forcegraph", name: "ForceGraph", href: "/forcegraph.html" },
  { id: "animations", name: "Animations", href: "/animations.html" },
];

export function Layout({ children, currentPage }: LayoutProps) {
  const navigationItems = [
    <a key="storybook" href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
      Storybook
    </a>,
    <Menubar key="theme">
      <ChangeThemeDropdown />
    </Menubar>,
    <ToggleVariantButton key="variant" />,
  ];

  const tabs = (
    <div className="inline-flex h-auto items-center gap-1 bg-transparent p-0">
      {pages.map((page) => (
        <a
          key={page.id}
          href={page.href}
          className={`
            text-xs md:text-sm px-2 md:px-3 py-1.5
            rounded-md transition-all
            hover:bg-accent/50
            ${currentPage === page.id
              ? 'shadow-[0_2px_0_0_var(--primary)] text-foreground'
              : 'text-muted-foreground'
            }
          `}
        >
          {page.name}
        </a>
      ))}
    </div>
  );

  return (
    <ThemeProvider>
      <HeaderProvider>
        <div className="min-h-screen bg-background text-foreground">
          <CatalystHeader
            title="CATALYST"
            navigationItems={navigationItems}
            tabs={tabs}
          />
          <div className="w-full p-6 md:p-8">
            {children}
          </div>
        </div>
        <Toaster />
      </HeaderProvider>
    </ThemeProvider>
  );
}
