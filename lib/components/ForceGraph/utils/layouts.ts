// Layout utilities for force graph

import { NodeData, NodeKind } from '../types';

export type LayoutKind = 'force' | 'structured';

export interface LayoutDimensions {
  width: number;
  height: number;
}

/**
 * Apply structured layout: group nodes by kind into columns, evenly spaced rows
 * This creates a clean columnar layout where each node type gets its own vertical column
 */
export function applyStructuredLayout(
  nodes: NodeData[],
  dimensions: LayoutDimensions
): NodeData[] {
  const { width, height } = dimensions;

  // Get unique node kinds and create groups
  const kinds = Array.from(new Set(nodes.map((n) => n.kind))) as NodeKind[];
  const colCount = kinds.length || 1;
  const colWidth = width / Math.max(1, colCount);

  // Group nodes by kind
  const grouped: Record<string, NodeData[]> = {};
  kinds.forEach((k) => (grouped[k] = []));
  nodes.forEach((n) => grouped[n.kind].push(n));

  // For each group, place nodes vertically centered within their column
  kinds.forEach((k, idx) => {
    const colNodes = grouped[k];
    const perCol = colNodes.length;
    const spacing = Math.max(80, (height - 80) / Math.max(1, perCol));
    const startY = (height - (spacing * (perCol - 1 || 1))) / 2;
    const x = colWidth * idx + colWidth / 2;

    colNodes.forEach((node, i) => {
      node.x = x;
      node.y = startY + i * spacing;
      node.fx = node.x; // Fix position for structured layout
      node.fy = node.y;
    });
  });

  return nodes;
}
