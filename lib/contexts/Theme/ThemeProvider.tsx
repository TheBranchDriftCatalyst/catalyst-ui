"use client"
import useLocalStorageState from "@/catalyst-ui/hooks/useLocalStorageState";
import { useEffect, useMemo } from "react";
import { ThemeContext, ThemeVariant } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorageState<string>(
    "theme:name",
    "catalyst",
  );
  const [variant, setVariant] = useLocalStorageState<ThemeVariant>(
    "theme:variant",
    "dark",
  );

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
