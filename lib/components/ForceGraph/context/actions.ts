import { NodeKind, EdgeKind, GraphData } from "../types";
import { GraphFilters } from "../types/filterTypes";
import { LayoutKind } from "../utils/layouts";

/**
 * GraphAction - All possible actions for graph state management
 */
export type GraphAction =
  | { type: "SET_RAW_DATA"; payload: GraphData }
  | { type: "SET_FILTERED_DATA"; payload: GraphData }
  | { type: "UPDATE_FILTERS"; payload: Partial<GraphFilters> }
  | { type: "SET_HOVERED_NODE"; payload: string | null }
  | { type: "SET_SELECTED_NODE"; payload: string | null }
  | { type: "SET_DIMENSIONS"; payload: { width: number; height: number } }
  | { type: "TOGGLE_NODE_VISIBILITY"; payload: NodeKind }
  | { type: "TOGGLE_EDGE_VISIBILITY"; payload: EdgeKind }
  | { type: "RESET_FILTERS" }
  | { type: "SET_LAYOUT"; payload: LayoutKind }
  | { type: "SET_LAYOUT_OPTIONS"; payload: Record<string, any> }
  | { type: "TOGGLE_ORTHOGONAL_EDGES" };
