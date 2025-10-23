/**
 * Motion Variants - Centralized Framer Motion animation variants
 *
 * Pre-built animation variants for consistent motion design.
 * All variants follow the hidden/show pattern for consistency.
 */

// Text animations
export { textVariant, textFadeIn, textSlideUp, textGradientShimmer } from "./text";

// Fade animations
export { fadeIn, fadeOut, simpleFade, fadeInStagger } from "./fade";

// Slide animations
export { slideIn, slideOut, slideFromBottom } from "./slide";

// Scale animations
export { zoomIn, zoomOut, scaleSpring, pulseScale, popIn } from "./scale";

// Stagger animations
export {
  staggerContainer,
  staggerFast,
  staggerSlow,
  reverseStagger,
  biDirectionalStagger,
} from "./stagger";

// Type exports
export type { Variants } from "framer-motion";
