import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ReactD3Node from './ReactD3Node';
import ReactD3Edge from './ReactD3Edge';
import { EdgeKind, ReactD3GraphProps, NodeData, EdgeData } from './types';
import { enrichGraph, NodeWithHelpers, EdgeWithHelpers } from './utils/GraphNavigator';
import { useGraphState } from './hooks/useGraphState';
import { applyStructuredLayout } from './utils/layouts';

const ReactD3Graph: React.FC<ReactD3GraphProps> = ({
  data,
  dimensions,
  visibleNodes,
  visibleEdges,
  setHoveredNode,
  setSelectedNode,
  hoveredNode,
  selectedNode,
  config,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomLayerRef = useRef<SVGGElement>(null);
  const [nodes, setNodes] = useState<NodeWithHelpers[] | NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeWithHelpers[] | EdgeData[]>([]);
  const [_zoomScale, setZoomScale] = useState<number>(1);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);
  const chargeForceRef = useRef<any>(null);
  const prevNodeCountRef = useRef<number>(0);

  const { layout, orthogonalEdges } = useGraphState();

  useEffect(() => {
    if (!data || !svgRef.current) {
      return;
    }

    const { width, height } = dimensions;
    const enriched = enrichGraph(data);

    const allNodes = Object.values(enriched.nodes) as NodeWithHelpers[];
    const filteredNodes = allNodes.filter((n) => visibleNodes[n.kind]);

    const rawLinks = enriched.edges as EdgeWithHelpers[];
    const filteredLinks = rawLinks.filter(
      (l) => visibleEdges[l.kind as EdgeKind] && l.source && l.target
    );

    // Apply structured layout if needed
    if (layout === 'structured') {
      try {
        applyStructuredLayout(filteredNodes as any, { width, height });
      } catch (e) {
        // fallthrough
      }
    }

    if (layout === 'force') {
      // Release fixed positions for force layout
      filteredNodes.forEach((n) => {
        n.fx = null;
        n.fy = null;
      });
    }

    // For structured layout, skip simulation
    if (layout === 'structured') {
      setNodes(filteredNodes);
      setEdges(filteredLinks);
      return () => { };
    }

    // D3 force simulation for force layout
    const simulation = d3.forceSimulation(filteredNodes)
      .force(
        'link',
        d3
          .forceLink(filteredLinks)
          .id((d: any) => d.id)
          .distance((d: any) => {
            switch (d.kind) {
              case 'derived_from':
                return 200;
              case 'connected_to':
                return 250;
              case 'mounted_into':
                return 200;
              default:
                return 200;
            }
          })
          .strength(0.08)
      )
      .force('charge', d3.forceManyBody().strength(-80))
      .force('collision', d3.forceCollide().radius(60))
      .alphaDecay(0.05)
      .alpha(0.2);

    simulation.on('tick', () => {
      setNodes([...filteredNodes]);
      setEdges([...filteredLinks]);
    });

    // Capture charge force for dynamic rebalancing
    try {
      const f = (simulation.force as any) ? (simulation.force as any)('charge') : null;
      if (f) {
        chargeForceRef.current = f;
      }
    } catch (e) { }

    // Rebalance on node count increase
    const prevCount = prevNodeCountRef.current || 0;
    const newCount = filteredNodes.length;
    if (newCount > prevCount && simulationRef.current) {
      try {
        const boost = Math.min(3, Math.max(1.2, newCount / Math.max(1, prevCount || 1)));
        if (chargeForceRef.current && typeof chargeForceRef.current.strength === 'function') {
          const current = -80;
          chargeForceRef.current.strength(-Math.abs(current * boost));
        }
        simulation.alpha(0.6);
        simulation.restart();
        setTimeout(() => {
          if (chargeForceRef.current && typeof chargeForceRef.current.strength === 'function') {
            chargeForceRef.current.strength(-80);
          }
        }, 1200);
      } catch (e) { }
    }
    prevNodeCountRef.current = newCount;

    simulationRef.current = simulation;
    setNodes(filteredNodes);
    setEdges(filteredLinks);

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, visibleNodes, visibleEdges, layout]);

  // Drag handlers
  const handleDragStart = (node: NodeData) => (event: any) => {
    try {
      event?.sourceEvent?.stopPropagation();
    } catch (e) { }

    if (layout === 'structured') {
      node.fx = node.x;
      node.fy = node.y;
      return;
    }

    if (!simulationRef.current) {
      return;
    }
    if (!event.active) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
    node.fx = node.x;
    node.fy = node.y;
  };

  const handleDrag = (node: NodeData) => (event: any) => {
    try {
      event?.sourceEvent?.stopPropagation();
    } catch (e) { }

    node.fx = event.x;
    node.fy = event.y;

    if (layout === 'structured') {
      node.x = event.x;
      node.y = event.y;
      setNodes([...nodes]);
    }
  };

  const handleDragEnd = (node: NodeData) => (event: any) => {
    try {
      event?.sourceEvent?.stopPropagation();
    } catch (e) { }

    if (layout === 'structured') {
      node.fx = node.x;
      node.fy = node.y;
      return;
    }

    if (!simulationRef.current) {
      return;
    }
    if (!event.active) {
      simulationRef.current.alphaTarget(0);
    }
    node.fx = node.x;
    node.fy = node.y;
  };

  // Zoom / pan setup
  useEffect(() => {
    if (!svgRef.current || !zoomLayerRef.current) {
      return;
    }
    const svg = d3.select(svgRef.current);
    const zoomLayer = d3.select(zoomLayerRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 8])
      .on('zoom', (event) => {
        zoomLayer.attr('transform', event.transform.toString());
        try {
          setZoomScale(event.transform.k);
        } catch (e) { }
      });

    svg.call(zoom as any);
    zoom.transform(svg.transition().duration(0) as any, d3.zoomIdentity);

    return () => {
      svg.on('.zoom', null);
    };
  }, [dimensions.width, dimensions.height]);

  // Node event handlers
  const handleNodeMouseEnter = (nodeId: string) => () => {
    setHoveredNode(nodeId);
  };

  const handleNodeMouseLeave = (nodeId: string) => () => {
    if (selectedNode === nodeId) {
      return;
    }
    setHoveredNode(null);
  };

  const handleNodeClick = (nodeId: string) => () => {
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  return (
    <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
      {/* Gradients */}
      <defs>
        {/* Node gradients */}
        {['container', 'network', 'image', 'volume'].map((kind) => (
          <linearGradient
            key={kind}
            id={`gradient-${kind}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={`var(--${kind === 'container' ? 'primary' : kind === 'network' ? 'neon-yellow' : kind === 'image' ? 'neon-red' : 'neon-purple'})`} stopOpacity="0.1" />
            <stop offset="100%" stopColor={`var(--${kind === 'container' ? 'primary' : kind === 'network' ? 'neon-yellow' : kind === 'image' ? 'neon-red' : 'neon-purple'})`} stopOpacity="0.05" />
          </linearGradient>
        ))}
      </defs>

      {/* Glow filter */}
      <defs>
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="var(--primary)" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Background */}
      <rect
        width={dimensions.width}
        height={dimensions.height}
        fill="var(--background)"
        onClick={() => setSelectedNode(null)}
      />

      {/* Zoomable layer */}
      <g ref={zoomLayerRef} className="zoom-layer">
        {/* Edges */}
        <g className="edges">
          {edges.map((edge, index) => {
            const edgesBetweenNodes = edges.filter(e =>
              (e.source.id === edge.source.id && e.target.id === edge.target.id) ||
              (e.source.id === edge.target.id && e.target.id === edge.source.id)
            );
            const edgeIndex = edgesBetweenNodes.findIndex(e =>
              e.src === edge.src && e.dst === edge.dst
            );

            return (
              <ReactD3Edge
                key={`${edge.src}-${edge.dst}-${index}`}
                data={edge}
                orthogonal={orthogonalEdges}
                allNodes={nodes}
                edgeIndex={edgeIndex}
                totalEdgesBetweenNodes={edgesBetweenNodes.length}
                isDimmed={
                  Boolean(
                    hoveredNode &&
                    hoveredNode !== edge.source.id &&
                    hoveredNode !== edge.target.id &&
                    selectedNode !== edge.source.id &&
                    selectedNode !== edge.target.id
                  )
                }
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            // Get custom renderer from config for this node type
            const nodeConfig = config?.nodeTypes?.[node.kind];
            const customRenderer = nodeConfig?.renderer || config?.defaultNodeRenderer;
            const getNodeDimensionsFn = config?.getNodeDimensions;

            return (
              <ReactD3Node
                key={node.id}
                data={node}
                isSelected={selectedNode === node.id}
                isHovered={hoveredNode === node.id}
                isDimmed={Boolean(hoveredNode && hoveredNode !== node.id && selectedNode !== node.id)}
                customRenderer={customRenderer}
                getNodeDimensionsFn={getNodeDimensionsFn}
                onMouseEnter={handleNodeMouseEnter(node.id)}
                onMouseLeave={handleNodeMouseLeave(node.id)}
                onClick={handleNodeClick(node.id)}
                onDoubleClick={() => {
                  try {
                    node.fx = null;
                    node.fy = null;
                  } catch (e) { }
                }}
                onDragStart={handleDragStart(node)}
                onDrag={handleDrag(node)}
                onDragEnd={handleDragEnd(node)}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
};

export default ReactD3Graph;
