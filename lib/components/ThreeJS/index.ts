/**
 * ThreeJS Components - Barrel Export
 *
 * Exports all Three.js visualization components, hooks, and utilities.
 */

// Core Canvas Components
export { ThreeCanvas } from "./ThreeCanvas";
export type { ThreeCanvasProps } from "./ThreeCanvas";

export { CanvasLoader } from "./CanvasLoader";
export type { CanvasLoaderProps } from "./CanvasLoader";

// 3D Models
export { DesktopPCModel } from "./DesktopPCModel";
export type { DesktopPCModelProps } from "./DesktopPCModel";

export { PlanetModel } from "./PlanetModel";
export type { PlanetModelProps } from "./PlanetModel";

export { StarsBackground } from "./StarsBackground";
export type { StarsBackgroundProps } from "./StarsBackground";

export { FloatingBall } from "./FloatingBall";
export type { FloatingBallProps } from "./FloatingBall";

// Showcase
export { ModelShowcase } from "./ModelShowcase";
export type { ModelShowcaseProps, ModelType } from "./ModelShowcase";

// Hooks
export { useResponsiveCanvas } from "./hooks/useResponsiveCanvas";
export type { ResponsiveCanvasState } from "./hooks/useResponsiveCanvas";

// Utils
export { textVariant, fadeIn, zoomIn, slideIn, staggerContainer } from "./utils/motion";
