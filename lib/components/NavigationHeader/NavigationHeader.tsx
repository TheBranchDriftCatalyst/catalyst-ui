import { NavigationMenu, NavigationMenuList } from "@/catalyst-ui/ui/navigation-menu";
// import Link from "next/link"
import { addKeysToChildren } from "@/catalyst-ui/utils";
import * as React from "react";
import NavItem from "./NavigationItem";

/**
 * Props for the NavigationHeader component
 *
 * @interface NavigationHeaderProps
 */
export interface NavigationHeaderProps {
  /**
   * Array of NavigationItem components to display in the header
   *
   * @example
   * ```tsx
   * <NavigationHeader>
   *   <NavItem title="Products" links={productLinks} />
   *   <NavItem title="About" links={aboutLinks} />
   * </NavigationHeader>
   * ```
   */
  children: React.ReactElement<typeof NavItem>[];

  /**
   * Direction for dropdown menu positioning
   *
   * Controls where the NavigationMenuContent dropdown appears relative to the trigger.
   * This is a workaround for positioning issues when navigation items are near edges.
   *
   * - "left": Dropdowns expand to the left (use for right-side navigation)
   * - "right": Dropdowns expand to the right (use for left-side navigation)
   *
   * @default "left"
   *
   * @remarks
   * Ideally this should be computed automatically based on the NavigationMenuItem
   * position, but currently requires manual specification. See inline TODO.
   */
  direction?: "left" | "right";
}

/**
 * NavigationHeader - Multi-level navigation menu with dropdown support
 *
 * A wrapper component for Radix UI's NavigationMenu that provides a consistent
 * navigation header experience. Displays a horizontal list of navigation items,
 * each of which can trigger a dropdown menu with child links.
 *
 * Features:
 * - Horizontal navigation bar
 * - Dropdown menus with links or custom content
 * - Automatic key assignment to children
 * - Configurable dropdown positioning
 * - Built on Radix UI NavigationMenu primitives
 *
 * @param props - Component props
 * @returns Rendered navigation header
 *
 * @example
 * Basic usage with links:
 * ```tsx
 * import { NavigationHeader, NavItem } from 'catalyst-ui';
 *
 * const productLinks = [
 *   { title: "Laptops", href: "/products/laptops", description: "Browse laptops" },
 *   { title: "Phones", href: "/products/phones", description: "Browse phones" }
 * ];
 *
 * <NavigationHeader>
 *   <NavItem title="Products" links={productLinks} />
 *   <NavItem title="About" links={aboutLinks} />
 *   <NavItem title="Contact" links={contactLinks} />
 * </NavigationHeader>
 * ```
 *
 * @example
 * With custom dropdown content:
 * ```tsx
 * <NavigationHeader direction="right">
 *   <NavItem title="Custom">
 *     <div className="p-4">
 *       <h3>Custom Content</h3>
 *       <p>Any JSX can go here</p>
 *     </div>
 *   </NavItem>
 * </NavigationHeader>
 * ```
 *
 * @see {@link NavItem} - Navigation item component used as children
 */
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
