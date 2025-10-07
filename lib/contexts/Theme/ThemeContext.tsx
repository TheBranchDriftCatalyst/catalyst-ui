"use client";
import { createContext, useContext } from "react";

export type ThemeVariant = "dark" | "light";

// TODO: lets dynamically create these from ./styles/*.css ????
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

export interface ThemeEffects {
  glow: boolean;              // Glow/shadow effects on buttons, inputs, cards
  scanlines: boolean;         // Grid/scanline overlays on body
  borderAnimations: boolean;  // Border shimmer, scan, pulse animations
  gradientShift: boolean;     // Animated gradient backgrounds and headings
  debug: boolean;             // Red outlines on all elements (for testing)
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
  effects: ThemeEffects;
  setEffects: (effects: ThemeEffects) => void;
  updateEffect: (key: keyof ThemeEffects, value: boolean) => void;
  allThemes: (string | null)[];
}

const defaultEffects: ThemeEffects = {
  glow: true,
  scanlines: true,
  borderAnimations: true,
  gradientShift: true,
  debug: false,
};

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
export const useTheme = () => useContext(ThemeContext);
