"use client";
import Debug from "debug";
import React, { ReactNode, createContext, useContext, useState } from "react";

/**
 * Debug context shape for debug logging system
 *
 * @remarks
 * Provides centralized debug logger management using the `debug` package.
 * Each namespace gets its own logger instance that can be toggled on/off
 * via localStorage using the `DEBUG` key.
 *
 * **Enable debug logs:**
 * ```javascript
 * localStorage.setItem('DEBUG', 'catalyst:*'); // All catalyst logs
 * localStorage.setItem('DEBUG', 'catalyst:theme,catalyst:header'); // Specific namespaces
 * ```
 *
 * @public
 */
interface DebuggerContextType {
  /**
   * Get or create a debugger for a namespace
   * @param namespace - Logger namespace (e.g., "catalyst:theme")
   * @returns Debug.Debugger instance
   */
  getDebugger: (namespace: string) => Debug.Debugger;

  /**
   * Cache of all created debuggers by namespace
   * Used internally to avoid recreating loggers
   */
  debuggers: Record<string, Debug.Debugger>;
}

/**
 * React context for debug logging
 *
 * @remarks
 * This context should be consumed via the {@link useDebugger} hook.
 * Do not use `useContext(DebuggerContext)` directly.
 *
 * @public
 */
export const DebuggerContext = createContext<DebuggerContextType>({
  getDebugger: (namespace: string) => Debug(namespace),
  debuggers: {},
});

/**
 * Props for DebuggerProvider component
 * @public
 */
interface DebuggerProviderProps {
  /**
   * Child components to render
   */
  children: ReactNode;
}

/**
 * Debug provider component - manages debug logger instances
 *
 * @param props - Component props
 * @param props.children - Child components to render
 *
 * @remarks
 * This provider should wrap your application (typically in `App.tsx`).
 * It provides centralized debug logging using the `debug` package.
 *
 * **Features:**
 * - Namespace-based logging (e.g., "catalyst:theme", "catalyst:api")
 * - Logger caching to avoid recreation
 * - Controlled via localStorage `DEBUG` key
 * - Supports wildcards: `DEBUG=catalyst:*`
 *
 * **How to enable debug logs:**
 * 1. Open browser DevTools Console
 * 2. Run: `localStorage.setItem('DEBUG', 'catalyst:*')`
 * 3. Refresh page
 * 4. All catalyst logs will appear in console
 *
 * **Namespace conventions:**
 * - Use colon-separated hierarchy: `catalyst:context:theme`
 * - Use wildcards for filtering: `catalyst:*` or `catalyst:context:*`
 * - Component logs: `catalyst:component:ForceGraph`
 * - Context logs: `catalyst:context:theme`
 * - API logs: `catalyst:api:fetch`
 *
 * @example Basic Setup
 * ```tsx
 * // App.tsx
 * import { DebuggerProvider } from '@/catalyst-ui/contexts/Debug';
 *
 * function App() {
 *   return (
 *     <DebuggerProvider>
 *       <YourApp />
 *     </DebuggerProvider>
 *   );
 * }
 * ```
 *
 * @example Consumer Component
 * ```tsx
 * import { useDebugger } from '@/catalyst-ui/contexts/Debug';
 *
 * function MyComponent() {
 *   const debug = useDebugger('catalyst:component:MyComponent');
 *
 *   useEffect(() => {
 *     debug('Component mounted');
 *     debug('Props:', props);
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @example Using in Utilities
 * ```tsx
 * import { useDebugger } from '@/catalyst-ui/contexts/Debug';
 *
 * export function useFetchData(url: string) {
 *   const debug = useDebugger('catalyst:hooks:useFetchData');
 *
 *   const [data, setData] = useState(null);
 *
 *   useEffect(() => {
 *     debug('Fetching:', url);
 *     fetch(url)
 *       .then(res => res.json())
 *       .then(json => {
 *         debug('Received:', json);
 *         setData(json);
 *       });
 *   }, [url]);
 *
 *   return data;
 * }
 * ```
 *
 * @public
 */
export const DebuggerProvider: React.FC<DebuggerProviderProps> = ({ children }) => {
  // State to store cached debuggers
  const [debuggers, setDebuggers] = useState<Record<string, Debug.Debugger>>({});

  const getDebugger = (namespace: string): Debug.Debugger => {
    // Check if the debugger already exists, if not create a new one and cache it
    if (!debuggers[namespace]) {
      const newDebugger = Debug(namespace);
      setDebuggers(prev => ({ ...prev, [namespace]: newDebugger }));
      return newDebugger;
    }
    return debuggers[namespace];
  };

  return (
    <DebuggerContext.Provider value={{ getDebugger, debuggers }}>
      {children}
    </DebuggerContext.Provider>
  );
};

/**
 * Hook to access debug logger for a namespace
 *
 * @param namespace - Logger namespace (e.g., "catalyst:theme")
 * @returns Debug.Debugger instance for logging
 *
 * @remarks
 * Must be used within a {@link DebuggerProvider}
 *
 * Logs are disabled by default. Enable via localStorage:
 * ```javascript
 * localStorage.setItem('DEBUG', 'catalyst:*'); // All catalyst logs
 * ```
 *
 * @example Basic Usage
 * ```tsx
 * import { useDebugger } from '@/catalyst-ui/contexts/Debug';
 *
 * function MyComponent() {
 *   const debug = useDebugger('catalyst:MyComponent');
 *
 *   debug('Component rendered');
 *   debug('State:', { count: 5 });
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @example Conditional Logging
 * ```tsx
 * import { useDebugger } from '@/catalyst-ui/contexts/Debug';
 *
 * function DataFetcher() {
 *   const debug = useDebugger('catalyst:api:DataFetcher');
 *
 *   const fetchData = async () => {
 *     debug('Starting fetch...');
 *     try {
 *       const res = await fetch('/api/data');
 *       debug('Response status:', res.status);
 *       const json = await res.json();
 *       debug('Data received:', json);
 *     } catch (error) {
 *       debug('Fetch failed:', error);
 *     }
 *   };
 *
 *   return <button onClick={fetchData}>Fetch</button>;
 * }
 * ```
 *
 * @public
 */
export const useDebugger = (namespace: string): Debug.Debugger => {
  const context = useContext(DebuggerContext);
  if (!context) {
    throw new Error("useDebugger must be used within a DebuggerProvider");
  }
  return context.getDebugger(namespace);
};
