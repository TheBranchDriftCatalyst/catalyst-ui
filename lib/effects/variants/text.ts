/**
 * Text Variants - Framer Motion animation variants for text elements
 *
 * Pre-built variants for common text entrance animations.
 */

import type { Variants } from "framer-motion";

/**
 * Text Variant - Fade in + slide up animation
 *
 * Perfect for headings, titles, and emphasis text.
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.h1 variants={textVariant(0.2)} initial="hidden" animate="show">
 *   Welcome to our site
 * </motion.h1>
 * ```
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
 * Text Fade In - Simple opacity fade
 *
 * Minimal animation for subtitles, descriptions, and body text.
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.6)
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.p variants={textFadeIn(0.4)} initial="hidden" animate="show">
 *   Description text that fades in
 * </motion.p>
 * ```
 */
export const textFadeIn = (delay = 0, duration = 0.6): Variants => ({
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

/**
 * Text Slide Up - Slide from bottom with fade
 *
 * Smooth upward motion, great for sequential text reveals.
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.8)
 * @param distance - Slide distance in pixels (default: 30)
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.h2 variants={textSlideUp(0.3, 0.8, 40)} initial="hidden" animate="show">
 *   Animated heading
 * </motion.h2>
 * ```
 */
export const textSlideUp = (delay = 0, duration = 0.8, distance = 30): Variants => ({
  hidden: {
    y: distance,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration,
      delay,
    },
  },
});

/**
 * Text Gradient Shimmer - Animated gradient effect
 *
 * Creates a shimmer effect on gradient text (requires gradient background-clip).
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.h1
 *   className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
 *   variants={textGradientShimmer()}
 *   initial="hidden"
 *   animate="show"
 * >
 *   Shimmering Title
 * </motion.h1>
 * ```
 */
export const textGradientShimmer = (delay = 0): Variants => ({
  hidden: {
    backgroundPosition: "200% center",
    opacity: 0,
  },
  show: {
    backgroundPosition: "0% center",
    opacity: 1,
    transition: {
      duration: 2,
      delay,
      ease: "easeInOut",
    },
  },
});
