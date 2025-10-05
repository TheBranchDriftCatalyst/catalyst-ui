import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NodeData, NodeKind } from './types';

interface ReactD3NodeProps {
  data: NodeData;
  isSelected?: boolean;
  isHovered?: boolean;
  zoom?: number;
  isDimmed?: boolean;
  showLogo?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDragStart?: (event: any) => void;
  onDrag?: (event: any) => void;
  onDragEnd?: (event: any) => void;
}

// Dynamic node dimensions calculation
export const getNodeDimensions = (d: NodeData) => {
  const name = d.name || d.Name || d.id || '';
  const status = (d.attributes && d.attributes.status) || '';

  const minWidth = 160;
  const minHeight = 60;
  const maxWidth = 280;
  const maxHeight = 80;

  const nameLength = name.length;
  const hasStatus = status.length > 0;
  const hasAttributes = d.attributes && Object.keys(d.attributes).length > 1;

  let width = Math.max(minWidth, Math.min(maxWidth, nameLength * 8 + 100));

  let height = minHeight;
  if (hasStatus) {
    height += 0;
  }
  if (hasAttributes) {
    height += 10;
  }

  height = Math.min(maxHeight, height);

  return { width, height };
};

// Get node color based on kind - using CSS variables
const getNodeColor = (kind: NodeKind): string => {
  switch (kind) {
    case 'container':
      return 'var(--primary)';
    case 'network':
      return 'var(--neon-yellow)';
    case 'image':
      return 'var(--neon-red)';
    case 'volume':
      return 'var(--neon-purple)';
    default:
      return 'var(--border)';
  }
};

// Get node icon/emoji
const getNodeIcon = (kind: NodeKind): string => {
  switch (kind) {
    case 'container':
      return '📦';
    case 'network':
      return '🌐';
    case 'image':
      return '💿';
    case 'volume':
      return '💾';
    default:
      return '⚪';
  }
};

const ReactD3Node: React.FC<ReactD3NodeProps> = ({
  data,
  isSelected = false,
  isHovered = false,
  zoom,
  isDimmed = false,
  showLogo = true,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const groupRef = useRef<SVGGElement>(null);
  const { width, height } = getNodeDimensions(data);
  const effectiveZoom = 1;

  const pad = 12;
  const imgSize = 32;

  // Setup drag behavior
  useEffect(() => {
    if (!groupRef.current || !onDragStart || !onDrag || !onDragEnd) {
      return;
    }

    const drag = d3
      .drag<SVGGElement, any>()
      .on('start', onDragStart)
      .on('drag', onDrag)
      .on('end', onDragEnd);

    d3.select(groupRef.current).call(drag as any);
  }, [onDragStart, onDrag, onDragEnd]);

  // Calculate content
  const name = data.name || data.Name || data.id || '';
  const status = (data.attributes && data.attributes.status) || '';
  const maxLength = Math.floor((width - imgSize - 40) / 7);
  const displayName =
    name.length > maxLength ? name.substring(0, maxLength) + '...' : name;

  // Status styling
  const statusColor =
    (status === 'running' || status == 'in-use')
      ? '#00FF66'
      : status === 'stopped'
        ? '#FF3B30'
        : '#FFA500';
  const statusText =
    status === 'running'
      ? '#7CFC00'
      : status === 'stopped'
        ? '#FF6B6B'
        : '#FFA500';

  const visualWidth = width;
  const visualHeight = height;
  const nodeColor = getNodeColor(data.kind);
  const nodeIcon = getNodeIcon(data.kind);

  return (
    <g
      ref={groupRef}
      transform={`translate(${data.x || 0}, ${data.y || 0})`}
      style={{
        cursor: 'pointer',
        opacity: isDimmed ? 0.35 : 1,
        filter: isSelected || isHovered ? 'url(#node-glow)' : undefined,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        try {
          e.stopPropagation();
        } catch (err) { }
        if (onClick) onClick();
      }}
      onDoubleClick={onDoubleClick}
      onMouseDown={(e) => {
        try {
          e.stopPropagation();
        } catch (err) { }
      }}
      onTouchStart={(e) => {
        try {
          e.stopPropagation();
        } catch (err) { }
      }}
    >
      {/* Card background */}
      <rect
        x={-visualWidth / 2}
        y={-visualHeight / 2}
        rx={8}
        ry={8}
        width={visualWidth}
        height={visualHeight}
        fill={`url(#gradient-${data.kind})`}
        stroke={nodeColor}
        strokeWidth={isHovered ? 3 : 2}
        className="node-card"
      />

      {/* Icon/Emoji */}
      {showLogo && (
        <text
          x={-visualWidth / 2 + pad}
          y={0}
          fontSize={imgSize}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {nodeIcon}
        </text>
      )}

      {/* Name */}
      <text
        x={-visualWidth / 2 + pad + imgSize + 12}
        y={-8}
        textAnchor="start"
        fontSize={13}
        fill="var(--foreground)"
        fontWeight="600"
      >
        {displayName}
      </text>

      {/* Status */}
      {status && (
        <text
          x={-visualWidth / 2 + pad + imgSize + 12}
          y={10}
          textAnchor="start"
          fontSize={10}
          fill={statusText}
          fontWeight="500"
        >
          {status.toUpperCase()}
        </text>
      )}

      {/* Status indicator */}
      {status && (
        <circle
          cx={visualWidth / 2 - pad - 8}
          cy={-visualHeight / 2 + pad + 8}
          r={4}
          fill={statusColor}
          opacity={0.9}
        />
      )}

      {/* Type indicator */}
      <text
        x={visualWidth / 2 - pad - 4}
        y={visualHeight / 2 - pad + 2}
        textAnchor="end"
        fontSize={9}
        fill={nodeColor}
        opacity={0.6}
        fontWeight="500"
      >
        {data.kind.toUpperCase()}
      </text>
    </g>
  );
};

export default ReactD3Node;
export type { ReactD3NodeProps };
