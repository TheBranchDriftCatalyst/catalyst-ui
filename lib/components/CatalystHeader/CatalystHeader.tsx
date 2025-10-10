"use client";

import { Separator } from "@/catalyst-ui/ui/separator";
import React from "react";

/**
 * Props for the CatalystHeader component
 * @interface CatalystHeaderProps
 */
interface CatalystHeaderProps {
  /** Array of navigation items to display in the utility navigation area */
  navigationItems?: React.ReactNode[];
  /** User settings component (typically a dropdown or menu) */
  userSettings?: React.ReactNode;
  /** Application title displayed on the left side of the header */
  title?: string;
  /** Tab navigation component displayed in the center zone */
  tabs?: React.ReactNode;
  /** Breadcrumb navigation items (currently unused, reserved for future use) */
  breadcrumbs?: any[];
}

/**
 * CatalystHeader - Themed application header with navigation
 *
 * A sticky header component with a glassmorphism effect that provides three distinct zones:
 * - Left: Brand/title
 * - Center: Tab navigation
 * - Right: Utility navigation and user settings
 *
 * @param props - Component props
 * @returns Rendered header component
 *
 * @example
 * ```tsx
 * import { CatalystHeader, ChangeThemeDropdown } from 'catalyst-ui';
 *
 * function App() {
 *   return (
 *     <CatalystHeader
 *       title="My App"
 *       tabs={<Tabs>...</Tabs>}
 *       navigationItems={[
 *         <Button key="settings">Settings</Button>
 *       ]}
 *       userSettings={<ChangeThemeDropdown />}
 *     />
 *   );
 * }
 * ```
 */
export const CatalystHeader = ({
  navigationItems,
  userSettings,
  title,
  tabs,
}: CatalystHeaderProps) => {
  return (
    <header
      className="header-glow bg-background/70 backdrop-blur-2xl sticky top-0 z-50 w-full border-b transition-all duration-300"
      style={{ borderColor: "color-mix(in srgb, var(--border) 40%, transparent)" }}
    >
      <div className="flex h-14 items-center gap-3 px-6">
        {/* Left Zone: Brand */}
        {title && (
          <>
            <div className="flex items-center">
              <h1 className="font-display text-base md:text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <Separator orientation="vertical" className="h-8 bg-border/60" />
          </>
        )}

        {/* Center Zone: Tabs */}
        {tabs && (
          <div className="flex-1 flex items-center justify-start overflow-x-auto scrollbar-hide">
            {tabs}
          </div>
        )}

        {/* Right Zone: Utilities + User Settings */}
        <div className="ml-auto flex items-center gap-2">
          {navigationItems && navigationItems.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-8 bg-border/60" />
              <nav className="flex items-center gap-2" aria-label="Utility navigation">
                {navigationItems}
              </nav>
            </>
          )}
          {userSettings}
        </div>
      </div>
    </header>
  );
};

export default CatalystHeader;
