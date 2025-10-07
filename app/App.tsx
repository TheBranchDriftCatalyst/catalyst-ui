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
import { useState, useEffect, lazy, Suspense } from "react";
import { D4Loader } from "./components/D4Loader";
import { PerformanceMonitor } from "./components/PerformanceMonitor";

// Lazy-load tab components using Vite's import.meta.glob for code-splitting
const tabModules = import.meta.glob('./tabs/*Tab.tsx', { eager: false });

// Create lazy components dynamically
const tabComponents = Object.keys(tabModules).reduce((acc, path) => {
  const tabName = path.match(/\.\/tabs\/(.+)Tab\.tsx$/)?.[1];
  if (tabName) {
    acc[`${tabName}Tab`] = lazy(() => 
      tabModules[path]().then((m: any) => ({ default: m[`${tabName}Tab`] }))
    );
  }
  return acc;
}, {} as Record<string, React.LazyExoticComponent<any>>);

// Destructure for easier access
const { 
  OverviewTab, 
  TokensTab, 
  TypographyTab, 
  FormsTab, 
  ComponentsTab, 
  DisplayTab, 
  CardsTab, 
  AnimationsTab, 
  ForceGraphTab, 
  ResumeTab 
} = tabComponents;

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
    // TODO: probably need to turn this into a env var and handle it in gh-pages and our build to link them???
    <a key="storybook" href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
      Storybook
    </a>,
    <Menubar key="theme">
      <ChangeThemeDropdown />
    </Menubar>,
    <ToggleVariantButton key="variant" />,
    <PerformanceMonitor key="performance" />,
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
            <Suspense fallback={<D4Loader />}>
              <OverviewTab />
            </Suspense>
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <TokensTab />
            </Suspense>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <TypographyTab />
            </Suspense>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <FormsTab />
            </Suspense>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <ComponentsTab />
            </Suspense>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <DisplayTab />
            </Suspense>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <CardsTab />
            </Suspense>
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <AnimationsTab />
            </Suspense>
          </TabsContent>

          {/* Force Graph Tab */}
          <TabsContent value="forcegraph" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <ForceGraphTab />
            </Suspense>
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-4 mt-0">
            <Suspense fallback={<D4Loader />}>
              <ResumeTab />
            </Suspense>
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
