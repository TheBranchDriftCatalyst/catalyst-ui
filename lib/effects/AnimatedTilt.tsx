import React from "react";
import { Tilt, TiltProps } from "@jdion/tilt-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * AnimatedTilt - 3D tilt effect that respects user's motion preferences
 *
 * A wrapper around @jdion/tilt-react that automatically disables tilt animations
 * when the user has `prefers-reduced-motion` enabled. This ensures the component
 * is accessible to users with vestibular disorders or motion sensitivity.
 *
 * @param enabled - Whether tilt is enabled (default: true). When false, children render without tilt.
 * @param children - The content to wrap with tilt effect
 * @param ...tiltProps - All standard Tilt component props (tiltMaxAngleX, tiltMaxAngleY, scale, etc.)
 *
 * @example
 * ```tsx
 * <AnimatedTilt tiltMaxAngleX={20} tiltMaxAngleY={20} scale={1.05}>
 *   <Card>Content</Card>
 * </AnimatedTilt>
 * ```
 *
 * @example Conditionally enable/disable
 * ```tsx
 * <AnimatedTilt enabled={!isMobile} tiltMaxAngleX={10} tiltMaxAngleY={10}>
 *   <Card>Content</Card>
 * </AnimatedTilt>
 * ```
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
 */
export interface AnimatedTiltProps extends Omit<TiltProps, "children"> {
  enabled?: boolean;
  children: React.ReactNode;
}

export const AnimatedTilt: React.FC<AnimatedTiltProps> = ({
  enabled = true,
  children,
  ...tiltProps
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Disable tilt if:
  // 1. Explicitly disabled via `enabled` prop
  // 2. User prefers reduced motion
  const shouldEnableTilt = enabled && !prefersReducedMotion;

  if (!shouldEnableTilt) {
    // Render children directly without tilt wrapper
    return <>{children}</>;
  }

  return <Tilt {...tiltProps}>{children}</Tilt>;
};

export default AnimatedTilt;
