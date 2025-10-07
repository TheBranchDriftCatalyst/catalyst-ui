// Filter types for ForceGraph

import { NodeKind, EdgeKind } from "./index";
import { FilterOption } from "../config/types";

/**
 * Graph-level connection filter (domain-agnostic)
 * Filters nodes based on their connectivity in the graph:
 * - 'all': Show all nodes
 * - 'connected': Show only nodes with edges
 * - 'orphaned': Show only nodes without edges
 */
export type GraphConnectionFilter = "all" | "connected" | "orphaned";

/**
 * Graph-level connection filter options for UI (domain-agnostic)
 * These are graph properties that apply to any domain
 */
export const GRAPH_CONNECTION_FILTER_OPTIONS: FilterOption<GraphConnectionFilter>[] = [
  { value: "all", label: "All Nodes" },
  { value: "connected", label: "Connected" },
  { value: "orphaned", label: "Orphaned" },
];

export interface GraphFilters {
  // Graph-level filters (domain-agnostic)
  visibleNodes: Record<NodeKind, boolean>;
  visibleEdges: Record<EdgeKind, boolean>;
  connectionFilter: GraphConnectionFilter; // Graph-level: connected/orphaned
  searchQuery: string;
  showOrphanedOnly: boolean; // Graph-level: nodes without edges
  excludedNodeIds: string[];
  attributeFilterValues?: Record<string, any>; // Generic attribute filters from config

  // Domain-specific filters (e.g., Docker-specific)
  // These values depend on the domain config (DockerGraphConfig, etc.)
  statusFilter: string; // Domain-specific: e.g., 'running', 'stopped' for Docker
  showRunningOnly: boolean; // Domain-specific: Docker containers
  showInUseOnly: boolean; // Domain-specific: Docker resources
}

// Filter panel props
export interface FilterPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

// Generic filter option interfaces
export interface NodeTypeOption {
  kind: NodeKind;
  label: string;
  color: string;
}

export interface EdgeTypeOption {
  kind: EdgeKind;
  label: string;
}
