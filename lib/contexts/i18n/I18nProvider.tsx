import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

/**
 * Props for I18nProvider component
 * @public
 */
interface I18nProviderProps {
  /**
   * Child components to render
   */
  children: React.ReactNode;
}

/**
 * Internationalization (i18n) provider component
 *
 * @param props - Component props
 * @param props.children - Child components to render
 *
 * @remarks
 * Wraps the application with i18next context for multi-language support.
 * Provides translation functionality via the `useTranslation` hook from
 * `react-i18next`.
 *
 * **Features:**
 * - Co-located translations (`.locale` folders next to components)
 * - Namespace-based organization (one namespace per component)
 * - Auto-detected language from URL, localStorage, or browser
 * - Fallback to English if translation missing
 * - Suspense boundary for async translation loading
 *
 * **Translation file structure:**
 * ```
 * component/
 *   .locale/
 *     ComponentName.en.i18n.json
 *     ComponentName.es.i18n.json
 *     ComponentName.fr.i18n.json
 *   ComponentName.tsx
 * ```
 *
 * **Language detection priority:**
 * 1. URL parameter: `?locale=es`
 * 2. localStorage: `catalyst-ui-locale`
 * 3. Browser language: `navigator.language`
 * 4. Default: `en`
 *
 * @example Basic Setup
 * ```tsx
 * // App.tsx
 * import { I18nProvider } from '@/catalyst-ui/contexts/i18n';
 *
 * function App() {
 *   return (
 *     <I18nProvider>
 *       <YourApp />
 *     </I18nProvider>
 *   );
 * }
 * ```
 *
 * @example Consumer Component
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 *
 * function Greeting() {
 *   const { t, i18n } = useTranslation('Greeting'); // namespace = component name
 *
 *   return (
 *     <div>
 *       <h1>{t('welcome')}</h1>
 *       <p>{t('description', { name: 'User' })}</p>
 *       <button onClick={() => i18n.changeLanguage('es')}>
 *         Español
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Translation Files
 * ```json
 * // component/.locale/Greeting.en.i18n.json
 * {
 *   "welcome": "Welcome!",
 *   "description": "Hello, {{name}}!"
 * }
 *
 * // component/.locale/Greeting.es.i18n.json
 * {
 *   "welcome": "¡Bienvenido!",
 *   "description": "¡Hola, {{name}}!"
 * }
 * ```
 *
 * @example Switching Language
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 *
 * function LanguageSwitcher() {
 *   const { i18n } = useTranslation();
 *
 *   const changeLanguage = (lng: string) => {
 *     i18n.changeLanguage(lng);
 *     localStorage.setItem('catalyst-ui-locale', lng);
 *   };
 *
 *   return (
 *     <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
 *       <option value="en">English</option>
 *       <option value="es">Español</option>
 *       <option value="fr">Français</option>
 *     </select>
 *   );
 * }
 * ```
 *
 * @example With Custom Fallback
 * ```tsx
 * import { I18nProvider } from '@/catalyst-ui/contexts/i18n';
 *
 * function App() {
 *   return (
 *     <I18nProvider>
 *       <Suspense fallback={<CustomLoader />}>
 *         <YourApp />
 *       </Suspense>
 *     </I18nProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading translations...</div>}>{children}</Suspense>
    </I18nextProvider>
  );
}
