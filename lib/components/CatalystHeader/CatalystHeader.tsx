'use client';

import { Separator } from "@/catalyst-ui/ui/separator";
import React from "react";

//  TODO: when we get to it, this interface is going to == the CatalystHeaderContext shape
interface CatalystHeaderProps {
  navigationItems?: React.ReactNode[];
  userSettings?: React.ReactNode;
  title?: string;
  tabs?: React.ReactNode;
  breadcrumbs?: any[];
}

export const CatalystHeader = ({ navigationItems, userSettings, title, tabs }: CatalystHeaderProps) => {
  return (
    <header className="header-glow bg-background/70 backdrop-blur-2xl sticky top-0 z-50 w-full border-b transition-all duration-300" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
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
              <div className="flex items-center gap-2">
                {navigationItems}
              </div>
            </>
          )}
          {userSettings}
        </div>
      </div>
    </header>
  );
};

export default CatalystHeader;
