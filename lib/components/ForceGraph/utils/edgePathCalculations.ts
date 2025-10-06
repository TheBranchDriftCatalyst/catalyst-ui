import { getNodeDimensions } from './nodeDimensions';

/**
 * Edge path calculation utilities
 * Pure functions for calculating edge endpoints, paths, and midpoints
 */

/**
 * Calculate edge endpoints using 4-handle system (top, bottom, left, right)
 * Finds the closest handle on each node to connect to the other node
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
      right: { x: centerX + halfWidth, y: centerY }
    };
  };

  const findClosestHandle = (handles: any, targetX: number, targetY: number) => {
    let closestHandle = handles.top;
    let minDistance = Math.sqrt((handles.top.x - targetX) ** 2 + (handles.top.y - targetY) ** 2);

    const handleEntries = [
      { side: 'top', handle: handles.top },
      { side: 'bottom', handle: handles.bottom },
      { side: 'left', handle: handles.left },
      { side: 'right', handle: handles.right }
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
    y2: targetHandle.y
  };
};

/**
 * Calculate orthogonal path with collision avoidance
 * Tries multiple routing strategies and picks the best one based on priority
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
  if (!lineIntersectsNodes(x1, y1, hMidX, y1) &&
    !lineIntersectsNodes(hMidX, y1, hMidX, y2) &&
    !lineIntersectsNodes(hMidX, y2, x2, y2)) {
    routes.push({
      path: `M ${x1} ${y1} L ${hMidX} ${y1} L ${hMidX} ${y2} L ${x2} ${y2}`,
      priority: Math.abs(dx) > Math.abs(dy) ? 1 : 2
    });
  }

  // Option 2: Vertical-first
  const vMidY = y1 + dy * 0.7 + baseOffset * 0.3;
  if (!lineIntersectsNodes(x1, y1, x1, vMidY) &&
    !lineIntersectsNodes(x1, vMidY, x2, vMidY) &&
    !lineIntersectsNodes(x2, vMidY, x2, y2)) {
    routes.push({
      path: `M ${x1} ${y1} L ${x1} ${vMidY} L ${x2} ${vMidY} L ${x2} ${y2}`,
      priority: Math.abs(dy) > Math.abs(dx) ? 1 : 2
    });
  }

  // Option 3: Compact horizontal detour
  const hMidX2 = x1 + dx * 0.5;
  const offsetY = dy > 0 ? Math.max(40, Math.abs(dy) * 0.2) + baseOffset : -Math.max(40, Math.abs(dy) * 0.2) + baseOffset;
  const routeY = y1 + offsetY;

  if (!lineIntersectsNodes(x1, y1, hMidX2, y1) &&
    !lineIntersectsNodes(hMidX2, y1, hMidX2, routeY) &&
    !lineIntersectsNodes(hMidX2, routeY, x2, routeY) &&
    !lineIntersectsNodes(x2, routeY, x2, y2)) {
    routes.push({
      path: `M ${x1} ${y1} L ${hMidX2} ${y1} L ${hMidX2} ${routeY} L ${x2} ${routeY} L ${x2} ${y2}`,
      priority: 3
    });
  }

  // Option 4: Compact vertical detour
  const vMidY2 = y1 + dy * 0.5;
  const offsetX = dx > 0 ? Math.max(40, Math.abs(dx) * 0.2) + baseOffset : -Math.max(40, Math.abs(dx) * 0.2) + baseOffset;
  const routeX = x1 + offsetX;

  if (!lineIntersectsNodes(x1, y1, x1, vMidY2) &&
    !lineIntersectsNodes(x1, vMidY2, routeX, vMidY2) &&
    !lineIntersectsNodes(routeX, vMidY2, routeX, y2) &&
    !lineIntersectsNodes(routeX, y2, x2, y2)) {
    routes.push({
      path: `M ${x1} ${y1} L ${x1} ${vMidY2} L ${routeX} ${vMidY2} L ${routeX} ${y2} L ${x2} ${y2}`,
      priority: 3
    });
  }

  // Fallback tight detours
  const tightOffsetY = dy > 0 ? 60 + Math.abs(baseOffset) : -60 - Math.abs(baseOffset);
  const tightOffsetX = dx > 0 ? 60 + Math.abs(baseOffset) : -60 - Math.abs(baseOffset);

  routes.push({
    path: `M ${x1} ${y1} L ${x1} ${y1 + tightOffsetY} L ${x2} ${y1 + tightOffsetY} L ${x2} ${y2}`,
    priority: 4
  });

  routes.push({
    path: `M ${x1} ${y1} L ${x1 + tightOffsetX} ${y1} L ${x1 + tightOffsetX} ${y2} L ${x2} ${y2}`,
    priority: 4
  });

  routes.sort((a, b) => a.priority - b.priority);

  return routes.length > 0 ? routes[0].path : `M ${x1} ${y1} L ${x2} ${y2}`;
};

/**
 * Get midpoint of orthogonal path for label positioning
 * Calculates the true midpoint along the path length
 */
export const getOrthogonalPathMidpoint = (pathString: string) => {
  const commands = pathString.match(/[MLZ][^MLZ]*/g) || [];
  const points = [];

  for (const command of commands) {
    const coords = command.slice(1).trim().split(/\s+/);
    if (coords.length >= 2) {
      points.push({
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1])
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
        y: segment.start.y + (segment.end.y - segment.start.y) * ratio
      };
    }
    currentLength += segment.length;
  }

  const centerIndex = Math.floor(points.length / 2);
  return points[centerIndex];
};
