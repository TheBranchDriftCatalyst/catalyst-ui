/**
 * Docker-specific graph configuration for ForceGraph.
 *
 * This module provides a complete, production-ready graph configuration for
 * visualizing Docker infrastructure (containers, networks, images, volumes).
 * It serves as both a usable default config and a reference implementation
 * for creating custom domain-specific configs.
 *
 * @module ForceGraph/config/DockerGraphConfig
 *
 * @remarks
 * **Key Design Principles:**
 * - Single source of truth: `DockerNodeEdgeTypes` const defines all metadata
 * - Type-safe: All types derived from const (no string literals scattered)
 * - Composable: Individual exports allow granular imports
 * - Extensible: Easy to fork and customize for your own domains
 *
 * **What's included:**
 * - Node types: container, network, image, volume
 * - Edge types: derived_from, connected_to, mounted_into
 * - Status filters: all, running, stopped, in-use
 * - Quick filters: Orphaned, Running, Minimal presets
 * - Attribute filters: layer0 (hide infrastructure)
 *
 * @example
 * ```typescript
 * import { ForceGraph } from '@/catalyst-ui/components';
 * import { DockerGraphConfig } from './config/DockerGraphConfig';
 *
 * function MyDockerGraph() {
 *   return (
 *     <ForceGraph
 *       data={dockerData}
 *       config={DockerGraphConfig}
 *       storageKey="docker-graph"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Customize by extending the base config
 * import { DockerGraphConfig } from './config/DockerGraphConfig';
 *
 * const customConfig: GraphConfig = {
 *   ...DockerGraphConfig,
 *   title: 'My Custom Docker Graph',
 *   quickFilters: [
 *     ...DockerGraphConfig.quickFilters!,
 *     {
 *       label: 'Production',
 *       icon: '🚀',
 *       action: () => ({ searchQuery: 'prod' })
 *     }
 *   ]
 * };
 * ```
 */

import {
  GraphConfig,
  NodeTypeConfig,
  EdgeTypeConfig,
  FilterOption,
  QuickFilter,
  AttributeFilter,
} from "./types";
import { NodeTypeOption, EdgeTypeOption } from "../types/filterTypes";
import { NodeData } from "../types";

/**
 * Single source of truth for Docker node, edge, and status type definitions.
 *
 * @remarks
 * This const object serves as the central registry for all Docker-specific
 * graph metadata. All exported types and configs are derived from this object,
 * ensuring type safety and eliminating scattered string literals.
 *
 * **Structure:**
 * - `nodes`: Node type configurations (label, color, icon)
 * - `edges`: Edge type configurations (label, color)
 * - `statusFilters`: Status filter options (value → label mapping)
 *
 * **Why const?**
 * Using `as const` allows TypeScript to infer literal types, enabling
 * precise type extraction (e.g., `keyof typeof DockerNodeEdgeTypes.nodes`
 * becomes `"container" | "network" | "image" | "volume"`).
 *
 * **Color Scheme:**
 * Colors use CSS custom properties from the Catalyst theme:
 * - `var(--primary)`: Cyan/electric blue (containers, connections)
 * - `var(--neon-yellow)`: Yellow (networks, mounts)
 * - `var(--neon-red)`: Red (images, derivations)
 * - `var(--neon-purple)`: Purple (volumes)
 *
 * @internal
 * This is an internal implementation detail. Import domain-specific types
 * from the module exports instead (DockerNodeKind, DockerEdgeKind, etc.).
 */
const DockerNodeEdgeTypes = {
  nodes: {
    container: {
      label: "Containers",
      color: "var(--primary)",
      icon: "📦",
    },
    network: {
      label: "Networks",
      color: "var(--neon-yellow)",
      icon: "🌐",
    },
    image: {
      label: "Images",
      color: "var(--neon-red)",
      icon: "💿",
    },
    volume: {
      label: "Volumes",
      color: "var(--neon-purple)",
      icon: "💾",
    },
  },
  edges: {
    derived_from: {
      label: "Derived From",
      color: "var(--neon-red)",
    },
    connected_to: {
      label: "Connected To",
      color: "var(--primary)",
    },
    mounted_into: {
      label: "Mounted Into",
      color: "var(--neon-yellow)",
    },
  },
  statusFilters: {
    all: "All Status",
    running: "Running",
    stopped: "Stopped",
    "in-use": "In Use",
  },
} as const;

/**
 * Union type of Docker node kinds.
 *
 * @remarks
 * Extracted from `DockerNodeEdgeTypes.nodes` to ensure type safety.
 * This type represents all possible node types in a Docker infrastructure graph.
 *
 * **Values:**
 * - `container`: Docker containers (running or stopped)
 * - `network`: Docker networks (bridge, host, overlay, etc.)
 * - `image`: Docker images (base images, derived images)
 * - `volume`: Docker volumes (persistent storage)
 *
 * @example
 * ```typescript
 * const nodeKind: DockerNodeKind = 'container';
 *
 * // Type-safe node creation
 * const node: NodeData = {
 *   id: 'nginx-prod',
 *   kind: 'container' as DockerNodeKind,
 *   name: 'nginx-prod',
 *   attributes: { status: 'running' }
 * };
 * ```
 */
export type DockerNodeKind = keyof typeof DockerNodeEdgeTypes.nodes;

/**
 * Union type of Docker edge kinds.
 *
 * @remarks
 * Extracted from `DockerNodeEdgeTypes.edges` to ensure type safety.
 * This type represents all possible relationships between Docker resources.
 *
 * **Values:**
 * - `derived_from`: Image derivation (child image → parent image)
 * - `connected_to`: Network connection (container → network)
 * - `mounted_into`: Volume mount (volume → container)
 *
 * @example
 * ```typescript
 * const edgeKind: DockerEdgeKind = 'connected_to';
 *
 * // Type-safe edge creation
 * const edge: EdgeData = {
 *   src: 'nginx-prod',
 *   dst: 'bridge-net',
 *   kind: 'connected_to' as DockerEdgeKind,
 *   source: containerNode,
 *   target: networkNode
 * };
 * ```
 */
export type DockerEdgeKind = keyof typeof DockerNodeEdgeTypes.edges;

/**
 * Union type of Docker status filter values.
 *
 * @remarks
 * Extracted from `DockerNodeEdgeTypes.statusFilters` to ensure type safety.
 * These status values are specific to Docker container/resource states.
 *
 * **Values:**
 * - `all`: Show all resources regardless of status
 * - `running`: Show only running containers
 * - `stopped`: Show only stopped containers
 * - `in-use`: Show only resources being used by containers (networks, volumes)
 *
 * **Note:** This is Docker-specific. Other domains (e.g., Kubernetes) would
 * define their own status values like "ready", "pending", "failed".
 *
 * @example
 * ```typescript
 * const status: DockerStatusFilter = 'running';
 *
 * // Type-safe filter state
 * const filters: GraphFilters = {
 *   statusFilter: 'running',
 *   showRunningOnly: true,
 *   // ... other filters
 * };
 * ```
 */
export type DockerStatusFilter = keyof typeof DockerNodeEdgeTypes.statusFilters;

/**
 * Docker node type configurations.
 *
 * @remarks
 * Derived from `DockerNodeEdgeTypes.nodes` and cast to the correct type.
 * This mapping provides the visual configuration for each Docker node type.
 *
 * Used internally by `DockerGraphConfig.nodeTypes`.
 *
 * @internal
 */
const dockerNodeTypes: Record<DockerNodeKind, NodeTypeConfig> = DockerNodeEdgeTypes.nodes as Record<
  DockerNodeKind,
  NodeTypeConfig
>;

/**
 * Docker edge type configurations.
 *
 * @remarks
 * Derived from `DockerNodeEdgeTypes.edges` and cast to the correct type.
 * This mapping provides the visual configuration for each Docker edge type.
 *
 * Used internally by `DockerGraphConfig.edgeTypes`.
 *
 * @internal
 */
const dockerEdgeTypes: Record<DockerEdgeKind, EdgeTypeConfig> = DockerNodeEdgeTypes.edges as Record<
  DockerEdgeKind,
  EdgeTypeConfig
>;

/**
 * Docker status filter UI options.
 *
 * @remarks
 * Converted from `DockerNodeEdgeTypes.statusFilters` into an array of
 * FilterOption objects for use in UI components (dropdowns, selects).
 *
 * **Values:**
 * - `all`: "All Status" - Show all resources
 * - `running`: "Running" - Show only running containers
 * - `stopped`: "Stopped" - Show only stopped containers
 * - `in-use`: "In Use" - Show only resources being used
 *
 * Used internally by `DockerGraphConfig.statusFilterOptions`.
 *
 * @internal
 *
 * @example
 * ```typescript
 * // Render in a dropdown
 * <select>
 *   {dockerStatusFilterOptions.map(opt => (
 *     <option key={opt.value} value={opt.value}>{opt.label}</option>
 *   ))}
 * </select>
 * ```
 */
const dockerStatusFilterOptions: FilterOption<DockerStatusFilter>[] = Object.entries(
  DockerNodeEdgeTypes.statusFilters
).map(([value, label]) => ({ value: value as DockerStatusFilter, label }));

/**
 * Docker layer0 attribute filter - hides built-in Docker infrastructure.
 *
 * @remarks
 * The "layer0" filter removes common Docker infrastructure resources that are
 * present in every Docker installation but rarely need to be visualized.
 * This helps reduce visual clutter and focus on application-specific resources.
 *
 * **Filtered resources:**
 * - `bridge`: Default bridge network
 * - `host`: Host network mode
 * - `none`: Null network mode
 * - `default`: Default network/volume
 * - `docker_gwbridge`: Swarm gateway bridge
 * - `ingress`: Swarm ingress network
 *
 * **How it works:**
 * - Type: `boolean` (rendered as checkbox in filter panel)
 * - When disabled (default): Shows all nodes
 * - When enabled: Hides nodes whose names match any pattern
 * - Matching: Case-insensitive substring match
 *
 * @internal
 *
 * @example
 * ```typescript
 * // Enable in filter state
 * const filters: GraphFilters = {
 *   // ... other filters
 *   attributeFilterValues: {
 *     layer0: true  // Hide infrastructure
 *   }
 * };
 * ```
 */
const dockerLayer0Filter: AttributeFilter = {
  name: "layer0",
  label: "Hide Infrastructure",
  type: "boolean",
  defaultValue: false,
  patterns: ["bridge", "host", "none", "default", "docker_gwbridge", "ingress"],
  predicate: (enabled: boolean, node: NodeData, filter?: AttributeFilter) => {
    if (!enabled) return true; // Keep all nodes if filter disabled
    const name = (node.name || node.Name || "").toLowerCase();
    const isInfrastructure = filter?.patterns?.some(pattern => name.includes(pattern)) || false;
    return !isInfrastructure; // Filter out infrastructure nodes
  },
};

/**
 * Docker quick filter presets - one-click filter combinations.
 *
 * @remarks
 * Quick filters provide convenient shortcuts for common filtering scenarios.
 * Each preset applies multiple filter changes simultaneously to achieve a
 * specific view of the Docker infrastructure.
 *
 * **Presets:**
 *
 * 1. **Orphaned** - Find unused resources:
 *    - Shows only nodes without edges (unused containers, networks, volumes)
 *    - Use case: Cleanup, identifying stale resources
 *    - Combines: `showOrphanedOnly`, `connectionFilter: 'orphaned'`
 *
 * 2. **Running** - Show active containers only:
 *    - Filters to running containers and their connections
 *    - Use case: Focus on live infrastructure
 *    - Combines: `showRunningOnly`, `statusFilter: 'running'`
 *
 * 3. **Minimal** - Clean, focused view:
 *    - Hides infrastructure nodes (layer0 filter)
 *    - Shows only resources in use
 *    - Shows only connected nodes
 *    - Use case: Application-level visualization without Docker internals
 *    - Combines: `layer0: true`, `statusFilter: 'in-use'`, `connectionFilter: 'connected'`
 *
 * @internal
 *
 * @example
 * ```typescript
 * // Custom quick filter
 * const productionFilter: QuickFilter = {
 *   label: 'Production',
 *   icon: '🚀',
 *   className: 'bg-green-500 text-white',
 *   action: () => ({
 *     searchQuery: 'prod',
 *     statusFilter: 'running',
 *     connectionFilter: 'connected'
 *   })
 * };
 * ```
 */
const dockerQuickFilters: QuickFilter[] = [
  {
    label: "Orphaned",
    icon: "🔍",
    className:
      "px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5",
    action: () => ({
      showOrphanedOnly: true,
      statusFilter: "all",
      connectionFilter: "orphaned", // Graph-level property
      showRunningOnly: false,
      showInUseOnly: false,
    }),
  },
  {
    label: "Running",
    icon: "▶️",
    className:
      "px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5",
    action: () => ({
      showRunningOnly: true,
      statusFilter: "running", // Docker-specific status
      showOrphanedOnly: false,
      showInUseOnly: false,
    }),
  },
  {
    label: "Minimal",
    icon: "🎯",
    className:
      "px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5",
    action: () => ({
      attributeFilterValues: { layer0: true },
      showOrphanedOnly: false,
      statusFilter: "in-use", // Docker-specific status
      connectionFilter: "connected", // Graph-level property
    }),
  },
];

/**
 * Complete Docker graph configuration.
 *
 * @remarks
 * This is the primary export of this module - a production-ready GraphConfig
 * for Docker infrastructure visualization. It combines all Docker-specific
 * node types, edge types, filters, and styling into a single configuration object.
 *
 * **Configuration includes:**
 * - 4 node types: container, network, image, volume
 * - 3 edge types: derived_from, connected_to, mounted_into
 * - 1 attribute filter: layer0 (hide infrastructure)
 * - 3 quick filters: Orphaned, Running, Minimal
 * - Status filter options: all, running, stopped, in-use
 * - Graph title: "DOCKER GRAPH"
 *
 * **Usage:**
 * Pass this config to the `<ForceGraph>` component's `config` prop.
 *
 * @example
 * ```typescript
 * import { ForceGraph } from '@/catalyst-ui/components';
 * import { DockerGraphConfig } from './config/DockerGraphConfig';
 *
 * function DockerVisualization() {
 *   const data = fetchDockerData(); // Your data loading logic
 *
 *   return (
 *     <ForceGraph
 *       data={data}
 *       config={DockerGraphConfig}
 *       storageKey="docker-graph"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Extend the config with custom settings
 * import { DockerGraphConfig } from './config/DockerGraphConfig';
 *
 * const customConfig: GraphConfig = {
 *   ...DockerGraphConfig,
 *   title: 'Production Docker Infrastructure',
 *   quickFilters: [
 *     ...DockerGraphConfig.quickFilters!,
 *     {
 *       label: 'Production',
 *       icon: '🚀',
 *       action: () => ({ searchQuery: 'prod' })
 *     }
 *   ]
 * };
 * ```
 */
export const DockerGraphConfig: GraphConfig<DockerNodeKind, DockerEdgeKind> = {
  nodeTypes: dockerNodeTypes,
  edgeTypes: dockerEdgeTypes,
  // Docker-specific attribute filters
  attributeFilters: [dockerLayer0Filter],
  // Quick filter presets
  quickFilters: dockerQuickFilters,
  // Graph title
  title: "DOCKER GRAPH",
  // Domain-specific filter options
  statusFilterOptions: dockerStatusFilterOptions,
};

/**
 * Get node type configuration for a Docker node kind.
 *
 * @param kind - Docker node kind (container, network, image, volume)
 * @returns NodeTypeConfig with label, color, and icon
 *
 * @remarks
 * Helper function for programmatic access to node configurations.
 * Useful when building custom renderers or dynamic UI elements.
 *
 * @example
 * ```typescript
 * const containerConfig = getDockerNodeConfig('container');
 * console.log(containerConfig.label);  // "Containers"
 * console.log(containerConfig.color);  // "var(--primary)"
 * console.log(containerConfig.icon);   // "📦"
 * ```
 */
export const getDockerNodeConfig = (kind: DockerNodeKind): NodeTypeConfig => {
  return dockerNodeTypes[kind];
};

/**
 * Get edge type configuration for a Docker edge kind.
 *
 * @param kind - Docker edge kind (derived_from, connected_to, mounted_into)
 * @returns EdgeTypeConfig with label and color
 *
 * @remarks
 * Helper function for programmatic access to edge configurations.
 * Useful when rendering custom edge styles or tooltips.
 *
 * @example
 * ```typescript
 * const connectionConfig = getDockerEdgeConfig('connected_to');
 * console.log(connectionConfig.label);  // "Connected To"
 * console.log(connectionConfig.color);  // "var(--primary)"
 * ```
 */
export const getDockerEdgeConfig = (kind: DockerEdgeKind): EdgeTypeConfig => {
  return dockerEdgeTypes[kind];
};

/**
 * Docker status filter options (legacy export).
 *
 * @deprecated Use `DockerGraphConfig.statusFilterOptions` instead.
 * This export is maintained for backwards compatibility.
 *
 * @remarks
 * Provides the same array of FilterOption objects as
 * `DockerGraphConfig.statusFilterOptions`. Prefer using the config
 * property for consistency.
 *
 * @example
 * ```typescript
 * // Deprecated
 * import { DOCKER_STATUS_FILTER_OPTIONS } from './config/DockerGraphConfig';
 *
 * // Preferred
 * import { DockerGraphConfig } from './config/DockerGraphConfig';
 * const options = DockerGraphConfig.statusFilterOptions;
 * ```
 */
export const DOCKER_STATUS_FILTER_OPTIONS = dockerStatusFilterOptions;

/**
 * Docker node type options for UI components.
 *
 * @remarks
 * Pre-formatted array of node type options suitable for rendering in
 * filter checkboxes, legends, or other UI components. Each option includes
 * the kind, label, and color for visual consistency.
 *
 * Derived from `dockerNodeTypes` configuration.
 *
 * @example
 * ```typescript
 * import { DOCKER_NODE_TYPE_OPTIONS } from './config/DockerGraphConfig';
 *
 * // Render as checkboxes
 * {DOCKER_NODE_TYPE_OPTIONS.map(opt => (
 *   <label key={opt.kind} style={{ color: opt.color }}>
 *     <input
 *       type="checkbox"
 *       checked={visibleNodes[opt.kind]}
 *       onChange={() => toggleNode(opt.kind)}
 *     />
 *     {opt.label}
 *   </label>
 * ))}
 * ```
 */
export const DOCKER_NODE_TYPE_OPTIONS: NodeTypeOption[] = Object.entries(dockerNodeTypes).map(
  ([kind, config]) => ({
    kind: kind as any,
    label: config.label,
    color: config.color,
  })
);

/**
 * Docker edge type options for UI components.
 *
 * @remarks
 * Pre-formatted array of edge type options suitable for rendering in
 * filter checkboxes, legends, or other UI components. Each option includes
 * the kind and label.
 *
 * Derived from `dockerEdgeTypes` configuration.
 *
 * @example
 * ```typescript
 * import { DOCKER_EDGE_TYPE_OPTIONS } from './config/DockerGraphConfig';
 *
 * // Render as checkboxes
 * {DOCKER_EDGE_TYPE_OPTIONS.map(opt => (
 *   <label key={opt.kind}>
 *     <input
 *       type="checkbox"
 *       checked={visibleEdges[opt.kind]}
 *       onChange={() => toggleEdge(opt.kind)}
 *     />
 *     {opt.label}
 *   </label>
 * ))}
 * ```
 */
export const DOCKER_EDGE_TYPE_OPTIONS: EdgeTypeOption[] = Object.entries(dockerEdgeTypes).map(
  ([kind, config]) => ({
    kind: kind as any,
    label: config.label,
  })
);
