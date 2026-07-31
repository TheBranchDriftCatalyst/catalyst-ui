import { Loader2 } from "lucide-react";
import { cn } from "@/catalyst-ui/utils";

export interface SpinnerProps {
  /** Diameter of the loader glyph. `sm`=h-4, `default`=h-8, `lg`=h-12. */
  size?: "sm" | "default" | "lg";
  /** When true, the wrapping div gets `h-full w-full py-16` so the spinner
   *  centers on the parent block (route-level loading state). When false
   *  (default), it renders inline sized to the glyph. */
  fill?: boolean;
  /** Accessible label announced by screen readers. Defaults to "Loading". */
  label?: string;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
};

/**
 * A centered rotating loader. Distinct from `LoadingSkeleton` (which is a
 * placeholder pulse block) — use `Spinner` for "operation in progress" and
 * `LoadingSkeleton` for "layout preview while data streams in".
 *
 * @example
 *   // Inline, next to a button label
 *   <Spinner size="sm" />
 *
 *   // Center-of-viewport route loading state
 *   <Spinner fill />
 */
export function Spinner({
  size = "default",
  fill = false,
  label = "Loading",
  className,
}: SpinnerProps) {
  const glyph = (
    <Loader2
      role="status"
      aria-label={label}
      className={cn("animate-spin text-muted-foreground", SIZE_CLASS[size], className)}
    />
  );
  if (!fill) return glyph;
  return <div className="flex h-full w-full items-center justify-center py-16">{glyph}</div>;
}
