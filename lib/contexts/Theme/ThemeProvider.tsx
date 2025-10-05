"use client"
import useLocalStorageState from "@/catalyst-ui/hooks/useLocalStorageState";
import { useEffect, useMemo } from "react";
import { ThemeContext, ThemeVariant } from "./ThemeContext";

// Dynamic theme CSS imports
const themeStyles: Record<string, () => Promise<any>> = {
  // @ts-ignore - Vite handles CSS imports
  catalyst: () => import("./styles/catalyst.css"),
  // @ts-ignore - Vite handles CSS imports
  dracula: () => import("./styles/dracula.css"),
  // @ts-ignore - Vite handles CSS imports
  dungeon: () => import("./styles/dungeon.css"),
  // @ts-ignore - Vite handles CSS imports
  gold: () => import("./styles/gold.css"),
  // @ts-ignore - Vite handles CSS imports
  laracon: () => import("./styles/laracon.css"),
  // @ts-ignore - Vite handles CSS imports
  nature: () => import("./styles/nature.css"),
  // @ts-ignore - Vite handles CSS imports
  netflix: () => import("./styles/netflix.css"),
  // @ts-ignore - Vite handles CSS imports
  nord: () => import("./styles/nord.css"),
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorageState<string>(
    "theme:name",
    "catalyst",
  );
  const [variant, setVariant] = useLocalStorageState<ThemeVariant>(
    "theme:variant",
    "dark",
  );

  // Dynamically load theme CSS
  useEffect(() => {
    if (theme && themeStyles[theme]) {
      themeStyles[theme]();
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.className = `theme-${theme} ${variant}`;
  }, [theme, variant]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      variant,
      setVariant,
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
    [theme, variant],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
