/**
 * Unit tests for CatalystProvider — focus on the seed/migration logic that
 * runs BEFORE ThemeProvider mounts. The migration is the only novel behavior
 * over ThemeProvider itself, so we exercise it directly via the exported
 * `seedCatalystDefaults` helper AND end-to-end by rendering CatalystProvider.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { CatalystProvider, seedCatalystDefaults } from "./CatalystProvider";
import { defaultEffects } from "./Theme/ThemeContext";

function clearThemeKeys() {
  window.localStorage.removeItem("theme:name");
  window.localStorage.removeItem("theme:variant");
  window.localStorage.removeItem("theme:effects");
  window.localStorage.removeItem("boomtime-theme");
  window.localStorage.removeItem("legacy-key");
}

describe("seedCatalystDefaults", () => {
  beforeEach(() => {
    clearThemeKeys();
  });

  afterEach(() => {
    clearThemeKeys();
  });

  it("writes defaultTheme when theme:name is unset", () => {
    seedCatalystDefaults({ defaultTheme: "boomtime" });
    expect(window.localStorage.getItem("theme:name")).toBe(JSON.stringify("boomtime"));
  });

  it("does NOT clobber an existing theme:name", () => {
    window.localStorage.setItem("theme:name", JSON.stringify("dracula"));
    seedCatalystDefaults({ defaultTheme: "boomtime" });
    expect(window.localStorage.getItem("theme:name")).toBe(JSON.stringify("dracula"));
  });

  it("writes defaultVariant when theme:variant is unset", () => {
    seedCatalystDefaults({ defaultVariant: "light" });
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
  });

  it("does NOT clobber an existing theme:variant", () => {
    window.localStorage.setItem("theme:variant", JSON.stringify("dark"));
    seedCatalystDefaults({ defaultVariant: "light" });
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("dark"));
  });

  it("merges defaultEffects over library defaults when theme:effects is unset", () => {
    seedCatalystDefaults({ defaultEffects: { scanlines: false } });
    const raw = window.localStorage.getItem("theme:effects");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    // Explicitly overridden
    expect(parsed.scanlines).toBe(false);
    // Preserved from library defaults
    expect(parsed.glow).toBe(defaultEffects.glow);
    expect(parsed.borderAnimations).toBe(defaultEffects.borderAnimations);
    expect(parsed.gradientShift).toBe(defaultEffects.gradientShift);
    expect(parsed.debug).toBe(defaultEffects.debug);
  });

  it("does NOT clobber existing theme:effects", () => {
    const existing = { ...defaultEffects, scanlines: false, glow: false };
    window.localStorage.setItem("theme:effects", JSON.stringify(existing));
    seedCatalystDefaults({ defaultEffects: { scanlines: true, glow: true } });
    const parsed = JSON.parse(window.localStorage.getItem("theme:effects")!);
    expect(parsed.scanlines).toBe(false);
    expect(parsed.glow).toBe(false);
  });

  it("migrates raw-string legacy value 'dark' into theme:variant", () => {
    window.localStorage.setItem("boomtime-theme", "dark");
    seedCatalystDefaults({ legacyStorageKey: "boomtime-theme" });
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("dark"));
    // legacy key is removed after migration
    expect(window.localStorage.getItem("boomtime-theme")).toBeNull();
  });

  it("migrates raw-string legacy value 'light' into theme:variant", () => {
    window.localStorage.setItem("boomtime-theme", "light");
    seedCatalystDefaults({ legacyStorageKey: "boomtime-theme" });
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
    expect(window.localStorage.getItem("boomtime-theme")).toBeNull();
  });

  it("migrates JSON-encoded legacy value into theme:variant", () => {
    window.localStorage.setItem("boomtime-theme", '"light"');
    seedCatalystDefaults({ legacyStorageKey: "boomtime-theme" });
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
  });

  it("ignores malformed legacy values but STILL removes the legacy key", () => {
    window.localStorage.setItem("boomtime-theme", "system");
    seedCatalystDefaults({ legacyStorageKey: "boomtime-theme" });
    expect(window.localStorage.getItem("theme:variant")).toBeNull();
    // Still cleaned up so we don't inspect it on every future mount
    expect(window.localStorage.getItem("boomtime-theme")).toBeNull();
  });

  it("does NOT overwrite an existing theme:variant during legacy migration", () => {
    window.localStorage.setItem("theme:variant", JSON.stringify("light"));
    window.localStorage.setItem("boomtime-theme", "dark");
    seedCatalystDefaults({ legacyStorageKey: "boomtime-theme" });
    // existing value wins
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
    // legacy still cleaned up
    expect(window.localStorage.getItem("boomtime-theme")).toBeNull();
  });

  it("runs legacy migration BEFORE seeding defaultVariant", () => {
    // Legacy is the ONLY source of a value at this point. If seeding ran
    // first, defaultVariant would win and legacy would be lost.
    window.localStorage.setItem("legacy-key", "light");
    seedCatalystDefaults({
      legacyStorageKey: "legacy-key",
      defaultVariant: "dark",
    });
    // Migrated legacy value wins because it was written first, then the
    // defaultVariant check saw the key was already set and skipped.
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
  });

  it("swallows localStorage.setItem throws (private mode / quota)", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() =>
      seedCatalystDefaults({
        defaultTheme: "boomtime",
        defaultVariant: "dark",
        defaultEffects: { glow: false },
      })
    ).not.toThrow();

    spy.mockRestore();
    // sanity: restore worked
    window.localStorage.setItem("sanity-check", "1");
    expect(window.localStorage.getItem("sanity-check")).toBe("1");
    window.localStorage.removeItem("sanity-check");
  });

  it("swallows localStorage.getItem throws", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(() =>
      seedCatalystDefaults({
        defaultTheme: "boomtime",
        legacyStorageKey: "boomtime-theme",
      })
    ).not.toThrow();

    spy.mockRestore();
  });

  it("is a no-op when no options are passed", () => {
    seedCatalystDefaults({});
    expect(window.localStorage.getItem("theme:name")).toBeNull();
    expect(window.localStorage.getItem("theme:variant")).toBeNull();
    expect(window.localStorage.getItem("theme:effects")).toBeNull();
  });
});

describe("CatalystProvider (end-to-end mount)", () => {
  beforeEach(() => {
    clearThemeKeys();
  });

  afterEach(() => {
    clearThemeKeys();
    cleanup();
  });

  it("seeds defaults BEFORE ThemeProvider reads localStorage on first mount", () => {
    // Sanity: fresh state, no keys set.
    expect(window.localStorage.getItem("theme:name")).toBeNull();

    render(
      <CatalystProvider defaultTheme="boomtime" defaultVariant="dark">
        <div data-testid="child">hi</div>
      </CatalystProvider>
    );

    // After mount, seeded values are in localStorage AND ThemeProvider has
    // applied them to <html> — proving ordering is correct.
    expect(window.localStorage.getItem("theme:name")).toBe(JSON.stringify("boomtime"));
    expect(document.documentElement.className).toContain("theme-boomtime");
    expect(document.documentElement.className).toContain("dark");
  });

  it("legacy migration + first-run seeding work together", () => {
    window.localStorage.setItem("boomtime-theme", "light");

    render(
      <CatalystProvider defaultTheme="boomtime" legacyStorageKey="boomtime-theme">
        <div />
      </CatalystProvider>
    );

    // Migrated legacy variant, seeded theme name, legacy key wiped.
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
    expect(window.localStorage.getItem("theme:name")).toBe(JSON.stringify("boomtime"));
    expect(window.localStorage.getItem("boomtime-theme")).toBeNull();
  });

  it("preserves an existing user selection on remount", () => {
    // User already picked dracula previously.
    window.localStorage.setItem("theme:name", JSON.stringify("dracula"));
    window.localStorage.setItem("theme:variant", JSON.stringify("light"));

    render(
      <CatalystProvider defaultTheme="boomtime" defaultVariant="dark">
        <div />
      </CatalystProvider>
    );

    expect(window.localStorage.getItem("theme:name")).toBe(JSON.stringify("dracula"));
    expect(window.localStorage.getItem("theme:variant")).toBe(JSON.stringify("light"));
  });
});
