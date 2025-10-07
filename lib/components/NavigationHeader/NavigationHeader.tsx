import { NavigationMenu, NavigationMenuList } from "@/catalyst-ui/ui/navigation-menu";
// import Link from "next/link"
import { addKeysToChildren } from "@/catalyst-ui/utils";
import * as React from "react";
import NavItem from "./NavigationItem";

export interface NavigationHeaderProps {
  children: React.ReactElement<typeof NavItem>[];

  // Not a fan of this prop, but it's here for now
  // fixes an issue with the NavigationMenuContent component showing
  // offscreen when positioned on the left or the right.  We, actually
  // want to compute this based on the position of the NavigationMenuItem
  direction?: "left" | "right";
}

export const NavigationHeader = ({
  direction = "left",
  children: navigationMenuItem,
}: NavigationHeaderProps) => {
  return (
    <NavigationMenu direction={direction}>
      <NavigationMenuList>{addKeysToChildren(navigationMenuItem)}</NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationHeader;
