import { NodeData } from '../types';

/**
 * Calculate dynamic dimensions for a node based on its content
 * @param node - The node data to calculate dimensions for
 * @returns Object containing width and height in pixels
 */
export const getNodeDimensions = (node: NodeData): { width: number; height: number } => {
  const name = node.name || node.Name || node.id || '';
  const status = (node.attributes && node.attributes.status) || '';

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
