import { GraphState, defaultFilters } from "./state";
import { GraphAction } from "./actions";

/**
 * graphReducer - Pure reducer function for graph state updates
 */
export function graphReducer(state: GraphState, action: GraphAction): GraphState {
  switch (action.type) {
    case "SET_RAW_DATA":
      return { ...state, rawData: action.payload };

    case "SET_FILTERED_DATA":
      return { ...state, filteredData: action.payload };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "SET_HOVERED_NODE":
      return { ...state, hoveredNode: action.payload };

    case "SET_SELECTED_NODE":
      return { ...state, selectedNode: action.payload };

    case "SET_DIMENSIONS":
      return { ...state, dimensions: action.payload };

    case "TOGGLE_NODE_VISIBILITY":
      return {
        ...state,
        filters: {
          ...state.filters,
          visibleNodes: {
            ...state.filters.visibleNodes,
            [action.payload]: !state.filters.visibleNodes[action.payload],
          },
        },
      };

    case "TOGGLE_EDGE_VISIBILITY":
      return {
        ...state,
        filters: {
          ...state.filters,
          visibleEdges: {
            ...state.filters.visibleEdges,
            [action.payload]: !state.filters.visibleEdges[action.payload],
          },
        },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
      };

    case "SET_LAYOUT":
      return { ...state, layout: action.payload };

    case "SET_LAYOUT_OPTIONS":
      return { ...state, layoutOptions: action.payload };

    case "TOGGLE_ORTHOGONAL_EDGES":
      return { ...state, orthogonalEdges: !state.orthogonalEdges };

    default:
      return state;
  }
}
