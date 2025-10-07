import "../lib/global.css";
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme/ThemeProvider";
import { ToggleVariantButton } from "@/catalyst-ui/contexts/Theme/ToggleDarkMode";
import { ChangeThemeDropdown } from "@/catalyst-ui/contexts/Theme/ChangeThemeDropdown";
import { CatalystHeader } from "@/catalyst-ui/components/CatalystHeader/CatalystHeader";
import { HeaderProvider } from "@/catalyst-ui/components/CatalystHeader/HeaderProvider";
import { Menubar } from "@/catalyst-ui/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { Toaster } from "@/catalyst-ui/ui/toaster";
import { ScrollSnapContainer } from "@/catalyst-ui/components/effects";
import { useState, useEffect } from "react";

// Import tab components
import { OverviewTab } from "./tabs/OverviewTab";
import { TokensTab } from "./tabs/TokensTab";
import { TypographyTab } from "./tabs/TypographyTab";
import { FormsTab } from "./tabs/FormsTab";
import { ComponentsTab } from "./tabs/ComponentsTab";
import { DisplayTab } from "./tabs/DisplayTab";
import { CardsTab } from "./tabs/CardsTab";
import { AnimationsTab } from "./tabs/AnimationsTab";
import { ForceGraphTab } from "./tabs/ForceGraphTab";
import { ResumeTab } from "./tabs/ResumeTab";

function KitchenSink() {
  // Read initial tab from URL params
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || 'overview';
      setActiveTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigationItems = [
    <a key="storybook" href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
      Storybook
    </a>,
    <Menubar key="theme">
      <ChangeThemeDropdown />
    </Menubar>,
    <ToggleVariantButton key="variant" />,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CatalystHeader
          title="CATALYST"
          navigationItems={navigationItems}
          tabs={
            <TabsList className="inline-flex h-auto items-center gap-1 bg-transparent p-0">
              <TabsTrigger value="overview" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tokens" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Tokens
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Type
              </TabsTrigger>
              <TabsTrigger value="forms" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Forms
              </TabsTrigger>
              <TabsTrigger value="components" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Components
              </TabsTrigger>
              <TabsTrigger value="display" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Display
              </TabsTrigger>
              <TabsTrigger value="cards" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Cards
              </TabsTrigger>
              <TabsTrigger value="forcegraph" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                ForceGraph
              </TabsTrigger>
              <TabsTrigger value="animations" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Animations
              </TabsTrigger>
              <TabsTrigger value="resume" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Resume
              </TabsTrigger>
            </TabsList>
          }
        />
        <ScrollSnapContainer type="y" behavior="mandatory" className="w-full h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide p-6 md:p-8">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-0">
            <OverviewTab />
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4 mt-0">
            <TokensTab />
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4 mt-0">
            <TypographyTab />
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-4 mt-0">
            <FormsTab />
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4 mt-0">
            <ComponentsTab />
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-4 mt-0">
            <DisplayTab />

          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4 mt-0">
            <CardsTab />
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-4 mt-0">
            <AnimationsTab />
          </TabsContent>

          {/* Force Graph Tab */}
          <TabsContent value="forcegraph" className="space-y-4 mt-0">
            <ForceGraphTab />
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-4 mt-0">
            <ResumeTab />
          </TabsContent>
        </ScrollSnapContainer>
      </Tabs>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <KitchenSink />
        <Toaster />
      </HeaderProvider>
    </ThemeProvider>
  );
}

export default App;
