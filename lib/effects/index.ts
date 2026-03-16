// 🎯 RECOMMENDED: Unified animation interface (auto-selects CSS or Motion)
export * from "./Animate";

// CSS-based animation HOCs (for explicit control)
export * from "./AnimatedFlip";
export * from "./AnimatedFade";
export * from "./AnimatedSlide";
export * from "./AnimatedBounce";
export * from "./AnimatedTilt";
export * from "./ScrollSnapContainer";
export * from "./ScrollSnapItem";

// Framer Motion components (import directly for tree-shaking):
//   import { MotionFade } from "@/catalyst-ui/effects/MotionFade";
//   import { MotionScale } from "@/catalyst-ui/effects/MotionScale";
//   import { variants } from "@/catalyst-ui/effects/variants";

// Types
export * from "./types";
