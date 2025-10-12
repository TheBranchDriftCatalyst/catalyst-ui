/**
 * i18next configuration for catalyst-ui
 *
 * @remarks
 * This module configures i18next for internationalization with:
 * - Co-located translations (`.locale` folders next to components)
 * - Namespace-based organization (one namespace per component)
 * - Auto-detected language from URL, localStorage, or browser
 * - Fallback to English if translation missing
 *
 * **Translation file patterns:**
 * - `app/**\/.locale\/*.*.i18n.json` - App-level translations
 * - `lib/**\/.locale\/*.*.i18n.json` - Library-level translations
 *
 * **Naming convention:**
 * - `ComponentName.en.i18n.json` - English translations
 * - `ComponentName.es.i18n.json` - Spanish translations
 * - `ComponentName.fr.i18n.json` - French translations
 *
 * **Language detection priority:**
 * 1. URL parameter: `?locale=es`
 * 2. localStorage: `catalyst-ui-locale`
 * 3. Browser language: `navigator.language`
 * 4. Default: `en`
 *
 * @module
 * @public
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/**
 * Dynamically import all co-located translation files from .locale folders
 *
 * @remarks
 * Uses Vite's `import.meta.glob` to discover translation files at build time.
 * Eager loading ensures translations are bundled (no async loading at runtime).
 * HMR is disabled for these files via Vite config to prevent double-init warnings.
 *
 * @example File Patterns
 * - `app/tabs/.locale/OverviewTab.en.i18n.json`
 * - `lib/components/.locale/ForceGraph.es.i18n.json`
 *
 * @internal
 */
const translationModules = import.meta.glob<{ default: Record<string, string> }>(
  [
    "../../../../app/**/.locale/*.*.i18n.json", // app/tabs/.locale/ComponentName.en.i18n.json
    "../../../**/.locale/*.*.i18n.json", // lib/components/.locale/ComponentName.en.i18n.json
  ],
  { eager: true }
);

/**
 * Build resources object from co-located translation files
 *
 * @remarks
 * Resources are structured as:
 * ```typescript
 * {
 *   en: { ComponentName: { key: "English text" } },
 *   es: { ComponentName: { key: "Texto en español" } }
 * }
 * ```
 *
 * Namespace = Component filename (e.g., "OverviewTab", "ForceGraph")
 *
 * @internal
 */
const resources: Record<string, Record<string, Record<string, string>>> = {};

for (const [path, module] of Object.entries(translationModules)) {
  // Pattern: directory/.locale/ComponentName.en.i18n.json -> lang=en, namespace="ComponentName"
  // Pattern: directory/.locale/ComponentName.es.i18n.json -> lang=es, namespace="ComponentName"

  const langMatch = path.match(/\.locale\/([^/]+)\.([a-z]{2})\.i18n\.json$/);

  if (langMatch) {
    // Language-specific file (e.g., tabs/.locale/OverviewTab.en.i18n.json)
    const namespace = langMatch[1];
    const lang = langMatch[2];

    if (!resources[lang]) {
      resources[lang] = {};
    }
    resources[lang][namespace] = module.default;
  }
}

/**
 * Detect initial language using standard i18n practices
 *
 * @param availableLangs - Array of supported language codes
 * @returns Detected language code
 *
 * @remarks
 * Detection priority:
 * 1. URL parameter: `?locale=es` (highest - explicit user action)
 * 2. localStorage: `catalyst-ui-locale` (saved preference)
 * 3. Browser language: `navigator.language` (default browser setting)
 * 4. Fallback: `en` (default)
 *
 * When URL parameter is detected, it's saved to localStorage for future visits.
 *
 * @example URL-based switching
 * ```
 * https://example.com/?locale=es
 * ```
 *
 * @example localStorage-based persistence
 * ```javascript
 * localStorage.setItem('catalyst-ui-locale', 'fr');
 * ```
 *
 * @internal
 */
function getInitialLanguage(availableLangs: string[]): string {
  if (typeof window === "undefined") return "en";

  const supportedLanguages = availableLangs;

  // 1. Check URL parameter (highest priority - explicit user action)
  const params = new URLSearchParams(window.location.search);
  const urlLocale = params.get("locale");
  if (urlLocale && supportedLanguages.includes(urlLocale)) {
    // Save to localStorage for future visits
    localStorage.setItem("catalyst-ui-locale", urlLocale);
    return urlLocale;
  }

  // 2. Check localStorage (saved user preference)
  try {
    const savedLocale = localStorage.getItem("catalyst-ui-locale");
    if (savedLocale && supportedLanguages.includes(savedLocale)) {
      return savedLocale;
    }
  } catch (error) {
    console.warn("[i18n] Failed to read locale from localStorage:", error);
  }

  // 3. Check browser language (navigator.language)
  try {
    const browserLang = navigator.language.split("-")[0]; // "en-US" → "en"
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
  } catch (error) {
    console.warn("[i18n] Failed to detect browser language:", error);
  }

  // 4. Default to English
  return "en";
}

/**
 * Initialize i18next if not already initialized
 *
 * @remarks
 * Only initializes once to prevent HMR double-init warnings.
 * Development features:
 * - Debug logging enabled
 * - Missing key warnings
 * - Namespace logging
 *
 * Production features:
 * - Debug disabled
 * - No console warnings
 * - Optimized bundle size
 *
 * @internal
 */
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(Object.keys(resources)),
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    // Development mode features
    debug: import.meta.env.DEV,
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (_lng, ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation key: ${ns}:${key}`);
      }
    },
  });

  // Log loaded namespaces in dev mode
  if (import.meta.env.DEV) {
    const namespaces = resources.en ? Object.keys(resources.en) : [];
    console.log(`[i18n] Loaded ${namespaces.length} namespaces:`, namespaces);
  }
}

/**
 * Configured i18next instance
 *
 * @remarks
 * This instance is pre-configured with:
 * - All translation resources from `.locale` folders
 * - Language detection from URL/localStorage/browser
 * - Fallback to English
 * - React integration via `react-i18next`
 *
 * Use via {@link I18nProvider} and `useTranslation` hook.
 *
 * @example Basic Usage
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 *
 * function MyComponent() {
 *   const { t } = useTranslation('MyComponent');
 *   return <h1>{t('title')}</h1>;
 * }
 * ```
 *
 * @example Language Switching
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 *
 * function LanguageButton() {
 *   const { i18n } = useTranslation();
 *   return (
 *     <button onClick={() => i18n.changeLanguage('es')}>
 *       Español
 *     </button>
 *   );
 * }
 * ```
 *
 * @public
 */
export default i18n;
