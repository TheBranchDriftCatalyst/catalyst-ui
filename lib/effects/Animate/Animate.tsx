"use client";

import * as React from "react";

// CSS-based implementations
import { AnimatedFade } from "../AnimatedFade";
import { AnimatedFlip } from "../AnimatedFlip";
import { AnimatedSlide } from "../AnimatedSlide";
import { AnimatedBounce } from "../AnimatedBounce";

// Motion-based implementations
import { MotionFade } from "../MotionFade";
import { MotionScale } from "../MotionScale";

import type { AnimationTrigger } from "../types";

/**
 * Animation implementation strategy
 */
export type AnimationImplementation = "css" | "motion" | "auto";

/**
 * Animation variant type
 */
export type AnimationVariant =
  | "fade"
  | "flip"
  | "slide"
  | "bounce"
  | "scale"
  | "zoom"
  | "spring"
  | "pop";

/**
 * Direction for directional animations
 */
export type AnimationDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "horizontal"
  | "vertical"
  | "none";

export interface AnimateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** Animation variant */
  variant: AnimationVariant;
  /** Animation implementation strategy (default: "auto") */
  implementation?: AnimationImplementation;
  /** Direction for directional animations */
  direction?: AnimationDirection;
  /** Animation trigger (CSS mode only) */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds (CSS) or seconds (Motion) */
  duration?: number;
  /** Animation delay in seconds (Motion) or milliseconds (CSS) */
  delay?: number;
  /** Whether to animate on mount (Motion) */
  animateOnMount?: boolean;
  /** Whether to use exit animation (Motion, requires AnimatePresence) */
  useExit?: boolean;
  /** Additional content for flip animations (back face) */
  backContent?: React.ReactNode;
  /** Scale intensity for bounce/scale animations */
  intensity?: number;
  /** Controlled state for CSS animations */
  isActive?: boolean;
  /** Callback when state changes (CSS animations) */
  onStateChange?: (isActive: boolean) => void;
}

/**
 * Animate - Unified animation interface
 *
 * @description
 * A unified component that provides a single API for animations, automatically
 * choosing between CSS-based or Framer Motion-based implementations.
 *
 * **Implementation Strategy**:
 * - **"auto"** (default): Uses CSS for simple interactions, Motion for complex ones
 * - **"css"**: Forces CSS-based animation (smaller bundle, better performance)
 * - **"motion"**: Forces Framer Motion (more features, larger bundle)
 *
 * **Auto Selection Logic**:
 * - Uses CSS when: Simple hover/click interactions, no exit animations
 * - Uses Motion when: `useExit`, `animateOnMount={false}`, or complex variants
 *
 * @example Simple fade (auto-selects CSS)
 * ```tsx
 * <Animate variant="fade" trigger="hover" duration={300}>
 *   <Card>Hover to fade</Card>
 * </Animate>
 * ```
 *
 * @example Directional fade (auto-selects Motion)
 * ```tsx
 * <Animate variant="fade" direction="up" duration={0.8}>
 *   <Hero>Slides up while fading</Hero>
 * </Animate>
 * ```
 *
 * @example Force CSS implementation
 * ```tsx
 * <Animate variant="bounce" implementation="css" trigger="hover">
 *   <Button>Bouncy button</Button>
 * </Animate>
 * ```
 *
 * @example Force Motion with exit animation
 * ```tsx
 * <AnimatePresence>
 *   {isVisible && (
 *     <Animate variant="slide" direction="left" implementation="motion" useExit>
 *       <Sidebar />
 *     </Animate>
 *   )}
 * </AnimatePresence>
 * ```
 *
 * @example Flip animation
 * ```tsx
 * <Animate
 *   variant="flip"
 *   direction="horizontal"
 *   trigger="click"
 *   backContent={<CodeBlock>Source code</CodeBlock>}
 * >
 *   <Card>Front content</Card>
 * </Animate>
 * ```
 */
export const Animate = React.forwardRef<HTMLDivElement, AnimateProps>(
  (
    {
      children,
      variant,
      implementation = "auto",
      direction = "none",
      trigger = "click",
      duration = 300,
      delay = 0,
      animateOnMount = true,
      useExit = false,
      backContent,
      intensity = 1.1,
      isActive,
      onStateChange,
      ...htmlProps
    },
    ref
  ) => {
    // Auto-select implementation
    const effectiveImpl = React.useMemo(() => {
      if (implementation !== "auto") return implementation;

      // Use Motion if:
      // - Exit animations needed
      // - Not animating on mount (controlled reveal)
      // - Direction specified (for smooth directional fades)
      // - Scale/zoom variants (Motion has better spring physics)
      if (
        useExit ||
        !animateOnMount ||
        (direction !== "none" && variant === "fade") ||
        variant === "scale" ||
        variant === "zoom" ||
        variant === "spring" ||
        variant === "pop"
      ) {
        return "motion";
      }

      // Default to CSS for simple interactions
      return "css";
    }, [implementation, useExit, animateOnMount, direction, variant]);

    // Render CSS implementation
    if (effectiveImpl === "css") {
      const cssDuration = typeof duration === "number" ? duration : 300;

      switch (variant) {
        case "fade":
          return (
            <AnimatedFade
              ref={ref}
              trigger={trigger}
              duration={cssDuration}
              isVisible={isActive}
              onVisibilityChange={onStateChange}
              {...htmlProps}
            >
              {children}
            </AnimatedFade>
          );

        case "flip":
          return (
            <AnimatedFlip
              ref={ref}
              front={children}
              back={backContent || children}
              trigger={trigger}
              direction={
                direction === "horizontal" || direction === "vertical" ? direction : "horizontal"
              }
              duration={cssDuration}
              isFlipped={isActive}
              onFlipChange={onStateChange}
              {...htmlProps}
            />
          );

        case "slide":
          return (
            <AnimatedSlide
              ref={ref}
              trigger={trigger}
              direction={direction === "none" ? "left" : (direction as any)}
              duration={cssDuration}
              isSliding={isActive}
              onSlideChange={onStateChange}
              {...htmlProps}
            >
              {children}
            </AnimatedSlide>
          );

        case "bounce":
        case "spring":
          return (
            <AnimatedBounce
              ref={ref}
              trigger={trigger}
              duration={cssDuration}
              intensity={intensity}
              isBouncing={isActive}
              onBounceChange={onStateChange}
              {...htmlProps}
            >
              {children}
            </AnimatedBounce>
          );

        default:
          return (
            <div ref={ref} {...htmlProps}>
              {children}
            </div>
          );
      }
    }

    // Render Motion implementation
    const motionDuration = typeof duration === "number" ? duration / 1000 : 0.5;
    const motionDelay = typeof delay === "number" ? delay / 1000 : 0;

    switch (variant) {
      case "fade":
        return (
          <MotionFade
            ref={ref}
            direction={direction as any}
            duration={motionDuration}
            delay={motionDelay}
            animateOnMount={animateOnMount}
            useExit={useExit}
            {...htmlProps}
          >
            {children}
          </MotionFade>
        );

      case "scale":
      case "zoom":
        return (
          <MotionScale
            ref={ref}
            variant="zoom"
            duration={motionDuration}
            delay={motionDelay}
            animateOnMount={animateOnMount}
            {...htmlProps}
          >
            {children}
          </MotionScale>
        );

      case "spring":
        return (
          <MotionScale
            ref={ref}
            variant="spring"
            scale={intensity}
            delay={motionDelay}
            animateOnMount={animateOnMount}
            {...htmlProps}
          >
            {children}
          </MotionScale>
        );

      case "pop":
        return (
          <MotionScale
            ref={ref}
            variant="pop"
            delay={motionDelay}
            animateOnMount={animateOnMount}
            {...htmlProps}
          >
            {children}
          </MotionScale>
        );

      default:
        return (
          <div ref={ref} {...htmlProps}>
            {children}
          </div>
        );
    }
  }
);

Animate.displayName = "Animate";

export default Animate;
