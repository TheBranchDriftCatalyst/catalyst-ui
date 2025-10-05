// Generic config types
export type {
  NodeRendererProps,
  NodeRenderer,
  NodeTypeConfig,
  EdgeTypeConfig,
  AttributeFilter,
  AttributeFilterPredicate,
  GraphConfig,
  ExtractNodeKind,
  ExtractEdgeKind,
  FilterOption,
} from './types';

// Default Docker configuration
export {
  DockerGraphConfig,
  getDockerNodeConfig,
  getDockerEdgeConfig,
  type DockerNodeKind,
  type DockerEdgeKind,
} from './DockerGraphConfig';
