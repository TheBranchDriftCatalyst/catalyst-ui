import { NodeData, EdgeData } from "../types";
import { GraphFilters, GraphConnectionFilter } from "../types/filterTypes";
import { GraphConfig } from "../config/types";

/**
 * Pure filter predicate functions
 * Extracted from useGraphFilters for performance and testability
 */

/**
 * Check if a node is orphaned (has no edges)
 * This is a graph-level property, not domain-specific
 */
export const isOrphanedNode = (nodeId: string, edges: EdgeData[]): boolean => {
  return !edges.some(edge => edge.src === nodeId || edge.dst === nodeId);
};

/**
 * Check if a node matches the status filter
 * NOTE: This is domain-specific logic (e.g., Docker container statuses)
 */
export const matchesStatusFilter = (node: NodeData, filter: string): boolean => {
  if (filter === "all") {
    return true;
  }

  const status = node.attributes?.status?.toLowerCase();

  // Domain-specific status matching (currently Docker-focused)
  switch (filter) {
    case "running":
      return status === "running";
    case "stopped":
      return status === "stopped" || status === "exited";
    case "in-use":
      return status === "in-use" || status === "running";
    default:
      return true;
  }
};

/**
 * Check if a node matches the connection filter
 * This is a graph-level property (connected/orphaned), not domain-specific
 */
export const matchesConnectionFilter = (
  nodeId: string,
  filter: GraphConnectionFilter,
  edges: EdgeData[]
): boolean => {
  if (filter === "all") {
    return true;
  }

  const isOrphaned = isOrphanedNode(nodeId, edges);

  switch (filter) {
    case "connected":
      return !isOrphaned;
    case "orphaned":
      return isOrphaned;
    default:
      return true;
  }
};

/**
 * Check if a node matches the search query
 */
export const matchesSearchQuery = (node: NodeData, query: string): boolean => {
  if (!query.trim()) {
    return true;
  }

  const searchLower = query.toLowerCase();
  const nodeName = (node.name || node.Name || "").toLowerCase();
  const nodeId = node.id.toLowerCase();

  return nodeName.includes(searchLower) || nodeId.includes(searchLower);
};

/**
 * Check if a node matches attribute filters from config
 */
export const matchesAttributeFilters = (
  node: NodeData,
  filters: GraphFilters,
  config?: GraphConfig<any, any>
): boolean => {
  if (!config?.attributeFilters || config.attributeFilters.length === 0) {
    return true; // No attribute filters configured
  }

  if (!filters.attributeFilterValues) {
    return true; // No filter values set
  }

  // All attribute filters must pass
  return config.attributeFilters.every(filter => {
    const filterValue = filters.attributeFilterValues?.[filter.name];

    // If no value is set for this filter, use default or skip
    if (filterValue === undefined || filterValue === null) {
      if (filter.defaultValue !== undefined) {
        return filter.predicate(filter.defaultValue, node, filter);
      }
      return true; // Skip this filter if no value set
    }

    // Apply the predicate function with filter config as 3rd param
    return filter.predicate(filterValue, node, filter);
  });
};

/**
 * Check if a node passes the "running only" filter
 */
export const matchesRunningOnly = (node: NodeData, enabled: boolean): boolean => {
  if (!enabled) return true;
  const status = node.attributes?.status?.toLowerCase();
  return status === "running";
};

/**
 * Check if a node passes the "in-use only" filter
 */
export const matchesInUseOnly = (node: NodeData, enabled: boolean): boolean => {
  if (!enabled) return true;
  const status = node.attributes?.status?.toLowerCase();
  return status === "in-use" || status === "running";
};
