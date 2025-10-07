// import { useWidgetWidth } from "@/catalyst-ui/components/ResponsiveGridWidget";
import { cn } from "@/catalyst-ui/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

// type TypographyVariant = keyof typeof variants;

const typographyVariants = cva("", {
  variants: {
    size: {
      "4xs": "text-4xs sm:text-3xs md:text-2xs",
      "3xs": "text-3xs sm:text-2xs md:text-xs",
      "2xs": "text-2xs sm:text-xs md:text-sm",
      xs: "text-xs sm:text-sm md:text-base",
      sm: "text-sm sm:text-base md:text-lg",
      base: "text-base sm:text-lg md:text-xl",
      lg: "text-lg sm:text-xl md:text-2xl",
      xl: "text-xl sm:text-2xl md:text-3xl",
      "2xl": "text-2xl sm:text-3xl md:text-4xl",
      h6: "text-sm sm:text-base md:text-lg font-semibold tracking-wide",
      h5: "text-base sm:text-lg md:text-xl font-semibold tracking-wide",
      h4: "text-lg sm:text-xl md:text-2xl font-bold tracking-[0.05em] uppercase",
      "3xl": "text-3xl sm:text-4xl md:text-5xl",
      h3: "text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.05em] uppercase",
      "4xl": "text-4xl sm:text-5xl md:text-6xl",
      h2: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.05em] uppercase leading-tight",
      "5xl": "text-5xl sm:text-6xl md:text-7xl",
      h1: "text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase leading-tight",
      "6xl": "text-6xl sm:text-7xl md:text-8xl",
    },
    variant: {
      h1: "font-display",
      h2: "font-display",
      h3: "font-display",
      h4: "font-display",
      h5: "font-display text-base font-semibold tracking-wide",
      h6: "font-display text-sm font-semibold tracking-wide",
      p: "font-sans",
      blockquote: "border-l-4 pl-4 italic font-sans",
      code: "font-mono text-sm bg-muted px-1 py-0.5 rounded",
      lead: "text-xl font-medium font-sans tracking-wide",
      large: "text-lg font-sans",
      small: "text-sm font-sans",
      muted: "text-muted-foreground font-sans",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

interface ResponsiveTypographyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typographyVariants> {
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  asChild?: boolean;
  breakpoints?: Record<TypographySize, number>;
  variant?: VariantProps<typeof typographyVariants>["variant"];
}

type TypographySize = Exclude<VariantProps<typeof typographyVariants>["size"], undefined | null>;

// type Entries<T> = {
//   [K in keyof T]: [K, T[K]];
// }[keyof T][];

// const getEntries = <T extends object>(obj: T) =>
//   Object.entries(defaultBreakpoints) as Entries<T>;

const defaultBreakpoints: Partial<Record<TypographySize, number>> = {
  // '4xs': 0,
  // '3xs': 30,
  // '2xs': 60,
  // 'xs': 90,
  // 'sm': 120,
  base: 150,
  // 'lg': 180,
  // 'xl': 210,
  // '2xl': 240,
  // '3xl': 270,
  // '4xl': 300,
  // '5xl': 330,
  // '6xl': 360,
};

// type Entries2<T, K extends keyof T = keyof T> = (K extends unknown
//   ? [K, T[K]]
//   : never)[];

const ResponsiveTypography = React.forwardRef<HTMLDivElement, ResponsiveTypographyProps>(
  (
    {
      tag,
      size,
      variant,
      className,
      asChild = false,
      children,
      breakpoints = defaultBreakpoints,
      ...props
    },
    ref
  ) => {
    // const { width } = useWidgetWidth();
    // If variant is provided and matches a heading, use it as size and tag
    const resolvedSize =
      variant && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(variant)
        ? (variant as TypographySize)
        : size;

    // Map variant to valid HTML element type
    const variantTagMap: Record<string, keyof JSX.IntrinsicElements> = {
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      h5: "h5",
      h6: "h6",
      p: "p",
      blockquote: "blockquote",
      code: "code",
      lead: "p",
      large: "p",
      small: "small",
      muted: "p",
    };

    const resolvedTag = variant && variantTagMap[variant] ? variantTagMap[variant] : tag;

    const Comp: React.ElementType = asChild ? Slot : resolvedTag || "p";

    let adjustedSize: TypographySize = resolvedSize as TypographySize;

    // Determine the appropriate size based on the widget's width and breakpoints
    // for (const [breakpointSize, breakpointWidth] of Object.entries(
    //   breakpoints,
    // )) {
    //   if (width >= breakpointWidth) {
    //     adjustedSize = breakpointSize as TypographySize;
    //   } else {
    //     break;
    //   }
    // }

    const classNames = cn(typographyVariants({ size: adjustedSize, variant, className }));

    return (
      <Comp className={classNames} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);

ResponsiveTypography.displayName = "ResponsiveTypography";

export { ResponsiveTypography, ResponsiveTypography as Typography, typographyVariants };

export default ResponsiveTypography;
