"use client";
import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

export interface PageToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Primary page heading (rendered as h1). */
  title: React.ReactNode;
  /** Optional secondary line under the title. Rendered muted. */
  subtitle?: React.ReactNode;
  /** Right-aligned action slot — buttons, dropdowns, tab strips. Wraps on
   *  narrow viewports so the toolbar never overflows horizontally. */
  children?: React.ReactNode;
}

/**
 * PageToolbar — in-page section header. Title on the left, right-aligned
 * action slot. Distinct from `CatalystHeader` (sticky app-shell header
 * with glassmorphism + brand + tabs zones) and `NavigationHeader` (Radix
 * NavigationMenu with dropdowns). PageToolbar is the small, per-page
 * "title-plus-actions" bar used at the top of every feature page.
 *
 * @example
 * ```tsx
 * <PageToolbar title="Overview">
 *   <DateRangePicker ... />
 *   <TimeLimitDropdown ... />
 * </PageToolbar>
 *
 * <PageToolbar
 *   title="Import"
 *   subtitle="Migrate historical data from wakatime.com"
 * >
 *   <Button>Run import</Button>
 * </PageToolbar>
 * ```
 */
export function PageToolbar({ title, subtitle, children, className, ...props }: PageToolbarProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
