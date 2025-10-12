/**
 * Progress Components
 *
 * Visual progress indicators built on Radix UI Progress primitives.
 * Shows completion status for tasks, loading states, or multi-step processes.
 *
 * @module progress
 *
 * @example
 * ```tsx
 * import { Progress } from "@/catalyst-ui/ui/progress";
 *
 * function UploadProgress() {
 *   const [progress, setProgress] = React.useState(0);
 *
 *   React.useEffect(() => {
 *     const timer = setInterval(() => {
 *       setProgress(prev => (prev >= 100 ? 0 : prev + 10));
 *     }, 500);
 *     return () => clearInterval(timer);
 *   }, []);
 *
 *   return <Progress value={progress} />;
 * }
 * ```
 */
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";
import { VariantProps, cva } from "class-variance-authority";

/**
 * Progress bar style variants using class-variance-authority.
 *
 * Defines background colors for different progress states.
 */
const progressBarVariants = cva("relative h-4 w-full overflow-hidden rounded-full bg-secondary", {
  variants: {
    variant: {
      secondary: "bg-secondary",
      default: "bg-secondary",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Progress - Visual progress indicator.
 *
 * Displays a horizontal progress bar with animated fill indicator.
 * Supports different visual variants and smooth transitions.
 *
 * @component
 *
 * @param value - Progress percentage (0-100)
 * @param variant - Visual style: "default" | "secondary" | "destructive"
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Simple progress bar
 * <Progress value={60} />
 * ```
 *
 * @example
 * ```tsx
 * // Animated loading progress
 * function LoadingBar() {
 *   const [progress, setProgress] = React.useState(0);
 *
 *   React.useEffect(() => {
 *     const timer = setInterval(() => {
 *       setProgress(prev => {
 *         const next = prev + 10;
 *         return next > 100 ? 100 : next;
 *       });
 *     }, 300);
 *
 *     return () => clearInterval(timer);
 *   }, []);
 *
 *   return (
 *     <div className="w-full">
 *       <Progress value={progress} />
 *       <p className="text-sm text-center mt-2">{progress}% complete</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Destructive variant for errors or warnings
 * <Progress value={75} variant="destructive" />
 * ```
 *
 * @example
 * ```tsx
 * // Multi-step form progress
 * function FormProgress({ currentStep, totalSteps }) {
 *   const progress = (currentStep / totalSteps) * 100;
 *
 *   return (
 *     <div>
 *       <div className="flex justify-between mb-2">
 *         <span>Step {currentStep} of {totalSteps}</span>
 *         <span>{Math.round(progress)}%</span>
 *       </div>
 *       <Progress value={progress} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses native progress element with proper ARIA attributes
 * - Announces progress changes to screen readers
 * - Value automatically clamped to 0-100 range
 *
 * @remarks
 * The progress indicator uses a smooth 500ms transition when the value changes.
 * The fill color is set via the primary theme color.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressBarVariants>
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressBarVariants({ variant }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
