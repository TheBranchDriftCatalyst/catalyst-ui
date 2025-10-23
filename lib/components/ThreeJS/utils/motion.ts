/**
 * Motion Utils - Framer Motion Animation Variants
 *
 * @deprecated Use centralized variants from @/catalyst-ui/effects/variants instead.
 * This file re-exports from the centralized library for backward compatibility.
 *
 * Migration:
 * - Old: import { fadeIn } from "@/catalyst-ui/components/ThreeJS/utils/motion"
 * - New: import { fadeIn } from "@/catalyst-ui/effects/variants"
 */

// Re-export from centralized variants library
export {
  textVariant,
  fadeIn,
  zoomIn,
  slideIn,
  staggerContainer,
} from "@/catalyst-ui/effects/variants";
export type { Variants } from "framer-motion";
