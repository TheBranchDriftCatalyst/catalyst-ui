/**
 * Stagger Variants - Framer Motion animation variants for staggered children
 *
 * Container variants that orchestrate child animations with stagger delays.
 */

import type { Variants } from "framer-motion";

/**
 * Stagger Container - Staggers children animations
 *
 * Orchestrates sequential animations for child elements.
 *
 * @param staggerChildren - Delay between each child animation (default: 0.1)
 * @param delayChildren - Initial delay before first child (default: 0)
 * @returns Framer Motion variants
 *
 * @example List of cards
 * ```tsx
 * <motion.div
 *   variants={staggerContainer(0.1, 0.2)}
 *   initial="hidden"
 *   animate="show"
 * >
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={fadeIn("up", "spring", 0, 0.5)}>
 *       <Card>{item.content}</Card>
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
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

/**
 * Stagger Fast - Quick succession stagger
 *
 * Rapid sequential reveals, good for small lists.
 *
 * @param delayChildren - Initial delay before first child (default: 0)
 * @returns Framer Motion variants
 *
 * @example Tags or badges
 * ```tsx
 * <motion.div
 *   variants={staggerFast()}
 *   initial="hidden"
 *   animate="show"
 *   className="flex gap-2"
 * >
 *   {tags.map(tag => (
 *     <motion.span key={tag} variants={popIn()}>
 *       <Badge>{tag}</Badge>
 *     </motion.span>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerFast = (delayChildren = 0): Variants => staggerContainer(0.05, delayChildren);

/**
 * Stagger Slow - Deliberate stagger effect
 *
 * Slow, dramatic reveals for emphasis.
 *
 * @param delayChildren - Initial delay before first child (default: 0)
 * @returns Framer Motion variants
 *
 * @example Feature sections
 * ```tsx
 * <motion.div
 *   variants={staggerSlow(0.5)}
 *   initial="hidden"
 *   whileInView="show"
 *   viewport={{ once: true }}
 * >
 *   {features.map(feature => (
 *     <motion.div key={feature.id} variants={fadeIn("up", "spring", 0, 1)}>
 *       <Feature {...feature} />
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerSlow = (delayChildren = 0): Variants => staggerContainer(0.2, delayChildren);

/**
 * Reverse Stagger - Children animate in reverse order
 *
 * Last child animates first, useful for exit animations.
 *
 * @param staggerChildren - Delay between each child (default: 0.05)
 * @returns Framer Motion variants
 *
 * @example Dismissing notifications
 * ```tsx
 * <AnimatePresence>
 *   <motion.div
 *     variants={reverseStagger()}
 *     initial="show"
 *     exit="hidden"
 *   >
 *     {notifications.map(notif => (
 *       <motion.div key={notif.id} variants={fadeOut("right", "tween", 0, 0.3)}>
 *         <Notification {...notif} />
 *       </motion.div>
 *     ))}
 *   </motion.div>
 * </AnimatePresence>
 * ```
 */
export const reverseStagger = (staggerChildren = 0.05): Variants => ({
  show: {},
  hidden: {
    transition: {
      staggerChildren,
      staggerDirection: -1, // Reverse order
    },
  },
});

/**
 * Bi-directional Stagger - Stagger from center outward
 *
 * Children animate from middle to edges (requires proper indexing).
 *
 * @param staggerChildren - Delay between each child (default: 0.08)
 * @param delayChildren - Initial delay (default: 0)
 * @returns Framer Motion variants
 *
 * @example Gallery grid
 * ```tsx
 * <motion.div
 *   variants={biDirectionalStagger()}
 *   initial="hidden"
 *   whileInView="show"
 *   className="grid grid-cols-3 gap-4"
 * >
 *   {images.map((img, i) => (
 *     <motion.div
 *       key={img.id}
 *       variants={zoomIn(0, 0.4)}
 *       custom={Math.abs(i - images.length / 2)}
 *     >
 *       <img src={img.src} alt={img.alt} />
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const biDirectionalStagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
