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

interface CrumbShape {
  href: string;
  name: string;
  // Compact the next n items
  compact?: number;
}

export interface BreadcrumbsProps {
  crumbs: CrumbShape[];
}

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
