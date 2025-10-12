import { useEffect, useState } from "react";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("useDynamicImport");

/**
 * useDynamicImport - Dynamically imports icons from @icons-pack/react-simple-icons
 *
 * This hook provides lazy loading for icon components, reducing initial bundle size
 * by loading icons only when needed. It handles the asynchronous import process
 * and provides both the loaded component and any errors that occur during loading.
 *
 * The hook is particularly useful for applications that use many icons but don't
 * need all of them loaded upfront. It automatically retries when the icon name changes.
 *
 * @param iconName - The name of the icon to import (without file extension)
 * @returns Object containing the loaded IconComponent (or null if loading/failed) and any import error
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { IconComponent, error } = useDynamicImport("SiReact");
 *
 * if (error) {
 *   return <div>Failed to load icon: {error.message}</div>;
 * }
 *
 * if (!IconComponent) {
 *   return <div>Loading icon...</div>;
 * }
 *
 * return <IconComponent />;
 * ```
 *
 * @example
 * ```tsx
 * // With dynamic icon selection
 * function TechIcon({ tech }: { tech: string }) {
 *   const iconMap: Record<string, string> = {
 *     react: "SiReact",
 *     typescript: "SiTypescript",
 *     nodejs: "SiNodedotjs",
 *   };
 *
 *   const { IconComponent, error } = useDynamicImport(iconMap[tech] || "SiQuestion");
 *
 *   return IconComponent ? <IconComponent /> : <span>?</span>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With loading state and error handling
 * function IconDisplay({ iconName }: { iconName: string }) {
 *   const { IconComponent, error } = useDynamicImport(iconName);
 *
 *   if (error) {
 *     return (
 *       <div className="icon-error" role="alert">
 *         <span>Icon not found</span>
 *       </div>
 *     );
 *   }
 *
 *   if (!IconComponent) {
 *     return (
 *       <div className="icon-loading" aria-label="Loading icon">
 *         <Spinner />
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <div className="icon-wrapper">
 *       <IconComponent />
 *     </div>
 *   );
 * }
 * ```
 *
 * @warning This hook is specifically designed for @icons-pack/react-simple-icons.
 * The import path is hardcoded and cannot be customized for other icon libraries.
 *
 * @note The icon component is memoized and will only re-import if iconName changes.
 * Errors are logged to the console with the "useDynamicImport" logger namespace.
 */
const useDynamicImport = (iconName: string) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const importIcon = async () => {
      try {
        const module = await import(
          `node_modules/@icons-pack/react-simple-icons/icons/${iconName}`
        );
        setIconComponent(() => module.default);
      } catch (err) {
        log.error(`Failed to load icon: ${iconName}`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    importIcon();
  }, [iconName]);

  return { IconComponent, error };
};

export default useDynamicImport;
