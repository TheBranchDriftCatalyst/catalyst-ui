"use client";

import * as React from "react";
import type { AnimationTrigger } from "../types";

export interface AnimatedBounceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** How to trigger the bounce animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Bounce intensity (scale multiplier) */
  intensity?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled bounce state */
  isBouncing?: boolean;
  /** Callback when bounce state should change */
  onBounceChange?: (isBouncing: boolean) => void;
}

/**
 * AnimatedBounce - A generic bounce animation HOC
 *
 * Provides bounce animation with configurable intensity.
 * Content-agnostic - works with any React components.
 *
 * @example
 * ```tsx
 * <AnimatedBounce trigger="hover" intensity={1.2} duration={500}>
 *   <button>Click me!</button>
 * </AnimatedBounce>
 * ```
 */
export const AnimatedBounce = React.forwardRef<HTMLDivElement, AnimatedBounceProps>(
  (
    {
      children,
      trigger = "hover",
      duration = 500,
      intensity = 1.1,
      className,
      isBouncing: controlledIsBouncing,
      onBounceChange,
      ...props
    },
    ref
  ) => {
    const [internalIsBouncing, setInternalIsBouncing] = React.useState(false);

    // Use controlled state if provided, otherwise use internal state
    const isControlled = controlledIsBouncing !== undefined;
    const isBouncing = isControlled ? controlledIsBouncing : internalIsBouncing;

    const handleBounceChange = (newBouncing: boolean) => {
      if (isControlled) {
        onBounceChange?.(newBouncing);
      } else {
        setInternalIsBouncing(newBouncing);
      }
    };

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        handleBounceChange(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        handleBounceChange(false);
      }
    };

    const handleClick = () => {
      if (trigger === "click" && !isControlled) {
        handleBounceChange(true);
        // Auto-reset after animation completes
        setTimeout(() => {
          handleBounceChange(false);
        }, duration);
      }
    };

    // Bounce animation using cubic-bezier for spring-like effect
    const containerStyle: React.CSSProperties = {
      transition: `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
      transform: isBouncing ? `scale(${intensity})` : "scale(1)",
      display: "inline-block",
    };

    const containerProps = {
      ref,
      className,
      style: containerStyle,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...(isControlled ? {} : { onClick: handleClick }),
      ...props,
    };

    return <div {...containerProps}>{children}</div>;
  }
);

AnimatedBounce.displayName = "AnimatedBounce";

export default AnimatedBounce;
