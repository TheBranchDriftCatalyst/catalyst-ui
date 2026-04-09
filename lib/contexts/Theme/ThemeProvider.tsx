"use client";
import useLocalStorageState from "@/catalyst-ui/hooks/useLocalStorageState";
import { useCallback, useEffect, useMemo } from "react";
import { THEMES, ThemeContext, ThemeEffects, ThemeVariant, defaultEffects } from "./ThemeContext";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("ThemeProvider");

/**
 * Map of theme names to their CSS content (loaded as inline strings).
 *
 * @remarks
 * Uses `?inline` imports so Vite embeds CSS as JS strings in the bundle
 * instead of side-effect imports (which get stripped to `/* empty css *\/`
 * in library builds). Only the active theme's CSS is injected into the DOM.
 *
 * @internal
 */
const themeCoreStyles: Record<string, () => Promise<{ default: string }>> = {
  catalyst: () => import("./styles/catalyst.css?inline"),
  dracula: () => import("./styles/dracula.css?inline"),
  dungeon: () => import("./styles/dungeon.css?inline"),
  gold: () => import("./styles/gold.css?inline"),
  laracon: () => import("./styles/laracon.css?inline"),
  nature: () => import("./styles/nature.css?inline"),
  netflix: () => import("./styles/netflix.css?inline"),
  nord: () => import("./styles/nord.css?inline"),
};

const THEME_STYLE_ID = "catalyst-ui-theme";

/**
 * Inject CSS text into a <style> tag in <head>, replacing any previous theme.
 * @internal
 */
function injectThemeCSS(css: string) {
  let el = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = THEME_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

// Effect layers — always loaded (controlled via data attributes, not dynamic)
import "./styles/effects/keyframes.css";
import "./styles/effects/glow.css";
import "./styles/effects/scanlines.css";
import "./styles/effects/borders.css";
import "./styles/effects/gradients.css";
import "./styles/effects/debug.css";

/**
 * Theme provider component - manages theming state and CSS injection
 *
 * @param props - Component props
 * @param props.children - Child components to render
 *
 * @remarks
 * This provider should wrap your entire application (typically in `App.tsx`).
 * It provides:
 * - Theme selection (catalyst, dracula, nord, etc.)
 * - Variant toggling (light/dark mode)
 * - Visual effect controls (glow, scanlines, borders, gradients)
 * - LocalStorage persistence for all settings
 * - Dynamic CSS loading via Vite code-splitting
 *
 * **How it works:**
 * 1. Loads theme/variant/effects from localStorage on mount
 * 2. Applies className to `<html>`: `theme-{name} {variant}`
 * 3. Sets data attributes for effects: `data-effect-*="true|false"`
 * 4. Dynamically imports theme CSS when theme changes
 * 5. Effect CSS is always loaded (controlled via data attributes)
 *
 * **LocalStorage keys:**
 * - `theme:name` - Current theme name (default: "catalyst")
 * - `theme:variant` - Current variant (default: "dark")
 * - `theme:effects` - Effect toggles object
 *
 * @example Basic Setup
 * ```tsx
 * // App.tsx
 * import { ThemeProvider } from '@/catalyst-ui/contexts/Theme';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example With Multiple Providers
 * ```tsx
 * import { ThemeProvider } from '@/catalyst-ui/contexts/Theme';
 * import { DebuggerProvider } from '@/catalyst-ui/contexts/Debug';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <DebuggerProvider>
 *         <YourApp />
 *       </DebuggerProvider>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example Consumer Component
 * ```tsx
 * import { useTheme } from '@/catalyst-ui/contexts/Theme';
 *
 * function ThemedComponent() {
 *   const { theme, variant, effects } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Theme: {theme}</p>
 *       <p>Variant: {variant}</p>
 *       <p>Glow: {effects.glow ? 'On' : 'Off'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorageState<string>("theme:name", "catalyst");
  const [variant, setVariant] = useLocalStorageState<ThemeVariant>("theme:variant", "dark");
  const [storedEffects, setStoredEffects] = useLocalStorageState<ThemeEffects>(
    "theme:effects",
    defaultEffects
  );

  // Merge stored effects with defaults to handle new properties
  // Use useMemo to prevent creating new object on every render
  const effects = useMemo(() => ({ ...defaultEffects, ...storedEffects }), [storedEffects]);
  const setEffects = useCallback(
    (newEffects: ThemeEffects) => {
      setStoredEffects(newEffects);
    },
    [setStoredEffects]
  );

  // Update single effect
  const updateEffect = useCallback(
    (key: keyof ThemeEffects, value: boolean) => {
      setStoredEffects(prev => ({ ...prev, [key]: value }));
    },
    [setStoredEffects]
  );

  // Load core theme CSS — dynamically imports CSS as string, injects into <style>
  useEffect(() => {
    if (theme && themeCoreStyles[theme]) {
      themeCoreStyles[theme]().then(mod => {
        injectThemeCSS(mod.default);
      });
    }
  }, [theme]);

  // Apply theme classes and effect data attributes to document element
  useEffect(() => {
    document.documentElement.className = `theme-${theme} ${variant}`;

    // Set data attributes for each effect (used by effect CSS selectors)
    document.documentElement.dataset.effectGlow = effects.glow.toString();
    document.documentElement.dataset.effectScanlines = effects.scanlines.toString();
    document.documentElement.dataset.effectBorderAnimations = effects.borderAnimations.toString();
    document.documentElement.dataset.effectGradientShift = effects.gradientShift.toString();
    document.documentElement.dataset.effectDebug = effects.debug.toString();

    // Dev-only logging (framework-agnostic: supports both Vite and Next.js)
    const isDev =
      (typeof process !== "undefined" && process.env?.NODE_ENV === "development") ||
      (typeof import.meta !== "undefined" && import.meta.env?.DEV);
    if (isDev) {
      log.debug("Applied:", {
        theme,
        variant,
        effects,
        dataAttributes: {
          glow: document.documentElement.dataset.effectGlow,
          scanlines: document.documentElement.dataset.effectScanlines,
          borderAnimations: document.documentElement.dataset.effectBorderAnimations,
          gradientShift: document.documentElement.dataset.effectGradientShift,
          debug: document.documentElement.dataset.effectDebug,
        },
      });
    }
  }, [theme, variant, effects]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      variant,
      setVariant,
      effects,
      setEffects,
      updateEffect,
      allThemes: THEMES,
    }),
    [theme, variant, effects, updateEffect]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
