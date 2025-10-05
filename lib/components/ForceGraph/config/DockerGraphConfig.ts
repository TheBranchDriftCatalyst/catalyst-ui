import { GraphConfig, NodeTypeConfig, EdgeTypeConfig, FilterOption, QuickFilter, AttributeFilter } from './types';
import { NodeTypeOption, EdgeTypeOption } from '../types/filterTypes';
import { NodeData } from '../types';

/**
 * Unified Docker node/edge/filter type definition.
 * This is the single source of truth for all Docker-specific metadata.
 * All types are derived from this const to ensure type safety and eliminate string matching.
 */
const DockerNodeEdgeTypes = {
  nodes: {
    container: {
      label: 'Containers',
      color: 'var(--primary)',
      icon: '📦',
    },
    network: {
      label: 'Networks',
      color: 'var(--neon-yellow)',
      icon: '🌐',
    },
    image: {
      label: 'Images',
      color: 'var(--neon-red)',
      icon: '💿',
    },
    volume: {
      label: 'Volumes',
      color: 'var(--neon-purple)',
      icon: '💾',
    },
  },
  edges: {
    derived_from: {
      label: 'Derived From',
      color: 'var(--neon-red)',
    },
    connected_to: {
      label: 'Connected To',
      color: 'var(--primary)',
    },
    mounted_into: {
      label: 'Mounted Into',
      color: 'var(--neon-yellow)',
    },
  },
  statusFilters: {
    all: 'All Status',
    running: 'Running',
    stopped: 'Stopped',
    'in-use': 'In Use',
  },
} as const;

/**
 * Docker-specific node types (derived from DockerNodeEdgeTypes)
 */
export type DockerNodeKind = keyof typeof DockerNodeEdgeTypes.nodes;

/**
 * Docker-specific edge types (derived from DockerNodeEdgeTypes)
 */
export type DockerEdgeKind = keyof typeof DockerNodeEdgeTypes.edges;

/**
 * Docker-specific status filter type (derived from DockerNodeEdgeTypes)
 * NOTE: This is Docker-specific (running/stopped/in-use are container statuses)
 */
export type DockerStatusFilter = keyof typeof DockerNodeEdgeTypes.statusFilters;

/**
 * Docker node type configurations (derived from DockerNodeEdgeTypes)
 */
const dockerNodeTypes: Record<DockerNodeKind, NodeTypeConfig> = DockerNodeEdgeTypes.nodes as Record<DockerNodeKind, NodeTypeConfig>;

/**
 * Docker edge type configurations (derived from DockerNodeEdgeTypes)
 */
const dockerEdgeTypes: Record<DockerEdgeKind, EdgeTypeConfig> = DockerNodeEdgeTypes.edges as Record<DockerEdgeKind, EdgeTypeConfig>;

/**
 * Docker status filter options (for UI components)
 * Derived from DockerNodeEdgeTypes.statusFilters
 * NOTE: These are Docker-specific (container/resource statuses)
 */
const dockerStatusFilterOptions: FilterOption<DockerStatusFilter>[] = Object.entries(DockerNodeEdgeTypes.statusFilters).map(
  ([value, label]) => ({ value: value as DockerStatusFilter, label })
);

/**
 * Docker layer0 filter - hides common Docker infrastructure resources
 */
const dockerLayer0Filter: AttributeFilter = {
  name: 'layer0',
  label: 'Hide Infrastructure',
  type: 'boolean',
  defaultValue: false,
  patterns: ['bridge', 'host', 'none', 'default', 'docker_gwbridge', 'ingress'],
  predicate: (enabled: boolean, node: NodeData, filter?: AttributeFilter) => {
    if (!enabled) return true; // Keep all nodes if filter disabled
    const name = (node.name || node.Name || '').toLowerCase();
    const isInfrastructure = filter?.patterns?.some(pattern => name.includes(pattern)) || false;
    return !isInfrastructure; // Filter out infrastructure nodes
  },
};

/**
 * Docker quick filter presets
 * NOTE: Now type-safe - no more 'as any' needed!
 */
const dockerQuickFilters: QuickFilter[] = [
  {
    label: 'Orphaned',
    icon: '🔍',
    className: 'px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5',
    action: () => ({
      showOrphanedOnly: true,
      statusFilter: 'all',
      connectionFilter: 'orphaned', // Graph-level property
      showRunningOnly: false,
      showInUseOnly: false,
    }),
  },
  {
    label: 'Running',
    icon: '▶️',
    className: 'px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5',
    action: () => ({
      showRunningOnly: true,
      statusFilter: 'running', // Docker-specific status
      showOrphanedOnly: false,
      showInUseOnly: false,
    }),
  },
  {
    label: 'Minimal',
    icon: '🎯',
    className: 'px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5',
    action: () => ({
      attributeFilterValues: { layer0: true },
      showOrphanedOnly: false,
      statusFilter: 'in-use', // Docker-specific status
      connectionFilter: 'connected', // Graph-level property
    }),
  },
];

/**
 * Default Docker graph configuration
 * This is the default configuration for backwards compatibility
 */
export const DockerGraphConfig: GraphConfig<DockerNodeKind, DockerEdgeKind> = {
  nodeTypes: dockerNodeTypes,
  edgeTypes: dockerEdgeTypes,
  // Docker-specific attribute filters
  attributeFilters: [dockerLayer0Filter],
  // Quick filter presets
  quickFilters: dockerQuickFilters,
  // Graph title
  title: 'DOCKER GRAPH',
  // Domain-specific filter options
  statusFilterOptions: dockerStatusFilterOptions,
};

/**
 * Helper to get node configuration for a Docker node
 */
export const getDockerNodeConfig = (kind: DockerNodeKind): NodeTypeConfig => {
  return dockerNodeTypes[kind];
};

/**
 * Helper to get edge configuration for a Docker edge
 */
export const getDockerEdgeConfig = (kind: DockerEdgeKind): EdgeTypeConfig => {
  return dockerEdgeTypes[kind];
};

// NOTE: Legacy exports for backwards compatibility
// These are now available in DockerGraphConfig.statusFilterOptions
export const DOCKER_STATUS_FILTER_OPTIONS = dockerStatusFilterOptions;

/**
 * Docker node type filter options (for UI components)
 * Built from dockerNodeTypes config
 */
export const DOCKER_NODE_TYPE_OPTIONS: NodeTypeOption[] = Object.entries(dockerNodeTypes).map(
  ([kind, config]) => ({
    kind: kind as any,
    label: config.label,
    color: config.color,
  })
);

/**
 * Docker edge type filter options (for UI components)
 * Built from dockerEdgeTypes config
 */
export const DOCKER_EDGE_TYPE_OPTIONS: EdgeTypeOption[] = Object.entries(dockerEdgeTypes).map(
  ([kind, config]) => ({
    kind: kind as any,
    label: config.label,
  })
);
