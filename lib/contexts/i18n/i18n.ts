import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Dynamically import all co-located translation files from .locale folders
// Pattern: directory/.locale/ComponentName.en.i18n.json, directory/.locale/ComponentName.es.i18n.json
// NOTE: Using eager: true but HMR is prevented via Vite watcher exclusions
const translationModules = import.meta.glob<{ default: Record<string, string> }>(
  [
    "../../../../app/**/.locale/*.*.i18n.json", // app/tabs/.locale/ComponentName.en.i18n.json
    "../../../**/.locale/*.*.i18n.json", // lib/components/.locale/ComponentName.en.i18n.json
  ],
  { eager: true }
);

// Build resources object from co-located translation files
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

// Get initial language using standard i18n detection practices
// Priority: URL param → localStorage → browser language → default
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

// Only initialize if not already initialized (prevents HMR double-init warning)
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

export default i18n;
