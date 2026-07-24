/**
 * No-flash-of-wrong-theme (NFOT) inline script.
 *
 * ThemeProvider only runs AFTER React mounts, which means there's a paint
 * window where the browser shows the default UA theme (typically light
 * regardless of user preference). Putting a small synchronous script in
 * `<head>` fixes this by writing the theme class + `colorScheme` BEFORE
 * the first paint.
 *
 * Every catalyst-ui consumer wants this, so we ship a canonical version
 * here and expose a helper that spits out the exact `<script>` body to
 * paste (or a full `<script>` tag) — parameterized by the same
 * `legacyStorageKey` and `defaultVariant` options that {@link CatalystProvider}
 * accepts, so the runtime + no-flash paths stay in sync.
 *
 * The script is intentionally hand-written and DOM-only — no imports, no
 * bundler transforms — because it runs before any module loader is
 * available.
 *
 * @packageDocumentation
 * @public
 */

/**
 * Options for {@link renderNoFlashScript}.
 *
 * @public
 */
export interface NoFlashScriptOptions {
  /**
   * Default variant to apply when no stored preference is found. Defaults
   * to `"dark"` to match {@link ThemeProvider}'s hardcoded default.
   */
  defaultVariant?: "light" | "dark";
  /**
   * Optional legacy localStorage key holding a raw `"light"` / `"dark"`
   * string. If present, the script prefers this value over the new
   * `theme:variant` key. Mirrors {@link CatalystProvider}'s
   * `legacyStorageKey` prop so the no-flash script picks up the same
   * migration the runtime provider would apply.
   */
  legacyStorageKey?: string;
}

/**
 * Return the RAW BODY of the no-flash script (no surrounding `<script>`
 * tag). Use this if you want to inject it via a template engine that
 * escapes tags, or wrap it in your own SSR renderer.
 *
 * Behavior at runtime (in-browser):
 *  1. Attempt to read `theme:variant` (the canonical key).
 *  2. Fall back to `legacyStorageKey` (raw string, no JSON parse) if given.
 *  3. Fall back to `defaultVariant` (or `"dark"`).
 *  4. Toggle `.dark` on `<html>` and set `colorScheme` on inline style.
 *
 * All storage access is wrapped in try/catch so private-mode / disabled
 * cookies never throw a JS error into `<head>`.
 *
 * @public
 */
export function renderNoFlashScriptBody(options: NoFlashScriptOptions = {}): string {
  const { defaultVariant = "dark", legacyStorageKey } = options;
  // Sanitize embedded strings — no untrusted input reaches this function
  // in typical use but be defensive against `</script>` injection anyway.
  const safeDefault = defaultVariant === "light" ? "light" : "dark";
  const safeLegacy = legacyStorageKey ? JSON.stringify(legacyStorageKey) : "null";

  // Keep this body tight: it lands verbatim in every consumer's HTML.
  return `(function(){try{var t=null;try{var raw=localStorage.getItem("theme:variant");if(raw){var p=raw;if(p.charAt(0)==='"')p=p.slice(1,-1);if(p==="light"||p==="dark")t=p;}}catch(_){}if(!t){var lk=${safeLegacy};if(lk){try{var lv=localStorage.getItem(lk);if(lv==="light"||lv==="dark")t=lv;}catch(_){}}}if(t!=="light")t=t==="dark"?"dark":${JSON.stringify(safeDefault)};var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`;
}

/**
 * Return a complete `<script>` tag (as a string) ready to paste into a
 * static `index.html`. Use this when you're wiring an SSR-free Vite app.
 *
 * Places the script inside `<head>` (before your app's module bundle) so
 * it runs synchronously before the first paint.
 *
 * @example
 * ```html
 * <head>
 *   <!-- injected once, at build time or by your template -->
 *   ${renderNoFlashScript({ legacyStorageKey: "boomtime-theme" })}
 * </head>
 * ```
 *
 * @public
 */
export function renderNoFlashScript(options: NoFlashScriptOptions = {}): string {
  return `<script>${renderNoFlashScriptBody(options)}</script>`;
}
