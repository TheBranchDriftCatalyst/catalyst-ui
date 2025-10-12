/**
 * Core type definitions for the ForceGraph component system.
 *
 * This module provides the fundamental data structures for building interactive
 * force-directed graphs with D3.js. While the current implementation uses Docker
 * types for backwards compatibility, the system is designed to be domain-agnostic.
 *
 * @module ForceGraph/types
 *
 * @example
 * ```typescript
 * // Create a simple graph
 * const graphData: GraphData = {
 *   nodes: {
 *     'node1': { id: 'node1', kind: 'container', name: 'web-server' },
 *     'node2': { id: 'node2', kind: 'network', name: 'bridge-net' }
 *   },
 *   edges: [
 *     { src: 'node1', dst: 'node2', kind: 'connected_to', source: nodes.node1, target: nodes.node2 }
 *   ]
 * };
 * ```
 */

/**
 * Unique identifier for graph nodes.
 *
 * @remarks
 * Node IDs must be unique within a graph and are used for edge connections,
 * filtering, selection, and position persistence.
 *
 * @example
 * ```typescript
 * const nodeId: NodeID = "container-nginx-prod";
 * ```
 */
export type NodeID = string;

/**
 * Node kinds - Domain-specific type
 *
 * NOTE: This is currently set to Docker types for backwards compatibility.
 * For new code, import DockerNodeKind from config/DockerGraphConfig instead.
 * In the future, this could be made fully generic via type parameters.
 *
 * @deprecated Import domain-specific types from your graph config instead
 *
 * @example
 * ```typescript
 * // Deprecated usage
 * const kind: NodeKind = "container";
 *
 * // Preferred usage
 * import { DockerNodeKind } from './config/DockerGraphConfig';
 * const kind: DockerNodeKind = "container";
 * ```
 */
export type NodeKind = "container" | "network" | "image" | "volume";

/**
 * Edge kinds - Domain-specific type
 *
 * NOTE: This is currently set to Docker types for backwards compatibility.
 * For new code, import DockerEdgeKind from config/DockerGraphConfig instead.
 * In the future, this could be made fully generic via type parameters.
 *
 * @deprecated Import domain-specific types from your graph config instead
 *
 * @example
 * ```typescript
 * // Deprecated usage
 * const kind: EdgeKind = "connected_to";
 *
 * // Preferred usage
 * import { DockerEdgeKind } from './config/DockerGraphConfig';
 * const kind: DockerEdgeKind = "connected_to";
 * ```
 */
export type EdgeKind = "derived_from" | "connected_to" | "mounted_into";

/**
 * Represents a node in the force-directed graph.
 *
 * @remarks
 * Nodes are the primary visual elements in the graph. Each node has a unique ID,
 * a domain-specific kind (e.g., container, network), and optional position data
 * for D3 force simulation.
 *
 * Position properties:
 * - `x`, `y`: Current computed position (managed by D3)
 * - `fx`, `fy`: Fixed position (when set, node becomes pinned)
 *
 * @example
 * ```typescript
 * const node: NodeData = {
 *   id: "nginx-prod",
 *   name: "nginx-prod",
 *   kind: "container",
 *   attributes: {
 *     status: "running",
 *     image: "nginx:latest"
 *   }
 * };
 *
 * // Pin node to specific position
 * node.fx = 100;
 * node.fy = 200;
 * ```
 */
export interface NodeData {
  /** Unique node identifier */
  id: string;

  /** Display name (lowercase) - legacy Docker format */
  name?: string;

  /** Display name (PascalCase) - legacy Docker format */
  Name?: string;

  /** Domain-specific node type (e.g., container, network, image, volume) */
  kind: NodeKind;

  /** Domain-specific attributes (e.g., status, image, configuration) */
  attributes?: {
    /** Node status (e.g., "running", "stopped" for containers) */
    status?: string;

    /** Image reference (for container nodes) */
    image?: string;

    /** Additional custom attributes */
    [key: string]: any;
  };

  /** Current X position in force simulation */
  x?: number;

  /** Current Y position in force simulation */
  y?: number;

  /** Fixed X position (null = not pinned, number = pinned) */
  fx?: number | null;

  /** Fixed Y position (null = not pinned, number = pinned) */
  fy?: number | null;
}

/**
 * Represents an edge (link) between two nodes in the graph.
 *
 * @remarks
 * Edges define relationships between nodes. Each edge has source/destination IDs,
 * a domain-specific kind (e.g., derived_from, connected_to), and references to
 * the actual node objects for D3 force simulation.
 *
 * @example
 * ```typescript
 * const edge: EdgeData = {
 *   id: "edge-1",
 *   src: "nginx-prod",
 *   dst: "bridge-network",
 *   kind: "connected_to",
 *   attributes: {
 *     ip: "172.17.0.2"
 *   },
 *   source: nginxNode,
 *   target: bridgeNode
 * };
 * ```
 */
export interface EdgeData {
  /** Optional unique edge identifier */
  id?: string;

  /** Source node ID */
  src: string;

  /** Destination node ID */
  dst: string;

  /** Domain-specific edge type (e.g., derived_from, connected_to, mounted_into) */
  kind: EdgeKind;

  /** Domain-specific attributes (e.g., IP address, mount target) */
  attributes?: {
    /** IP address for network connections */
    ip?: string;

    /** Mount target path for volume mounts */
    target?: string;

    /** Additional custom attributes */
    [key: string]: any;
  };

  /** Reference to source node object (required by D3) */
  source: NodeData;

  /** Reference to target node object (required by D3) */
  target: NodeData;
}

/**
 * Complete graph data structure containing all nodes and edges.
 *
 * @remarks
 * The graph data structure uses a dictionary for nodes (O(1) lookup by ID)
 * and an array for edges (easy iteration for rendering).
 *
 * @example
 * ```typescript
 * const graph: GraphData = {
 *   nodes: {
 *     'web': { id: 'web', kind: 'container', name: 'web-server' },
 *     'db': { id: 'db', kind: 'container', name: 'database' },
 *     'net': { id: 'net', kind: 'network', name: 'app-network' }
 *   },
 *   edges: [
 *     { src: 'web', dst: 'net', kind: 'connected_to', source: nodes.web, target: nodes.net },
 *     { src: 'db', dst: 'net', kind: 'connected_to', source: nodes.db, target: nodes.net }
 *   ]
 * };
 * ```
 */
export interface GraphData {
  /** Dictionary of nodes indexed by ID for fast lookups */
  nodes: Record<string, NodeData>;

  /** Array of edges connecting nodes */
  edges: EdgeData[];
}

/**
 * Dimensions for the graph canvas.
 *
 * @remarks
 * Controls the SVG viewBox size and force simulation boundaries.
 * Typically matched to the container element dimensions for responsive layouts.
 *
 * @example
 * ```typescript
 * const dimensions: GraphDimensions = {
 *   width: 1200,
 *   height: 800
 * };
 * ```
 */
export interface GraphDimensions {
  /** Canvas width in pixels */
  width: number;

  /** Canvas height in pixels */
  height: number;
}

/**
 * Visibility state for filtering nodes and edges by type.
 *
 * @remarks
 * Controls which node/edge types are visible in the graph. When a node type
 * is hidden, all nodes of that type are filtered out. When an edge type is
 * hidden, all edges of that type are not rendered (but their connected nodes
 * may still be visible).
 *
 * @example
 * ```typescript
 * const visibility: VisibilityState = {
 *   visibleNodes: {
 *     container: true,
 *     network: true,
 *     image: false,    // Hide all image nodes
 *     volume: true
 *   },
 *   visibleEdges: {
 *     derived_from: false,    // Hide derivation edges
 *     connected_to: true,
 *     mounted_into: true
 *   }
 * };
 * ```
 */
export interface VisibilityState {
  /** Visibility flags for each node type */
  visibleNodes: Record<NodeKind, boolean>;

  /** Visibility flags for each edge type */
  visibleEdges: Record<EdgeKind, boolean>;
}

/**
 * Event handlers for graph interactions.
 *
 * @remarks
 * Manages hover and selection state for interactive graph behaviors.
 * These handlers are passed down to the ReactD3Graph component and used
 * in node rendering to show visual feedback.
 *
 * @example
 * ```typescript
 * const [hoveredNode, setHoveredNode] = useState<string | null>(null);
 * const [selectedNode, setSelectedNode] = useState<string | null>(null);
 *
 * const handlers: GraphEventHandlers = {
 *   setHoveredNode,
 *   setSelectedNode,
 *   hoveredNode,
 *   selectedNode
 * };
 * ```
 */
export interface GraphEventHandlers {
  /** Callback to update the currently hovered node ID */
  setHoveredNode: (id: string | null) => void;

  /** Callback to update the currently selected node ID */
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;

  /** Currently hovered node ID (null if none) */
  hoveredNode: string | null;

  /** Currently selected node ID (null if none) */
  selectedNode: string | null;
}

/**
 * Props for the ReactD3Graph rendering component.
 *
 * @remarks
 * This is the low-level D3 graph renderer. It combines graph data, dimensions,
 * visibility state, and event handlers to render the force-directed graph using D3.js.
 *
 * The `config` prop allows customization of node/edge styling and behavior.
 * The `storageKey` enables persistent node positions across sessions.
 *
 * @example
 * ```typescript
 * <ReactD3Graph
 *   data={graphData}
 *   dimensions={{ width: 1200, height: 800 }}
 *   visibleNodes={visibilityState.visibleNodes}
 *   visibleEdges={visibilityState.visibleEdges}
 *   hoveredNode={hoveredNode}
 *   selectedNode={selectedNode}
 *   setHoveredNode={setHoveredNode}
 *   setSelectedNode={setSelectedNode}
 *   config={DockerGraphConfig}
 *   storageKey="my-graph-positions"
 * />
 * ```
 */
export interface ReactD3GraphProps extends VisibilityState, GraphEventHandlers {
  /** Graph data to render */
  data: GraphData;

  /** Canvas dimensions */
  dimensions: GraphDimensions;

  /** Graph configuration (styling, renderers, etc.) - using any to avoid circular import */
  config?: any; // GraphConfig from config/types

  /** localStorage key for persisting node positions */
  storageKey?: string;
}

/**
 * Props for the main ForceGraph component wrapper.
 *
 * @remarks
 * This is the high-level ForceGraph component that includes the graph renderer,
 * filter panel, and state management. It wraps ReactD3Graph and provides a
 * complete interactive graph experience.
 *
 * The `storageKey` enables both position persistence AND independent filter state
 * when rendering multiple graphs on the same page.
 *
 * @example
 * ```typescript
 * import { ForceGraph } from '@/catalyst-ui/components';
 * import { DockerGraphConfig } from './config/DockerGraphConfig';
 *
 * function MyGraph() {
 *   return (
 *     <ForceGraph
 *       data={dockerGraphData}
 *       config={DockerGraphConfig}
 *       storageKey="docker-graph"
 *     />
 *   );
 * }
 * ```
 */
export interface ForceGraphProps {
  /** Graph data to render */
  data: GraphData;

  /** Graph configuration (styling, renderers, filters, etc.) - using any to avoid circular import */
  config?: any; // GraphConfig type from config/types

  /** localStorage key for persisting positions and filter state */
  storageKey?: string;
}

/**
 * Type guard to check if a node is a container.
 *
 * @param node - Node to check
 * @returns true if node.kind === "container"
 *
 * @deprecated Use domain-specific type guards from your graph config instead.
 * This function is Docker-specific and will be removed in future versions.
 *
 * @example
 * ```typescript
 * if (isContainerNode(node)) {
 *   console.log(`Container: ${node.name}`);
 * }
 * ```
 */
export function isContainerNode(node: NodeData): boolean {
  return node.kind === "container";
}

/**
 * Type guard to check if a node is a network.
 *
 * @param node - Node to check
 * @returns true if node.kind === "network"
 *
 * @deprecated Use domain-specific type guards from your graph config instead.
 * This function is Docker-specific and will be removed in future versions.
 *
 * @example
 * ```typescript
 * if (isNetworkNode(node)) {
 *   console.log(`Network: ${node.name}`);
 * }
 * ```
 */
export function isNetworkNode(node: NodeData): boolean {
  return node.kind === "network";
}

/**
 * Type guard to check if a node is an image.
 *
 * @param node - Node to check
 * @returns true if node.kind === "image"
 *
 * @deprecated Use domain-specific type guards from your graph config instead.
 * This function is Docker-specific and will be removed in future versions.
 *
 * @example
 * ```typescript
 * if (isImageNode(node)) {
 *   console.log(`Image: ${node.name}`);
 * }
 * ```
 */
export function isImageNode(node: NodeData): boolean {
  return node.kind === "image";
}

/**
 * Type guard to check if a node is a volume.
 *
 * @param node - Node to check
 * @returns true if node.kind === "volume"
 *
 * @deprecated Use domain-specific type guards from your graph config instead.
 * This function is Docker-specific and will be removed in future versions.
 *
 * @example
 * ```typescript
 * if (isVolumeNode(node)) {
 *   console.log(`Volume: ${node.name}`);
 * }
 * ```
 */
export function isVolumeNode(node: NodeData): boolean {
  return node.kind === "volume";
}
