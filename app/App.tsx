import "../lib/global.css";
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme/ThemeProvider";
import { CatalystHeader } from "@/catalyst-ui/components/CatalystHeader/CatalystHeader";
import { HeaderProvider } from "@/catalyst-ui/components/CatalystHeader/HeaderProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { Toaster } from "@/catalyst-ui/ui/toaster";
import { ScrollSnapContainer } from "@/catalyst-ui/effects";
import { useState, useEffect, Suspense } from "react";
import { D4Loader } from "./components/D4Loader";
import { UserSettingsDropdown } from "./components/UserSettingsDropdown";
import { PerformanceMonitor } from "./components/PerformanceMonitor";

import { tabComponents, initialTabs } from "./tabs/loader";

function KitchenSink() {
  // Read initial tab from URL params
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "overview";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

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
        });
      }
    }
    return filtered.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  });

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [activeTab]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") || "overview";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // No async metadata effect — manifest is trusted and loaded at build/dev start.

  const navigationItems = [
    // Performance Monitor (dev-only)
    <PerformanceMonitor key="performance" />,
    // TODO: probably need to turn this into a env var and handle it in gh-pages and our build to link them???
    <a
      key="storybook"
      href="http://localhost:6006"
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
          userSettings={<UserSettingsDropdown />}
          tabs={
            <TabsList className="inline-flex h-auto items-center gap-1 bg-transparent p-0">
              {TABS.map(t => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="text-xs md:text-sm px-2 md:px-3 py-1.5"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          }
        />
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
