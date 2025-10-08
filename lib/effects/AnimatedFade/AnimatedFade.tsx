"use client";

import * as React from "react";
import { useControllableState } from "@/catalyst-ui/hooks/useControllableState";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
import type { AnimationTrigger } from "../types";

export interface AnimatedFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** How to trigger the fade animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled visibility state */
  isVisible?: boolean;
  /** Callback when visibility should change */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * AnimatedFade - A generic fade animation HOC
 *
 * Provides fade in/out animation for any content.
 * Content-agnostic - works with any React components.
 *
 * @example
 * ```tsx
 * <AnimatedFade trigger="hover" duration={300}>
 *   <div>Content that fades in/out</div>
 * </AnimatedFade>
 * ```
 */
export const AnimatedFade = React.forwardRef<HTMLDivElement, AnimatedFadeProps>(
  (
    {
      children,
      trigger = "click",
      duration = 300,
      className,
      isVisible: controlledIsVisible,
      onVisibilityChange,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useControllableState(
      controlledIsVisible,
      false,
      onVisibilityChange
    );
    const prefersReducedMotion = usePrefersReducedMotion();

    // Respect user's motion preferences
    const effectiveDuration = prefersReducedMotion ? 0 : duration;

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        setIsVisible(false);
      }
    };

    const handleClick = () => {
      if (trigger === "click") {
        setIsVisible(!isVisible);
      }
    };

    const containerStyle: React.CSSProperties = {
      transition: `opacity ${effectiveDuration}ms ease-in-out`,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
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

AnimatedFade.displayName = "AnimatedFade";

export default AnimatedFade;
