"use client";

import { useMemo, type ReactNode } from "react";
import { ThemeProvider } from "./Theme/ThemeProvider";
import { defaultEffects, type ThemeEffects, type ThemeVariant } from "./Theme/ThemeContext";

/**
 * Configuration surface for the {@link CatalystProvider} wrapper.
 *
 * All fields are optional. When present, `defaultTheme` / `defaultVariant` /
 * `defaultEffects` seed the corresponding localStorage keys ONLY when they
 * are currently unset — existing user selections are never clobbered.
 *
 * @public
 */
export interface CatalystProviderProps {
  /**
   * Optional first-run default theme name (e.g. "boomtime", "dracula").
   * Written to `theme:name` on mount if that key is unset. If a user has
   * previously chosen a theme, their choice wins.
   */
  defaultTheme?: string;
  /**
   * Optional first-run default variant. Written to `theme:variant` if
   * that key is unset. Defaults to "dark" inside ThemeProvider anyway,
   * but this lets a consumer force "light" for the initial paint.
   */
  defaultVariant?: ThemeVariant;
  /**
   * Optional partial defaults for effect toggles. Merged over
   * `defaultEffects` and written to `theme:effects` if that key is unset.
   *
   * Only the fields you specify are overridden; omitted fields fall back
   * to the library defaults (glow/scanlines/borderAnimations/gradientShift
   * ON, debug OFF).
   */
  defaultEffects?: Partial<ThemeEffects>;
  /**
   * Optional one-shot migration hook. If your app previously stored a
   * theme selection under a different key (e.g. boomtime used
   * `"boomtime-theme"` holding the raw string `"dark"` / `"light"`),
   * pass that key and the migration runs synchronously on first mount:
   *
   *   1. If the legacy value is `"dark"` or `"light"` AND `theme:variant`
   *      is unset, copy it into `theme:variant`.
   *   2. Remove the legacy key so the migration doesn't re-run.
   *
   * Safe to leave undefined — no migration attempted in that case.
   */
  legacyStorageKey?: string;
  children?: ReactNode;
}

/**
 * Read the CURRENT raw string from localStorage.
 *
 * Returns `null` if the key is missing, localStorage is unavailable
 * (SSR / private mode), or the storage access throws. Never rethrows.
 *
 * @internal
 */
function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Write a value to localStorage. Silently no-ops if the browser refuses
 * (private mode, quota exceeded, disabled cookies). Values are JSON-encoded
 * to match {@link useLocalStorageState}'s wire format.
 *
 * @internal
 */
function writeRaw(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/**
 * Remove a key from localStorage. Silently no-ops on any storage failure.
 *
 * @internal
 */
function removeRaw(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Run the one-shot legacy migration + seed defaults BEFORE ThemeProvider
 * mounts and reads its initial state. Called from a `useMemo` at the top of
 * {@link CatalystProvider} so it happens synchronously during render, before
 * any child effects fire.
 *
 * Exposed for direct unit testing.
 *
 * @internal
 */
export function seedCatalystDefaults(opts: {
  defaultTheme?: string;
  defaultVariant?: ThemeVariant;
  defaultEffects?: Partial<ThemeEffects>;
  legacyStorageKey?: string;
}): void {
  const { defaultTheme, defaultVariant, defaultEffects: effectsOverride, legacyStorageKey } = opts;

  // 1. Legacy-key migration. This runs FIRST so the migrated value can seed
  //    theme:variant before we notice the key is "unset" and write our own
  //    default over top of the migrated user preference.
  if (legacyStorageKey) {
    const legacy = readRaw(legacyStorageKey);
    // useLocalStorageState JSON-encodes on write but this legacy key was
    // written by an app that stored the raw string. Normalize accordingly.
    let normalized: string | null = null;
    if (legacy === "dark" || legacy === "light") {
      normalized = legacy;
    } else if (legacy === '"dark"' || legacy === '"light"') {
      // Already JSON-encoded — strip the outer quotes.
      normalized = legacy.slice(1, -1);
    }
    if (normalized === "dark" || normalized === "light") {
      if (readRaw("theme:variant") === null) {
        writeRaw("theme:variant", normalized);
      }
    }
    // Regardless of whether we could interpret the value, remove the legacy
    // key so we don't keep re-checking it on every mount.
    removeRaw(legacyStorageKey);
  }

  // 2. Seed defaultTheme if the key is unset. Never clobber a real user pick.
  if (defaultTheme && readRaw("theme:name") === null) {
    writeRaw("theme:name", defaultTheme);
  }

  // 3. Seed defaultVariant only if still unset after legacy migration.
  if (defaultVariant && readRaw("theme:variant") === null) {
    writeRaw("theme:variant", defaultVariant);
  }

  // 4. Seed defaultEffects if the key is unset. Merge over library defaults
  //    so consumers can specify just the toggles they care about.
  if (effectsOverride && readRaw("theme:effects") === null) {
    const merged: ThemeEffects = { ...defaultEffects, ...effectsOverride };
    writeRaw("theme:effects", merged);
  }
}

/**
 * `CatalystProvider` — one-stop wrapper that seeds first-run defaults, runs
 * an optional legacy-key migration, then mounts `ThemeProvider` from
 * `@/catalyst-ui/contexts/Theme`.
 *
 * All existing consumers of `useTheme()` continue to work unchanged; this is
 * additive over `ThemeProvider`.
 *
 * @example Basic integration (Boomtime)
 * ```tsx
 * <CatalystProvider defaultTheme="boomtime" legacyStorageKey="boomtime-theme">
 *   <App />
 * </CatalystProvider>
 * ```
 *
 * @example Force initial variant + partial effect overrides
 * ```tsx
 * <CatalystProvider
 *   defaultTheme="dracula"
 *   defaultVariant="dark"
 *   defaultEffects={{ scanlines: false, glow: true }}
 * >
 *   <App />
 * </CatalystProvider>
 * ```
 *
 * @public
 */
export const CatalystProvider = ({
  defaultTheme,
  defaultVariant,
  defaultEffects: defaultEffectsProp,
  legacyStorageKey,
  children,
}: CatalystProviderProps) => {
  // Run migration + seeding SYNCHRONOUSLY during render, before ThemeProvider
  // is instantiated below. `useMemo` guarantees this fires exactly once per
  // provider instance (not per render), and BEFORE any effects/children run,
  // so ThemeProvider's `useLocalStorageState` initializers observe the seeded
  // values on their very first read.
  useMemo(
    () =>
      seedCatalystDefaults({
        defaultTheme,
        defaultVariant,
        defaultEffects: defaultEffectsProp,
        legacyStorageKey,
      }),
    // Intentionally seed once per mount. Changing props after mount does NOT
    // rerun migration — that would risk clobbering a user's live selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <ThemeProvider>{children}</ThemeProvider>;
};

export default CatalystProvider;
