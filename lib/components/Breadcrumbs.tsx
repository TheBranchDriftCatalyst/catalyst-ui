import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/catalyst-ui/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Fragment } from "react/jsx-runtime";

/**
 * Represents a single breadcrumb item in the navigation trail
 *
 * @interface CrumbShape
 */
interface CrumbShape {
  /** URL path for the breadcrumb link */
  href: string;
  /** Display name of the breadcrumb */
  name: string;
  /**
   * Number of breadcrumbs to compact into a dropdown menu starting from this item
   *
   * When specified, this breadcrumb and the next (n-1) breadcrumbs will be collapsed
   * into a dropdown menu with an ellipsis trigger. Useful for long navigation paths.
   *
   * @example
   * ```tsx
   * const crumbs = [
   *   { href: "/", name: "Home" },
   *   { href: "/products", name: "Products", compact: 3 }, // Compacts Products, Category, Subcategory
   *   { href: "/products/electronics", name: "Category" },
   *   { href: "/products/electronics/phones", name: "Subcategory" },
   *   { href: "/products/electronics/phones/iphone", name: "iPhone" }
   * ];
   * // Renders: Home / ... / iPhone
   * // With dropdown showing: Products, Category, Subcategory
   * ```
   */
  compact?: number;
}

/**
 * Props for the BreadCrumbs component
 *
 * @interface BreadcrumbsProps
 */
export interface BreadcrumbsProps {
  /** Array of breadcrumb items to display in the navigation trail */
  crumbs: CrumbShape[];
}

/**
 * BreadCrumbs - Hierarchical navigation component with smart compaction
 *
 * A breadcrumb navigation component that displays a hierarchical navigation trail.
 * Supports automatic compaction of multiple breadcrumbs into a dropdown menu to
 * save space when dealing with deeply nested navigation paths.
 *
 * Features:
 * - Standard breadcrumb display with separators
 * - Smart compaction: collapse multiple items into a dropdown
 * - Responsive design with small text sizing
 * - Accessible dropdown menus
 *
 * @param props - Component props
 * @returns Rendered breadcrumb navigation
 *
 * @example
 * Basic usage:
 * ```tsx
 * <BreadCrumbs
 *   crumbs={[
 *     { href: "/", name: "Home" },
 *     { href: "/products", name: "Products" },
 *     { href: "/products/laptops", name: "Laptops" }
 *   ]}
 * />
 * ```
 *
 * @example
 * With compaction (long paths):
 * ```tsx
 * <BreadCrumbs
 *   crumbs={[
 *     { href: "/", name: "Home" },
 *     { href: "/docs", name: "Documentation", compact: 3 },
 *     { href: "/docs/guides", name: "Guides" },
 *     { href: "/docs/guides/react", name: "React" },
 *     { href: "/docs/guides/react/hooks", name: "Hooks" }
 *   ]}
 * />
 * // Renders: Home / ... / Hooks
 * // Dropdown shows: Documentation, Guides, React
 * ```
 */
export function BreadCrumbs({ crumbs }: BreadcrumbsProps) {
  const renderCrumbs = () => {
    const elements = [];
    let i = 0;

    while (i < crumbs.length) {
      const crumb = crumbs[i];

      if (crumb.compact) {
        const compactItems = crumbs.slice(i, i + crumb.compact);

        elements.push(
          <Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {compactItems.map((compactCrumb, index) => (
                    <DropdownMenuItem key={index}>
                      <BreadcrumbLink href={compactCrumb.href}>{compactCrumb.name}</BreadcrumbLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        );

        i += crumb.compact;
      } else {
        elements.push(
          <Fragment key={i}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        );

        i++;
      }
    }

    return elements;
  };

  return (
    <Breadcrumb className="mt-[-8px]">
      <BreadcrumbList className="text-xs">{renderCrumbs()}</BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbs;
