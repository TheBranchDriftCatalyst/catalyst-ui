import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { __FONT_LINK_DATA_ATTR, ensureThemeFonts, themeFonts } from "./fonts";

/**
 * These tests exercise the *real* DOM behaviour of {@link ensureThemeFonts}.
 * No fakes, no mocks-of-mocks: each test queries `document.head` directly and
 * asserts the actual `<link>` elements that the function attaches or removes.
 */
describe("ensureThemeFonts", () => {
  // Snapshot what's already in <head> before each test so we can detect leaks.
  let initialLinkCount = 0;

  beforeEach(() => {
    // Strip any leftover font links from previous tests (paranoia — vitest
    // already isolates jsdom per-file, but this also covers the FONT_LINK
    // class of links specifically).
    document
      .querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`)
      .forEach(el => el.parentNode?.removeChild(el));
    initialLinkCount = document.querySelectorAll("link").length;
  });

  afterEach(() => {
    document
      .querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`)
      .forEach(el => el.parentNode?.removeChild(el));
  });

  it("attaches a <link rel='stylesheet'> to <head> for the given theme", () => {
    ensureThemeFonts("catalyst");

    const links = document.querySelectorAll<HTMLLinkElement>(
      `link[${__FONT_LINK_DATA_ATTR}="catalyst"]`
    );
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of Array.from(links)) {
      expect(link.rel).toBe("stylesheet");
      expect(link.href).toContain("fonts.googleapis.com");
    }
  });

  it("uses the URLs declared in the registry", () => {
    ensureThemeFonts("dracula");

    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>(`link[${__FONT_LINK_DATA_ATTR}="dracula"]`)
    );
    const hrefs = links.map(l => l.href);

    // Each URL from themeFonts.dracula must be on the page.
    for (const url of themeFonts.dracula.stylesheets) {
      // jsdom may normalise hrefs — fall back to startsWith / contains
      // matching on a stable identifier.
      const found = hrefs.some(h => h === url || h.startsWith(url));
      expect(found, `expected a <link> for ${url}`).toBe(true);
    }
  });

  it("removes the previous theme's <link> tags when a new theme is set", () => {
    ensureThemeFonts("catalyst");
    const afterFirst = document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`).length;
    expect(afterFirst).toBeGreaterThan(0);

    ensureThemeFonts("nord");

    // No leftover catalyst tags.
    const stale = document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}="catalyst"]`);
    expect(stale.length).toBe(0);

    // At least one nord tag is present.
    const nordTags = document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}="nord"]`);
    expect(nordTags.length).toBeGreaterThan(0);
  });

  it("is idempotent: calling twice with the same theme does NOT duplicate links", () => {
    ensureThemeFonts("nord");
    const after1 = document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}="nord"]`).length;

    ensureThemeFonts("nord");
    const after2 = document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}="nord"]`).length;

    expect(after2).toBe(after1);
  });

  it("strips font links and adds none when theme is null/unknown", () => {
    ensureThemeFonts("catalyst");
    expect(document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`).length).toBeGreaterThan(0);

    ensureThemeFonts(null);
    expect(document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`).length).toBe(0);

    ensureThemeFonts("some-theme-that-does-not-exist");
    expect(document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`).length).toBe(0);
  });

  it("leaves non-font <link> elements untouched", () => {
    // Insert an unrelated link the function should never touch.
    const unrelated = document.createElement("link");
    unrelated.rel = "icon";
    unrelated.href = "/favicon.ico";
    document.head.appendChild(unrelated);

    ensureThemeFonts("catalyst");
    ensureThemeFonts("nord");
    ensureThemeFonts(null);

    expect(document.head.contains(unrelated)).toBe(true);
    expect(unrelated.rel).toBe("icon");

    unrelated.parentNode?.removeChild(unrelated);
  });

  it("declares every named theme in THEMES (regression guard)", () => {
    // The eight named themes (excluding the `null` 'no theme' option).
    const expected = [
      "catalyst",
      "dracula",
      "dungeon",
      "gold",
      "laracon",
      "nature",
      "netflix",
      "nord",
    ];
    for (const name of expected) {
      expect(themeFonts[name], `missing font metadata for ${name}`).toBeDefined();
      expect(themeFonts[name].stylesheets.length).toBeGreaterThan(0);
      for (const url of themeFonts[name].stylesheets) {
        // Sanity: all current entries route through Google Fonts (which
        // includes display=swap in the URL).
        expect(url).toMatch(/^https:\/\/fonts\.googleapis\.com\//);
        expect(url).toContain("display=swap");
      }
    }
  });

  it("does not leak <link> tags onto the head between switches", () => {
    ensureThemeFonts("catalyst");
    ensureThemeFonts("dracula");
    ensureThemeFonts("nord");
    ensureThemeFonts("gold");
    ensureThemeFonts("nature");
    ensureThemeFonts("netflix");
    ensureThemeFonts("laracon");
    ensureThemeFonts("dungeon");
    ensureThemeFonts(null);

    // No font links should remain after a final null reset.
    expect(document.querySelectorAll(`link[${__FONT_LINK_DATA_ATTR}]`).length).toBe(0);

    // No unrelated leak either.
    expect(document.querySelectorAll("link").length).toBe(initialLinkCount);
  });
});
