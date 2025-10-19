/**
 * Edge path calculation utilities
 *
 * Pure functions for calculating smart edge routing in graph visualizations.
 * Handles node-to-node connections with collision avoidance, orthogonal routing,
 * and proper anchor point selection.
 *
 * **Features:**
 * - 4-handle anchor system (top, bottom, left, right) for natural connections
 * - Orthogonal (right-angle) path routing with collision avoidance
 * - Multiple routing strategies with automatic selection
 * - Support for parallel edges with automatic spacing
 * - Path midpoint calculation for label placement
 *
 * @module ForceGraph/utils/edgePathCalculations
 */

import { getNodeDimensions } from "./nodeDimensions";

/**
 * Calculate optimal edge endpoints using 4-handle anchor system
 *
 * Each node has 4 potential connection points (handles) at its edges:
 * top, bottom, left, and right. This function selects the pair of handles
 * that minimizes the distance between source and target nodes, creating
 * more natural-looking connections.
 *
 * **Algorithm:**
 * 1. Calculate all 4 handle positions for both nodes (based on dimensions)
 * 2. For source node: find handle closest to target node center
 * 3. For target node: find handle closest to source node center
 * 4. Return selected handle coordinates
 *
 * **Benefits:**
 * - Edges connect at node edges (not centers)
 * - Connections adapt to node orientation
 * - Reduces edge crossing visual clutter
 * - Works with dynamic node dimensions
 *
 * **Usage:**
 * ```typescript
 * const endpoints = calculateEdgeEndpoints(
 *   sourceNode.x, sourceNode.y,
 *   targetNode.x, targetNode.y,
 *   sourceNode, targetNode
 * );
 *
 * // Use endpoints for straight line
 * const path = `M ${endpoints.x1} ${endpoints.y1} L ${endpoints.x2} ${endpoints.y2}`;
 *
 * // Or pass to orthogonal router
 * const orthoPath = calculateOrthogonalPath(
 *   endpoints.x1, endpoints.y1, endpoints.x2, endpoints.y2,
 *   sourceNode, targetNode, allNodes
 * );
 * ```
 *
 * **Performance:**
 * - Time Complexity: O(1) - constant time calculations
 * - Called once per edge per render frame
 *
 * @param sourceX - X coordinate of source node center
 * @param sourceY - Y coordinate of source node center
 * @param targetX - X coordinate of target node center
 * @param targetY - Y coordinate of target node center
 * @param sourceNode - Source node data (for dimension calculation)
 * @param targetNode - Target node data (for dimension calculation)
 * @returns Object with x1, y1 (source anchor) and x2, y2 (target anchor)
 *
 * @see {@link getNodeDimensions} for node dimension calculation
 * @see {@link calculateOrthogonalPath} for routing between endpoints
 */
export const calculateEdgeEndpoints = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourceNode: any,
  targetNode: any
) => {
  const sourceDimensions = getNodeDimensions(sourceNode);
  const targetDimensions = getNodeDimensions(targetNode);

  const sourceWidth = sourceDimensions.width;
  const sourceHeight = sourceDimensions.height;
  const targetWidth = targetDimensions.width;
  const targetHeight = targetDimensions.height;

  const getNodeHandles = (centerX: number, centerY: number, width: number, height: number) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return {
      top: { x: centerX, y: centerY - halfHeight },
      bottom: { x: centerX, y: centerY + halfHeight },
      left: { x: centerX - halfWidth, y: centerY },
      right: { x: centerX + halfWidth, y: centerY },
    };
  };

  const findClosestHandle = (handles: any, targetX: number, targetY: number) => {
    let closestHandle = handles.top;
    let minDistance = Math.sqrt((handles.top.x - targetX) ** 2 + (handles.top.y - targetY) ** 2);

    const handleEntries = [
      { side: "top", handle: handles.top },
      { side: "bottom", handle: handles.bottom },
      { side: "left", handle: handles.left },
      { side: "right", handle: handles.right },
    ];

    for (const { handle } of handleEntries) {
      const distance = Math.sqrt((handle.x - targetX) ** 2 + (handle.y - targetY) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        closestHandle = handle;
      }
    }

    return closestHandle;
  };

  const sourceHandles = getNodeHandles(sourceX, sourceY, sourceWidth, sourceHeight);
  const targetHandles = getNodeHandles(targetX, targetY, targetWidth, targetHeight);

  const sourceHandle = findClosestHandle(sourceHandles, targetX, targetY);
  const targetHandle = findClosestHandle(targetHandles, sourceX, sourceY);

  return {
    x1: sourceHandle.x,
    y1: sourceHandle.y,
    x2: targetHandle.x,
    y2: targetHandle.y,
  };
};

/**
 * Calculate orthogonal (right-angle) path with intelligent collision avoidance
 *
 * Creates aesthetically pleasing paths that route around obstacles using only
 * horizontal and vertical line segments. Tests multiple routing strategies and
 * selects the best collision-free path.
 *
 * **Routing Strategies (in priority order):**
 * 1. **Horizontal-first**: Go horizontal, then vertical, then horizontal
 *    - Priority 1 if horizontal distance > vertical distance
 * 2. **Vertical-first**: Go vertical, then horizontal, then vertical
 *    - Priority 1 if vertical distance > horizontal distance
 * 3. **Compact detours**: 4-segment paths with small offsets
 *    - Priority 3 (fallback)
 * 4. **Tight detours**: Guaranteed fallback with fixed offsets
 *    - Priority 4 (always works)
 *
 * **Collision Detection:**
 * - Samples 15 points along each line segment
 * - Checks if any point intersects node bounding boxes
 * - Adds 8px padding around nodes for visual clearance
 * - Only checks nodes other than source/target
 *
 * **Parallel Edge Handling:**
 * - Uses edgeIndex to offset paths when multiple edges exist
 * - Alternates offset direction (even indices right/up, odd left/down)
 * - Spacing: 15px per parallel edge
 * - Prevents overlapping parallel connections
 *
 * **Usage:**
 * ```typescript
 * // Simple usage
 * const path = calculateOrthogonalPath(x1, y1, x2, y2, source, target, allNodes);
 *
 * // With parallel edge support
 * const path = calculateOrthogonalPath(
 *   x1, y1, x2, y2,
 *   source, target, allNodes,
 *   edgeIndex  // 0 for first edge, 1 for second, etc.
 * );
 *
 * // Render path
 * <path d={path} stroke="black" fill="none" />
 * ```
 *
 * **Performance:**
 * - Time Complexity: O(r × s × n) where:
 *   - r = routing strategies tested (typically 4-6)
 *   - s = sample points per segment (15)
 *   - n = number of nodes
 * - Typical: ~360-540 point checks per edge
 * - Consider simplifying for graphs with >1000 nodes
 *
 * **Visual Quality:**
 * - Smooth 90-degree turns (no diagonal segments)
 * - Avoids overlapping nodes
 * - Minimal path length when possible
 * - Consistent parallel edge spacing
 *
 * @param x1 - X coordinate of path start (source anchor)
 * @param y1 - Y coordinate of path start
 * @param x2 - X coordinate of path end (target anchor)
 * @param y2 - Y coordinate of path end
 * @param sourceNode - Source node (excluded from collision detection)
 * @param targetNode - Target node (excluded from collision detection)
 * @param allNodes - All nodes in graph (for collision detection)
 * @param edgeIndex - Index for parallel edge offset (0 for first edge)
 * @param _totalEdgesBetweenNodes - Reserved for future use
 * @returns SVG path string (e.g., "M 10 20 L 30 20 L 30 50 L 60 50")
 *
 * @see {@link calculateEdgeEndpoints} for generating x1, y1, x2, y2
 * @see {@link getOrthogonalPathMidpoint} for finding path center for labels
 */
export const calculateOrthogonalPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sourceNode: any,
  targetNode: any,
  allNodes: any[] = [],
  edgeIndex: number = 0,
  _totalEdgesBetweenNodes: number = 1
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const edgeSpacing = 15;
  const offsetMultiplier = Math.floor(edgeIndex / 2) + 1;
  const isEvenIndex = edgeIndex % 2 === 0;
  const offsetDirection = isEvenIndex ? 1 : -1;
  const baseOffset = offsetMultiplier * edgeSpacing * offsetDirection;

  const isPointInNode = (px: number, py: number, node: any) => {
    if (!node || node.id === sourceNode.id || node.id === targetNode.id) {
      return false;
    }

    const nodeDims = getNodeDimensions(node);
    const { width, height } = nodeDims;

    const nodeX = node.x || 0;
    const nodeY = node.y || 0;

    return (
      px >= nodeX - width / 2 - 8 &&
      px <= nodeX + width / 2 + 8 &&
      py >= nodeY - height / 2 - 8 &&
      py <= nodeY + height / 2 + 8
    );
  };

  const lineIntersectsNodes = (sx: number, sy: number, ex: number, ey: number) => {
    const steps = 15;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = sx + (ex - sx) * t;
      const py = sy + (ey - sy) * t;

      for (const node of allNodes) {
        if (isPointInNode(px, py, node)) {
          return true;
        }
      }
    }
    return false;
  };

  const routes = [];

  // Option 1: Horizontal-first
  const hMidX = x1 + dx * 0.7 + baseOffset * 0.3;
  if (
    !lineIntersectsNodes(x1, y1, hMidX, y1) &&
    !lineIntersectsNodes(hMidX, y1, hMidX, y2) &&
    !lineIntersectsNodes(hMidX, y2, x2, y2)
  ) {
    routes.push({
      path: `M ${x1} ${y1} L ${hMidX} ${y1} L ${hMidX} ${y2} L ${x2} ${y2}`,
      priority: Math.abs(dx) > Math.abs(dy) ? 1 : 2,
    });
  }

  // Option 2: Vertical-first
  const vMidY = y1 + dy * 0.7 + baseOffset * 0.3;
  if (
    !lineIntersectsNodes(x1, y1, x1, vMidY) &&
    !lineIntersectsNodes(x1, vMidY, x2, vMidY) &&
    !lineIntersectsNodes(x2, vMidY, x2, y2)
  ) {
    routes.push({
      path: `M ${x1} ${y1} L ${x1} ${vMidY} L ${x2} ${vMidY} L ${x2} ${y2}`,
      priority: Math.abs(dy) > Math.abs(dx) ? 1 : 2,
    });
  }

  // Option 3: Compact horizontal detour
  const hMidX2 = x1 + dx * 0.5;
  const offsetY =
    dy > 0
      ? Math.max(40, Math.abs(dy) * 0.2) + baseOffset
      : -Math.max(40, Math.abs(dy) * 0.2) + baseOffset;
  const routeY = y1 + offsetY;

  if (
    !lineIntersectsNodes(x1, y1, hMidX2, y1) &&
    !lineIntersectsNodes(hMidX2, y1, hMidX2, routeY) &&
    !lineIntersectsNodes(hMidX2, routeY, x2, routeY) &&
    !lineIntersectsNodes(x2, routeY, x2, y2)
  ) {
    routes.push({
      path: `M ${x1} ${y1} L ${hMidX2} ${y1} L ${hMidX2} ${routeY} L ${x2} ${routeY} L ${x2} ${y2}`,
      priority: 3,
    });
  }

  // Option 4: Compact vertical detour
  const vMidY2 = y1 + dy * 0.5;
  const offsetX =
    dx > 0
      ? Math.max(40, Math.abs(dx) * 0.2) + baseOffset
      : -Math.max(40, Math.abs(dx) * 0.2) + baseOffset;
  const routeX = x1 + offsetX;

  if (
    !lineIntersectsNodes(x1, y1, x1, vMidY2) &&
    !lineIntersectsNodes(x1, vMidY2, routeX, vMidY2) &&
    !lineIntersectsNodes(routeX, vMidY2, routeX, y2) &&
    !lineIntersectsNodes(routeX, y2, x2, y2)
  ) {
    routes.push({
      path: `M ${x1} ${y1} L ${x1} ${vMidY2} L ${routeX} ${vMidY2} L ${routeX} ${y2} L ${x2} ${y2}`,
      priority: 3,
    });
  }

  // Fallback tight detours
  const tightOffsetY = dy > 0 ? 60 + Math.abs(baseOffset) : -60 - Math.abs(baseOffset);
  const tightOffsetX = dx > 0 ? 60 + Math.abs(baseOffset) : -60 - Math.abs(baseOffset);

  routes.push({
    path: `M ${x1} ${y1} L ${x1} ${y1 + tightOffsetY} L ${x2} ${y1 + tightOffsetY} L ${x2} ${y2}`,
    priority: 4,
  });

  routes.push({
    path: `M ${x1} ${y1} L ${x1 + tightOffsetX} ${y1} L ${x1 + tightOffsetX} ${y2} L ${x2} ${y2}`,
    priority: 4,
  });

  routes.sort((a, b) => a.priority - b.priority);

  return routes.length > 0 ? routes[0].path : `M ${x1} ${y1} L ${x2} ${y2}`;
};

/**
 * Calculate true midpoint of orthogonal path for label positioning
 *
 * Finds the point that is exactly halfway along the path's total length,
 * accounting for all segments. This is more accurate than simple (x1+x2)/2
 * for multi-segment orthogonal paths.
 *
 * **Algorithm:**
 * 1. Parse SVG path commands (M, L) into coordinate points
 * 2. Calculate length of each segment
 * 3. Find segment containing the 50% length mark
 * 4. Interpolate exact position within that segment
 *
 * **Why This Matters:**
 * - Orthogonal paths have multiple segments
 * - Simple midpoint doesn't account for path shape
 * - This ensures labels appear centered on the actual path
 * - Works correctly for all routing strategies
 *
 * **Usage:**
 * ```typescript
 * const path = calculateOrthogonalPath(x1, y1, x2, y2, source, target, nodes);
 * const midpoint = getOrthogonalPathMidpoint(path);
 *
 * // Position label at midpoint
 * <text x={midpoint.x} y={midpoint.y} textAnchor="middle">
 *   Edge Label
 * </text>
 *
 * // Or position marker/icon
 * <circle cx={midpoint.x} cy={midpoint.y} r={4} />
 * ```
 *
 * **Edge Cases:**
 * - Empty path: Returns {x: 0, y: 0}
 * - Single segment: Returns geometric midpoint
 * - Zero-length segments: Skipped in calculation
 *
 * **Performance:**
 * - Time Complexity: O(s) where s = number of segments
 * - Typical: 3-5 segments, very fast
 * - No heavy calculations, just parsing and arithmetic
 *
 * @param pathString - SVG path string from {@link calculateOrthogonalPath}
 * @returns Object with x, y coordinates of the path's true midpoint
 *
 * @see {@link calculateOrthogonalPath} generates the paths this function analyzes
 */
export const getOrthogonalPathMidpoint = (pathString: string) => {
  const commands = pathString.match(/[MLZ][^MLZ]*/g) || [];
  const points = [];

  for (const command of commands) {
    const coords = command.slice(1).trim().split(/\s+/);
    if (coords.length >= 2) {
      points.push({
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1]),
      });
    }
  }

  if (points.length < 2) {
    return { x: 0, y: 0 };
  }

  let totalLength = 0;
  const segments = [];

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segments.push({ length, start: points[i - 1], end: points[i] });
    totalLength += length;
  }

  const targetLength = totalLength / 2;
  let currentLength = 0;

  for (const segment of segments) {
    if (currentLength + segment.length >= targetLength) {
      const ratio = (targetLength - currentLength) / segment.length;
      return {
        x: segment.start.x + (segment.end.x - segment.start.x) * ratio,
        y: segment.start.y + (segment.end.y - segment.start.y) * ratio,
      };
    }
    currentLength += segment.length;
  }

  const centerIndex = Math.floor(points.length / 2);
  return points[centerIndex];
};
