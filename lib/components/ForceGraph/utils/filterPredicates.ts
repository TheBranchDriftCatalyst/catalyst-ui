/**
 * Graph filter predicate functions
 *
 * Pure, testable functions for filtering graph nodes based on various criteria.
 * Extracted from useGraphFilters hook for better performance and testability.
 *
 * **Filter Categories:**
 * - **Graph-level**: Connection status (orphaned/connected)
 * - **Domain-specific**: Status, attributes (e.g., Docker container states)
 * - **Generic**: Search queries, custom attribute filters
 *
 * **Design Principles:**
 * - Pure functions (no side effects)
 * - Composable (can be combined)
 * - Type-safe (TypeScript first)
 * - Fast (O(1) or O(n) operations only)
 *
 * @module ForceGraph/utils/filterPredicates
 */

import { NodeData, EdgeData } from "../types";
import { GraphFilters, GraphConnectionFilter } from "../types/filterTypes";
import { GraphConfig } from "../config/types";

/**
 * Check if a node is orphaned (has no edges)
 *
 * An orphaned node has no incoming or outgoing connections in the graph.
 * This is a structural graph property, independent of domain-specific data.
 *
 * **Use Cases:**
 * - Finding isolated nodes
 * - Detecting potential data quality issues
 * - Filtering out disconnected components
 * - Highlighting unused entities
 *
 * **Performance:**
 * - Time Complexity: O(e) where e = number of edges
 * - Called once per node during filtering
 * - Consider caching for large graphs
 *
 * @param nodeId - ID of node to check
 * @param edges - All edges in the graph
 * @returns true if node has no connections, false otherwise
 *
 * @example
 * ```typescript
 * const orphans = nodes.filter(node =>
 *   isOrphanedNode(node.id, edges)
 * );
 * console.log(`Found ${orphans.length} orphaned nodes`);
 * ```
 */
export const isOrphanedNode = (nodeId: string, edges: EdgeData[]): boolean => {
  return !edges.some(edge => edge.src === nodeId || edge.dst === nodeId);
};

/**
 * Check if a node matches the status filter
 *
 * **Domain-Specific Filter** - Currently optimized for Docker container status.
 * This function maps status filter values to actual node status values.
 *
 * **Status Mappings:**
 * - `"all"` → matches all nodes
 * - `"running"` → status === "running"
 * - `"stopped"` → status === "stopped" OR "exited"
 * - `"in-use"` → status === "in-use" OR "running"
 *
 * **Note:** This is domain-specific and may need customization for other use cases.
 * Consider using {@link matchesAttributeFilters} for generic filtering.
 *
 * @param node - Node to check
 * @param filter - Filter value ("all", "running", "stopped", "in-use")
 * @returns true if node matches filter
 *
 * @example
 * ```typescript
 * // Filter for running containers
 * const runningNodes = nodes.filter(n =>
 *   matchesStatusFilter(n, "running")
 * );
 * ```
 *
 * @see {@link matchesAttributeFilters} for generic attribute filtering
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
 *
 * Filters nodes based on their connectivity in the graph structure.
 * This is a graph-level filter (not domain-specific).
 *
 * **Filter Values:**
 * - `"all"` → all nodes pass
 * - `"connected"` → only nodes with at least one edge
 * - `"orphaned"` → only nodes with no edges
 *
 * **Use Cases:**
 * - Show only connected components
 * - Highlight isolated nodes for investigation
 * - Clean up visualization by hiding orphans
 *
 * @param nodeId - ID of node to check
 * @param filter - Connection filter type
 * @param edges - All edges in graph
 * @returns true if node matches filter
 *
 * @example
 * ```typescript
 * // Show only connected nodes
 * const connectedNodes = nodes.filter(n =>
 *   matchesConnectionFilter(n.id, "connected", edges)
 * );
 * ```
 *
 * @see {@link isOrphanedNode} for the underlying orphan detection
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
 *
 * Performs case-insensitive substring matching on node name and ID.
 *
 * **Searched Fields:**
 * - `node.name` (primary display name)
 * - `node.Name` (alternative name field)
 * - `node.id` (unique identifier)
 *
 * **Matching:**
 * - Case-insensitive
 * - Substring match (not exact match)
 * - Empty query matches all nodes
 *
 * **Performance:**
 * - Time Complexity: O(1) per node
 * - Very fast string operations
 *
 * @param node - Node to check
 * @param query - Search string (trimmed and lowercased automatically)
 * @returns true if query matches node name or ID
 *
 * @example
 * ```typescript
 * // Search for nodes containing "docker"
 * const results = nodes.filter(n =>
 *   matchesSearchQuery(n, "docker")
 * );
 *
 * // Case-insensitive: matches "Docker", "DOCKER", "docker"
 * const matches = matchesSearchQuery(node, "DOCKER"); // true
 * ```
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
 * Check if a node matches custom attribute filters from config
 *
 * Applies all configured attribute filters using their custom predicate functions.
 * This is the generic filter system that works with any node attribute.
 *
 * **How It Works:**
 * 1. Checks if config has attributeFilters defined
 * 2. For each filter, calls its predicate function with:
 *    - Current filter value (from UI state)
 *    - Node data
 *    - Filter configuration
 * 3. All predicates must return true for node to pass
 *
 * **Filter Configuration:**
 * ```typescript
 * attributeFilters: [
 *   {
 *     name: "minConnections",
 *     label: "Minimum Connections",
 *     type: "number",
 *     defaultValue: 0,
 *     predicate: (value, node, filter) => {
 *       const connections = countEdges(node.id);
 *       return connections >= value;
 *     }
 *   }
 * ]
 * ```
 *
 * **Performance:**
 * - Time Complexity: O(f) where f = number of filters
 * - Each predicate should be O(1) for best performance
 * - Called once per node during filtering
 *
 * @param node - Node to check
 * @param filters - Current filter state (includes attributeFilterValues)
 * @param config - Graph configuration with attributeFilters definitions
 * @returns true if node passes all attribute filters
 *
 * @example
 * ```typescript
 * const filtered = nodes.filter(node =>
 *   matchesAttributeFilters(node, currentFilters, graphConfig)
 * );
 * ```
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
