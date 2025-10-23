/**
 * useCalculatedThemeColors - Reactive Theme Color Calculator
 *
 * Provides calculated CSS custom property values that reactively update
 * when the theme or variant changes. Replaces manual getComputedStyle calls.
 */

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "./ThemeContext";

export interface CalculatedThemeColors {
  // Core theme colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;

  // Neon colors (synthwave)
  neonCyan: string;
  neonPink: string;
  neonPurple: string;
  neonBlue: string;
  neonRed: string;
  neonYellow: string;
  neonGold: string;

  // Chart colors (for data viz)
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
  chart7: string;
  chart8: string;
  chart9: string;
  chart10: string;
  chart11: string;
  chart12: string;

  // RGB variants (optional - calculated if needed)
  primaryRgb?: string;
  accentRgb?: string;
  neonCyanRgb?: string;
}

/**
 * Convert HSL string to RGB hex
 * @param hslValue - HSL color value (e.g., "240 100% 50%")
 * @returns RGB hex string (e.g., "#0000ff")
 */
function hslToHex(hslValue: string): string {
  // Parse HSL string (format: "h s% l%")
  const parts = hslValue.trim().split(/\s+/);
  if (parts.length !== 3) return hslValue; // Return original if parsing fails

  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Calculate all theme colors from CSS custom properties
 * @returns CalculatedThemeColors object
 */
function calculateColors(): CalculatedThemeColors {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  const getCSSColor = (varName: string): string => {
    const value = computedStyle.getPropertyValue(varName).trim();
    // If value is HSL format, convert to hex
    if (value.includes("%")) {
      return hslToHex(value);
    }
    // If value is already RGB/hex, return as-is
    return value;
  };

  return {
    // Core theme colors
    primary: getCSSColor("--primary"),
    primaryForeground: getCSSColor("--primary-foreground"),
    secondary: getCSSColor("--secondary"),
    secondaryForeground: getCSSColor("--secondary-foreground"),
    accent: getCSSColor("--accent"),
    accentForeground: getCSSColor("--accent-foreground"),
    background: getCSSColor("--background"),
    foreground: getCSSColor("--foreground"),
    muted: getCSSColor("--muted"),
    mutedForeground: getCSSColor("--muted-foreground"),
    card: getCSSColor("--card"),
    cardForeground: getCSSColor("--card-foreground"),
    border: getCSSColor("--border"),
    input: getCSSColor("--input"),
    ring: getCSSColor("--ring"),
    destructive: getCSSColor("--destructive"),
    destructiveForeground: getCSSColor("--destructive-foreground"),

    // Neon colors
    neonCyan: getCSSColor("--neon-cyan"),
    neonPink: getCSSColor("--neon-pink"),
    neonPurple: getCSSColor("--neon-purple"),
    neonBlue: getCSSColor("--neon-blue"),
    neonRed: getCSSColor("--neon-red"),
    neonYellow: getCSSColor("--neon-yellow"),
    neonGold: getCSSColor("--neon-gold"),

    // Chart colors
    chart1: getCSSColor("--chart-1"),
    chart2: getCSSColor("--chart-2"),
    chart3: getCSSColor("--chart-3"),
    chart4: getCSSColor("--chart-4"),
    chart5: getCSSColor("--chart-5"),
    chart6: getCSSColor("--chart-6"),
    chart7: getCSSColor("--chart-7"),
    chart8: getCSSColor("--chart-8"),
    chart9: getCSSColor("--chart-9"),
    chart10: getCSSColor("--chart-10"),
    chart11: getCSSColor("--chart-11"),
    chart12: getCSSColor("--chart-12"),

    // RGB variants (optional - can be calculated on demand)
    primaryRgb: getCSSColor("--primary-rgb"),
    accentRgb: getCSSColor("--accent-rgb"),
    neonCyanRgb: getCSSColor("--neon-cyan-rgb"),
  };
}

/**
 * Hook to get calculated theme colors that reactively update
 * when theme or variant changes.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const colors = useCalculatedThemeColors();
 *   return <div style={{ color: colors.primary }}>Hello</div>;
 * }
 * ```
 */
export function useCalculatedThemeColors(): CalculatedThemeColors {
  const { theme, variant } = useTheme();
  const [colors, setColors] = useState<CalculatedThemeColors>(calculateColors);

  useEffect(() => {
    // Recalculate colors when theme or variant changes
    setColors(calculateColors());
  }, [theme, variant]);

  // Memoize the colors object to prevent new reference unless values actually change
  return useMemo(
    () => colors,
    [
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.neonCyan,
      colors.neonPink,
      colors.neonPurple,
      colors.neonBlue,
      colors.neonRed,
      colors.neonYellow,
      colors.neonGold,
      colors.chart1,
      colors.chart2,
      colors.chart3,
      colors.chart4,
      colors.chart5,
      colors.chart6,
    ]
  );
}
