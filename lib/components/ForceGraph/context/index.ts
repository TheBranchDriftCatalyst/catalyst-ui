/**
 * ForceGraph Context Module
 *
 * Provides state management for the ForceGraph component via React Context.
 * Split into focused modules for maintainability:
 * - state.ts: State types, defaults, and initialization
 * - actions.ts: Action type definitions
 * - reducer.ts: Pure reducer function
 * - GraphContext.tsx: Context, Provider, and hooks
 */

// Main exports
export { GraphProvider, useGraphContext, useGraphConfig } from "./GraphContext";

// Type exports
export type { GraphState } from "./state";
export type { GraphAction } from "./actions";
export type { GraphConnectionFilter, GraphFilters } from "../types/filterTypes";

// Utility exports
export { DEFAULT_FILTERS_STORAGE_KEY, clearPersistedFilters } from "./state";
