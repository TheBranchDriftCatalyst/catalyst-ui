/**
 * Single-source theme registry.
 *
 * This is the canonical list of themes available in catalyst-ui. All consumers
 * (ThemeContext.THEMES, ThemeProvider.allThemes, .storybook/preview.tsx toolbar,
 * DesignTokens.stories.tsx, JsonTreeViewDemo) MUST derive from this registry —
 * do not hardcode theme names elsewhere.
 *
 * To add a new theme:
 *   1. Drop a `<name>.css` in lib/contexts/Theme/styles/ defining
 *      `.theme-<name>.light` and `.theme-<name>.dark` selectors.
 *   2. Add an entry below.
 *   3. (Optional) Add `@import "./contexts/Theme/styles/<name>.css";` in
 *      lib/global.css if the theme should be eagerly bundled into the global
 *      stylesheet — otherwise consumers can use `cssLoader()` to lazily
 *      inject it.
 *
 * The CSS source-of-truth lives at `lib/contexts/Theme/styles/`. There is NO
 * `lib/themes/` directory; if you see references to one in old docs/issues,
 * that path was never canonical.
 */

export type ThemeVariant = "dark" | "light";

export interface ThemeRegistryEntry {
  /** Stable identifier used in the `.theme-<name>` CSS class and localStorage. */
  readonly name: string;
  /** Human-readable display label (used in toolbars, dropdowns, story grids). */
  readonly label: string;
  /** Variants the theme defines. All current themes support both. */
  readonly variants: readonly ThemeVariant[];
  /**
   * Lazy loader returning the theme's CSS as an inline string.
   * Uses Vite's `?inline` query so consumers can choose between bundling
   * (via @import in global.css) and runtime injection.
   *
   * Each loader is wrapped in a function so the import is deferred — calling
   * `cssLoader()` resolves to the CSS text.
   */
  readonly cssLoader: () => Promise<string>;
}

export const THEME_REGISTRY = [
  {
    name: "catalyst",
    label: "Catalyst",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/catalyst.css?inline").then(m => m.default),
  },
  {
    name: "dracula",
    label: "Dracula",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/dracula.css?inline").then(m => m.default),
  },
  {
    name: "gold",
    label: "Gold",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/gold.css?inline").then(m => m.default),
  },
  {
    name: "laracon",
    label: "Laracon",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/laracon.css?inline").then(m => m.default),
  },
  {
    name: "nature",
    label: "Nature",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/nature.css?inline").then(m => m.default),
  },
  {
    name: "netflix",
    label: "Netflix",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/netflix.css?inline").then(m => m.default),
  },
  {
    name: "nord",
    label: "Nord",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/nord.css?inline").then(m => m.default),
  },
  {
    name: "dungeon",
    label: "Dungeon",
    variants: ["dark", "light"] as const,
    cssLoader: () => import("./styles/dungeon.css?inline").then(m => m.default),
  },
] as const satisfies readonly ThemeRegistryEntry[];

export type RegisteredThemeName = (typeof THEME_REGISTRY)[number]["name"];

/** Derived: just the canonical theme names, in registry order. */
export const THEME_NAMES: readonly RegisteredThemeName[] = THEME_REGISTRY.map(t => t.name);

/** Derived: name → entry lookup. */
export const THEME_REGISTRY_BY_NAME: Readonly<Record<string, ThemeRegistryEntry>> = Object.freeze(
  THEME_REGISTRY.reduce<Record<string, ThemeRegistryEntry>>((acc, t) => {
    acc[t.name] = t;
    return acc;
  }, {})
);

/** Default variant when none is set. */
export const DEFAULT_VARIANT: ThemeVariant = "dark";

/** Default theme name when none is set. */
export const DEFAULT_THEME_NAME: RegisteredThemeName = "catalyst";
