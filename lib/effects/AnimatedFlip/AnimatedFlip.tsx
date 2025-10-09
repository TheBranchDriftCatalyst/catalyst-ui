"use client";

import * as React from "react";
import { useControllableState } from "@/catalyst-ui/hooks/useControllableState";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
import { useAnimationTriggers } from "@/catalyst-ui/hooks/useAnimationTriggers";
import type { AnimationTrigger, FlipDirection } from "../types";

export interface AnimatedFlipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to display on the front face */
  front: React.ReactNode;
  /** Content to display on the back face */
  back: React.ReactNode;
  /** How to trigger the flip animation */
  trigger?: AnimationTrigger;
  /** Direction of flip animation */
  direction?: FlipDirection;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled flip state */
  isFlipped?: boolean;
  /** Callback when flip state should change */
  onFlipChange?: (isFlipped: boolean) => void;
}

/**
 * AnimatedFlip - A generic flip animation HOC
 *
 * Provides 3D flip animation between two pieces of content.
 * Content-agnostic - works with any React components.
 *
 * @example
 * ```tsx
 * <AnimatedFlip
 *   front={<Card>Front content</Card>}
 *   back={<Card>Back content</Card>}
 *   trigger="click"
 *   direction="horizontal"
 * />
 * ```
 */
const AnimatedFlipComponent = React.forwardRef<HTMLDivElement, AnimatedFlipProps>(
  (
    {
      front,
      back,
      trigger = "click",
      direction = "horizontal",
      duration = 600,
      className,
      isFlipped: controlledIsFlipped,
      onFlipChange,
      ...props
    },
    ref
  ) => {
    const [isFlipped, setIsFlipped] = useControllableState(
      controlledIsFlipped,
      false,
      onFlipChange
    );
    const prefersReducedMotion = usePrefersReducedMotion();

    // Only use automatic triggers if component is uncontrolled
    const isControlled = controlledIsFlipped !== undefined;

    const { handleMouseEnter, handleMouseLeave, handleClick } = useAnimationTriggers(
      trigger,
      setIsFlipped
    );

    // Respect user's motion preferences - disable animation if preferred
    const effectiveDuration = prefersReducedMotion ? 0 : duration;

    const containerStyle: React.CSSProperties = {
      position: "relative",
      perspective: "1500px",
      display: "block",
    };

    const flipperStyle: React.CSSProperties = {
      transition: `transform ${effectiveDuration}ms`,
      transformStyle: "preserve-3d",
      position: "relative",
      transform: isFlipped
        ? direction === "horizontal"
          ? "rotateY(180deg)"
          : "rotateX(180deg)"
        : "none",
    };

    const faceStyle: React.CSSProperties = {
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    };

    const frontFaceStyle: React.CSSProperties = {
      ...faceStyle,
      position: isFlipped ? "absolute" : "relative",
      top: isFlipped ? 0 : undefined,
      left: isFlipped ? 0 : undefined,
    };

    const backFaceStyle: React.CSSProperties = {
      ...faceStyle,
      position: isFlipped ? "relative" : "absolute",
      top: isFlipped ? undefined : 0,
      left: isFlipped ? undefined : 0,
      transform: direction === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)",
    };

    // Build props - when controlled, explicitly remove any click handlers
    const {
      onClick: _propsOnClick,
      onMouseEnter: _propsOnMouseEnter,
      onMouseLeave: _propsOnMouseLeave,
      ...restProps
    } = props;

    const containerProps = {
      ref,
      className,
      style: containerStyle,
      ...restProps,
      // Only attach handlers when UNcontrolled
      ...(!isControlled && {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleClick,
      }),
      // When controlled, explicitly block all mouse events
      ...(isControlled && {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        onMouseEnter: undefined,
        onMouseLeave: undefined,
      }),
    };

    // In controlled mode, prevent clicks on content from bubbling
    const handleContentClick = isControlled
      ? (e: React.MouseEvent) => {
          // Stop propagation to prevent any parent handlers from firing
          e.stopPropagation();
        }
      : undefined;

    return (
      <div {...containerProps}>
        <div style={flipperStyle}>
          {/* Front Face */}
          <div style={frontFaceStyle} onClick={handleContentClick}>
            {front}
          </div>

          {/* Back Face */}
          <div style={backFaceStyle} onClick={handleContentClick}>
            {back}
          </div>
        </div>
      </div>
    );
  }
);

AnimatedFlipComponent.displayName = "AnimatedFlipComponent";

/**
 * Memoized AnimatedFlip component for performance optimization
 * Prevents unnecessary re-renders when props haven't changed
 */
export const AnimatedFlip = React.memo(AnimatedFlipComponent);
AnimatedFlip.displayName = "AnimatedFlip";

export default AnimatedFlip;
