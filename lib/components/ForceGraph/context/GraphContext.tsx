import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { GraphConfig } from "../config/types";
import { DockerGraphConfig } from "../config/DockerGraphConfig";
import { GraphState, getInitialState, DEFAULT_FILTERS_STORAGE_KEY } from "./state";
import { GraphAction } from "./actions";
import { graphReducer } from "./reducer";

// Re-export types and utilities for convenience
export type { GraphConnectionFilter, GraphFilters } from "../types/filterTypes";
export type { GraphState } from "./state";
export type { GraphAction } from "./actions";
export { DEFAULT_FILTERS_STORAGE_KEY, clearPersistedFilters } from "./state";

/**
 * GraphContext - React context for graph state management
 */
const GraphContext = createContext<{
  state: GraphState;
  dispatch: React.Dispatch<GraphAction>;
} | null>(null);

/**
 * GraphProvider - Provides graph state to all child components
 *
 * Features:
 * - Manages graph data, filters, layout, and UI state
 * - Persists filters to localStorage
 * - Restores filters from localStorage on mount
 */
export const GraphProvider: React.FC<{
  children: ReactNode;
  config?: GraphConfig<any, any>;
  storageKey?: string;
}> = ({ children, config = DockerGraphConfig, storageKey = DEFAULT_FILTERS_STORAGE_KEY }) => {
  const [state, dispatch] = useReducer(graphReducer, getInitialState(config), init => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...init, filters: { ...init.filters, ...parsed } };
      }
    } catch (e) {
      // ignore parse/localstorage errors and fall back to defaults
    }
    return init;
  });

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.filters));
    } catch (e) {
      // ignore storage errors
    }
  }, [state.filters, storageKey]);

  return <GraphContext.Provider value={{ state, dispatch }}>{children}</GraphContext.Provider>;
};

/**
 * useGraphContext - Access graph state and dispatch
 *
 * @throws Error if used outside of GraphProvider
 */
export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }
  return context;
};

/**
 * useGraphConfig - Convenience hook to access just the graph config
 */
export const useGraphConfig = () => {
  const { state } = useGraphContext();
  return state.config;
};
