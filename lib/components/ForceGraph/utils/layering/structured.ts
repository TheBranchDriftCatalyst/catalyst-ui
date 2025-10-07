/**
 * Structured Layout
 * Groups nodes by kind into vertical columns with even spacing
 */

import { NodeData, EdgeData, NodeKind } from "../../types";
import { LayoutDimensions } from "../layouts";

export interface StructuredLayoutOptions {
  columnSpacing?: number; // Space between columns
  minNodeSpacing?: number; // Minimum space between nodes vertically
}

export const StructuredLayoutConfig = {
  name: "Structured (Columns)",
  description: "Organizes nodes into vertical columns by type",
  fields: [
    {
      key: "minNodeSpacing",
      label: "Node Spacing",
      type: "number" as const,
      min: 50,
      max: 200,
      step: 10,
      defaultValue: 100,
      description: "Minimum vertical space between nodes",
    },
  ],
};

/**
 * Apply structured column-based layout
 * Returns nodes with fixed positions (static layout, no simulation)
 */
export function applyStructuredLayout(
  nodes: NodeData[],
  _edges: EdgeData[],
  dimensions: LayoutDimensions,
  options: StructuredLayoutOptions = {}
): NodeData[] {
  const { minNodeSpacing = 100 } = options;

  const { width, height } = dimensions;

  // Group nodes by kind into columns
  const kinds = Array.from(new Set(nodes.map(n => n.kind))) as NodeKind[];
  const colCount = kinds.length || 1;
  const colWidth = width / Math.max(1, colCount);

  const grouped: Record<string, NodeData[]> = {};
  kinds.forEach(k => (grouped[k] = []));
  nodes.forEach(n => grouped[n.kind].push(n));

  // Position each column
  kinds.forEach((k, colIndex) => {
    const colNodes = grouped[k];
    const nodesInColumn = colNodes.length;
    const availableHeight = height - 160;

    // Calculate spacing
    const idealSpacing =
      nodesInColumn > 1
        ? Math.max(minNodeSpacing, availableHeight / (nodesInColumn - 1))
        : minNodeSpacing;
    const spacing = Math.min(idealSpacing, availableHeight / Math.max(1, nodesInColumn));

    const totalHeight = nodesInColumn > 1 ? (nodesInColumn - 1) * spacing : 0;
    const startY = (height - totalHeight) / 2;
    const x = colWidth * colIndex + colWidth / 2;

    colNodes.forEach((node, i) => {
      node.x = x;
      node.y = startY + i * spacing;
      node.fx = node.x; // Fix position for static layout
      node.fy = node.y;
    });
  });

  return nodes;
}
