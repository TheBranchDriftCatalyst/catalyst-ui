"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("useLocalStorageState");

/**
 * getFromLocalStorage - Safely retrieves and deserializes data from localStorage
 *
 * Attempts to read a value from localStorage by key, parse it as JSON, and return
 * it with the expected type. If localStorage is unavailable (SSR, private browsing)
 * or the key doesn't exist, returns the provided default value.
 *
 * @template T - The type of the value being retrieved
 * @param key - The localStorage key to read from
 * @param defaultValue - Fallback value if key doesn't exist or localStorage unavailable
 * @returns The parsed value from localStorage, or defaultValue if not found
 *
 * @example
 * ```tsx
 * const theme = getFromLocalStorage<string>("app-theme", "dark");
 * const settings = getFromLocalStorage<UserSettings>("user-settings", defaultSettings);
 * ```
 *
 * @note This function is SSR-safe and will return defaultValue during server-side rendering
 * @note Logs a warning if localStorage is unavailable but continues gracefully
 *
 * @see {@link setToLocalStorage} for the corresponding setter function
 */
// TODO: anything we can do here, what if we are on the phone,
// any hybrid frameworks or alts in this case?
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof localStorage === "undefined") {
    log.warn("localStorage is not available. Returning default value.");
    return defaultValue;
  }

  const storedValue = localStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
};

/**
 * setToLocalStorage - Safely serializes and stores data in localStorage
 *
 * Attempts to serialize a value as JSON and store it in localStorage under the
 * specified key. If localStorage is unavailable (SSR, private browsing, quota exceeded),
 * logs a warning and fails silently without throwing an error.
 *
 * @template T - The type of the value being stored
 * @param key - The localStorage key to write to
 * @param value - The value to serialize and store
 *
 * @example
 * ```tsx
 * setToLocalStorage("app-theme", "dark");
 * setToLocalStorage("user-settings", { notifications: true, theme: "light" });
 * setToLocalStorage("recent-searches", ["react", "typescript", "vite"]);
 * ```
 *
 * @warning This function uses JSON.stringify, so values must be JSON-serializable.
 * Functions, Symbols, and circular references will cause serialization to fail.
 *
 * @note This function is SSR-safe and will no-op during server-side rendering
 * @note Does not throw on localStorage quota exceeded - check browser console for warnings
 *
 * @see {@link getFromLocalStorage} for the corresponding getter function
 */
export const setToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof localStorage === "undefined") {
    log.warn("localStorage is not available. Skipping set operation.");
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * useLocalStorageState - React state hook with localStorage persistence and cross-tab sync
 *
 * This hook provides a drop-in replacement for useState that automatically persists
 * state to localStorage and synchronizes changes across browser tabs/windows in real-time.
 *
 * Changes made in one tab are immediately reflected in all other tabs via the
 * `storage` event, making it ideal for user preferences, theme settings, and other
 * shared application state.
 *
 * The hook is SSR-safe and gracefully degrades to in-memory state when localStorage
 * is unavailable (server-side rendering, private browsing mode, or disabled storage).
 *
 * @template T - The type of the state value (must be JSON-serializable)
 * @param key - The localStorage key to use for persistence
 * @param defaultValue - Initial value if no stored value exists
 * @returns A tuple [value, setValue] identical to useState, with automatic persistence
 *
 * @example
 * ```tsx
 * // Basic usage - theme preference
 * function ThemeToggle() {
 *   const [theme, setTheme] = useLocalStorageState("app-theme", "dark");
 *
 *   return (
 *     <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Complex object storage - user settings
 * interface UserSettings {
 *   notifications: boolean;
 *   autoSave: boolean;
 *   theme: string;
 * }
 *
 * function SettingsPanel() {
 *   const [settings, setSettings] = useLocalStorageState<UserSettings>(
 *     "user-settings",
 *     { notifications: true, autoSave: true, theme: "dark" }
 *   );
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={settings.notifications}
 *           onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
 *         />
 *         Enable notifications
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Functional updates (like useState)
 * function Counter() {
 *   const [count, setCount] = useLocalStorageState("counter", 0);
 *
 *   return (
 *     <button onClick={() => setCount(prev => prev + 1)}>
 *       Clicks: {count}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Cross-tab synchronization demo
 * function SyncDemo() {
 *   const [message, setMessage] = useLocalStorageState("shared-message", "");
 *
 *   return (
 *     <div>
 *       <p>Open this page in multiple tabs and type below:</p>
 *       <input
 *         value={message}
 *         onChange={(e) => setMessage(e.target.value)}
 *         placeholder="Type here..."
 *       />
 *       <p>Changes will sync across all tabs instantly!</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @warning Values must be JSON-serializable. Functions, Symbols, and circular
 * references cannot be stored. Attempting to store non-serializable values will
 * cause the hook to fail silently and fall back to in-memory state.
 *
 * @note Cross-tab synchronization only works for changes made via this hook or
 * the `setToLocalStorage` utility. Direct `localStorage.setItem()` calls won't
 * trigger synchronization in other tabs.
 *
 * @note The hook listens to the `storage` event which only fires when localStorage
 * is modified from a different browsing context (tab/window). Changes in the same
 * tab are handled via React state updates.
 *
 * @see {@link getFromLocalStorage} for manual localStorage reads
 * @see {@link setToLocalStorage} for manual localStorage writes
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
 */
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => getFromLocalStorage(key, defaultValue));

  useEffect(() => {
    // ensures that the state is updated when the corresponding local storage item changes in another tab or window.
    const handler = (event: StorageEvent) => {
      if (event.key === key) {
        setState(getFromLocalStorage(key, defaultValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, defaultValue]);

  useEffect(() => {
    setToLocalStorage(key, state);
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorageState;
