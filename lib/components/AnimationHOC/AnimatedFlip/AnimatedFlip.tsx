"use client";

import * as React from "react";
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
export const AnimatedFlip = React.forwardRef<HTMLDivElement, AnimatedFlipProps>(
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
    const [internalIsFlipped, setInternalIsFlipped] = React.useState(false);

    // Use controlled state if provided, otherwise use internal state
    const isControlled = controlledIsFlipped !== undefined;
    const isFlipped = isControlled ? controlledIsFlipped : internalIsFlipped;

    const handleFlipChange = (newFlipped: boolean) => {
      if (isControlled) {
        onFlipChange?.(newFlipped);
      } else {
        setInternalIsFlipped(newFlipped);
      }
    };

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        handleFlipChange(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        handleFlipChange(false);
      }
    };

    const handleClick = () => {
      if (trigger === "click" && !isControlled) {
        handleFlipChange(!isFlipped);
      }
    };

    const containerStyle: React.CSSProperties = {
      position: "relative",
      perspective: "1500px",
      display: "block",
    };

    const flipperStyle: React.CSSProperties = {
      transition: `transform ${duration}ms`,
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
      transform:
        direction === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)",
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

    return (
      <div {...containerProps}>
        <div style={flipperStyle}>
          {/* Front Face */}
          <div style={frontFaceStyle}>
            {front}
          </div>

          {/* Back Face */}
          <div style={backFaceStyle}>
            {back}
          </div>
        </div>
      </div>
    );
  }
);

AnimatedFlip.displayName = "AnimatedFlip";

export default AnimatedFlip;
