/**
 * Slide Variants - Framer Motion animation variants for slide effects
 *
 * Edge-based entrance and exit animations.
 */

import type { Variants } from "framer-motion";

/**
 * Slide In - Edge-based entrance animation
 *
 * Slides in from screen edge (uses percentage-based positioning).
 *
 * @param direction - Direction to slide from ("left", "right", "up", "down")
 * @param type - Animation type ("spring" | "tween")
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 *
 * @example Drawer sliding from left
 * ```tsx
 * <motion.aside
 *   variants={slideIn("left", "spring", 0, 0.5)}
 *   initial="hidden"
 *   animate="show"
 * >
 *   <Navigation />
 * </motion.aside>
 * ```
 */
export const slideIn = (
  direction: "left" | "right" | "up" | "down",
  type: "spring" | "tween" = "spring",
  delay = 0,
  duration = 0.5
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
 * Slide Out - Edge-based exit animation
 *
 * Slides out toward screen edge.
 *
 * @param direction - Direction to slide toward ("left", "right", "up", "down")
 * @param type - Animation type ("spring" | "tween")
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <motion.div
 *       variants={slideOut("right", "tween", 0, 0.3)}
 *       initial="show"
 *       exit="hidden"
 *     >
 *       Notification
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 * ```
 */
export const slideOut = (
  direction: "left" | "right" | "up" | "down",
  type: "spring" | "tween" = "tween",
  delay = 0,
  duration = 0.3
): Variants => ({
  show: {
    x: 0,
    y: 0,
  },
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeIn",
    },
  },
});

/**
 * Slide From Bottom - Common bottom sheet pattern
 *
 * Optimized for modals, bottom sheets, and mobile drawers.
 *
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.4)
 * @returns Framer Motion variants
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={slideFromBottom()}
 *   initial="hidden"
 *   animate="show"
 *   className="fixed bottom-0 inset-x-0"
 * >
 *   <BottomSheet />
 * </motion.div>
 * ```
 */
export const slideFromBottom = (delay = 0, duration = 0.4): Variants => ({
  hidden: {
    y: "100%",
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay,
      duration,
    },
  },
});
