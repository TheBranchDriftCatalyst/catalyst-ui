// Core types for ForceGraph component

export type NodeID = string;

/**
 * Node kinds - Domain-specific type
 *
 * NOTE: This is currently set to Docker types for backwards compatibility.
 * For new code, import DockerNodeKind from config/DockerGraphConfig instead.
 * In the future, this could be made fully generic via type parameters.
 *
 * @deprecated Import domain-specific types from your graph config instead
 */
export type NodeKind = 'container' | 'network' | 'image' | 'volume';

/**
 * Edge kinds - Domain-specific type
 *
 * NOTE: This is currently set to Docker types for backwards compatibility.
 * For new code, import DockerEdgeKind from config/DockerGraphConfig instead.
 * In the future, this could be made fully generic via type parameters.
 *
 * @deprecated Import domain-specific types from your graph config instead
 */
export type EdgeKind = 'derived_from' | 'connected_to' | 'mounted_into';

/** Node data structure */
export interface NodeData {
  id: string;
  name?: string;
  Name?: string;
  kind: NodeKind;
  attributes?: {
    status?: string;
    image?: string;
    [key: string]: any;
  };
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

/** Edge data structure */
export interface EdgeData {
  id?: string;
  src: string;
  dst: string;
  kind: EdgeKind;
  attributes?: {
    ip?: string;
    target?: string;
    [key: string]: any;
  };
  source: NodeData;
  target: NodeData;
}

/** Graph data structure */
export interface GraphData {
  nodes: Record<string, NodeData>;
  edges: EdgeData[];
}

/** Graph dimensions */
export interface GraphDimensions {
  width: number;
  height: number;
}

/** Visibility state for nodes and edges */
export interface VisibilityState {
  visibleNodes: Record<NodeKind, boolean>;
  visibleEdges: Record<EdgeKind, boolean>;
}

/** Graph event handlers */
export interface GraphEventHandlers {
  setHoveredNode: (id: string | null) => void;
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
  hoveredNode: string | null;
  selectedNode: string | null;
}

/** Props for ReactD3Graph */
export interface ReactD3GraphProps extends VisibilityState, GraphEventHandlers {
  data: GraphData;
  dimensions: GraphDimensions;
  config?: any; // GraphConfig from config/types - using any to avoid circular import
}

/** Props for main ForceGraph component */
export interface ForceGraphProps {
  data: GraphData;
  config?: any; // GraphConfig type from config/types - using any to avoid circular import
}

/** Type guards */
export function isContainerNode(node: NodeData): boolean {
  return node.kind === 'container';
}

export function isNetworkNode(node: NodeData): boolean {
  return node.kind === 'network';
}

export function isImageNode(node: NodeData): boolean {
  return node.kind === 'image';
}

export function isVolumeNode(node: NodeData): boolean {
  return node.kind === 'volume';
}
