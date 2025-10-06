/**
 * ELK (Eclipse Layout Kernel) Layout
 * Advanced hierarchical layout with multiple algorithms
 * - Layered: Hierarchical directed graph layout (Sugiyama-style)
 * - Force: Physics-based layout
 * - MrTree: Multi-root tree layout
 * - Radial: Radial tree layout
 * - Disco: For disconnected graphs
 */

import ELK from 'elkjs/lib/elk.bundled.js';
import { NodeData, EdgeData } from '../../types';
import { LayoutDimensions } from '../layouts';

export type ELKAlgorithm = 'layered' | 'force' | 'mrtree' | 'radial' | 'disco';
export type ELKDirection = 'DOWN' | 'UP' | 'RIGHT' | 'LEFT';

export interface ELKLayoutOptions {
  algorithm?: ELKAlgorithm;        // ELK algorithm to use
  direction?: ELKDirection;        // Layout direction
  spacing?: number;                // Node spacing
  layerSpacing?: number;           // Spacing between layers (layered only)
  edgeSpacing?: number;            // Spacing between edges
  nodeNodeSpacing?: number;        // Minimum spacing between nodes
  // Layered algorithm options
  layeredCrossingMinimization?: 'LAYER_SWEEP' | 'INTERACTIVE';
  layeredNodePlacement?: 'SIMPLE' | 'LINEAR_SEGMENTS' | 'NETWORK_SIMPLEX' | 'BRANDES_KOEPF';
  // Force algorithm options
  forceIterations?: number;
  forceTemperature?: number;
}

export const ELKLayoutConfig = {
  name: 'ELK (Advanced)',
  description: 'Eclipse Layout Kernel with multiple advanced algorithms',
  fields: [
    {
      key: 'algorithm',
      label: 'Algorithm',
      type: 'select' as const,
      options: [
        { value: 'layered', label: 'Layered (Hierarchical)' },
        { value: 'force', label: 'Force-Directed' },
        { value: 'mrtree', label: 'Multi-Root Tree' },
        { value: 'radial', label: 'Radial Tree' },
        { value: 'disco', label: 'Disco (Disconnected)' },
      ],
      defaultValue: 'layered',
      description: 'Layout algorithm to use',
    },
    {
      key: 'direction',
      label: 'Direction',
      type: 'select' as const,
      options: [
        { value: 'DOWN', label: 'Top → Bottom' },
        { value: 'UP', label: 'Bottom → Top' },
        { value: 'RIGHT', label: 'Left → Right' },
        { value: 'LEFT', label: 'Right → Left' },
      ],
      defaultValue: 'DOWN',
      description: 'Layout flow direction',
    },
    {
      key: 'layeredNodePlacement',
      label: 'Node Placement Strategy',
      type: 'select' as const,
      options: [
        { value: 'SIMPLE', label: 'Simple' },
        { value: 'LINEAR_SEGMENTS', label: 'Linear Segments' },
        { value: 'NETWORK_SIMPLEX', label: 'Network Simplex (Best)' },
        { value: 'BRANDES_KOEPF', label: 'Brandes-Köpf' },
      ],
      defaultValue: 'NETWORK_SIMPLEX',
      description: 'How nodes are placed within layers (layered only)',
    },
    {
      key: 'spacing',
      label: 'Node Spacing',
      type: 'number' as const,
      min: 20,
      max: 200,
      step: 10,
      defaultValue: 80,
      description: 'General spacing between nodes',
    },
    {
      key: 'layerSpacing',
      label: 'Layer Spacing',
      type: 'number' as const,
      min: 30,
      max: 300,
      step: 10,
      defaultValue: 100,
      description: 'Spacing between layers (layered algorithm)',
    },
    {
      key: 'edgeSpacing',
      label: 'Edge Spacing',
      type: 'number' as const,
      min: 5,
      max: 50,
      step: 5,
      defaultValue: 15,
      description: 'Minimum spacing between edges',
    },
  ],
};

/**
 * Apply ELK layout
 * Returns nodes with fixed positions (static layout)
 */
export async function applyELKLayout(
  nodes: NodeData[],
  edges: EdgeData[],
  dimensions: LayoutDimensions,
  options: ELKLayoutOptions = {}
): Promise<NodeData[]> {
  const {
    algorithm = 'layered',
    direction = 'DOWN',
    spacing = 80,
    layerSpacing = 100,
    edgeSpacing = 15,
    nodeNodeSpacing = 80,
    layeredCrossingMinimization = 'LAYER_SWEEP',
    layeredNodePlacement = 'NETWORK_SIMPLEX',
    forceIterations = 150,
    forceTemperature = 0.001,
  } = options;

  const elk = new ELK();

  // Convert graph to ELK format
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': algorithm,
      'elk.direction': direction,
      'elk.spacing.nodeNode': String(nodeNodeSpacing),
      'elk.spacing.edgeNode': String(spacing),
      'elk.spacing.edgeEdge': String(edgeSpacing),
      // Layered algorithm options
      'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
      'elk.layered.crossingMinimization.strategy': layeredCrossingMinimization,
      'elk.layered.nodePlacement.strategy': layeredNodePlacement,
      'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
      'elk.layered.edgeRouting.polylineSlopeVertical': '0.2',
      // Force algorithm options
      'elk.force.iterations': String(forceIterations),
      'elk.force.temperature': String(forceTemperature),
      // General options
      'elk.padding': '[top=50,left=50,bottom=50,right=50]',
      'elk.aspectRatio': String(dimensions.width / dimensions.height),
    },
    children: nodes.map(node => ({
      id: node.id,
      width: 80,  // Approximate node width
      height: 40,  // Approximate node height
      labels: [{ text: node.name }],
    })),
    edges: edges.map((edge, index) => ({
      id: `edge-${index}`,
      sources: [edge.src],
      targets: [edge.dst],
    })),
  };


  // Perform layout
  const layoutedGraph = await elk.layout(elkGraph);

  // ELK adds width/height to the result, but types don't reflect this
  const elkResult = layoutedGraph as any;

  // Extract positions and center in viewport
  const graphWidth = (elkResult.width as number) || dimensions.width;
  const graphHeight = (elkResult.height as number) || dimensions.height;
  const offsetX = (dimensions.width - graphWidth) / 2;
  const offsetY = (dimensions.height - graphHeight) / 2;

  // Apply positions to nodes
  layoutedGraph.children?.forEach(elkNode => {
    const node = nodes.find(n => n.id === elkNode.id);
    if (node && elkNode.x !== undefined && elkNode.y !== undefined) {
      // Center nodes at their position (ELK gives top-left corner)
      node.x = elkNode.x + (elkNode.width || 80) / 2 + offsetX;
      node.y = elkNode.y + (elkNode.height || 40) / 2 + offsetY;
      node.fx = node.x;  // Fix positions
      node.fy = node.y;

    }
  });

  return nodes;
}
