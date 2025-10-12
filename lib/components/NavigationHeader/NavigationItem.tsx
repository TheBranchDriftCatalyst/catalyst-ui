import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/catalyst-ui/ui/navigation-menu";
import { cn } from "@/catalyst-ui/utils";
import React, { useMemo } from "react";

/**
 * NavigationListItem - Individual link item within a navigation dropdown
 *
 * A styled link component for use within NavigationMenuContent dropdowns.
 * Displays a title and description with hover/focus states.
 *
 * @param props - Component props (extends anchor element props)
 * @param props.className - Additional CSS classes
 * @param props.title - Link title text
 * @param props.children - Description text (displayed below title)
 * @param props.comp - Optional custom component to render (default: "a")
 * @param ref - Forwarded ref to the anchor element
 * @returns Rendered list item with link
 *
 * @example
 * ```tsx
 * <ul>
 *   <NavigationListItem
 *     href="/products/laptops"
 *     title="Laptops"
 *   >
 *     Browse our selection of laptops
 *   </NavigationListItem>
 * </ul>
 * ```
 */
export const NavigationListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { comp?: React.ElementType }
>(({ className, title, children, comp, ...props }, ref) => {
  const Comp = comp || "a";
  return (
    <li>
      <NavigationMenuLink asChild>
        <Comp
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Comp>
      </NavigationMenuLink>
    </li>
  );
});
NavigationListItem.displayName = "NavigationListItem";

/**
 * Base props shared by all NavigationItem variants
 *
 * @interface NavigationItemBaseProps
 */
export interface NavigationItemBaseProps {
  /** Display text for the navigation trigger button */
  title: string;
}

/**
 * Props for NavigationItem with custom children content
 *
 * @interface NavigationItemChildrenProps
 */
export interface NavigationItemChildrenProps extends NavigationItemBaseProps {
  /** Custom React content to display in the dropdown (use instead of links) */
  children?: React.ReactNode;
}

/**
 * Props for NavigationItem with predefined link list
 *
 * @interface NavigationItemListChildrenProps
 */
export interface NavigationItemListChildrenProps extends NavigationItemBaseProps {
  /**
   * Array of link objects to display in a grid layout
   *
   * Each link displays as a NavigationListItem with title and description
   */
  links?: NavigationListLinks[];
}

/**
 * Shape of a single navigation link object
 *
 * @interface NavigationListLinks
 */
export interface NavigationListLinks {
  /** Link title text */
  title: string;
  /** URL path for navigation */
  href: string;
  /** Description text displayed below title */
  description: string;
}

/**
 * Sample link objects for testing and demos
 *
 * @internal
 */
export const _sampleLinkObjects: NavigationListLinks[] = Array.from({ length: 10 }, (_, i) => ({
  title: `Link ${i + 1}`,
  href: "/",
  description: "A description of the link",
}));

/**
 * Combined props type for NavigationItem
 * Supports either custom children or predefined links array
 */
type NavigationItemProps = NavigationItemChildrenProps & NavigationItemListChildrenProps;

/**
 * NavItemLinks - Renders a grid of navigation links
 *
 * Internal component that layouts an array of NavigationListLinks in a responsive grid.
 * Used by NavigationItem when links prop is provided.
 *
 * @param props - Component props
 * @param props.links - Array of link objects to render
 * @returns Rendered grid of navigation links
 *
 * @internal
 */
export const NavItemLinks = ({ links }: { links: NavigationListLinks[] }) => {
  return (
    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
      {links?.map(({ title, href, description }) => (
        <NavigationListItem key={title} href={href} title={title}>
          {description}
        </NavigationListItem>
      ))}
    </ul>
  );
};

/**
 * NavigationItem - Dropdown navigation item with trigger and content
 *
 * A navigation menu item that displays a trigger button and dropdown content.
 * Supports two content modes: custom JSX children or an array of predefined links.
 *
 * Built on Radix UI's NavigationMenuItem, NavigationMenuTrigger, and
 * NavigationMenuContent primitives for accessibility and keyboard navigation.
 *
 * @param props - Component props
 * @param props.title - Text displayed on the trigger button
 * @param props.children - Custom JSX content for the dropdown (takes precedence over links)
 * @param props.links - Array of link objects to display in a grid (used if children not provided)
 * @returns Rendered navigation menu item with dropdown
 *
 * @example
 * With predefined links:
 * ```tsx
 * const productLinks = [
 *   {
 *     title: "Laptops",
 *     href: "/products/laptops",
 *     description: "High-performance laptops"
 *   },
 *   {
 *     title: "Phones",
 *     href: "/products/phones",
 *     description: "Latest smartphones"
 *   }
 * ];
 *
 * <NavigationItem title="Products" links={productLinks} />
 * ```
 *
 * @example
 * With custom content:
 * ```tsx
 * <NavigationItem title="Special">
 *   <div className="p-6 w-[600px]">
 *     <h3 className="text-lg font-bold">Featured Products</h3>
 *     <div className="grid grid-cols-2 gap-4 mt-4">
 *       <ProductCard />
 *       <ProductCard />
 *     </div>
 *   </div>
 * </NavigationItem>
 * ```
 *
 * @example
 * Mixed usage in NavigationHeader:
 * ```tsx
 * <NavigationHeader>
 *   <NavigationItem title="Products" links={productLinks} />
 *   <NavigationItem title="Custom">
 *     <CustomDropdownContent />
 *   </NavigationItem>
 * </NavigationHeader>
 * ```
 */
export const NavigationItem = ({ children, title, links }: NavigationItemProps) => {
  const navContent = useMemo(() => {
    if (children) {
      return children;
    }

    return <NavItemLinks links={links || []} />;
  }, [children, links]);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>{navContent}</NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavigationItem;
