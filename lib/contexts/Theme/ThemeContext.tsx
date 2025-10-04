"use client";
import { createContext, useContext } from "react";

export type ThemeVariant = "dark" | "light";

// TODO: lets dynamically create these from ./styles/*.css ????
export const THEMES = [
  "dracula",
  "gold",
  "laracon",
  "nature",
  "netflix",
  "nord",
  null,
];

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
  allThemes: (string | null)[];
}
export const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  variant: "dark",
  setTheme: () => {},
  setVariant: () => {},
  allThemes: THEMES,
});
export default ThemeContext;
export const useTheme = () => useContext(ThemeContext);
