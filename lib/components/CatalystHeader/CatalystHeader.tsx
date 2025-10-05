'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import { Separator } from "@/catalyst-ui/ui/separator";
import React from "react";

//  TODO: when we get to it, this interface is going to == the CatalystHeaderContext shape
interface CatalystHeaderProps {
  navigationItems?: React.ReactNode[];
  title?: string;
  tabs?: React.ReactNode;
  breadcrumbs?: any[];
}

export const CatalystHeader = ({ navigationItems, title, tabs }: CatalystHeaderProps) => {
  return (
    <header className="bg-background/80 backdrop-blur-xl sticky top-0 z-50 w-full border-b border-border/40 transition-all duration-200" style={{ boxShadow: '0 4px 16px -4px var(--primary)' }}>
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

        {/* Right Zone: Utilities */}
        <div className="ml-auto flex items-center gap-2">
          {navigationItems && navigationItems.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-8 bg-border/60" />
              <div className="flex items-center gap-2">
                {navigationItems}
              </div>
            </>
          )}
          <Avatar className="h-8 w-8 ring-1 ring-border/40 transition-all hover:ring-primary/50">
            {/* TODO: turn this into the login widget */}
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default CatalystHeader;
