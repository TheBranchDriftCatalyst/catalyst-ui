import "../lib/global.css";
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme/ThemeProvider";
import { LocalizationProvider } from "@/catalyst-ui/contexts/Localization";
import { I18nProvider, AnnotationProvider } from "@/catalyst-ui/dev/context";
import { DevModeToggle } from "@/catalyst-ui/dev/components";
import { CatalystHeader } from "@/catalyst-ui/components/CatalystHeader/CatalystHeader";
import { HeaderProvider } from "@/catalyst-ui/components/CatalystHeader/HeaderProvider";
import { Tabs, TabsContent } from "@/catalyst-ui/ui/tabs";
import { Toaster } from "@/catalyst-ui/ui/toaster";
import { ScrollSnapContainer } from "@/catalyst-ui/effects";
import { useState, useEffect, Suspense } from "react";
import { D4Loader } from "./components/D4Loader";
import { SettingsDropdown } from "./components/SettingsDropdown";
import { ProfileDropdown } from "./components/ProfileDropdown";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { SidebarNav } from "./components/SidebarNav";
import { SectionNavigation, type Section } from "./components/SectionNavigation";
import { LocaleSwitcher } from "@/catalyst-ui/components/LocaleSwitcher";

import { tabComponents, initialTabs } from "./tabs/loader";

function KitchenSink() {
  // Read initial section and tab from URL path
  const getInitialState = () => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const section = (pathSegments[0] as Section) || "catalyst";
    const tab = pathSegments[1] || "overview";
    return { section, tab };
  };

  const initialState = getInitialState();
  const [activeSection, setActiveSection] = useState<Section>(initialState.section);
  const [activeTab, setActiveTab] = useState(initialState.tab);

  // Sidebar state with localStorage persistence (default open on desktop)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("catalyst-sidebar-open");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("catalyst-sidebar-open", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Tabs state is initialized synchronously from the build-time manifest (initialTabs)
  // and filtered to only include discovered components. This avoids any runtime
  // imports of tab modules and preserves lazy loading for the component bundles.
  const [TABS] = useState(() => {
    const discoveredKeys = new Set(Object.keys(tabComponents));
    const filtered = initialTabs.filter(t => discoveredKeys.has(t.compKey));
    // Append any discovered components missing from manifest deterministically
    for (const compKey of Object.keys(tabComponents)) {
      if (!filtered.some(f => f.compKey === compKey)) {
        const name = compKey.replace(/Tab$/, "");
        const parts = name.split(/(?=[A-Z])/).filter(Boolean);
        filtered.push({
          compKey,
          name,
          value: parts.join("").toLowerCase(),
          label: parts.join(" "),
          order: filtered.length,
          section: "catalyst" as const,
        });
      }
    }
    return filtered.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  });

  // Filter tabs by active section
  const sectionTabs = TABS.filter(t => t.section === activeSection);

  // Update URL when section or tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newPath = `/${activeSection}/${activeTab}`;
    const newUrl = params.toString() ? `${newPath}?${params.toString()}` : newPath;
    window.history.replaceState({}, "", newUrl);
  }, [activeSection, activeTab]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      const section = (pathSegments[0] as Section) || "catalyst";
      const tab = pathSegments[1] || "overview";
      setActiveSection(section);
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle section change - switch to first tab in new section
  const handleSectionChange = (newSection: Section) => {
    setActiveSection(newSection);
    const firstTab = TABS.find(t => t.section === newSection);
    if (firstTab) {
      setActiveTab(firstTab.value);
    }
  };

  // No async metadata effect — manifest is trusted and loaded at build/dev start.

  // Storybook URL: dev uses localhost, production uses relative path
  const storybookUrl = import.meta.env.DEV
    ? "http://localhost:6006"
    : `${import.meta.env.BASE_URL}storybook/`;

  const navigationItems = [
    // Performance Monitor (dev-only)
    <PerformanceMonitor key="performance" />,
    <DevModeToggle key="devmode" variant="ghost" />,
    <LocaleSwitcher key="locale" />,
    <SettingsDropdown key="settings" />,
    <a
      key="storybook"
      href={storybookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm hover:text-primary transition-colors"
    >
      Storybook
    </a>,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CatalystHeader
          title="CATALYST"
          navigationItems={navigationItems}
          userSettings={<ProfileDropdown />}
          tabs={
            <SectionNavigation
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          }
        />

        {/* Main layout with sidebar */}
        <div className="flex">
          {/* Sidebar Navigation */}
          <SidebarNav
            items={sectionTabs.map(t => ({
              label: t.label,
              value: t.value,
            }))}
            activeValue={activeTab}
            onValueChange={setActiveTab}
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
          />

          {/* Main content area - adjusts for sidebar on desktop */}
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-0" : ""}`}>
            <ScrollSnapContainer
              type="y"
              behavior="mandatory"
              className="w-full h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide p-6 md:p-8"
            >
              {/* Render tab contents by mapping the discovered TABS so labels, values, and component keys stay in sync */}
              {TABS.map(t => {
                const Comp = (tabComponents as any)[t.compKey];
                return (
                  <TabsContent key={t.value} value={t.value} className="space-y-4 mt-0">
                    <Suspense fallback={<D4Loader />}>{Comp ? <Comp /> : null}</Suspense>
                  </TabsContent>
                );
              })}
            </ScrollSnapContainer>
          </main>
        </div>
      </Tabs>
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <LocalizationProvider>
        <AnnotationProvider>
          <ThemeProvider>
            <HeaderProvider>
              <KitchenSink />
              <Toaster />
            </HeaderProvider>
          </ThemeProvider>
        </AnnotationProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}

export default App;
