import * as React from "react";
import { ReactNode } from "react";
import { Card, CardProps } from "@/catalyst-ui/ui/card";
import { useCard } from "@/catalyst-ui/contexts/Card";
import { cn } from "@/catalyst-ui/utils";

export interface CardWithContextProps extends CardProps {
  /** Custom header content. If provided, overrides context-based header */
  header?: ReactNode;
  /** Whether to show the header section when components are registered */
  showHeader?: boolean;
  /** Whether to show the footer section when components are registered */
  showFooter?: boolean;
  /** Additional class names for the header section */
  headerClassName?: string;
  /** Additional class names for the footer section */
  footerClassName?: string;
}

/**
 * Card component that integrates with CardContext to render
 * dynamically registered header and footer components.
 */
export const CardWithContext = React.forwardRef<HTMLDivElement, CardWithContextProps>(
  (
    {
      children,
      header,
      showHeader = true,
      showFooter = true,
      headerClassName,
      footerClassName,
      className,
      ...props
    },
    ref
  ) => {
    const { headerComponents, footerComponents } = useCard();

    // If header prop provided, use that; otherwise check context
    const hasHeader = header !== undefined ? true : showHeader && headerComponents.length > 0;
    const hasFooter = showFooter && footerComponents.length > 0;

    return (
      <Card ref={ref} className={className} {...props}>
        {hasHeader && (
          <div className={cn("flex items-center gap-4 px-4 py-2 border-b", headerClassName)}>
            {header !== undefined
              ? header
              : headerComponents.map((component, index) => (
                  <React.Fragment key={index}>{component}</React.Fragment>
                ))}
          </div>
        )}
        {children}
        {hasFooter && (
          <div className={cn("flex items-center gap-4 px-4 py-2 border-t", footerClassName)}>
            {footerComponents.map((component, index) => (
              <React.Fragment key={index}>{component}</React.Fragment>
            ))}
          </div>
        )}
      </Card>
    );
  }
);

CardWithContext.displayName = "CardWithContext";

export default CardWithContext;
