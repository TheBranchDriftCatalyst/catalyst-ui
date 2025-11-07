/**
 * HeroScene - Composed 3D scene for WelcomeTab
 *
 * Combines StarsBackground and DesktopPCModel in a single scene
 * while maintaining separation of concerns.
 */

import React, { useMemo } from "react";
import { StarsBackground, DesktopPCModel } from "@/catalyst-ui/components/ThreeJS";
import { useCalculatedThemeColors } from "@/catalyst-ui/contexts/Theme";

/**
 * Generate gradient color palette between two colors
 */
function generateGradient(color1: string, color2: string, steps: number = 10): string[] {
  const parseColor = (color: string) => {
    if (color.startsWith("#")) {
      const clean = color.replace("#", "");
      return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16),
      };
    }
    console.warn("[HeroScene] Invalid color format:", color);
    return { r: 242, g: 114, b: 200 };
  };

  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  const gradient: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    gradient.push(hex);
  }

  return gradient;
}

export interface HeroSceneProps {
  /** Number of stars (default: 5000) */
  starCount?: number;
  /** Star size (default: 0.3) */
  starSize?: number;
  /** Stars sphere radius (default: 50) */
  starRadius?: number;
  /** Enable desktop model controls (default: false) */
  enableControls?: boolean;
}

/**
 * HeroScene Component
 *
 * Renders stars background and desktop PC model in a unified scene.
 * Stars use theme gradient colors and are clickable for supernova effects.
 */
export function HeroScene({ enableControls = false }: HeroSceneProps) {
  const themeColors = useCalculatedThemeColors();

  return (
    <>
      <DesktopPCModel enableControls={enableControls} />
    </>
  );
}
