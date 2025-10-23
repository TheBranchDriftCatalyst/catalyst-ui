/**
 * Scale Variants - Framer Motion animation variants for scale/zoom effects
 *
 * Scale-based entrance, exit, and interactive animations.
 */

import type { Variants } from "framer-motion";

/**
 * Zoom In - Scale-based entrance animation
 *
 * Grows from center point with fade.
 *
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 *
 * @example Modal entrance
 * ```tsx
 * <motion.div
 *   variants={zoomIn(0, 0.3)}
 *   initial="hidden"
 *   animate="show"
 * >
 *   <Dialog />
 * </motion.div>
 * ```
 */
export const zoomIn = (delay = 0, duration = 0.5): Variants => ({
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
 * Zoom Out - Scale-based exit animation
 *
 * Shrinks toward center with fade.
 *
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isVisible && (
 *     <motion.div
 *       variants={zoomOut(0, 0.2)}
 *       initial="show"
 *       exit="hidden"
 *     >
 *       Popup content
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 * ```
 */
export const zoomOut = (delay = 0, duration = 0.3): Variants => ({
  show: {
    scale: 1,
    opacity: 1,
  },
  hidden: {
    scale: 0,
    opacity: 0,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: "easeIn",
    },
  },
});

/**
 * Scale Spring - Bouncy scale animation
 *
 * Spring-based scale effect with natural bounce.
 *
 * @param delay - Animation delay in seconds
 * @param scale - Target scale value (default: 1.1)
 * @returns Framer Motion variants
 *
 * @example Button hover effect
 * ```tsx
 * <motion.button
 *   variants={scaleSpring(0, 1.05)}
 *   whileHover="show"
 *   initial="hidden"
 * >
 *   Click me
 * </motion.button>
 * ```
 */
export const scaleSpring = (delay = 0, scale = 1.1): Variants => ({
  hidden: {
    scale: 1,
  },
  show: {
    scale,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
      delay,
    },
  },
});

/**
 * Pulse Scale - Repeating scale pulse
 *
 * Continuous pulsing animation, great for loading indicators.
 *
 * @param scale - Maximum scale (default: 1.1)
 * @param duration - Duration of one pulse cycle (default: 1.5)
 * @returns Framer Motion variants
 *
 * @example Loading indicator
 * ```tsx
 * <motion.div
 *   variants={pulseScale()}
 *   animate="show"
 *   className="w-4 h-4 bg-primary rounded-full"
 * />
 * ```
 */
export const pulseScale = (scale = 1.1, duration = 1.5): Variants => ({
  show: {
    scale: [1, scale, 1],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

/**
 * Pop In - Overshoot scale entrance
 *
 * Bouncy entrance that overshoots then settles.
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @returns Framer Motion variants
 *
 * @example Notification badge
 * ```tsx
 * <motion.span
 *   variants={popIn(0.1)}
 *   initial="hidden"
 *   animate="show"
 *   className="badge"
 * >
 *   3
 * </motion.span>
 * ```
 */
export const popIn = (delay = 0): Variants => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
      delay,
    },
  },
});
