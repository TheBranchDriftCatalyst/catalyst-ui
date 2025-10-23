"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useMotion } from "@/catalyst-ui/contexts/Motion";
import { simpleFade, fadeIn, fadeOut } from "../variants";

export interface MotionFadeProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  /** Content to animate */
  children: React.ReactNode;
  /** Direction for fade animation (default: none - simple fade) */
  direction?: "left" | "right" | "up" | "down" | "none";
  /** Animation type */
  type?: "spring" | "tween";
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Initial animation state (default: "hidden") */
  initialState?: "hidden" | "show";
  /** Whether to animate on mount (default: true) */
  animateOnMount?: boolean;
  /** Whether to use exit animation (requires AnimatePresence wrapper) */
  useExit?: boolean;
}

/**
 * MotionFade - Framer Motion-powered fade animation HOC
 *
 * @description
 * A Framer Motion implementation of fade animations that respects the Motion context
 * and accessibility preferences. Provides both directional and simple fade effects.
 *
 * Key Features:
 * - Respects MotionProvider's prefers-reduced-motion setting
 * - Directional fade (left, right, up, down) or simple opacity fade
 * - Spring or tween animation types
 * - Exit animations with AnimatePresence
 * - Full Framer Motion API access via props spreading
 *
 * @example Simple Fade
 * ```tsx
 * <MotionFade direction="none" duration={0.3}>
 *   <Alert>Fades in with opacity</Alert>
 * </MotionFade>
 * ```
 *
 * @example Directional Fade
 * ```tsx
 * <MotionFade direction="up" type="spring" delay={0.2} duration={1}>
 *   <Card>Slides up while fading in</Card>
 * </MotionFade>
 * ```
 *
 * @example With Exit Animation
 * ```tsx
 * <AnimatePresence>
 *   {isVisible && (
 *     <MotionFade direction="down" useExit>
 *       <Notification>Fades out when removed</Notification>
 *     </MotionFade>
 *   )}
 * </AnimatePresence>
 * ```
 *
 * @example Custom Framer Motion Props
 * ```tsx
 * <MotionFade
 *   direction="left"
 *   whileHover={{ scale: 1.05 }}
 *   whileTap={{ scale: 0.95 }}
 * >
 *   <Button>Interactive animated button</Button>
 * </MotionFade>
 * ```
 */
export const MotionFade = React.forwardRef<HTMLDivElement, MotionFadeProps>(
  (
    {
      children,
      direction = "none",
      type = "spring",
      delay = 0,
      duration = 0.5,
      initialState = "hidden",
      animateOnMount = true,
      useExit = false,
      ...motionProps
    },
    ref
  ) => {
    const { motionEnabled, prefersReducedMotion } = useMotion();

    // Select appropriate variant based on direction
    const variants =
      direction === "none" ? simpleFade(delay, duration) : fadeIn(direction, type, delay, duration);

    // If motion is disabled, just render without animation
    if (!motionEnabled || prefersReducedMotion) {
      return <div ref={ref}>{children}</div>;
    }

    // Build motion props
    const animateProps = animateOnMount ? { initial: initialState, animate: "show" } : {};

    // Only add exit animation for directional fades
    const exitProps =
      useExit && direction !== "none"
        ? { exit: fadeOut(direction, type, 0, duration * 0.7).hidden }
        : {};

    return (
      <motion.div ref={ref} variants={variants} {...animateProps} {...exitProps} {...motionProps}>
        {children}
      </motion.div>
    );
  }
);

MotionFade.displayName = "MotionFade";

export default MotionFade;
