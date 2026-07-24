/**
 * Unit tests for the no-flash inline script generator.
 *
 * The script is a hand-authored one-liner that runs inside every consumer's
 * `<head>`, so any regression is user-visible (wrong theme flash on first
 * paint). We test:
 *
 *  1. The generated body is well-formed JS (no template-literal mistakes).
 *  2. Legacy key + default variant options round-trip into the source.
 *  3. Executing the script in a jsdom-like environment applies the correct
 *     class + colorScheme.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderNoFlashScript, renderNoFlashScriptBody } from "./noFlash";

function runScript(body: string, storageState: Record<string, string> = {}) {
  // Set up localStorage state, reset <html>.
  window.localStorage.clear();
  for (const [k, v] of Object.entries(storageState)) {
    window.localStorage.setItem(k, v);
  }
  document.documentElement.className = "";
  document.documentElement.style.colorScheme = "";
  // eval in current global — the script only touches `document` +
  // `localStorage` which jsdom provides.
  // eslint-disable-next-line no-new-func
  new Function(body)();
  return {
    className: document.documentElement.className,
    colorScheme: document.documentElement.style.colorScheme,
  };
}

describe("renderNoFlashScriptBody", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.style.colorScheme = "";
  });

  it("returns a self-invoking function expression", () => {
    const body = renderNoFlashScriptBody();
    expect(body).toMatch(/^\(function\(\)\s*\{/);
    expect(body.trim().endsWith(")();")).toBe(true);
  });

  it("defaults to dark when no storage is present", () => {
    const result = runScript(renderNoFlashScriptBody());
    expect(result.className).toBe("dark");
    expect(result.colorScheme).toBe("dark");
  });

  it("respects defaultVariant option", () => {
    const result = runScript(renderNoFlashScriptBody({ defaultVariant: "light" }));
    expect(result.className).toBe("");
    expect(result.colorScheme).toBe("light");
  });

  it("reads a JSON-encoded theme:variant value (canonical format)", () => {
    const result = runScript(renderNoFlashScriptBody(), {
      "theme:variant": JSON.stringify("light"),
    });
    expect(result.className).toBe("");
    expect(result.colorScheme).toBe("light");
  });

  it("reads a raw-string theme:variant value (tolerance for hand-written keys)", () => {
    const result = runScript(renderNoFlashScriptBody(), {
      "theme:variant": "light",
    });
    expect(result.className).toBe("");
    expect(result.colorScheme).toBe("light");
  });

  it("falls back to legacyStorageKey when theme:variant is missing", () => {
    const result = runScript(renderNoFlashScriptBody({ legacyStorageKey: "boomtime-theme" }), {
      "boomtime-theme": "light",
    });
    expect(result.className).toBe("");
    expect(result.colorScheme).toBe("light");
  });

  it("prefers theme:variant over legacyStorageKey when both set", () => {
    const result = runScript(renderNoFlashScriptBody({ legacyStorageKey: "boomtime-theme" }), {
      "theme:variant": JSON.stringify("light"),
      "boomtime-theme": "dark",
    });
    expect(result.className).toBe("");
    expect(result.colorScheme).toBe("light");
  });

  it("swallows localStorage.getItem throws (private-mode)", () => {
    const orig = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("SecurityError");
    };
    try {
      const result = runScript(renderNoFlashScriptBody());
      // Falls back to dark on any error.
      expect(result.className).toBe("dark");
      expect(result.colorScheme).toBe("dark");
    } finally {
      Storage.prototype.getItem = orig;
    }
  });
});

describe("renderNoFlashScript", () => {
  it("wraps body in <script> tags", () => {
    const html = renderNoFlashScript({ legacyStorageKey: "app-theme" });
    expect(html.startsWith("<script>")).toBe(true);
    expect(html.endsWith("</script>")).toBe(true);
    // Legacy key round-trips into the source.
    expect(html).toContain('"app-theme"');
  });
});
