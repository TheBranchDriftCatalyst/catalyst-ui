/**
 * Graph navigation and traversal utilities
 *
 * Provides enhanced graph data structures with convenience methods for
 * traversing relationships between nodes and edges. Makes it easy to
 * explore graph topology without writing manual loops.
 *
 * **Key Features:**
 * - Helper methods on nodes: neighbors(), outgoing(), incoming()
 * - Direct edge.source and edge.target references
 * - Safe nested property access via get() method
 * - Type-safe TypeScript interfaces
 *
 * **Use Cases:**
 * - Finding all neighbors of a node
 * - Traversing incoming/outgoing connections
 * - Implementing graph algorithms (BFS, DFS, etc.)
 * - Building custom filter predicates
 * - Analyzing graph topology
 *
 * @module ForceGraph/utils/GraphNavigator
 */

import { GraphData, NodeData, EdgeData } from "../types";

/**
 * Node with enhanced navigation methods
 *
 * Extends base NodeData with helper methods for graph traversal.
 */
export type NodeWithHelpers = NodeData & {
  /** Get all neighboring nodes (connected by any edge) */
  neighbors: () => NodeWithHelpers[];
  /** Get all outgoing edges from this node */
  outgoing: () => EdgeWithHelpers[];
  /** Get all incoming edges to this node */
  incoming: () => EdgeWithHelpers[];
  /** Safely access nested properties (e.g., "attributes.status") */
  get: (path: string) => any;
};

/**
 * Edge with direct source/target references
 *
 * Extends base EdgeData with convenience references to connected nodes.
 */
export type EdgeWithHelpers = EdgeData & {
  /** Source node (instead of just src ID) */
  source: NodeWithHelpers;
  /** Target node (instead of just dst ID) */
  target: NodeWithHelpers;
  /** Safely access nested properties */
  get: (path: string) => any;
};

/**
 * Graph data structure with enhanced navigation
 *
 * Contains nodes (indexed by ID) and edges with bidirectional references.
 */
export type EnrichedGraph = {
  /** Map of node ID to node with helpers */
  nodes: Record<string, NodeWithHelpers>;
  /** Array of edges with source/target references */
  edges: EdgeWithHelpers[];
};

/**
 * Safely read nested object property by path
 *
 * **Examples:**
 * - `getByPath(node, "attributes.status")` → `node.attributes.status`
 * - `getByPath(node, "name")` → `node.name`
 * - `getByPath(node, "foo.bar.baz")` → undefined (if path doesn't exist)
 *
 * @param obj - Object to read from
 * @param path - Dot-separated path (e.g., "attributes.status")
 * @returns Value at path, or undefined if not found
 */
function getByPath(obj: any, path: string) {
  if (!path) {
    return undefined;
  }
  const parts = path.split(".");
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) {
      return undefined;
    }
    cur = cur[p];
  }
  return cur;
}

/**
 * Enrich graph data with navigation helper methods
 *
 * Transforms a plain graph data structure into an enhanced version with
 * bidirectional references and convenience methods. This makes graph
 * traversal much easier and more intuitive.
 *
 * **What It Does:**
 * 1. Creates NodeWithHelpers for each node (with get(), neighbors(), etc.)
 * 2. Creates EdgeWithHelpers for each edge (with source, target references)
 * 3. Wires up bidirectional relationships:
 *    - Nodes know their incoming/outgoing edges
 *    - Edges know their source/target nodes
 *    - Nodes can find all neighbors
 *
 * **Usage:**
 * ```typescript
 * const enriched = enrichGraph(graphData);
 *
 * // Access nodes by ID
 * const node = enriched.nodes["node-123"];
 *
 * // Get neighbors
 * const neighbors = node.neighbors();
 *
 * // Traverse outgoing edges
 * node.outgoing().forEach(edge => {
 *   console.log(`${node.id} -> ${edge.target.id}`);
 * });
 *
 * // Safe property access
 * const status = node.get("attributes.status");
 *
 * // Traverse incoming edges
 * node.incoming().forEach(edge => {
 *   console.log(`${edge.source.id} -> ${node.id}`);
 * });
 * ```
 *
 * **Performance:**
 * - Time Complexity: O(n + e) where n = nodes, e = edges
 * - Space Complexity: O(n + e) - creates new objects
 * - Called once when graph data changes
 * - Results can be cached/memoized
 *
 * **Use Cases:**
 * - Implementing breadth-first search (BFS)
 * - Finding shortest paths
 * - Detecting cycles
 * - Calculating node centrality
 * - Custom filtering based on topology
 *
 * @param data - Plain graph data (nodes and edges)
 * @returns Enriched graph with helper methods
 *
 * @example
 * ```typescript
 * // Find all nodes reachable from a starting node (BFS)
 * function findReachable(start: NodeWithHelpers): Set<string> {
 *   const visited = new Set<string>();
 *   const queue = [start];
 *
 *   while (queue.length > 0) {
 *     const node = queue.shift()!;
 *     if (visited.has(node.id)) continue;
 *     visited.add(node.id);
 *
 *     node.neighbors().forEach(neighbor => queue.push(neighbor));
 *   }
 *
 *   return visited;
 * }
 * ```
 */
export function enrichGraph(data: GraphData): EnrichedGraph {
  const nodeMap: Record<string, NodeWithHelpers> = {};

  // First clone nodes and add placeholder methods
  for (const [id, n] of Object.entries(data.nodes)) {
    const node: NodeWithHelpers = {
      ...n,
      neighbors: () => [],
      outgoing: () => [],
      incoming: () => [],
      get: (path: string) => getByPath(n, path),
    };
    nodeMap[id] = node;
  }

  // Build edges with source/target references
  const edges: EdgeWithHelpers[] = (data.edges || []).map(e => {
    const srcNode = nodeMap[e.src];
    const dstNode = nodeMap[e.dst];
    const edge: EdgeWithHelpers = {
      ...e,
      source: srcNode,
      target: dstNode,
      get: (path: string) => getByPath(e, path),
    };
    return edge;
  });

  // Attach incoming/outgoing references and neighbors
  for (const edge of edges) {
    if (edge.source) {
      const src = edge.source;
      const prevOut = src.outgoing;
      src.outgoing = () => [...prevOut(), edge];
    }
    if (edge.target) {
      const tgt = edge.target;
      const prevIn = tgt.incoming;
      tgt.incoming = () => [...prevIn(), edge];
    }
  }

  // neighbors: union of outgoing targets and incoming sources
  for (const node of Object.values(nodeMap)) {
    node.neighbors = () => {
      const outs = node
        .outgoing()
        .map(e => e.target)
        .filter(Boolean);
      const ins = node
        .incoming()
        .map(e => e.source)
        .filter(Boolean);
      // unique by id
      const map: Record<string, NodeWithHelpers> = {};
      [...outs, ...ins].forEach(n => {
        if (n && n.id) {
          map[n.id] = n;
        }
      });
      return Object.values(map);
    };
    node.get = (path: string) => getByPath(node, path);
  }

  return { nodes: nodeMap, edges };
}
