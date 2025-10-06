import React, { useMemo } from 'react';
import { EdgeData, EdgeKind } from './types';
import {
  calculateEdgeEndpoints,
  calculateOrthogonalPath,
  getOrthogonalPathMidpoint,
} from './utils/edgePathCalculations';

interface ReactD3EdgeProps {
  data: EdgeData;
  orthogonal?: boolean;
  allNodes?: any[];
  edgeIndex?: number;
  totalEdgesBetweenNodes?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isDimmed?: boolean;
}

// Edge color map using CSS variables
const getEdgeColor = (kind: EdgeKind): string => {
  switch (kind) {
    case 'derived_from':
      return 'var(--neon-red)';
    case 'connected_to':
      return 'var(--primary)';
    case 'mounted_into':
      return 'var(--neon-yellow)';
    default:
      return 'var(--border)';
  }
};

const ReactD3Edge: React.FC<ReactD3EdgeProps> = ({
  data,
  orthogonal = false,
  allNodes = [],
  edgeIndex = 0,
  totalEdgesBetweenNodes = 1,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isDimmed = false,
}) => {
  // Calculate label text
  let labelText = null;
  if (data.kind === 'connected_to' && data.attributes?.ip) {
    const { ip } = data.attributes;
    labelText = ip.length > 12 ? ip.substring(0, 12) + '...' : ip;
  } else if (data.kind === 'mounted_into' && data.attributes?.target) {
    const { target } = data.attributes;
    labelText = target.length > 12 ? target.substring(0, 12) + '...' : target;
  }

  const showLabel = labelText !== null;

  // Memoize edge endpoints calculation
  const edgePoints = useMemo(
    () =>
      calculateEdgeEndpoints(
        data.source.x || 0,
        data.source.y || 0,
        data.target.x || 0,
        data.target.y || 0,
        data.source,
        data.target
      ),
    [data.source.x, data.source.y, data.target.x, data.target.y, data.source, data.target]
  );

  // Memoize path calculation (expensive collision detection)
  const edgePath = useMemo(() => {
    if (!orthogonal) return null;
    return calculateOrthogonalPath(
      edgePoints.x1,
      edgePoints.y1,
      edgePoints.x2,
      edgePoints.y2,
      data.source,
      data.target,
      allNodes,
      edgeIndex,
      totalEdgesBetweenNodes
    );
  }, [orthogonal, edgePoints, data.source, data.target, allNodes, edgeIndex, totalEdgesBetweenNodes]);

  // Memoize midpoint calculation
  const { midX, midY } = useMemo(() => {
    if (orthogonal && edgePath) {
      const pathMidpoint = getOrthogonalPathMidpoint(edgePath);
      return { midX: pathMidpoint.x, midY: pathMidpoint.y };
    }
    return {
      midX: ((data.source.x || 0) + (data.target.x || 0)) / 2,
      midY: ((data.source.y || 0) + (data.target.y || 0)) / 2,
    };
  }, [orthogonal, edgePath, data.source.x, data.source.y, data.target.x, data.target.y]);

  const textWidth = labelText ? labelText.length * 6 + 8 : 50;
  const edgeColor = getEdgeColor(data.kind);

  return (
    <g className="edge-group">
      {/* Edge line */}
      {orthogonal ? (
        <path
          d={edgePath || ''}
          stroke={edgeColor}
          strokeWidth={2}
          strokeOpacity={isDimmed ? 0.18 : 0.8}
          fill="none"
          style={{ cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ) : (
        <line
          x1={edgePoints.x1}
          y1={edgePoints.y1}
          x2={edgePoints.x2}
          y2={edgePoints.y2}
          stroke={edgeColor}
          strokeWidth={2}
          strokeOpacity={isDimmed ? 0.18 : 0.8}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}

      {/* Label */}
      {showLabel && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-textWidth / 2}
            y={-8}
            width={textWidth}
            height={16}
            rx={4}
            fill="var(--background)"
            fillOpacity={0.95}
            stroke={edgeColor}
            strokeWidth={1}
          />
          <text
            fontSize={10}
            fill="var(--foreground)"
            textAnchor="middle"
            dy="0.35em"
            fontWeight="500"
          >
            {labelText}
          </text>
        </g>
      )}
    </g>
  );
};

export default ReactD3Edge;
export type { ReactD3EdgeProps };
