/**
 * Node dimension calculation utilities
 *
 * Provides dynamic sizing for graph nodes based on their content (name length,
 * attributes, status indicators). This ensures text fits properly and nodes
 * have visual balance.
 *
 * @module ForceGraph/utils/nodeDimensions
 */

import { NodeData } from "../types";

/**
 * Calculate dynamic dimensions for a node based on its content
 *
 * Computes appropriate width and height for a node card based on:
 * - Name/label length (longer names = wider nodes)
 * - Presence of status indicator
 * - Number of visible attributes
 *
 * **Sizing Strategy:**
 * - Width: Scales with name length (8px per character + 100px padding)
 * - Height: Base 60px + adjustments for status/attributes
 * - Constrained to min/max bounds for visual consistency
 *
 * **Constraints:**
 * - Min width: 160px (prevents nodes from being too narrow)
 * - Max width: 280px (prevents excessively wide nodes)
 * - Min height: 60px (minimum comfortable size)
 * - Max height: 80px (keeps nodes compact)
 *
 * **Usage:**
 * ```typescript
 * const dimensions = getNodeDimensions(node);
 * const { width, height } = dimensions;
 *
 * // Use for collision detection
 * const collisionRadius = Math.max(width, height) / 2;
 *
 * // Use for edge endpoint calculations
 * const halfWidth = width / 2;
 * const rightEdge = node.x + halfWidth;
 * ```
 *
 * **Performance:**
 * - Time Complexity: O(1) - simple arithmetic calculations
 * - Called frequently during layout and rendering
 * - No caching needed (very fast)
 *
 * @param node - The node data to calculate dimensions for
 * @returns Object containing width and height in pixels
 *
 * @see {@link calculateEdgeEndpoints} uses these dimensions for edge routing
 */
export const getNodeDimensions = (node: NodeData): { width: number; height: number } => {
  const name = node.name || node.Name || node.id || "";
  const status = (node.attributes && node.attributes.status) || "";

  const minWidth = 160;
  const minHeight = 60;
  const maxWidth = 280;
  const maxHeight = 80;

  const nameLength = name.length;
  const hasStatus = status.length > 0;
  const hasAttributes = node.attributes && Object.keys(node.attributes).length > 1;

  // Calculate width based on name length
  let width = Math.max(minWidth, Math.min(maxWidth, nameLength * 8 + 100));

  // Calculate height based on content
  let height = minHeight;
  if (hasStatus) {
    height += 0; // Reserved for future status height
  }
  if (hasAttributes) {
    height += 10; // Additional height for attributes indicator
  }

  height = Math.min(maxHeight, height);

  return { width, height };
};
