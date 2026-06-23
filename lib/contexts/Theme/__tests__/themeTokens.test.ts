/**
 * Theme token parity lint test.
 *
 * Parses every theme CSS file in lib/contexts/Theme/styles/*.css and
 * asserts that every `.theme-{name}.light` and `.theme-{name}.dark`
 * scope defines the full set of required design tokens. Theme drift
 * (missing tokens) will fail this test, even when the values differ.
 *
 * Required tokens are sourced from:
 *   - useCalculatedThemeColors.ts (--primary-rgb, --accent-rgb, --chart-1..12)
 *   - global.css :root fallback (--radius)
 *   - effect layer dependencies (--scanline-*, --grid-*)
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const STYLES_DIR = path.resolve(__dirname, "../styles");

/** Required token keys that EVERY theme scope must define. */
const REQUIRED_TOKENS = [
  // Spacing
  "--radius",
  // Effects
  "--scanline-color",
  "--scanline-opacity",
  "--grid-color",
  "--grid-opacity",
  // Semantic color RGB triplets (used by useCalculatedThemeColors)
  "--primary-rgb",
  "--accent-rgb",
  // Data viz palette (referenced by useCalculatedThemeColors:141-156)
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--chart-6",
  "--chart-7",
  "--chart-8",
  "--chart-9",
  "--chart-10",
  "--chart-11",
  "--chart-12",
];

interface CssBlock {
  selector: string;
  body: string;
  tokens: Set<string>;
}

/**
 * Walk through the CSS source and yield every TOP-LEVEL rule block
 * (selector + body). Handles nested braces (@media, @keyframes) and
 * block comments without depending on a real CSS parser.
 */
function parseTopLevelBlocks(content: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  let i = 0;
  const n = content.length;
  while (i < n) {
    // Skip block comments at the top level
    if (content[i] === "/" && content[i + 1] === "*") {
      const end = content.indexOf("*/", i + 2);
      if (end < 0) break;
      i = end + 2;
      continue;
    }
    if (/\s/.test(content[i])) {
      i++;
      continue;
    }
    const braceStart = content.indexOf("{", i);
    if (braceStart < 0) break;
    const selector = content.slice(i, braceStart).trim();
    let depth = 0;
    let j = braceStart;
    const bodyStart = braceStart + 1;
    let closed = false;
    while (j < n) {
      const c = content[j];
      if (c === "/" && content[j + 1] === "*") {
        const end = content.indexOf("*/", j + 2);
        if (end < 0) {
          j = n;
          break;
        }
        j = end + 2;
        continue;
      }
      if (c === "{") {
        depth++;
      } else if (c === "}") {
        depth--;
        if (depth === 0) {
          const body = content.slice(bodyStart, j);
          // Extract --tokens defined directly in this top-level rule.
          // Note: nested rules (e.g. @media) still appear in `body`,
          // but they would only ADD tokens, not subtract, so they don't
          // affect the required-token check.
          const tokens = new Set<string>();
          const re = /(--[a-z0-9-]+)\s*:/gi;
          let m: RegExpExecArray | null;
          while ((m = re.exec(body)) !== null) {
            tokens.add(m[1]);
          }
          blocks.push({ selector, body, tokens });
          i = j + 1;
          closed = true;
          break;
        }
      }
      j++;
    }
    if (!closed) break;
  }
  return blocks;
}

/** Identify rule blocks whose first selector matches `.theme-NAME.{light,dark}`. */
function isThemeScopeSelector(
  selector: string
): { name: string; variant: "light" | "dark" } | null {
  const first = selector.split(",")[0].trim();
  const m = /^\.theme-([\w-]+)\.(light|dark)$/.exec(first);
  if (!m) return null;
  return { name: m[1], variant: m[2] as "light" | "dark" };
}

/** Discover every theme CSS file and load its content. */
function loadThemeFiles() {
  return readdirSync(STYLES_DIR)
    .filter(f => f.endsWith(".css"))
    .sort()
    .map(f => ({
      filename: f,
      path: path.join(STYLES_DIR, f),
      content: readFileSync(path.join(STYLES_DIR, f), "utf8"),
    }));
}

describe("Theme token parity (lint)", () => {
  const files = loadThemeFiles();

  it("discovers all 8 theme files", () => {
    const names = files.map(f => f.filename).sort();
    expect(names).toEqual([
      "catalyst.css",
      "dracula.css",
      "dungeon.css",
      "gold.css",
      "laracon.css",
      "nature.css",
      "netflix.css",
      "nord.css",
    ]);
  });

  // Per-file × per-scope assertions. Each generates an individual test
  // so the failure message points at the exact theme/variant + missing key.
  for (const file of files) {
    const blocks = parseTopLevelBlocks(file.content);
    const themeBlocks = blocks
      .map(b => ({ block: b, scope: isThemeScopeSelector(b.selector) }))
      .filter(x => x.scope !== null) as Array<{
      block: CssBlock;
      scope: { name: string; variant: "light" | "dark" };
    }>;

    it(`${file.filename} declares both .light and .dark scopes`, () => {
      const variants = new Set(themeBlocks.map(x => x.scope.variant));
      expect(variants.has("light")).toBe(true);
      expect(variants.has("dark")).toBe(true);
    });

    for (const { block, scope } of themeBlocks) {
      it(`${file.filename} .${scope.name}.${scope.variant} defines all required tokens`, () => {
        const missing = REQUIRED_TOKENS.filter(t => !block.tokens.has(t));
        // Custom error message includes the missing token list for easy fixing.
        expect(
          missing,
          `Missing tokens in .theme-${scope.name}.${scope.variant}: ${missing.join(", ")}`
        ).toEqual([]);
      });
    }
  }

  it("required tokens have non-empty values in every theme scope", () => {
    // Catches a regression where a token is declared but accidentally empty.
    // We re-parse each block's body for `--token: value;` and verify value is non-empty.
    const failures: string[] = [];
    for (const file of files) {
      const blocks = parseTopLevelBlocks(file.content);
      for (const block of blocks) {
        const scope = isThemeScopeSelector(block.selector);
        if (!scope) continue;
        for (const tok of REQUIRED_TOKENS) {
          // Match the token followed by its value, terminated by ; or end-of-block.
          // Use a regex that captures the value up to the next semicolon (ignoring
          // semicolons inside parentheses, which only matters for rgba(...) values).
          const re = new RegExp(
            `${tok.replace(/-/g, "\\-")}\\s*:\\s*([^;]*?(?:\\([^)]*\\)[^;]*)*);`,
            "i"
          );
          const m = re.exec(block.body);
          if (!m) {
            failures.push(
              `${file.filename} .theme-${scope.name}.${scope.variant} ${tok}: not declared`
            );
            continue;
          }
          const value = m[1].trim();
          if (value.length === 0) {
            failures.push(
              `${file.filename} .theme-${scope.name}.${scope.variant} ${tok}: empty value`
            );
          }
        }
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});
