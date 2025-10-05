'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import { NavigationMenu, NavigationMenuList } from "@/catalyst-ui/ui/navigation-menu";
import Typography from "@/catalyst-ui/ui/typography";
import React from "react";

//  TODO: when we get to it, this interface is going to == the CatalystHeaderContext shape
interface CatalystHeaderProps {
  navigationItems?: React.ReactNode[];
  title: string;

  breadcrumbs?: any[]
}

export const CatalystHeader = ({ navigationItems, title }: CatalystHeaderProps) => {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="container flex h-16 items-center gap-2 px-6">
        {/* Left Subgroup */}
        <div className="flex items-center gap-2">
          <Typography className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </Typography>
        </div>
        {/* Right Subgroup */}
        <div className="ml-auto flex items-center gap-2">
          {navigationItems && navigationItems.length > 0 && (
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          <Avatar className="h-8 w-8">
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
