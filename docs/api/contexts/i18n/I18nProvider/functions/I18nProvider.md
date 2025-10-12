[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/i18n/I18nProvider](../README.md) / I18nProvider

# Function: I18nProvider()

> **I18nProvider**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/contexts/i18n/I18nProvider.tsx:137](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/i18n/I18nProvider.tsx#L137)

Internationalization (i18n) provider component

## Parameters

### props

`I18nProviderProps`

Component props

## Returns

`Element`

## Remarks

Wraps the application with i18next context for multi-language support.
Provides translation functionality via the `useTranslation` hook from
`react-i18next`.

**Features:**

- Co-located translations (`.locale` folders next to components)
- Namespace-based organization (one namespace per component)
- Auto-detected language from URL, localStorage, or browser
- Fallback to English if translation missing
- Suspense boundary for async translation loading

**Translation file structure:**

```
component/
  .locale/
    ComponentName.en.i18n.json
    ComponentName.es.i18n.json
    ComponentName.fr.i18n.json
  ComponentName.tsx
```

**Language detection priority:**

1. URL parameter: `?locale=es`
2. localStorage: `catalyst-ui-locale`
3. Browser language: `navigator.language`
4. Default: `en`

## Examples

```tsx
// App.tsx
import { I18nProvider } from "@/catalyst-ui/contexts/i18n";

function App() {
  return (
    <I18nProvider>
      <YourApp />
    </I18nProvider>
  );
}
```

```tsx
import { useTranslation } from "react-i18next";

function Greeting() {
  const { t, i18n } = useTranslation("Greeting"); // namespace = component name

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("description", { name: "User" })}</p>
      <button onClick={() => i18n.changeLanguage("es")}>Español</button>
    </div>
  );
}
```

```json
// component/.locale/Greeting.en.i18n.json
{
  "welcome": "Welcome!",
  "description": "Hello, {{name}}!"
}

// component/.locale/Greeting.es.i18n.json
{
  "welcome": "¡Bienvenido!",
  "description": "¡Hola, {{name}}!"
}
```

```tsx
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("catalyst-ui-locale", lng);
  };

  return (
    <select value={i18n.language} onChange={e => changeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

```tsx
import { I18nProvider } from "@/catalyst-ui/contexts/i18n";

function App() {
  return (
    <I18nProvider>
      <Suspense fallback={<CustomLoader />}>
        <YourApp />
      </Suspense>
    </I18nProvider>
  );
}
```
