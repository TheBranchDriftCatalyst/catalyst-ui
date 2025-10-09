import { GraphData } from "../types";
import { GraphFilters } from "../types/filterTypes";
import { GraphConfig } from "../config/types";
import { LayoutKind } from "../utils/layouts";

/**
 * GraphState - Core state shape for the ForceGraph component
 */
export interface GraphState {
  config: GraphConfig<any, any>;
  rawData: GraphData | null;
  filteredData: GraphData | null;
  filters: GraphFilters;
  hoveredNode: string | null;
  selectedNode: string | null;
  dimensions: { width: number; height: number };
  layout: LayoutKind;
  layoutOptions: Record<string, any>;
  orthogonalEdges: boolean;
}

/**
 * Default filter values
 */
export const defaultFilters: GraphFilters = {
  visibleNodes: {
    container: true,
    network: true,
    image: true,
    volume: true,
  },
  visibleEdges: {
    derived_from: true,
    connected_to: true,
    mounted_into: true,
  },
  statusFilter: "all",
  connectionFilter: "all",
  searchQuery: "",
  showOrphanedOnly: false,
  showRunningOnly: false,
  showInUseOnly: false,
  excludedNodeIds: [],
};

/**
 * Create initial graph state
 */
export const getInitialState = (config: GraphConfig<any, any>): GraphState => ({
  config,
  rawData: null,
  filteredData: null,
  filters: defaultFilters,
  hoveredNode: null,
  selectedNode: null,
  dimensions: { width: window.innerWidth, height: window.innerHeight },
  layout: "force",
  layoutOptions: {},
  orthogonalEdges: false,
});

/**
 * Default local storage key for persisted filters
 */
export const DEFAULT_FILTERS_STORAGE_KEY = "catalyst-ui.forcegraph.filters.v1";

/**
 * Helper to clear persisted filters from localStorage
 */
export function clearPersistedFilters(storageKey: string = DEFAULT_FILTERS_STORAGE_KEY) {
  try {
    localStorage.removeItem(storageKey);
  } catch (e) {
    // ignore
  }
}
