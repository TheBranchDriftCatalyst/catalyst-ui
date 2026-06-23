import { describe, it, expect } from "vitest";
// Use Vite's `?raw` query to load the CSS source as a string. This keeps the
// test browser-bundle safe (no node:fs / node:path imports) so the file is
// safe to live alongside the rest of lib/ without breaking the library build.
import globalCss from "../../global.css?raw";
import catalystCss from "./styles/catalyst.css?raw";
import draculaCss from "./styles/dracula.css?raw";
import dungeonCss from "./styles/dungeon.css?raw";
import goldCss from "./styles/gold.css?raw";
import laraconCss from "./styles/laracon.css?raw";
import natureCss from "./styles/nature.css?raw";
import netflixCss from "./styles/netflix.css?raw";
import nordCss from "./styles/nord.css?raw";

/**
 * Static guard tests against the CSS source — they verify the @theme block in
 * global.css and every theme stylesheet are wired up so Tailwind utility
 * classes (font-sans / font-display / font-mono) follow the active theme.
 *
 * These exist because the Tailwind v4 @theme directive is *the* contract
 * between the runtime theme variables (set by each theme.css file) and the
 * generated utility classes. If a refactor accidentally hardcodes a font
 * stack back into @theme, every theme except catalyst stops rendering its
 * declared font.
 */
describe("Tailwind @theme font tokens", () => {
  it("maps --font-sans to the runtime --font-body variable", () => {
    expect(globalCss).toMatch(/--font-sans:\s*var\(--font-body\)/);
  });

  it("maps --font-display to the runtime --font-heading variable", () => {
    expect(globalCss).toMatch(/--font-display:\s*var\(--font-heading\)/);
  });

  it("maps --font-mono to the runtime --font-mono-stack variable", () => {
    // Crucial: the runtime variable name must differ from Tailwind's
    // --font-mono token to avoid the cyclic self-reference. We use
    // --font-mono-stack as the runtime name.
    expect(globalCss).toMatch(/--font-mono:\s*var\(--font-mono-stack\)/);
  });

  it("does NOT hardcode the Catalyst-specific font stacks inside @theme", () => {
    // Walk the @theme block and confirm it doesn't contain the hardcoded
    // Orbitron/Rajdhani/Space Mono values it used to ship with.
    const themeBlockMatch = globalCss.match(/@theme\s*\{[\s\S]*?\n\}/);
    expect(themeBlockMatch).toBeTruthy();
    const themeBlock = themeBlockMatch![0];
    expect(themeBlock).not.toMatch(/"Orbitron"/);
    expect(themeBlock).not.toMatch(/"Rajdhani"/);
    expect(themeBlock).not.toMatch(/"Space Mono"/);
  });

  const themeCss: Record<string, string> = {
    catalyst: catalystCss,
    dracula: draculaCss,
    dungeon: dungeonCss,
    gold: goldCss,
    laracon: laraconCss,
    nature: natureCss,
    netflix: netflixCss,
    nord: nordCss,
  };

  for (const [name, css] of Object.entries(themeCss)) {
    it(`${name}.css declares --font-heading / --font-body / --font-mono-stack`, () => {
      expect(css, `${name}.css missing --font-heading`).toMatch(/--font-heading\s*:/);
      expect(css, `${name}.css missing --font-body`).toMatch(/--font-body\s*:/);
      expect(
        css,
        `${name}.css missing --font-mono-stack (did you forget to rename --font-mono?)`
      ).toMatch(/--font-mono-stack\s*:/);
      // Crucial: must NOT also declare the colliding --font-mono variable.
      // Tests for "--font-mono:" specifically — we allow "--font-mono-stack:".
      // Strip every --font-mono-stack: line first, then make sure nothing else
      // declares --font-mono.
      const stripped = css.replace(/--font-mono-stack\s*:[^;]*;?/g, "");
      expect(
        stripped,
        `${name}.css still defines --font-mono — should be --font-mono-stack`
      ).not.toMatch(/--font-mono\s*:/);
    });
  }
});
