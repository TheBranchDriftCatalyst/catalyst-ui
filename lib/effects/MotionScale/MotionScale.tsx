"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useMotion } from "@/catalyst-ui/contexts/Motion";
import { zoomIn, scaleSpring, popIn } from "../variants";

export interface MotionScaleProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  /** Content to animate */
  children: React.ReactNode;
  /** Scale animation variant */
  variant?: "zoom" | "spring" | "pop";
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds (not used for spring/pop) */
  duration?: number;
  /** Target scale value for spring variant */
  scale?: number;
  /** Initial animation state (default: "hidden") */
  initialState?: "hidden" | "show";
  /** Whether to animate on mount (default: true) */
  animateOnMount?: boolean;
}

/**
 * MotionScale - Framer Motion-powered scale animation HOC
 *
 * @description
 * A Framer Motion implementation of scale animations with different variants.
 * Perfect for modals, popups, and interactive elements.
 *
 * Variants:
 * - **zoom**: Smooth scale with opacity fade (tween-based)
 * - **spring**: Bouncy scale effect (great for hovers)
 * - **pop**: Overshoot entrance animation (attention-grabbing)
 *
 * @example Zoom Modal
 * ```tsx
 * <MotionScale variant="zoom" duration={0.3}>
 *   <Dialog>Modal content</Dialog>
 * </MotionScale>
 * ```
 *
 * @example Spring Button Hover
 * ```tsx
 * <MotionScale variant="spring" scale={1.05} initialState="hidden">
 *   <Button>Hover for bounce</Button>
 * </MotionScale>
 * ```
 *
 * @example Pop Notification
 * ```tsx
 * <MotionScale variant="pop" delay={0.1}>
 *   <Badge>New!</Badge>
 * </MotionScale>
 * ```
 */
export const MotionScale = React.forwardRef<HTMLDivElement, MotionScaleProps>(
  (
    {
      children,
      variant = "zoom",
      delay = 0,
      duration = 0.5,
      scale = 1.1,
      initialState = "hidden",
      animateOnMount = true,
      ...motionProps
    },
    ref
  ) => {
    const { motionEnabled, prefersReducedMotion } = useMotion();

    // Select variant
    const variants = React.useMemo(() => {
      switch (variant) {
        case "spring":
          return scaleSpring(delay, scale);
        case "pop":
          return popIn(delay);
        case "zoom":
        default:
          return zoomIn(delay, duration);
      }
    }, [variant, delay, duration, scale]);

    // If motion is disabled, just render without animation
    if (!motionEnabled || prefersReducedMotion) {
      return <div ref={ref}>{children}</div>;
    }

    // Build motion props
    const animateProps = animateOnMount ? { initial: initialState, animate: "show" } : {};

    return (
      <motion.div ref={ref} variants={variants} {...animateProps} {...motionProps}>
        {children}
      </motion.div>
    );
  }
);

MotionScale.displayName = "MotionScale";

export default MotionScale;
