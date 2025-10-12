/**
 * Filter system types for the ForceGraph component.
 *
 * This module defines the filter data structures and UI option types that enable
 * interactive filtering of graph nodes and edges. The filter system supports both
 * domain-agnostic filters (connectivity, search) and domain-specific filters
 * (status, custom attributes).
 *
 * @module ForceGraph/types/filterTypes
 *
 * @example
 * ```typescript
 * import { GraphFilters, GraphConnectionFilter } from './filterTypes';
 *
 * // Create filter state
 * const filters: GraphFilters = {
 *   visibleNodes: { container: true, network: true, image: false, volume: true },
 *   visibleEdges: { derived_from: true, connected_to: true, mounted_into: true },
 *   connectionFilter: 'connected',
 *   searchQuery: 'nginx',
 *   showOrphanedOnly: false,
 *   excludedNodeIds: [],
 *   statusFilter: 'running',
 *   showRunningOnly: true,
 *   showInUseOnly: false
 * };
 * ```
 */

import { NodeKind, EdgeKind } from "./index";
import { FilterOption } from "../config/types";

/**
 * Graph-level connection filter for node connectivity.
 *
 * @remarks
 * This is a domain-agnostic filter that applies to any graph structure.
 * It filters nodes based solely on their connectivity (whether they have edges).
 *
 * - `all`: Display all nodes regardless of connectivity
 * - `connected`: Show only nodes that have at least one edge
 * - `orphaned`: Show only nodes without any edges
 *
 * @example
 * ```typescript
 * // Show only orphaned nodes (useful for finding unused resources)
 * const filter: GraphConnectionFilter = 'orphaned';
 *
 * // Show only connected nodes (hide standalone entities)
 * const filter: GraphConnectionFilter = 'connected';
 * ```
 */
export type GraphConnectionFilter = "all" | "connected" | "orphaned";

/**
 * UI filter options for graph connection states.
 *
 * @remarks
 * These options are domain-agnostic and can be used in any graph domain.
 * They represent structural properties of the graph itself, not domain semantics.
 *
 * Used by filter UI components like dropdowns or radio groups.
 *
 * @example
 * ```typescript
 * import { GRAPH_CONNECTION_FILTER_OPTIONS } from './filterTypes';
 *
 * // Render in a select dropdown
 * <select>
 *   {GRAPH_CONNECTION_FILTER_OPTIONS.map(opt => (
 *     <option key={opt.value} value={opt.value}>{opt.label}</option>
 *   ))}
 * </select>
 * ```
 */
export const GRAPH_CONNECTION_FILTER_OPTIONS: FilterOption<GraphConnectionFilter>[] = [
  { value: "all", label: "All Nodes" },
  { value: "connected", label: "Connected" },
  { value: "orphaned", label: "Orphaned" },
];

/**
 * Complete filter state for a ForceGraph instance.
 *
 * @remarks
 * This interface combines domain-agnostic filters (visibility, connectivity, search)
 * with domain-specific filters (status, running state, usage state).
 *
 * **Domain-agnostic filters** (apply to any graph):
 * - `visibleNodes`: Which node types to show/hide
 * - `visibleEdges`: Which edge types to show/hide
 * - `connectionFilter`: Connectivity-based filtering (all/connected/orphaned)
 * - `searchQuery`: Text search across node names
 * - `showOrphanedOnly`: Quick filter for nodes without edges
 * - `excludedNodeIds`: Specific nodes to hide by ID
 * - `attributeFilterValues`: Generic attribute-based filters from config
 *
 * **Domain-specific filters** (depend on graph domain, e.g., Docker):
 * - `statusFilter`: Resource status (e.g., "running", "stopped" for Docker containers)
 * - `showRunningOnly`: Docker-specific filter for running containers
 * - `showInUseOnly`: Docker-specific filter for in-use resources
 *
 * @example
 * ```typescript
 * // Docker graph filters
 * const dockerFilters: GraphFilters = {
 *   // Domain-agnostic
 *   visibleNodes: { container: true, network: true, image: false, volume: true },
 *   visibleEdges: { derived_from: true, connected_to: true, mounted_into: true },
 *   connectionFilter: 'connected',
 *   searchQuery: '',
 *   showOrphanedOnly: false,
 *   excludedNodeIds: ['old-container-id'],
 *   attributeFilterValues: { layer0: true }, // Hide infrastructure
 *
 *   // Docker-specific
 *   statusFilter: 'running',
 *   showRunningOnly: true,
 *   showInUseOnly: false
 * };
 *
 * // Custom domain filters (hypothetical Kubernetes graph)
 * const k8sFilters: GraphFilters = {
 *   // ... domain-agnostic filters ...
 *   statusFilter: 'ready',      // k8s-specific status
 *   showRunningOnly: false,     // Not applicable to k8s
 *   showInUseOnly: false,       // Not applicable to k8s
 *   attributeFilterValues: { namespace: 'production' }
 * };
 * ```
 */
export interface GraphFilters {
  // ===== Domain-agnostic filters (apply to any graph) =====

  /** Visibility flags for each node type */
  visibleNodes: Record<NodeKind, boolean>;

  /** Visibility flags for each edge type */
  visibleEdges: Record<EdgeKind, boolean>;

  /** Connectivity-based filter (all/connected/orphaned) */
  connectionFilter: GraphConnectionFilter;

  /** Text search query for filtering nodes by name */
  searchQuery: string;

  /** Quick toggle to show only orphaned nodes (nodes without edges) */
  showOrphanedOnly: boolean;

  /** Array of specific node IDs to exclude from display */
  excludedNodeIds: string[];

  /**
   * Generic attribute-based filter values from GraphConfig.attributeFilters
   *
   * @remarks
   * Key is the filter name (e.g., "layer0"), value depends on filter type
   * (boolean, string, number, etc.)
   *
   * @example
   * ```typescript
   * attributeFilterValues: {
   *   layer0: true,           // Hide infrastructure (boolean filter)
   *   namespace: 'production' // Filter by namespace (select filter)
   * }
   * ```
   */
  attributeFilterValues?: Record<string, any>;

  // ===== Domain-specific filters (depend on domain config) =====

  /**
   * Domain-specific status filter value.
   *
   * @remarks
   * For Docker: "all" | "running" | "stopped" | "in-use"
   * For other domains: Define your own status values in GraphConfig.statusFilterOptions
   *
   * @example
   * ```typescript
   * // Docker
   * statusFilter: 'running'
   *
   * // Kubernetes (hypothetical)
   * statusFilter: 'ready'
   * ```
   */
  statusFilter: string;

  /**
   * Docker-specific: Show only running containers.
   *
   * @remarks
   * This is specific to Docker container status. For non-Docker domains,
   * this filter may not apply or may need different semantics.
   */
  showRunningOnly: boolean;

  /**
   * Docker-specific: Show only resources that are in use.
   *
   * @remarks
   * For Docker, "in use" means networks/volumes with connected containers.
   * For other domains, define custom meaning or ignore this filter.
   */
  showInUseOnly: boolean;
}

/**
 * Props for the filter panel component.
 *
 * @remarks
 * Controls the visibility and toggle behavior of the filter panel UI.
 * The filter panel typically slides in/out from the side of the graph.
 *
 * @example
 * ```typescript
 * function FilterPanel({ isVisible, onToggle }: FilterPanelProps) {
 *   return (
 *     <div className={isVisible ? 'visible' : 'hidden'}>
 *       <button onClick={onToggle}>Close</button>
 *       {/* Filter controls... *\/}
 *     </div>
 *   );
 * }
 * ```
 */
export interface FilterPanelProps {
  /** Whether the filter panel is currently visible */
  isVisible: boolean;

  /** Callback to toggle filter panel visibility */
  onToggle: () => void;
}

/**
 * UI option for a node type in filter controls.
 *
 * @remarks
 * Represents a single node type that can be toggled in the visibility filters.
 * Includes visual metadata (label, color) for rendering checkboxes or toggles.
 *
 * @example
 * ```typescript
 * const containerOption: NodeTypeOption = {
 *   kind: 'container',
 *   label: 'Containers',
 *   color: 'var(--primary)'
 * };
 *
 * // Render as checkbox
 * <label style={{ color: containerOption.color }}>
 *   <input type="checkbox" />
 *   {containerOption.label}
 * </label>
 * ```
 */
export interface NodeTypeOption {
  /** The node kind identifier (matches NodeKind) */
  kind: NodeKind;

  /** Human-readable label for UI display */
  label: string;

  /** CSS color value for visual consistency with node rendering */
  color: string;
}

/**
 * UI option for an edge type in filter controls.
 *
 * @remarks
 * Represents a single edge type that can be toggled in the visibility filters.
 * Includes human-readable label for rendering checkboxes or toggles.
 *
 * @example
 * ```typescript
 * const connectionOption: EdgeTypeOption = {
 *   kind: 'connected_to',
 *   label: 'Connected To'
 * };
 *
 * // Render as checkbox
 * <label>
 *   <input type="checkbox" />
 *   {connectionOption.label}
 * </label>
 * ```
 */
export interface EdgeTypeOption {
  /** The edge kind identifier (matches EdgeKind) */
  kind: EdgeKind;

  /** Human-readable label for UI display */
  label: string;
}
