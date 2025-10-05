import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { NodeKind, EdgeKind, GraphData } from '../types';
import { GraphFilters } from '../types/filterTypes';
import { GraphConfig } from '../config/types';
import { DockerGraphConfig } from '../config/DockerGraphConfig';

export type { NodeStatusFilter, NodeConnectionFilter, GraphFilters } from '../types/filterTypes';

// Local storage key for persisted filters
export const FILTERS_STORAGE_KEY = 'catalyst-ui.forcegraph.filters.v1';

// Helper to clear persisted filters from localStorage
export function clearPersistedFilters() {
  try {
    localStorage.removeItem(FILTERS_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export interface GraphState {
  config: GraphConfig<any, any>;
  rawData: GraphData | null;
  filteredData: GraphData | null;
  filters: GraphFilters;
  hoveredNode: string | null;
  selectedNode: string | null;
  dimensions: { width: number; height: number };
  layout: 'force' | 'structured';
  orthogonalEdges: boolean;
}

// Action types
type GraphAction =
  | { type: 'SET_RAW_DATA'; payload: GraphData }
  | { type: 'SET_FILTERED_DATA'; payload: GraphData }
  | { type: 'UPDATE_FILTERS'; payload: Partial<GraphFilters> }
  | { type: 'SET_HOVERED_NODE'; payload: string | null }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'SET_DIMENSIONS'; payload: { width: number; height: number } }
  | { type: 'TOGGLE_NODE_VISIBILITY'; payload: NodeKind }
  | { type: 'TOGGLE_EDGE_VISIBILITY'; payload: EdgeKind }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_LAYOUT'; payload: 'force' | 'structured' }
  | { type: 'TOGGLE_ORTHOGONAL_EDGES' };

// Default state
const defaultFilters: GraphFilters = {
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
  statusFilter: 'all',
  connectionFilter: 'all',
  searchQuery: '',
  showOrphanedOnly: false,
  showRunningOnly: false,
  showInUseOnly: false,
  excludedNodeIds: [],
};

const getInitialState = (config: GraphConfig<any, any>): GraphState => ({
  config,
  rawData: null,
  filteredData: null,
  filters: defaultFilters,
  hoveredNode: null,
  selectedNode: null,
  dimensions: { width: window.innerWidth, height: window.innerHeight },
  layout: 'force',
  orthogonalEdges: false,
});

// Reducer
function graphReducer(state: GraphState, action: GraphAction): GraphState {
  switch (action.type) {
    case 'SET_RAW_DATA':
      return { ...state, rawData: action.payload };

    case 'SET_FILTERED_DATA':
      return { ...state, filteredData: action.payload };

    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'SET_HOVERED_NODE':
      return { ...state, hoveredNode: action.payload };

    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.payload };

    case 'SET_DIMENSIONS':
      return { ...state, dimensions: action.payload };

    case 'TOGGLE_NODE_VISIBILITY':
      return {
        ...state,
        filters: {
          ...state.filters,
          visibleNodes: {
            ...state.filters.visibleNodes,
            [action.payload]: !state.filters.visibleNodes[action.payload]
          }
        }
      };

    case 'TOGGLE_EDGE_VISIBILITY':
      return {
        ...state,
        filters: {
          ...state.filters,
          visibleEdges: {
            ...state.filters.visibleEdges,
            [action.payload]: !state.filters.visibleEdges[action.payload]
          }
        }
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: defaultFilters
      };

    case 'SET_LAYOUT':
      return { ...state, layout: action.payload };

    case 'TOGGLE_ORTHOGONAL_EDGES':
      return { ...state, orthogonalEdges: !state.orthogonalEdges };

    default:
      return state;
  }
}

// Context
const GraphContext = createContext<{
  state: GraphState;
  dispatch: React.Dispatch<GraphAction>;
} | null>(null);

// Provider
export const GraphProvider: React.FC<{
  children: ReactNode;
  config?: GraphConfig<any, any>;
}> = ({ children, config = DockerGraphConfig }) => {
  const [state, dispatch] = useReducer(graphReducer, getInitialState(config), (init) => {
    try {
      const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
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
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(state.filters));
    } catch (e) {
      // ignore storage errors
    }
  }, [state.filters]);

  return (
    <GraphContext.Provider value={{ state, dispatch }}>
      {children}
    </GraphContext.Provider>
  );
};

// Hook to use the context
export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraphContext must be used within a GraphProvider');
  }
  return context;
};

// Convenience hook to access just the config
export const useGraphConfig = () => {
  const { state } = useGraphContext();
  return state.config;
};
