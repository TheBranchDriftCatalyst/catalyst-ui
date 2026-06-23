/**
 * useCalculatedThemeColors integration test.
 *
 * Asserts that for every theme × variant combo, the calculated
 * primaryRgb and accentRgb values returned by the hook are non-empty.
 *
 * Strategy: Read each real theme CSS file from disk, inject it into the
 * jsdom <head>, apply the matching `theme-X` + variant classes to
 * <html>, then render a tiny consumer of the hook and assert the
 * exposed primaryRgb/accentRgb. This exercises the SAME code path
 * production uses (getComputedStyle on document.documentElement),
 * just without spinning up Storybook.
 *
 * Why this matters: useCalculatedThemeColors.ts:155-156 reads
 * --primary-rgb and --accent-rgb. If a theme forgets to declare them,
 * the returned value is an empty string and downstream consumers
 * (ForceGraph, charts) break silently.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { renderHook, cleanup } from "@testing-library/react";
import React from "react";
// NOTE: we intentionally DO NOT import ThemeProvider here.
// ThemeProvider eagerly imports several effect CSS files (which transitively
// process Tailwind via Vite's CSS pipeline). For this unit test we only need
// to verify that the hook reads --primary-rgb / --accent-rgb / --chart-*
// from the document's computed styles — which the default ThemeContext
// supports out of the box without a real Provider.
import { ThemeContext, defaultEffects, THEMES, type ThemeVariant } from "../ThemeContext";
import { useCalculatedThemeColors } from "../useCalculatedThemeColors";

const STYLES_DIR = path.resolve(__dirname, "../styles");
const STYLE_ID = "test-theme-css";

function getThemeFiles() {
  return readdirSync(STYLES_DIR)
    .filter(f => f.endsWith(".css"))
    .sort();
}

/** Pull theme name out of "catalyst.css" → "catalyst". */
function themeNameFromFile(filename: string): string {
  return filename.replace(/\.css$/, "");
}

/**
 * Inject a theme CSS string into the jsdom <head> and toggle the
 * matching theme class on <html>. jsdom DOES support custom properties
 * via getComputedStyle, so the hook can read them back.
 */
function applyTheme(themeName: string, variant: "light" | "dark", css: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
  document.documentElement.className = `theme-${themeName} ${variant}`;
}

function removeTheme() {
  const el = document.getElementById(STYLE_ID);
  if (el) el.remove();
  document.documentElement.className = "";
}

/**
 * Build a ThemeContext.Provider that supplies the requested theme + variant
 * so useCalculatedThemeColors's useEffect runs with the right dependencies.
 * The actual CSS-variable resolution happens in the DOM, NOT through
 * context values — context just drives recalculation triggers.
 */
function makeWrapper(themeName: string, variant: ThemeVariant) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeContext.Provider
        value={{
          theme: themeName,
          variant,
          effects: defaultEffects,
          setTheme: () => {},
          setVariant: () => {},
          setEffects: () => {},
          updateEffect: () => {},
          allThemes: THEMES,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
}

describe("useCalculatedThemeColors - primaryRgb/accentRgb populated per theme", () => {
  const themeFiles = getThemeFiles();

  beforeEach(() => {
    removeTheme();
  });

  afterEach(() => {
    cleanup();
    removeTheme();
  });

  for (const filename of themeFiles) {
    const themeName = themeNameFromFile(filename);
    const css = readFileSync(path.join(STYLES_DIR, filename), "utf8");

    for (const variant of ["light", "dark"] as const) {
      it(`${themeName} ${variant}: primaryRgb is non-empty`, () => {
        applyTheme(themeName, variant, css);
        const { result } = renderHook(() => useCalculatedThemeColors(), {
          wrapper: makeWrapper(themeName, variant),
        });
        // jsdom returns CSS variable values via getComputedStyle on
        // documentElement. Empty string means the variable is undefined.
        expect(result.current.primaryRgb, `primaryRgb for ${themeName}.${variant}`).toBeTruthy();
        expect(result.current.primaryRgb).not.toBe("");
      });

      it(`${themeName} ${variant}: accentRgb is non-empty`, () => {
        applyTheme(themeName, variant, css);
        const { result } = renderHook(() => useCalculatedThemeColors(), {
          wrapper: makeWrapper(themeName, variant),
        });
        expect(result.current.accentRgb, `accentRgb for ${themeName}.${variant}`).toBeTruthy();
        expect(result.current.accentRgb).not.toBe("");
      });

      it(`${themeName} ${variant}: chart-1 through chart-12 are all non-empty`, () => {
        applyTheme(themeName, variant, css);
        const { result } = renderHook(() => useCalculatedThemeColors(), {
          wrapper: makeWrapper(themeName, variant),
        });
        const chartColors = [
          result.current.chart1,
          result.current.chart2,
          result.current.chart3,
          result.current.chart4,
          result.current.chart5,
          result.current.chart6,
          result.current.chart7,
          result.current.chart8,
          result.current.chart9,
          result.current.chart10,
          result.current.chart11,
          result.current.chart12,
        ];
        const empties = chartColors
          .map((c, i) => ({ idx: i + 1, value: c }))
          .filter(x => !x.value || x.value === "");
        expect(
          empties,
          `Empty chart colors in ${themeName}.${variant}: ${JSON.stringify(empties)}`
        ).toEqual([]);
      });
    }
  }
});
