"use client";

import * as React from "react";
import { useControllableState } from "@/catalyst-ui/hooks/useControllableState";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
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
const AnimatedBounceComponent = React.forwardRef<HTMLDivElement, AnimatedBounceProps>(
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
    const [isBouncing, setIsBouncing] = useControllableState(
      controlledIsBouncing,
      false,
      onBounceChange
    );
    const prefersReducedMotion = usePrefersReducedMotion();

    // Respect user's motion preferences
    const effectiveDuration = prefersReducedMotion ? 0 : duration;

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        setIsBouncing(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        setIsBouncing(false);
      }
    };

    const handleClick = () => {
      if (trigger === "click") {
        setIsBouncing(true);
        // Auto-reset after animation completes
        setTimeout(() => {
          setIsBouncing(false);
        }, effectiveDuration);
      }
    };

    // Bounce animation using cubic-bezier for spring-like effect
    const containerStyle: React.CSSProperties = {
      transition: `transform ${effectiveDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
      transform: isBouncing ? `scale(${intensity})` : "scale(1)",
      display: "inline-block",
    };

    const containerProps = {
      ref,
      className,
      style: containerStyle,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      ...props,
    };

    return <div {...containerProps}>{children}</div>;
  }
);

AnimatedBounceComponent.displayName = "AnimatedBounceComponent";

/**
 * Memoized AnimatedBounce component for performance optimization
 */
export const AnimatedBounce = React.memo(AnimatedBounceComponent);
AnimatedBounce.displayName = "AnimatedBounce";

export default AnimatedBounce;
