/**
 * Motion Utils - Framer Motion Animation Variants
 *
 * Reusable animation variants for consistent motion design across components.
 * Based on the @3portfolio motion utilities.
 */

import type { Variants } from "framer-motion";

/**
 * Text Variant - Fade in + slide up animation
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @returns Framer Motion variants
 */
export const textVariant = (delay = 0): Variants => ({
  hidden: {
    y: -50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay,
    },
  },
});

/**
 * Fade In - Directional fade animation
 *
 * @param direction - Direction to fade from ("left", "right", "up", "down")
 * @param type - Animation type ("spring" | "tween")
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 */
export const fadeIn = (
  direction: "left" | "right" | "up" | "down",
  type: "spring" | "tween",
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

/**
 * Zoom In - Scale-based entrance animation
 *
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 */
export const zoomIn = (delay: number, duration: number): Variants => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

/**
 * Slide In - Edge-based entrance animation
 *
 * @param direction - Direction to slide from ("left", "right", "up", "down")
 * @param type - Animation type ("spring" | "tween")
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 */
export const slideIn = (
  direction: "left" | "right" | "up" | "down",
  type: "spring" | "tween",
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

/**
 * Stagger Container - Staggers children animations
 *
 * @param staggerChildren - Delay between each child animation (default: 0.1)
 * @param delayChildren - Initial delay before first child (default: 0)
 * @returns Framer Motion variants
 */
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
