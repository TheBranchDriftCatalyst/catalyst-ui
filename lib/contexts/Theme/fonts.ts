"use client";

/**
 * Per-theme font loader metadata.
 *
 * @remarks
 * Each theme declares which font stacks it uses via CSS custom properties
 * (`--font-heading`, `--font-body`, `--font-mono-stack`) inside its
 * `styles/<theme>.css` file. The actual font *files* are not loaded by those
 * stylesheets — they only declare a `font-family` value. This registry stores
 * the external stylesheet URLs (typically Google Fonts) that load the actual
 * font glyphs, so `ThemeProvider` can inject the matching `<link>` tag
 * whenever the active theme changes.
 *
 * URLs all use `display=swap` so text remains visible during font load
 * (avoids FOIT — Flash Of Invisible Text).
 *
 * @public
 */
export interface ThemeFontMetadata {
  /**
   * Stylesheet URLs to load for this theme. Usually Google Fonts CSS endpoints.
   * Multiple URLs are supported in case a theme needs fonts from different sources.
   */
  stylesheets: string[];
}

/**
 * Registry mapping each theme name to its font stylesheet URLs.
 *
 * @remarks
 * Theme names match the keys in {@link THEMES} and the keys in
 * `themeCoreStyles` inside ThemeProvider. If a theme is missing from this
 * registry, no fonts are loaded and the browser falls back to the
 * `font-family` stack's secondary/tertiary entries (e.g. system fonts).
 *
 * @public
 */
export const themeFonts: Record<string, ThemeFontMetadata> = {
  // Cyberpunk / synthwave fonts
  catalyst: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
    ],
  },
  // Gothic vampire fonts — Cinzel / Crimson Text / Fira Code
  dracula: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Fira+Code:wght@400;500;700&display=swap",
    ],
  },
  // Romantic fantasy fonts — Amatic SC / Spectral / Inconsolata
  dungeon: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Spectral:ital,wght@0,400;0,600;1,400&family=Inconsolata:wght@400;700&display=swap",
    ],
  },
  // Luxury fonts — Cormorant Garamond / Lora / IBM Plex Mono
  gold: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;700&display=swap",
    ],
  },
  // Laravel conference fonts — Nunito / Open Sans / Fira Code
  laracon: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&family=Fira+Code:wght@400;500;700&display=swap",
    ],
  },
  // Nature/earth fonts — Libre Baskerville / Merriweather / Ubuntu Mono
  nature: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu+Mono:wght@400;700&display=swap",
    ],
  },
  // Netflix branding fonts — Bebas Neue / Source Code Pro
  // (Netflix Sans is proprietary; the `--font-body` stack falls back to Helvetica.)
  netflix: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Code+Pro:wght@400;500;700&display=swap",
    ],
  },
  // Nord minimalist fonts — Inter / JetBrains Mono
  nord: {
    stylesheets: [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
    ],
  },
};

/**
 * Prefix used on every font `<link>` element injected by {@link ensureThemeFonts}.
 * Used to identify (and clean up) any font link we previously injected.
 *
 * @internal
 */
const FONT_LINK_DATA_ATTR = "data-catalyst-theme-font";

/**
 * Inject `<link rel="stylesheet">` tags for the active theme's fonts, removing
 * any previously-injected font links from other themes.
 *
 * @remarks
 * - **Browser cache** still keeps fonts from prior themes warm even after the
 *   `<link>` is removed, so switching back is instant.
 * - Each link is tagged with `data-catalyst-theme-font="<theme>"` so we can
 *   detect duplicates and prune stale links on theme change.
 * - Safe to call on a missing theme — it simply removes any existing font
 *   links and exits.
 * - No-op on the server (when `document` is not defined).
 *
 * @param themeName - Active theme name (e.g. `"catalyst"`, `"dracula"`).
 * @param doc - Document to inject into. Defaults to `document`. Exposed for tests.
 * @returns The list of `<link>` elements newly attached to the document head.
 *
 * @public
 */
export function ensureThemeFonts(
  themeName: string | null | undefined,
  doc: Document | undefined = typeof document !== "undefined" ? document : undefined
): HTMLLinkElement[] {
  if (!doc) return [];

  const existing = Array.from(
    doc.querySelectorAll<HTMLLinkElement>(`link[${FONT_LINK_DATA_ATTR}]`)
  );

  // No theme / no metadata: remove all and bail.
  const meta = themeName ? themeFonts[themeName] : undefined;
  if (!meta) {
    existing.forEach(el => el.parentNode?.removeChild(el));
    return [];
  }

  const desiredUrls = new Set(meta.stylesheets);
  const keptByUrl = new Map<string, HTMLLinkElement>();

  // Remove stale links (those for other themes OR for URLs not in the new set).
  for (const el of existing) {
    const tag = el.getAttribute(FONT_LINK_DATA_ATTR);
    const href = el.getAttribute("href") ?? "";
    if (tag === themeName && desiredUrls.has(href)) {
      keptByUrl.set(href, el);
    } else {
      el.parentNode?.removeChild(el);
    }
  }

  // Add any link we don't already have.
  const added: HTMLLinkElement[] = [];
  for (const url of meta.stylesheets) {
    if (keptByUrl.has(url)) continue;
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute(FONT_LINK_DATA_ATTR, themeName!);
    // font-display:swap is encoded in the URL itself (Google Fonts).
    doc.head.appendChild(link);
    added.push(link);
  }

  return added;
}

/**
 * Exposed for tests — the data attribute used to mark injected font links.
 *
 * @internal
 */
export const __FONT_LINK_DATA_ATTR = FONT_LINK_DATA_ATTR;
