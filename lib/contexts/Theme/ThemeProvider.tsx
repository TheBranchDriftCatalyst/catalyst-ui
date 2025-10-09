"use client";
import useLocalStorageState from "@/catalyst-ui/hooks/useLocalStorageState";
import { useCallback, useEffect, useMemo } from "react";
import { ThemeContext, ThemeEffects, ThemeVariant } from "./ThemeContext";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("ThemeProvider");

// Map themes to their core CSS files
// Dynamic CSS imports return Promise<void> since they're side-effect only
const themeCoreStyles: Record<string, () => Promise<void>> = {
  catalyst: () => import("./styles/catalyst.css") as Promise<void>,
  dracula: () => import("./styles/dracula.css") as Promise<void>,
  dungeon: () => import("./styles/dungeon.css") as Promise<void>,
  gold: () => import("./styles/gold.css") as Promise<void>,
  laracon: () => import("./styles/laracon.css") as Promise<void>,
  nature: () => import("./styles/nature.css") as Promise<void>,
  netflix: () => import("./styles/netflix.css") as Promise<void>,
  nord: () => import("./styles/nord.css") as Promise<void>,
};

// Import all effect layers upfront (Vite bundles CSS at build time)
import "./styles/effects/keyframes.css";
import "./styles/effects/glow.css";
import "./styles/effects/scanlines.css";
import "./styles/effects/borders.css";
import "./styles/effects/gradients.css";
import "./styles/effects/debug.css";

const defaultEffects: ThemeEffects = {
  glow: true,
  scanlines: true,
  borderAnimations: true,
  gradientShift: true,
  debug: false,
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorageState<string>("theme:name", "catalyst");
  const [variant, setVariant] = useLocalStorageState<ThemeVariant>("theme:variant", "dark");
  const [storedEffects, setStoredEffects] = useLocalStorageState<ThemeEffects>(
    "theme:effects",
    defaultEffects
  );

  // Merge stored effects with defaults to handle new properties
  const effects = { ...defaultEffects, ...storedEffects };
  const setEffects = (newEffects: ThemeEffects) => {
    setStoredEffects(newEffects);
  };

  // Update single effect
  const updateEffect = useCallback(
    (key: keyof ThemeEffects, value: boolean) => {
      setStoredEffects(prev => ({ ...prev, [key]: value }));
    },
    [setStoredEffects]
  );

  // Load core theme CSS
  useEffect(() => {
    if (theme && themeCoreStyles[theme]) {
      themeCoreStyles[theme]();
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

    // Dev-only logging
    if (import.meta.env.DEV) {
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
      allThemes: [
        "catalyst",
        "dracula",
        "dungeon",
        "gold",
        "laracon",
        "nature",
        "netflix",
        "nord",
        null,
      ],
    }),
    [theme, variant, effects, updateEffect]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
