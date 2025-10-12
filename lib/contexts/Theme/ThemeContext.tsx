"use client";
import { createContext, useContext } from "react";

/**
 * Theme variant type - controls light/dark mode
 * @public
 */
export type ThemeVariant = "dark" | "light";

/**
 * Available theme names in catalyst-ui
 * - catalyst: Cyberpunk/synthwave theme (default)
 * - dracula: Dark purple vampire theme
 * - dungeon: Fantasy dungeon theme
 * - gold: Luxury gold theme
 * - laracon: Laravel conference theme
 * - nature: Earth tones nature theme
 * - netflix: Netflix-inspired theme
 * - nord: Nordic minimalist theme
 * - null: No theme applied (browser defaults)
 *
 * @remarks
 * Each theme has a corresponding CSS file in `./styles/*.css`
 * TODO: Dynamically create this list from ./styles/*.css files
 * @public
 */
export const THEMES = [
  "catalyst",
  "dracula",
  "dungeon",
  "gold",
  "laracon",
  "nature",
  "netflix",
  "nord",
  null,
];

/**
 * Visual effect toggles for themes
 *
 * @remarks
 * Effects are controlled via data attributes on `<html>` element:
 * - `data-effect-glow="true"`
 * - `data-effect-scanlines="true"`
 * - `data-effect-border-animations="true"`
 * - `data-effect-gradient-shift="true"`
 * - `data-effect-debug="true"`
 *
 * Effect CSS is loaded from `./styles/effects/*.css`
 *
 * @public
 */
export interface ThemeEffects {
  /**
   * Enable glow/shadow effects on interactive elements
   * - Adds neon-style box-shadow to buttons
   * - Adds subtle glow to inputs and cards
   * - Powered by `effects/glow.css`
   */
  glow: boolean;

  /**
   * Enable CRT scanline overlays on the page
   * - Adds subtle grid/scanline texture to body
   * - Creates retro terminal aesthetic
   * - Powered by `effects/scanlines.css`
   */
  scanlines: boolean;

  /**
   * Enable animated border effects
   * - Border shimmer on cards
   * - Scan line animations on panels
   * - Pulse effects on focused elements
   * - Powered by `effects/borders.css`
   */
  borderAnimations: boolean;

  /**
   * Enable animated gradient backgrounds
   * - Gradient shift on headings
   * - Color-changing backgrounds on hero sections
   * - Powered by `effects/gradients.css`
   */
  gradientShift: boolean;

  /**
   * Enable debug mode (development only)
   * - Adds red outlines to all elements
   * - Helps visualize layout and spacing
   * - Powered by `effects/debug.css`
   */
  debug: boolean;
}

/**
 * Theme context shape for catalyst-ui theming system
 *
 * @remarks
 * Provides complete control over visual theming including:
 * - Theme selection (catalyst, dracula, nord, etc.)
 * - Variant (light/dark mode)
 * - Visual effects (glow, scanlines, borders, gradients)
 * - LocalStorage persistence for all settings
 *
 * Theme state is persisted to localStorage:
 * - `theme:name` - Current theme name
 * - `theme:variant` - Current variant (light/dark)
 * - `theme:effects` - Effect toggles
 *
 * @public
 */
export interface ThemeContextType {
  /**
   * Current theme name (e.g., "catalyst", "dracula", "nord")
   */
  theme: string;

  /**
   * Change the active theme
   * @param theme - Theme name from THEMES array
   */
  setTheme: (theme: string) => void;

  /**
   * Current theme variant (light or dark)
   */
  variant: ThemeVariant;

  /**
   * Change the theme variant
   * @param variant - "light" or "dark"
   */
  setVariant: (variant: ThemeVariant) => void;

  /**
   * Current visual effects configuration
   */
  effects: ThemeEffects;

  /**
   * Replace all effect settings
   * @param effects - Complete ThemeEffects object
   */
  setEffects: (effects: ThemeEffects) => void;

  /**
   * Update a single effect setting
   * @param key - Effect name to update
   * @param value - New boolean value
   */
  updateEffect: (key: keyof ThemeEffects, value: boolean) => void;

  /**
   * List of all available theme names
   */
  allThemes: (string | null)[];
}

/**
 * Default theme effects configuration
 * All effects enabled except debug mode
 * @internal
 */
const defaultEffects: ThemeEffects = {
  glow: true,
  scanlines: true,
  borderAnimations: true,
  gradientShift: true,
  debug: false,
};

/**
 * React context for theme management
 *
 * @remarks
 * This context should be consumed via the {@link useTheme} hook.
 * Do not use `useContext(ThemeContext)` directly.
 *
 * @example
 * ```tsx
 * import { useTheme } from '@/catalyst-ui/contexts/Theme';
 *
 * function MyComponent() {
 *   const { theme, setTheme, variant, effects } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme('dracula')}>
 *         Switch to Dracula
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export const ThemeContext = createContext<ThemeContextType>({
  theme: "catalyst",
  variant: "dark",
  effects: defaultEffects,
  setTheme: () => {},
  setVariant: () => {},
  setEffects: () => {},
  updateEffect: () => {},
  allThemes: THEMES,
});

export default ThemeContext;

/**
 * Hook to access theme context
 *
 * @returns ThemeContextType with theme state and setters
 *
 * @remarks
 * Must be used within a {@link ThemeProvider}
 *
 * @example Basic Usage
 * ```tsx
 * import { useTheme } from '@/catalyst-ui/contexts/Theme';
 *
 * function ThemeSwitcher() {
 *   const { theme, setTheme, allThemes } = useTheme();
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *       {allThemes.filter(Boolean).map((t) => (
 *         <option key={t} value={t}>{t}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 *
 * @example Toggle Dark Mode
 * ```tsx
 * import { useTheme } from '@/catalyst-ui/contexts/Theme';
 *
 * function DarkModeToggle() {
 *   const { variant, setVariant } = useTheme();
 *
 *   return (
 *     <button onClick={() => setVariant(variant === 'dark' ? 'light' : 'dark')}>
 *       {variant === 'dark' ? '🌙' : '☀️'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Toggle Effects
 * ```tsx
 * import { useTheme } from '@/catalyst-ui/contexts/Theme';
 *
 * function EffectsPanel() {
 *   const { effects, updateEffect } = useTheme();
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={effects.glow}
 *           onChange={(e) => updateEffect('glow', e.target.checked)}
 *         />
 *         Glow Effects
 *       </label>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={effects.scanlines}
 *           onChange={(e) => updateEffect('scanlines', e.target.checked)}
 *         />
 *         Scanlines
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export const useTheme = () => useContext(ThemeContext);
