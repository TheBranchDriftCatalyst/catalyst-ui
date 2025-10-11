import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import i18n from "@/catalyst-ui/dev/context/i18n";

/**
 * Type representing translation changes organized by namespace and key
 */
type TranslationChanges = Record<string, Record<string, string>>;

interface LocalizationContextValue {
  /**
   * Update a translation key with a new value (stored locally)
   * @param namespace - The translation namespace (common, components, errors)
   * @param key - The translation key (can be nested, e.g., "app.title")
   * @param value - The new translation value
   */
  updateTranslation: (namespace: string, key: string, value: string) => void;

  /**
   * Download localization file(s) as JSON
   * @param namespace - Optional namespace to dump (if omitted, dumps all)
   */
  dumpLocalizationFile: (namespace?: string) => void;

  /**
   * Get all translation changes
   */
  getChanges: () => TranslationChanges;

  /**
   * Clear all translation changes (reset to original)
   */
  clearChanges: () => void;

  /**
   * Undo the last translation change
   */
  undo: () => void;

  /**
   * Redo a previously undone translation change
   */
  redo: () => void;

  /**
   * Check if a translation key is dirty (has unsaved changes)
   * @param namespace - The translation namespace
   * @param key - The translation key
   * @returns True if the translation has unsaved changes
   */
  isDirty: (namespace: string, key: string) => boolean;

  /**
   * Check if undo is available
   */
  canUndo: () => boolean;

  /**
   * Check if redo is available
   */
  canRedo: () => boolean;

  /**
   * Revision number that increments on every translation change
   * Components can read this to trigger re-renders
   */
  revision: number;

  /**
   * Get the current value for a translation key
   * @param namespace - The translation namespace
   * @param key - The translation key
   * @returns The current value (from changes or original)
   */
  getValue: (namespace: string, key: string) => string;

  /**
   * Sync status - indicates backend sync state
   */
  syncStatus: "idle" | "syncing" | "synced" | "error";

  /**
   * Last error message from sync operation
   */
  syncError: string | null;

  /**
   * Manually trigger backend sync
   */
  syncToBackend: () => Promise<void>;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

const STORAGE_KEY = "catalyst-ui-translation-changes";
const SYNC_INTERVAL_MS = 5000; // Sync every 5 seconds if there are unsaved changes

/**
 * LocalizationProvider manages translation editing in dev mode
 *
 * Features:
 * - Stores translation changes locally (in-memory + localStorage)
 * - Allows dumping translations as JSON files
 * - Updates i18next resources in real-time
 * - Periodic backend sync (writes to directory/.locale/ComponentName.LANG.i18n.json files via Vite middleware)
 *
 * @example
 * ```tsx
 * import { LocalizationProvider } from '@/catalyst-ui/contexts/Localization';
 *
 * function App() {
 *   return (
 *     <I18nProvider>
 *       <LocalizationProvider>
 *         <YourApp />
 *       </LocalizationProvider>
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  // Store original translations before any edits (capture on first render)
  const [originalTranslations] = useState<TranslationChanges>(() => {
    if (typeof window === "undefined") return {};

    const originals: TranslationChanges = {};

    // Load ALL namespaces from i18next (not just hardcoded ones)
    // This includes global namespaces (common, components, errors)
    // AND co-located component namespaces (TypographyDemo, etc.)
    const languages = i18n.languages || ["en"];

    // Get all loaded namespaces
    const loadedNamespaces = new Set<string>();
    languages.forEach(lang => {
      const store = i18n.services.resourceStore.data[lang];
      if (store) {
        Object.keys(store).forEach(ns => loadedNamespaces.add(ns));
      }
    });

    // Capture original values for all namespaces
    loadedNamespaces.forEach(namespace => {
      const bundle = i18n.getResourceBundle("en", namespace);
      if (bundle) {
        originals[namespace] = { ...bundle };
      }
    });

    if (import.meta.env.DEV) {
      console.log(
        `[LocalizationProvider] Loaded ${loadedNamespaces.size} namespaces:`,
        Array.from(loadedNamespaces)
      );
    }

    return originals;
  });

  // Load initial changes from localStorage
  const [changes, setChanges] = useState<TranslationChanges>(() => {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("[LocalizationProvider] Failed to load stored changes:", error);
      return {};
    }
  });

  // History stack for undo/redo
  const [history, setHistory] = useState<TranslationChanges[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Revision counter - increments on every translation change
  // Components can read this to trigger re-renders when translations change
  const [revision, setRevision] = useState(0);

  // Track dirty keys (keys that have been modified but not saved to backend)
  // Format: Set of "namespace:key" strings
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return new Set();

      const storedChanges: TranslationChanges = JSON.parse(stored);
      const keys = new Set<string>();
      Object.entries(storedChanges).forEach(([namespace, translations]) => {
        Object.keys(translations).forEach(key => {
          keys.add(`${namespace}:${key}`);
        });
      });
      return keys;
    } catch (error) {
      return new Set();
    }
  });

  // Backend sync state
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(0);

  // Persist changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
    } catch (error) {
      console.error("[LocalizationProvider] Failed to persist changes:", error);
    }
  }, [changes]);

  const updateTranslation = useCallback(
    (namespace: string, key: string, value: string) => {
      // Create new changes object
      const newChanges: TranslationChanges = {
        ...changes,
        [namespace]: {
          ...(changes[namespace] || {}),
          [key]: value,
        },
      };

      // Update local state
      setChanges(newChanges);

      // Add to history stack, truncating any "future" history if we're not at the end
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newChanges);
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);

      // Mark as dirty
      const dirtyKey = `${namespace}:${key}`;
      setDirtyKeys(prev => new Set(prev).add(dirtyKey));

      // Increment revision to trigger re-renders
      setRevision(prev => prev + 1);

      if (import.meta.env.DEV) {
        console.log(`[LocalizationProvider] Updated ${namespace}:${key} = "${value}"`);
      }
    },
    [changes, historyIndex]
  );

  const dumpLocalizationFile = useCallback(
    (namespace?: string) => {
      try {
        let dataToExport: Record<string, any> = {};
        let filename: string;

        if (namespace) {
          // Dump single namespace
          const originalData = originalTranslations[namespace] || {};
          const changesForNamespace = changes[namespace] || {};

          // Merge original with changes
          dataToExport = {
            ...originalData,
            ...changesForNamespace,
          };
          filename = `${namespace}.json`;
        } else {
          // Dump all namespaces
          const allNamespaces = Object.keys(originalTranslations);
          allNamespaces.forEach(ns => {
            const originalData = originalTranslations[ns] || {};
            const changesForNamespace = changes[ns] || {};

            dataToExport[ns] = {
              ...originalData,
              ...changesForNamespace,
            };
          });
          filename = "locales-en.json";
        }

        // Create blob and download
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        if (import.meta.env.DEV) {
          console.log(`[LocalizationProvider] Dumped ${filename}`);
        }
      } catch (error) {
        console.error("[LocalizationProvider] Failed to dump localization file:", error);
      }
    },
    [changes, originalTranslations]
  );

  const getChanges = useCallback(() => changes, [changes]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevChanges = history[prevIndex];

      setHistoryIndex(prevIndex);
      setChanges(prevChanges);

      // Update dirty keys based on what's in prevChanges
      const newDirtyKeys = new Set<string>();
      Object.entries(prevChanges).forEach(([namespace, translations]) => {
        Object.keys(translations).forEach(key => {
          newDirtyKeys.add(`${namespace}:${key}`);
        });
      });
      setDirtyKeys(newDirtyKeys);

      // Increment revision to trigger re-renders
      setRevision(prev => prev + 1);

      if (import.meta.env.DEV) {
        console.log(`[LocalizationProvider] Undo to history index ${prevIndex}`, prevChanges);
      }
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextChanges = history[nextIndex];

      setHistoryIndex(nextIndex);
      setChanges(nextChanges);

      // Update dirty keys based on what's in nextChanges
      const newDirtyKeys = new Set<string>();
      Object.entries(nextChanges).forEach(([namespace, translations]) => {
        Object.keys(translations).forEach(key => {
          newDirtyKeys.add(`${namespace}:${key}`);
        });
      });
      setDirtyKeys(newDirtyKeys);

      // Increment revision to trigger re-renders
      setRevision(prev => prev + 1);

      if (import.meta.env.DEV) {
        console.log(`[LocalizationProvider] Redo to history index ${nextIndex}`, nextChanges);
      }
    }
  }, [historyIndex, history]);

  const isDirty = useCallback(
    (namespace: string, key: string) => {
      return dirtyKeys.has(`${namespace}:${key}`);
    },
    [dirtyKeys]
  );

  const canUndo = useCallback(() => historyIndex > 0, [historyIndex]);

  const canRedo = useCallback(() => historyIndex < history.length - 1, [historyIndex, history]);

  const getValue = useCallback(
    (namespace: string, key: string) => {
      // Get current language from i18next
      const currentLanguage = i18n.language || "en";

      // First check if there's a changed value for current language
      if (changes[namespace]?.[key] !== undefined) {
        return changes[namespace][key];
      }

      // Fall back to original value from current language's bundle
      const bundle = i18n.getResourceBundle(currentLanguage, namespace);
      if (bundle && bundle[key] !== undefined) {
        return bundle[key];
      }

      // Fallback to English if key not found in current language
      if (currentLanguage !== "en") {
        const enBundle = i18n.getResourceBundle("en", namespace);
        if (enBundle && enBundle[key] !== undefined) {
          return enBundle[key];
        }
      }

      // Fall back to originalTranslations (English)
      if (originalTranslations[namespace]?.[key] !== undefined) {
        return originalTranslations[namespace][key];
      }

      // Return empty string if not found anywhere
      return "";
    },
    [changes, originalTranslations]
  );

  const syncToBackend = useCallback(async () => {
    if (dirtyKeys.size === 0) {
      if (import.meta.env.DEV) {
        console.log("[LocalizationProvider] No dirty keys to sync");
      }
      return;
    }

    setSyncStatus("syncing");
    setSyncError(null);

    try {
      // POST each dirty translation to backend
      const syncPromises = Array.from(dirtyKeys).map(async dirtyKey => {
        const [namespace, key] = dirtyKey.split(":");
        const value = changes[namespace]?.[key];

        if (!value) {
          console.warn(`[LocalizationProvider] Skipping ${dirtyKey} - no value found`);
          return;
        }

        const response = await fetch("/api/i18n/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namespace,
            locale: "en",
            key,
            value,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to sync ${namespace}:${key}: ${errorText}`);
        }

        if (import.meta.env.DEV) {
          const result = await response.json();
          console.log(`[LocalizationProvider] Synced ${namespace}:${key} to ${result.file}`);
        }
      });

      await Promise.all(syncPromises);

      // Clear dirty keys on success
      setDirtyKeys(new Set());
      setSyncStatus("synced");
      setLastSyncedAt(Date.now());

      if (import.meta.env.DEV) {
        console.log(
          `[LocalizationProvider] Successfully synced ${syncPromises.length} translations to backend`
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sync failed";
      setSyncError(errorMessage);
      setSyncStatus("error");

      console.error("[LocalizationProvider] Sync error:", error);
    }
  }, [dirtyKeys, changes]);

  const clearChanges = useCallback(() => {
    setChanges({});
    setHistory([{}]);
    setHistoryIndex(0);
    setDirtyKeys(new Set());

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (import.meta.env.DEV) {
      console.log("[LocalizationProvider] Cleared all changes");
    }
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          // Ctrl+Shift+Z = Redo
          e.preventDefault();
          redo();
        } else {
          // Ctrl+Z = Undo
          e.preventDefault();
          undo();
        }
      }

      // Also support Ctrl+Y for redo (common on Windows)
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Periodic backend sync - syncs dirty translations every 5 seconds
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only set up interval if there are dirty keys
    if (dirtyKeys.size === 0) {
      return;
    }

    if (import.meta.env.DEV) {
      console.log(
        `[LocalizationProvider] Setting up periodic sync (${SYNC_INTERVAL_MS}ms) for ${dirtyKeys.size} dirty keys`
      );
    }

    const intervalId = setInterval(() => {
      syncToBackend();
    }, SYNC_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (import.meta.env.DEV) {
        console.log("[LocalizationProvider] Cleared periodic sync interval");
      }
    };
  }, [dirtyKeys.size, syncToBackend]);

  return (
    <LocalizationContext.Provider
      value={{
        updateTranslation,
        dumpLocalizationFile,
        getChanges,
        clearChanges,
        undo,
        redo,
        isDirty,
        canUndo,
        canRedo,
        revision,
        getValue,
        syncStatus,
        syncError,
        syncToBackend,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

/**
 * Hook to access localization context
 *
 * @example
 * ```tsx
 * import { useLocalizationContext } from '@/catalyst-ui/contexts/Localization';
 *
 * function MyComponent() {
 *   const { updateTranslation, dumpLocalizationFile } = useLocalizationContext();
 *
 *   return (
 *     <button onClick={() => dumpLocalizationFile('common')}>
 *       Dump Common Translations
 *     </button>
 *   );
 * }
 * ```
 */
export function useLocalizationContext() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalizationContext must be used within LocalizationProvider");
  }
  return context;
}
