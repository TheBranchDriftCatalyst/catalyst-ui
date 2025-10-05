import { GraphData, NodeData, EdgeData } from '../types';

// Extended types with helper methods
export type NodeWithHelpers = NodeData & {
  neighbors: () => NodeWithHelpers[];
  outgoing: () => EdgeWithHelpers[];
  incoming: () => EdgeWithHelpers[];
  get: (path: string) => any;
};

export type EdgeWithHelpers = EdgeData & {
  source: NodeWithHelpers;
  target: NodeWithHelpers;
  get: (path: string) => any;
};

export type EnrichedGraph = {
  nodes: Record<string, NodeWithHelpers>;
  edges: EdgeWithHelpers[];
};

// Helper: read nested path like 'attributes.status' safely
function getByPath(obj: any, path: string) {
  if (!path) {
    return undefined;
  }
  const parts = path.split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) {
      return undefined;
    }
    cur = cur[p];
  }
  return cur;
}

// Build enriched graph where nodes and edges get convenience helpers
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
  const edges: EdgeWithHelpers[] = (data.edges || []).map((e) => {
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
      const outs = node.outgoing().map((e) => e.target).filter(Boolean);
      const ins = node.incoming().map((e) => e.source).filter(Boolean);
      // unique by id
      const map: Record<string, NodeWithHelpers> = {};
      [...outs, ...ins].forEach((n) => {
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
