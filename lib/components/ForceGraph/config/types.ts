/**
 * Configuration types for customizing ForceGraph behavior and appearance.
 *
 * This module defines the configuration system that allows you to customize
 * node rendering, edge styling, filtering behavior, and layout options.
 * All configuration is type-safe and can be domain-specific (e.g., Docker, Kubernetes).
 *
 * @module ForceGraph/config/types
 *
 * @example
 * ```typescript
 * import { GraphConfig, NodeTypeConfig, EdgeTypeConfig } from './types';
 *
 * // Define node types
 * const nodeTypes: Record<string, NodeTypeConfig> = {
 *   server: { label: 'Servers', color: '#ff0000', icon: '🖥️' },
 *   database: { label: 'Databases', color: '#00ff00', icon: '💾' }
 * };
 *
 * // Define edge types
 * const edgeTypes: Record<string, EdgeTypeConfig> = {
 *   connects_to: { label: 'Connects To', color: '#0000ff' }
 * };
 *
 * // Create config
 * const config: GraphConfig = {
 *   nodeTypes,
 *   edgeTypes,
 *   title: 'Infrastructure Graph'
 * };
 * ```
 */

import React from "react";
import { NodeData } from "../types";
import { GraphFilters } from "../types/filterTypes";

/**
 * Props passed to custom node renderer components.
 *
 * @remarks
 * Custom node renderers receive these props to render nodes with consistent
 * sizing and behavior. The renderer can use the node's data to customize
 * appearance based on status, attributes, etc.
 *
 * @example
 * ```typescript
 * const CustomNodeRenderer: React.FC<NodeRendererProps> = ({
 *   data,
 *   width,
 *   height,
 *   pad,
 *   imgSize,
 *   showLogo
 * }) => {
 *   const isActive = data.attributes?.status === 'active';
 *
 *   return (
 *     <g>
 *       <rect
 *         width={width}
 *         height={height}
 *         fill={isActive ? 'green' : 'gray'}
 *         rx={4}
 *       />
 *       <text x={width/2} y={height/2} textAnchor="middle">
 *         {data.name}
 *       </text>
 *     </g>
 *   );
 * };
 * ```
 */
export interface NodeRendererProps {
  /** Node data including ID, kind, name, and attributes */
  data: NodeData;

  /** Calculated node width in pixels */
  width: number;

  /** Calculated node height in pixels */
  height: number;

  /** Internal padding for node content */
  pad: number;

  /** Size for icon/logo images */
  imgSize: number;

  /** Whether to display node type logo/icon */
  showLogo?: boolean;
}

/**
 * Custom node renderer component type.
 *
 * @remarks
 * Node renderers are React functional components that receive NodeRendererProps
 * and return SVG elements to render the node. They allow complete customization
 * of node appearance while maintaining consistent sizing and layout.
 *
 * @example
 * ```typescript
 * const CircleNodeRenderer: NodeRenderer = ({ data, width, height }) => {
 *   const radius = Math.min(width, height) / 2;
 *   return (
 *     <circle
 *       r={radius}
 *       fill={data.attributes?.color || 'blue'}
 *     />
 *   );
 * };
 * ```
 */
export type NodeRenderer = React.FC<NodeRendererProps>;

/**
 * Configuration for a specific node type.
 *
 * @remarks
 * Defines the visual appearance and behavior of a node type. Each node kind
 * in your graph should have a corresponding NodeTypeConfig entry.
 *
 * @example
 * ```typescript
 * const containerConfig: NodeTypeConfig = {
 *   label: 'Containers',
 *   color: 'var(--primary)',
 *   icon: '📦',
 *   renderer: CustomContainerRenderer  // Optional custom renderer
 * };
 * ```
 */
export interface NodeTypeConfig {
  /** Human-readable label for UI display (e.g., filter checkboxes) */
  label: string;

  /** CSS color value for node styling (supports CSS variables) */
  color: string;

  /** Emoji or icon character to display on the node */
  icon: string;

  /**
   * Optional custom renderer component for this node type.
   *
   * @remarks
   * If not provided, the default renderer will be used. Custom renderers
   * allow complete control over node appearance.
   */
  renderer?: NodeRenderer;
}

/**
 * Configuration for a specific edge type.
 *
 * @remarks
 * Defines the visual appearance of an edge type. Each edge kind in your
 * graph should have a corresponding EdgeTypeConfig entry.
 *
 * @example
 * ```typescript
 * const connectionConfig: EdgeTypeConfig = {
 *   label: 'Connected To',
 *   color: '#00ff00'
 * };
 * ```
 */
export interface EdgeTypeConfig {
  /** Human-readable label for UI display (e.g., filter checkboxes) */
  label: string;

  /** CSS color value for edge lines (supports CSS variables) */
  color: string;
}

/**
 * Predicate function for attribute-based filtering.
 *
 * @remarks
 * Attribute filter predicates receive the current filter value, the node being
 * filtered, and the filter configuration. They return true to keep the node,
 * false to filter it out.
 *
 * @param value - Current filter value (type depends on filter.type)
 * @param node - Node being evaluated
 * @param filter - Filter configuration (for accessing patterns, options, etc.)
 * @returns true to keep the node, false to filter it out
 *
 * @example
 * ```typescript
 * // Boolean filter: Hide nodes matching patterns
 * const hideInfrastructure: AttributeFilterPredicate<boolean> = (
 *   enabled,
 *   node,
 *   filter
 * ) => {
 *   if (!enabled) return true;  // Keep all if disabled
 *   const name = node.name?.toLowerCase() || '';
 *   const isInfra = filter?.patterns?.some(p => name.includes(p));
 *   return !isInfra;  // Hide infrastructure nodes
 * };
 *
 * // Select filter: Match specific attribute value
 * const namespaceFilter: AttributeFilterPredicate<string> = (
 *   namespace,
 *   node
 * ) => {
 *   if (namespace === 'all') return true;
 *   return node.attributes?.namespace === namespace;
 * };
 * ```
 */
export type AttributeFilterPredicate<T = any> = (
  value: T,
  node: NodeData,
  filter?: AttributeFilter
) => boolean;

/**
 * Configuration for a custom attribute-based filter.
 *
 * @remarks
 * Attribute filters allow filtering nodes based on custom logic. They can
 * operate on node attributes, names, or any other node properties. The filter
 * UI is automatically generated based on the `type` field.
 *
 * Filter types:
 * - `boolean`: Checkbox toggle
 * - `select`: Dropdown menu (requires `options`)
 * - `text`: Text input field
 * - `number`: Number input field
 *
 * @example
 * ```typescript
 * // Boolean filter to hide infrastructure nodes
 * const layer0Filter: AttributeFilter = {
 *   name: 'layer0',
 *   label: 'Hide Infrastructure',
 *   type: 'boolean',
 *   defaultValue: false,
 *   patterns: ['bridge', 'host', 'default'],
 *   predicate: (enabled, node, filter) => {
 *     if (!enabled) return true;
 *     const name = node.name?.toLowerCase() || '';
 *     return !filter?.patterns?.some(p => name.includes(p));
 *   }
 * };
 *
 * // Select filter for namespace
 * const namespaceFilter: AttributeFilter = {
 *   name: 'namespace',
 *   label: 'Namespace',
 *   type: 'select',
 *   defaultValue: 'all',
 *   options: [
 *     { value: 'all', label: 'All Namespaces' },
 *     { value: 'production', label: 'Production' },
 *     { value: 'staging', label: 'Staging' }
 *   ],
 *   predicate: (namespace, node) => {
 *     if (namespace === 'all') return true;
 *     return node.attributes?.namespace === namespace;
 *   }
 * };
 * ```
 */
export interface AttributeFilter {
  /** Unique filter identifier (used as key in attributeFilterValues) */
  name: string;

  /** Human-readable label for UI display */
  label: string;

  /** Filter input type (determines UI component) */
  type: "text" | "select" | "boolean" | "number";

  /**
   * Optional direct path to node attribute.
   *
   * @remarks
   * If provided, can be used for simple equality checks without custom predicate.
   * Example: "attributes.status" to filter by node.attributes?.status
   */
  attributePath?: string;

  /** Predicate function to evaluate whether a node passes the filter */
  predicate: AttributeFilterPredicate;

  /** Default value when filter is initialized */
  defaultValue?: any;

  /**
   * Options for select-type filters.
   *
   * @remarks
   * Required when type is "select". Each option represents a value in the dropdown.
   */
  options?: FilterOption<any>[];

  /**
   * String patterns for pattern-matching filters.
   *
   * @remarks
   * Useful for filters that match node names against a list of patterns.
   * Example: ['bridge', 'host', 'default'] for hiding Docker infrastructure.
   */
  patterns?: string[];
}

/**
 * Generic filter option for UI components.
 *
 * @remarks
 * Used in select filters, dropdowns, and other UI components that need
 * a value/label pair for display.
 *
 * @typeParam T - Type of the option value (defaults to string)
 *
 * @example
 * ```typescript
 * const statusOptions: FilterOption<string>[] = [
 *   { value: 'all', label: 'All Status' },
 *   { value: 'running', label: 'Running' },
 *   { value: 'stopped', label: 'Stopped' }
 * ];
 *
 * const priorityOptions: FilterOption<number>[] = [
 *   { value: 1, label: 'High' },
 *   { value: 2, label: 'Medium' },
 *   { value: 3, label: 'Low' }
 * ];
 * ```
 */
export interface FilterOption<T = string> {
  /** Option value (used in filter state) */
  value: T;

  /** Human-readable label for UI display */
  label: string;
}

/**
 * Quick filter preset configuration.
 *
 * @remarks
 * Quick filters are preset button combinations that apply multiple filter changes
 * at once. They provide shortcuts for common filtering scenarios.
 *
 * The `action` function receives the current filter state and returns a partial
 * filter state to merge in.
 *
 * @example
 * ```typescript
 * const orphanedFilter: QuickFilter = {
 *   label: 'Orphaned',
 *   icon: '🔍',
 *   className: 'bg-red-500 text-white',
 *   action: (current) => ({
 *     showOrphanedOnly: true,
 *     connectionFilter: 'orphaned',
 *     statusFilter: 'all'
 *   })
 * };
 *
 * const activeOnlyFilter: QuickFilter = {
 *   label: 'Active Only',
 *   icon: '▶️',
 *   action: () => ({
 *     statusFilter: 'running',
 *     showRunningOnly: true,
 *     connectionFilter: 'connected'
 *   })
 * };
 * ```
 */
export interface QuickFilter {
  /** Button label text */
  label: string;

  /** Emoji or icon character to display on button */
  icon: string;

  /**
   * Function to compute filter changes when button is clicked.
   *
   * @param currentFilters - Current filter state
   * @returns Partial filter state to merge into current filters
   */
  action: (currentFilters: GraphFilters) => Partial<GraphFilters>;

  /** Optional CSS classes for button styling (Tailwind or custom) */
  className?: string;
}

/**
 * Complete graph configuration object.
 *
 * @remarks
 * This is the main configuration interface for customizing a ForceGraph instance.
 * It defines node/edge types, filters, styling, and layout behavior.
 *
 * The configuration is type-safe with generic type parameters for node and edge kinds,
 * allowing for domain-specific type checking.
 *
 * @typeParam TNodeKind - Union type of node kind strings (e.g., "container" | "network")
 * @typeParam TEdgeKind - Union type of edge kind strings (e.g., "connected_to" | "mounted_into")
 *
 * @example
 * ```typescript
 * // Docker graph configuration
 * const dockerConfig: GraphConfig<DockerNodeKind, DockerEdgeKind> = {
 *   nodeTypes: {
 *     container: { label: 'Containers', color: 'var(--primary)', icon: '📦' },
 *     network: { label: 'Networks', color: 'var(--neon-yellow)', icon: '🌐' },
 *     image: { label: 'Images', color: 'var(--neon-red)', icon: '💿' },
 *     volume: { label: 'Volumes', color: 'var(--neon-purple)', icon: '💾' }
 *   },
 *   edgeTypes: {
 *     derived_from: { label: 'Derived From', color: 'var(--neon-red)' },
 *     connected_to: { label: 'Connected To', color: 'var(--primary)' },
 *     mounted_into: { label: 'Mounted Into', color: 'var(--neon-yellow)' }
 *   },
 *   attributeFilters: [layer0Filter],
 *   quickFilters: [orphanedFilter, runningFilter],
 *   title: 'DOCKER GRAPH',
 *   statusFilterOptions: [
 *     { value: 'all', label: 'All Status' },
 *     { value: 'running', label: 'Running' },
 *     { value: 'stopped', label: 'Stopped' }
 *   ]
 * };
 * ```
 */
export interface GraphConfig<TNodeKind extends string = string, TEdgeKind extends string = string> {
  /**
   * Node type configurations mapped by node kind.
   *
   * @remarks
   * Each key should match a possible value of TNodeKind. Every node in your
   * graph data must have a kind that exists in this mapping.
   */
  nodeTypes: Record<TNodeKind, NodeTypeConfig>;

  /**
   * Edge type configurations mapped by edge kind.
   *
   * @remarks
   * Each key should match a possible value of TEdgeKind. Every edge in your
   * graph data must have a kind that exists in this mapping.
   */
  edgeTypes: Record<TEdgeKind, EdgeTypeConfig>;

  /**
   * Custom attribute-based filters.
   *
   * @remarks
   * These filters are rendered in the filter panel and allow users to filter
   * nodes based on custom logic. Each filter generates a UI control based on
   * its `type` field.
   */
  attributeFilters?: AttributeFilter[];

  /**
   * Quick filter preset buttons.
   *
   * @remarks
   * These buttons appear in the filter panel and provide one-click shortcuts
   * to common filter combinations.
   */
  quickFilters?: QuickFilter[];

  /**
   * Graph title displayed in the header.
   *
   * @remarks
   * Defaults to "FORCE GRAPH" if not provided.
   */
  title?: string;

  /**
   * Default node renderer used as fallback.
   *
   * @remarks
   * If a node type doesn't have a custom renderer defined in NodeTypeConfig,
   * this renderer will be used. If not provided, the built-in default renderer
   * is used.
   */
  defaultNodeRenderer?: NodeRenderer;

  /**
   * Custom function to calculate node dimensions.
   *
   * @remarks
   * By default, nodes have fixed dimensions. This function allows dynamic sizing
   * based on node data (e.g., larger nodes for important entities).
   *
   * @param node - Node to calculate dimensions for
   * @returns Object with width and height in pixels
   *
   * @example
   * ```typescript
   * getNodeDimensions: (node) => {
   *   const nameLength = (node.name || '').length;
   *   return {
   *     width: Math.max(120, nameLength * 8),
   *     height: 80
   *   };
   * }
   * ```
   */
  getNodeDimensions?: (node: NodeData) => { width: number; height: number };

  /**
   * Domain-specific status filter options for UI.
   *
   * @remarks
   * These options populate the status filter dropdown in the filter panel.
   * Values are domain-specific:
   * - Docker: "all" | "running" | "stopped" | "in-use"
   * - Kubernetes (hypothetical): "all" | "ready" | "pending" | "failed"
   *
   * @example
   * ```typescript
   * statusFilterOptions: [
   *   { value: 'all', label: 'All Status' },
   *   { value: 'running', label: 'Running' },
   *   { value: 'stopped', label: 'Stopped' }
   * ]
   * ```
   */
  statusFilterOptions?: FilterOption<any>[];

  /**
   * Additional custom filter options for domain-specific filters.
   *
   * @remarks
   * Use this for any other domain-specific filter dropdowns beyond status.
   * Each key represents a filter name, and the value is an array of options.
   *
   * @example
   * ```typescript
   * customFilterOptions: {
   *   namespace: [
   *     { value: 'all', label: 'All Namespaces' },
   *     { value: 'production', label: 'Production' },
   *     { value: 'staging', label: 'Staging' }
   *   ],
   *   priority: [
   *     { value: 'all', label: 'All Priorities' },
   *     { value: 'high', label: 'High' },
   *     { value: 'low', label: 'Low' }
   *   ]
   * }
   * ```
   */
  customFilterOptions?: Record<string, FilterOption<any>[]>;
}

/**
 * Utility type to extract node kind union from a GraphConfig.
 *
 * @remarks
 * This type helper extracts the node kind type parameter from a GraphConfig type.
 * Useful for creating type-safe node data based on a config.
 *
 * @example
 * ```typescript
 * type MyNodeKind = ExtractNodeKind<typeof MyGraphConfig>;
 * // MyNodeKind = "server" | "database" | "service"
 * ```
 */
export type ExtractNodeKind<T extends GraphConfig<any, any>> =
  T extends GraphConfig<infer K, any> ? K : never;

/**
 * Utility type to extract edge kind union from a GraphConfig.
 *
 * @remarks
 * This type helper extracts the edge kind type parameter from a GraphConfig type.
 * Useful for creating type-safe edge data based on a config.
 *
 * @example
 * ```typescript
 * type MyEdgeKind = ExtractEdgeKind<typeof MyGraphConfig>;
 * // MyEdgeKind = "connects_to" | "depends_on"
 * ```
 */
export type ExtractEdgeKind<T extends GraphConfig<any, any>> =
  T extends GraphConfig<any, infer K> ? K : never;
