"use client";

/**
 * Tooltip Components
 *
 * Accessible tooltip components built on Radix UI Tooltip primitives.
 * Displays floating hints when hovering or focusing on trigger elements.
 *
 * @module tooltip
 *
 * @example
 * ```tsx
 * import {
 *   Tooltip,
 *   TooltipContent,
 *   TooltipProvider,
 *   TooltipTrigger,
 * } from "@/catalyst-ui/ui/tooltip";
 *
 * function MyComponent() {
 *   return (
 *     <TooltipProvider>
 *       <Tooltip>
 *         <TooltipTrigger>Hover me</TooltipTrigger>
 *         <TooltipContent>
 *           <p>This is a helpful tooltip</p>
 *         </TooltipContent>
 *       </Tooltip>
 *     </TooltipProvider>
 *   );
 * }
 * ```
 */
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * TooltipProvider - Context provider for tooltip configuration.
 *
 * Wraps tooltip components and provides shared configuration like
 * delay timing and skip-delay behavior. Required at the root of
 * tooltip usage.
 *
 * @component
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={300}>
 *   <Tooltip>...</Tooltip>
 *   <Tooltip>...</Tooltip>
 * </TooltipProvider>
 * ```
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip - Root tooltip component.
 *
 * Manages tooltip open/close state and coordinates trigger/content positioning.
 * This is re-exported from Radix UI primitives.
 *
 * @component
 *
 * @param open - Controlled open state
 * @param defaultOpen - Initial open state (uncontrolled)
 * @param onOpenChange - Callback when open state changes
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * TooltipTrigger - Element that triggers the tooltip.
 *
 * The element users interact with (hover/focus) to show the tooltip.
 * Can be any React element or component.
 *
 * @component
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <button>Hover me</button>
 *   </TooltipTrigger>
 *   <TooltipContent>Tooltip text</TooltipContent>
 * </Tooltip>
 * ```
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent - The tooltip content panel.
 *
 * Displays the tooltip message in a floating panel positioned
 * relative to the trigger element. Automatically handles positioning,
 * collision detection, and animations.
 *
 * @component
 *
 * @param side - Preferred placement: "top" | "right" | "bottom" | "left"
 * @param sideOffset - Distance in pixels from the trigger (default: 4)
 * @param align - Alignment relative to trigger: "start" | "center" | "end"
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>Info</TooltipTrigger>
 *   <TooltipContent side="top" align="center">
 *     This is helpful information
 *   </TooltipContent>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * // Multi-line tooltip with custom styling
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <InfoIcon />
 *   </TooltipTrigger>
 *   <TooltipContent className="max-w-xs">
 *     <p className="font-semibold">Pro Tip</p>
 *     <p className="text-sm">
 *       You can use keyboard shortcuts to speed up your workflow.
 *     </p>
 *   </TooltipContent>
 * </Tooltip>
 * ```
 *
 * @accessibility
 * - Automatically manages focus and ARIA attributes
 * - Keyboard accessible (shows on focus, hides on Escape)
 * - Screen reader announcements via ARIA
 * - Respects prefers-reduced-motion
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
