import { GraphConfig, NodeTypeConfig, EdgeTypeConfig, FilterOption, QuickFilter, AttributeFilter } from './types';
import { NodeTypeOption, EdgeTypeOption } from '../types/filterTypes';
import { NodeData } from '../types';

/**
 * Docker-specific node types
 */
export type DockerNodeKind = 'container' | 'network' | 'image' | 'volume';

/**
 * Docker-specific edge types
 */
export type DockerEdgeKind = 'derived_from' | 'connected_to' | 'mounted_into';

/**
 * Docker-specific status filter type
 */
export type DockerNodeStatusFilter = 'all' | 'running' | 'stopped' | 'in-use' | 'orphaned';

/**
 * Docker-specific connection filter type
 */
export type DockerNodeConnectionFilter = 'all' | 'connected' | 'orphaned';

/**
 * Docker node type configurations
 */
const dockerNodeTypes: Record<DockerNodeKind, NodeTypeConfig> = {
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
};

/**
 * Docker edge type configurations
 */
const dockerEdgeTypes: Record<DockerEdgeKind, EdgeTypeConfig> = {
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
};

/**
 * Docker status filter options (for UI components)
 */
const dockerStatusFilterOptions: FilterOption<DockerNodeStatusFilter>[] = [
  { value: 'all', label: 'All Status' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'in-use', label: 'In Use' },
];

/**
 * Docker connection filter options (for UI components)
 */
const dockerConnectionFilterOptions: FilterOption<DockerNodeConnectionFilter>[] = [
  { value: 'all', label: 'All Nodes' },
  { value: 'connected', label: 'Connected' },
  { value: 'orphaned', label: 'Orphaned' },
];

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
 */
const dockerQuickFilters: QuickFilter[] = [
  {
    label: 'Orphaned',
    icon: '🔍',
    className: 'px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5',
    action: () => ({
      showOrphanedOnly: true,
      statusFilter: 'all',
      connectionFilter: 'orphaned',
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
      statusFilter: 'running' as any,
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
      statusFilter: 'in-use' as any,
      connectionFilter: 'connected' as any,
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
  connectionFilterOptions: dockerConnectionFilterOptions,
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
// These are now available in DockerGraphConfig.statusFilterOptions and DockerGraphConfig.connectionFilterOptions
export const DOCKER_STATUS_FILTER_OPTIONS = dockerStatusFilterOptions;
export const DOCKER_CONNECTION_FILTER_OPTIONS = dockerConnectionFilterOptions;

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
