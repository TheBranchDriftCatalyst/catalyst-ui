import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { NodeData } from "./types";
import { NodeRenderer } from "./config/types";
import { useGraphConfig } from "./context/GraphContext";
import { getNodeDimensions } from "./utils/nodeDimensions";

interface ReactD3NodeProps {
  data: NodeData;
  isSelected?: boolean;
  isHovered?: boolean;
  zoom?: number;
  isDimmed?: boolean;
  showLogo?: boolean;
  customRenderer?: NodeRenderer;
  getNodeDimensionsFn?: (node: NodeData) => { width: number; height: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDragStart?: (event: any) => void;
  onDrag?: (event: any) => void;
  onDragEnd?: (event: any) => void;
}

const ReactD3Node: React.FC<ReactD3NodeProps> = ({
  data,
  isSelected = false,
  isHovered = false,
  isDimmed = false,
  showLogo = true,
  customRenderer,
  getNodeDimensionsFn,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const config = useGraphConfig();
  const groupRef = useRef<SVGGElement>(null);
  const dimensionCalculator = getNodeDimensionsFn || getNodeDimensions;
  const { width, height } = dimensionCalculator(data);
  const pad = 12;
  const imgSize = 32;

  // Setup drag behavior
  useEffect(() => {
    if (!groupRef.current || !onDragStart || !onDrag || !onDragEnd) {
      return;
    }

    const drag = d3
      .drag<SVGGElement, any>()
      .on("start", onDragStart)
      .on("drag", onDrag)
      .on("end", onDragEnd);

    d3.select(groupRef.current).call(drag as any);
  }, [onDragStart, onDrag, onDragEnd]);

  // Get position (D3 will update this directly during ticks)
  const x = data.x || 0;
  const y = data.y || 0;

  // If custom renderer is provided, use it
  if (customRenderer) {
    const CustomRenderer = customRenderer;

    return (
      <g
        ref={groupRef}
        transform={`translate(${x}, ${y})`}
        style={{
          cursor: "pointer",
          opacity: isDimmed ? 0.35 : 1,
          filter: isSelected || isHovered ? "url(#node-glow)" : undefined,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={e => {
          try {
            e.stopPropagation();
          } catch (err) {}
          if (onClick) onClick();
        }}
        onDoubleClick={onDoubleClick}
        onMouseDown={e => {
          try {
            e.stopPropagation();
          } catch (err) {}
        }}
        onTouchStart={e => {
          try {
            e.stopPropagation();
          } catch (err) {}
        }}
      >
        <CustomRenderer
          data={data}
          width={width}
          height={height}
          pad={pad}
          imgSize={imgSize}
          showLogo={showLogo}
        />
      </g>
    );
  }

  // Default rendering (Docker-specific)
  const name = data.name || data.Name || data.id || "";
  const status = (data.attributes && data.attributes.status) || "";
  const maxLength = Math.floor((width - imgSize - 40) / 7);
  const displayName = name.length > maxLength ? name.substring(0, maxLength) + "..." : name;

  // Status styling
  const statusColor =
    status === "running" || status == "in-use"
      ? "#00FF66"
      : status === "stopped"
        ? "#FF3B30"
        : "#FFA500";
  const statusText =
    status === "running" ? "#7CFC00" : status === "stopped" ? "#FF6B6B" : "#FFA500";

  const visualWidth = width;
  const visualHeight = height;

  // Get node config from context
  const nodeTypeConfig = config.nodeTypes[data.kind];
  const nodeColor = nodeTypeConfig?.color || "var(--border)";
  const nodeIcon = nodeTypeConfig?.icon || "⚪";

  return (
    <g
      ref={groupRef}
      transform={`translate(${x}, ${y})`}
      style={{
        cursor: "pointer",
        opacity: isDimmed ? 0.35 : 1,
        filter: isSelected || isHovered ? "url(#node-glow)" : undefined,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={e => {
        try {
          e.stopPropagation();
        } catch (err) {}
        if (onClick) onClick();
      }}
      onDoubleClick={onDoubleClick}
      onMouseDown={e => {
        try {
          e.stopPropagation();
        } catch (err) {}
      }}
      onTouchStart={e => {
        try {
          e.stopPropagation();
        } catch (err) {}
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

ReactD3Node.displayName = "ReactD3Node";

export default ReactD3Node;
export type { ReactD3NodeProps };
