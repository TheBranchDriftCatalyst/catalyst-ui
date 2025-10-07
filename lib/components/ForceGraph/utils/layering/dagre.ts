/**
 * Dagre Layout (Mermaid-style)
 * Uses Dagre's layered graph algorithm - the same used by Mermaid.js
 * Perfect for flowcharts and directed graphs
 */

import * as dagre from "dagre";
import { NodeData, EdgeData } from "../../types";
import { LayoutDimensions } from "../layouts";

export interface DagreLayoutOptions {
  rankdir?: "TB" | "BT" | "LR" | "RL"; // Direction: Top-Bottom, Bottom-Top, Left-Right, Right-Left
  ranksep?: number; // Separation between ranks/layers
  nodesep?: number; // Separation between nodes in same rank
  edgesep?: number; // Separation between edges
  marginx?: number; // Horizontal margin
  marginy?: number; // Vertical margin
  ranker?: "network-simplex" | "tight-tree" | "longest-path"; // Ranking algorithm
}

export const DagreLayoutConfig = {
  name: "Dagre (Mermaid)",
  description: "Layered graph layout algorithm used by Mermaid.js",
  fields: [
    {
      key: "rankdir",
      label: "Direction",
      type: "select" as const,
      options: [
        { value: "TB", label: "Top → Bottom" },
        { value: "BT", label: "Bottom → Top" },
        { value: "LR", label: "Left → Right" },
        { value: "RL", label: "Right → Left" },
      ],
      defaultValue: "TB",
    },
    {
      key: "ranker",
      label: "Ranking Algorithm",
      type: "select" as const,
      options: [
        { value: "network-simplex", label: "Network Simplex (Best)" },
        { value: "tight-tree", label: "Tight Tree" },
        { value: "longest-path", label: "Longest Path" },
      ],
      defaultValue: "network-simplex",
    },
    {
      key: "ranksep",
      label: "Layer Separation",
      type: "number" as const,
      min: 20,
      max: 300,
      step: 10,
      defaultValue: 100,
    },
    {
      key: "nodesep",
      label: "Node Separation",
      type: "number" as const,
      min: 20,
      max: 200,
      step: 10,
      defaultValue: 80,
    },
    {
      key: "marginx",
      label: "Horizontal Margin",
      type: "number" as const,
      min: 0,
      max: 200,
      step: 10,
      defaultValue: 50,
    },
    {
      key: "marginy",
      label: "Vertical Margin",
      type: "number" as const,
      min: 0,
      max: 200,
      step: 10,
      defaultValue: 50,
    },
  ],
};

/**
 * Apply Dagre layout (Mermaid-style)
 * Returns nodes with fixed positions (static layout)
 */
export function applyDagreLayout(
  nodes: NodeData[],
  edges: EdgeData[],
  _dimensions: LayoutDimensions,
  options: DagreLayoutOptions = {}
): NodeData[] {
  const {
    rankdir = "TB",
    ranksep = 100,
    nodesep = 80,
    edgesep = 10,
    marginx = 50,
    marginy = 50,
    ranker = "network-simplex",
  } = options;

  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set graph properties
  g.setGraph({
    rankdir,
    ranksep,
    nodesep,
    edgesep,
    marginx,
    marginy,
    ranker,
  });

  // Default node and edge labels
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  nodes.forEach(node => {
    // Dagre needs node dimensions - use defaults for now
    g.setNode(node.id, {
      label: node.name || node.id,
      width: 120, // Approximate node width
      height: 60, // Approximate node height
    });
  });

  // Add edges to the graph
  edges.forEach(edge => {
    g.setEdge(edge.src, edge.dst, {
      label: edge.kind,
    });
  });

  // Run the layout algorithm
  dagre.layout(g);

  // Apply the calculated positions back to nodes
  nodes.forEach(node => {
    const dagreNode = g.node(node.id);
    if (dagreNode) {
      node.x = dagreNode.x;
      node.y = dagreNode.y;
      node.fx = dagreNode.x; // Fix position (static layout)
      node.fy = dagreNode.y;
    }
  });

  return nodes;
}
