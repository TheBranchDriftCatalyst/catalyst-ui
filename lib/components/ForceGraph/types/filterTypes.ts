// Filter types for ForceGraph

import { NodeKind, EdgeKind } from './index';

export type NodeStatusFilter = 'all' | 'running' | 'stopped' | 'in-use' | 'orphaned';
export type NodeConnectionFilter = 'all' | 'connected' | 'orphaned';

export interface GraphFilters {
  visibleNodes: Record<NodeKind, boolean>;
  visibleEdges: Record<EdgeKind, boolean>;
  statusFilter: NodeStatusFilter;
  connectionFilter: NodeConnectionFilter;
  searchQuery: string;
  showOrphanedOnly: boolean;
  showRunningOnly: boolean;
  showInUseOnly: boolean;
  excludedNodeIds: string[];
  // Generic attribute filters from config
  attributeFilterValues?: Record<string, any>;
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

// NOTE: Concrete filter option constants (e.g., NODE_TYPE_OPTIONS, STATUS_FILTER_OPTIONS)
// should be defined in the domain-specific config (e.g., DockerGraphConfig.ts)
