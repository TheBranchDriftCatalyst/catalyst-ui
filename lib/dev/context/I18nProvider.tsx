import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18nProvider wraps the application with i18next context
 *
 * This provides translation functionality throughout the app via the `useTranslation` hook
 *
 * @example
 * ```tsx
 * import { I18nProvider } from '@/catalyst-ui/dev/context';
 *
 * function App() {
 *   return (
 *     <I18nProvider>
 *       <YourApp />
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading translations...</div>}>{children}</Suspense>
    </I18nextProvider>
  );
}
