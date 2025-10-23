/**
 * Fade Variants - Framer Motion animation variants for fade effects
 *
 * Directional and non-directional fade animations.
 */

import type { Variants } from "framer-motion";

/**
 * Fade In - Directional fade animation
 *
 * Fades in from a specific direction with motion.
 *
 * @param direction - Direction to fade from ("left", "right", "up", "down")
 * @param type - Animation type ("spring" | "tween")
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeIn("up", "spring", 0.2, 1)}
 *   initial="hidden"
 *   animate="show"
 * >
 *   Content that fades in from below
 * </motion.div>
 * ```
 */
export const fadeIn = (
  direction: "left" | "right" | "up" | "down",
  type: "spring" | "tween" = "spring",
  delay = 0,
  duration = 1
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
 * Fade Out - Directional fade out animation
 *
 * Fades out toward a specific direction.
 *
 * @param direction - Direction to fade toward ("left", "right", "up", "down")
 * @param type - Animation type ("spring" | "tween")
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeOut("down", "tween", 0, 0.5)}
 *   initial="show"
 *   exit="hidden"
 * >
 *   Content that fades down and out
 * </motion.div>
 * ```
 */
export const fadeOut = (
  direction: "left" | "right" | "up" | "down",
  type: "spring" | "tween" = "tween",
  delay = 0,
  duration = 0.5
): Variants => ({
  show: {
    x: 0,
    y: 0,
    opacity: 1,
  },
  hidden: {
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? -100 : direction === "down" ? 100 : 0,
    opacity: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeIn",
    },
  },
});

/**
 * Simple Fade - Basic opacity fade in/out
 *
 * Minimal fade effect without directional movement.
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.3)
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.div variants={simpleFade()} initial="hidden" animate="show">
 *   Content that simply fades
 * </motion.div>
 * ```
 */
export const simpleFade = (delay = 0, duration = 0.3): Variants => ({
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: "easeInOut",
    },
  },
});

/**
 * Fade In (Stagger Compatible) - Directional fade without transition timing
 *
 * Use this variant when you want children to be orchestrated by a parent staggerContainer.
 * Unlike fadeIn(), this variant does NOT include transition configuration, allowing the
 * parent container to control all timing via staggerChildren.
 *
 * @param direction - Direction to fade from ("left", "right", "up", "down")
 * @param distance - Distance to travel in pixels (default: 20)
 * @returns Framer Motion variants (without transition)
 *
 * @example
 * ```tsx
 * <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show">
 *   {items.map((item, i) => (
 *     <motion.div key={i} variants={fadeInStagger("up")}>
 *       <Card>{item}</Card>
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const fadeInStagger = (
  direction: "left" | "right" | "up" | "down",
  distance = 20
): Variants => ({
  hidden: {
    x: direction === "left" ? distance : direction === "right" ? -distance : 0,
    y: direction === "up" ? distance : direction === "down" ? -distance : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    // No transition - parent staggerContainer controls timing
  },
});
