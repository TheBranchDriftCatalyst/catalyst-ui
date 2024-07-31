import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/catalyst-ui/ui/navigation-menu";
import { cn } from "@/catalyst-ui/utils";
import React, { useMemo } from "react";

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
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Comp>
      </NavigationMenuLink>
    </li>
  );
});
NavigationListItem.displayName = "NavigationListItem";

export interface NavigationItemBaseProps {
  title: string;
}

export interface NavigationItemChildrenProps extends NavigationItemBaseProps {
  children?: React.ReactNode;
}

export interface NavigationItemListChildrenProps
  extends NavigationItemBaseProps {
  links?: NavigationListLinks[];
}

export interface NavigationListLinks {
  title: string;
  href: string;
  description: string;
}

export const _sampleLinkObjects: NavigationListLinks[] = Array.from(
  { length: 10 },
  (_, i) => ({
    title: `Link ${i + 1}`,
    href: "/",
    description: "A description of the link",
  }),
);

type NavigationItemProps = NavigationItemChildrenProps &
  NavigationItemListChildrenProps;

export const NavItemLinks = ({ links }: { links: NavigationListLinks[]}) => {
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


export const NavigationItem = ({
  children,
  title,
  links,
}: NavigationItemProps) => {
  const navContent = useMemo(() => {
    if (children) {
      return children;
    }

    return <NavItemLinks links={links} />;
  }, [children, links]);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>{navContent}</NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavigationItem;
