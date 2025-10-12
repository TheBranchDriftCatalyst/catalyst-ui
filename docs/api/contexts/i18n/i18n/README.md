[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / contexts/i18n/i18n

# contexts/i18n/i18n

i18next configuration for catalyst-ui

## Remarks

This module configures i18next for internationalization with:

- Co-located translations (`.locale` folders next to components)
- Namespace-based organization (one namespace per component)
- Auto-detected language from URL, localStorage, or browser
- Fallback to English if translation missing

**Translation file patterns:**

- `app/**/.locale/*.*.i18n.json` - App-level translations
- `lib/**/.locale/*.*.i18n.json` - Library-level translations

**Naming convention:**

- `ComponentName.en.i18n.json` - English translations
- `ComponentName.es.i18n.json` - Spanish translations
- `ComponentName.fr.i18n.json` - French translations

**Language detection priority:**

1. URL parameter: `?locale=es`
2. localStorage: `catalyst-ui-locale`
3. Browser language: `navigator.language`
4. Default: `en`
