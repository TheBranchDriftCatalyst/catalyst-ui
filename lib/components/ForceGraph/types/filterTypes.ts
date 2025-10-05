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
  hideSystemResources: boolean;
  excludedNodeIds: string[];
}

// Filter panel props
export interface FilterPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

// Filter option interfaces
export interface FilterOption<T = string> {
  value: T;
  label: string;
}

export interface NodeTypeOption {
  kind: NodeKind;
  label: string;
  color: string;
}

export interface EdgeTypeOption {
  kind: EdgeKind;
  label: string;
}

// Filter option constants
export const NODE_TYPE_OPTIONS: NodeTypeOption[] = [
  { kind: 'container', label: 'Containers', color: 'var(--primary)' },
  { kind: 'network', label: 'Networks', color: 'var(--neon-yellow)' },
  { kind: 'image', label: 'Images', color: 'var(--neon-red)' },
  { kind: 'volume', label: 'Volumes', color: 'var(--neon-purple)' },
];

export const EDGE_TYPE_OPTIONS: EdgeTypeOption[] = [
  { kind: 'derived_from', label: 'Derived From' },
  { kind: 'connected_to', label: 'Connected To' },
  { kind: 'mounted_into', label: 'Mounted Into' },
];

export const STATUS_FILTER_OPTIONS: FilterOption<NodeStatusFilter>[] = [
  { value: 'all', label: 'All Status' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'in-use', label: 'In Use' },
];

export const CONNECTION_FILTER_OPTIONS: FilterOption<NodeConnectionFilter>[] = [
  { value: 'all', label: 'All Nodes' },
  { value: 'connected', label: 'Connected' },
  { value: 'orphaned', label: 'Orphaned' },
];
