"use client"
import useLocalStorageState from "@/catalyst-ui/hooks/useLocalStorageState";
import { useEffect, useMemo } from "react";
import { ThemeContext, ThemeVariant } from "./ThemeContext";

// Dynamic theme CSS imports
const themeStyles: Record<string, () => Promise<any>> = {
  catalyst: () => import("./styles/catalyst.css"),
  dracula: () => import("./styles/dracula.css"),
  gold: () => import("./styles/gold.css"),
  laracon: () => import("./styles/laracon.css"),
  nature: () => import("./styles/nature.css"),
  netflix: () => import("./styles/netflix.css"),
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
