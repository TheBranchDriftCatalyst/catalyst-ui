"use client";

import * as React from "react";
import type { AnimationTrigger, SlideDirection } from "../types";

export interface AnimatedSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** Direction to slide from */
  direction?: SlideDirection;
  /** How to trigger the slide animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Distance to slide in pixels */
  distance?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled visibility state */
  isVisible?: boolean;
  /** Callback when visibility should change */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * AnimatedSlide - A generic slide animation HOC
 *
 * Provides slide animation from any direction.
 * Content-agnostic - works with any React components.
 *
 * @example
 * ```tsx
 * <AnimatedSlide direction="left" trigger="hover" duration={400}>
 *   <div>Content that slides in from the left</div>
 * </AnimatedSlide>
 * ```
 */
export const AnimatedSlide = React.forwardRef<HTMLDivElement, AnimatedSlideProps>(
  (
    {
      children,
      direction = "bottom",
      trigger = "click",
      duration = 400,
      distance = 50,
      className,
      isVisible: controlledIsVisible,
      onVisibilityChange,
      ...props
    },
    ref
  ) => {
    const [internalIsVisible, setInternalIsVisible] = React.useState(false);

    // Use controlled state if provided, otherwise use internal state
    const isControlled = controlledIsVisible !== undefined;
    const isVisible = isControlled ? controlledIsVisible : internalIsVisible;

    const handleVisibilityChange = (newVisible: boolean) => {
      if (isControlled) {
        onVisibilityChange?.(newVisible);
      } else {
        setInternalIsVisible(newVisible);
      }
    };

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        handleVisibilityChange(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        handleVisibilityChange(false);
      }
    };

    const handleClick = () => {
      if (trigger === "click" && !isControlled) {
        handleVisibilityChange(!isVisible);
      }
    };

    // Calculate transform based on direction
    const getTransform = (): string => {
      if (isVisible) return "translate(0, 0)";

      switch (direction) {
        case "top":
          return `translate(0, -${distance}px)`;
        case "right":
          return `translate(${distance}px, 0)`;
        case "bottom":
          return `translate(0, ${distance}px)`;
        case "left":
          return `translate(-${distance}px, 0)`;
        default:
          return "translate(0, 0)";
      }
    };

    const containerStyle: React.CSSProperties = {
      transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
      transform: getTransform(),
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
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

AnimatedSlide.displayName = "AnimatedSlide";

export default AnimatedSlide;
