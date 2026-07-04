/**
 * Popover primitives with automatic collision-avoidance.
 *
 * Two flavours share one file:
 *
 *   1. ``<Popover>`` / ``<PopoverTrigger>`` / ``<PopoverContent>`` — a thin
 *      wrap around ``@radix-ui/react-popover`` for the trigger-anchored
 *      case (a button expands a floating panel next to it). Radix handles
 *      portal mount + Esc/click-outside + ``avoidCollisions`` auto-flip.
 *
 *   2. ``<SmartPopover>`` — a convenience wrapper that takes ``content`` +
 *      ``children`` (trigger) as props and renders the full trigger →
 *      content pair with sensible defaults. This is the shape consumers
 *      like ``SpawnPopover`` / ``ReviewNotifier`` / ``OperatorContextStrip``
 *      want to consolidate onto.
 *
 * Auto-flip: Radix's ``avoidCollisions`` is on by default. When the
 * requested ``side`` doesn't fit in the viewport, Radix flips to the
 * opposite side. When neither fits, it shifts along the perpendicular
 * axis to stay inside the collision boundary (default: window). Consumers
 * can override with ``side`` (top/right/bottom/left) or ``align``
 * (start/center/end).
 *
 * Note on styling: the visual shell (border, radius, shadow, padding)
 * lives on ``PopoverContent`` so every consumer gets a consistent shell
 * for free. Consumers that need a custom shell can pass ``className`` or
 * drop in raw ``PopoverPrimitive.Content``.
 */
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/catalyst-ui/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /**
   * When true (default), skip the built-in border+shadow shell so consumers
   * can render an unstyled floating container. Leave false for the standard
   * catalyst chrome.
   */
  bare?: boolean;
}

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(function PopoverContent(
  {
    className,
    align = "start",
    sideOffset = 4,
    collisionPadding = 8,
    bare = false,
    children,
    ...props
  },
  ref
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 outline-none",
          !bare &&
            "min-w-[12rem] rounded-sm border border-border bg-popover text-popover-foreground shadow-lg p-3",
          // Framer-motion-lite entry/exit driven by data-state attrs
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

// ─────────────────────────────────────────────────────────────────
// SmartPopover — batteries-included wrapper for the common "click a
// button, get a floating panel" case. Consumers pass the trigger as
// children + the panel as ``content``; open state is fully managed.

export interface SmartPopoverProps extends Omit<PopoverContentProps, "children"> {
  /**
   * The trigger. Passed through ``<PopoverTrigger asChild>`` so the
   * consumer's button preserves its own styling and attaches the toggle
   * handler automatically.
   */
  children: React.ReactNode;
  /** Floating panel content — rendered inside ``PopoverContent``. */
  content: React.ReactNode;
  /**
   * Controlled open state (optional). Omit for uncontrolled behaviour;
   * Radix will manage internally.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Preferred side. Auto-flips when insufficient space. Default: "bottom".
   * Set "top" to prefer opening upwards; still flips to bottom if needed.
   */
  side?: PopoverContentProps["side"];
  /** Passed through to Radix Root for modal (focus-trap) semantics. */
  modal?: boolean;
}

export function SmartPopover({
  children,
  content,
  open,
  onOpenChange,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  collisionPadding = 8,
  modal,
  ...contentProps
}: SmartPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...contentProps}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
