"use client";
import * as React from "react";
import { Card, CardContent } from "@/catalyst-ui/ui/card";
import { cn } from "@/catalyst-ui/utils";

export type StatCardAccent = "primary" | "info" | "success" | "warning" | "danger";

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Small uppercased key rendered above the value (e.g. "TOTAL TRACKED TIME"). */
  name: string;
  /** Main value. Truncated with a `title` tooltip so long strings don't
   *  break the layout. */
  value: React.ReactNode;
  /** Optional icon rendered in a colored square left of the value. Any
   *  ReactNode works so consumers aren't locked to lucide-react — a
   *  lucide `<Crown className="h-6 w-6" />`, an inline SVG, or an emoji. */
  icon?: React.ReactNode;
  /** Icon-square + icon-glyph accent color. Defaults to `primary`. */
  accent?: StatCardAccent;
  /** Optional secondary line rendered under the value (e.g. "+12% vs last
   *  week"). Rendered muted. */
  subtitle?: React.ReactNode;
}

/**
 * Palette map for the icon square + glyph. Values reference Tailwind's
 * design tokens so downstream themes can override via CSS custom properties
 * (see lib/themes/*.css for the token surface each theme exposes).
 */
const ACCENT_CLASS: Record<StatCardAccent, string> = {
  primary: "text-primary bg-primary/10",
  info: "text-sky-500 bg-sky-500/10",
  success: "text-emerald-500 bg-emerald-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  danger: "text-destructive bg-destructive/10",
};

/**
 * StatCard — dashboard KPI tile. Icon square + `name` label + prominent
 * `value`, all wrapped in a `Card`. Complements `StatBar` (skill-bar
 * slider) and `CircularGauge` (0-100 ring); StatCard is the plain
 * label+value+icon tile for arbitrary units (durations, counts, names).
 *
 * @example
 * ```tsx
 * import { Clock, Crown } from "lucide-react";
 *
 * <StatCard
 *   name="Total tracked time"
 *   value="13h 42m"
 *   icon={<Clock className="h-6 w-6" />}
 *   accent="primary"
 * />
 *
 * <StatCard
 *   name="Most active project"
 *   value="boomtime"
 *   icon={<Crown className="h-6 w-6" />}
 *   accent="success"
 *   subtitle="+34% vs last week"
 * />
 * ```
 */
export function StatCard({
  name,
  value,
  icon,
  accent = "primary",
  subtitle,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={className} {...props}>
      <CardContent className="flex items-center gap-4 p-5">
        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
              ACCENT_CLASS[accent]
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {name}
          </p>
          <p
            className="truncate text-lg font-bold"
            title={
              typeof value === "string" || typeof value === "number" ? String(value) : undefined
            }
          >
            {value}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
