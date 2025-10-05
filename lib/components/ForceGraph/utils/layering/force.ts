/**
 * Force-Directed Layout
 * Standard D3 force simulation with customizable parameters
 */

import * as d3 from 'd3';
import { NodeData, EdgeData } from '../../types';
import { LayoutDimensions } from '../layouts';

export interface ForceLayoutOptions {
  linkDistance?: number | ((edge: EdgeData) => number);
  linkStrength?: number;
  chargeStrength?: number;
  collisionRadius?: number;
  centerStrength?: number;
  alphaDecay?: number;
  initialAlpha?: number;
}

export const ForceLayoutConfig = {
  name: 'Force-Directed',
  description: 'Physics-based force simulation for natural graph layouts',
  fields: [
    {
      key: 'chargeStrength',
      label: 'Node Repulsion',
      type: 'number' as const,
      min: -500,
      max: -50,
      step: 10,
      defaultValue: -150,
      description: 'How strongly nodes repel each other',
    },
    {
      key: 'linkStrength',
      label: 'Link Strength',
      type: 'number' as const,
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.1,
      description: 'How strongly links pull nodes together',
    },
    {
      key: 'collisionRadius',
      label: 'Collision Radius',
      type: 'number' as const,
      min: 30,
      max: 150,
      step: 5,
      defaultValue: 65,
      description: 'Minimum distance between nodes',
    },
    {
      key: 'centerStrength',
      label: 'Center Force',
      type: 'number' as const,
      min: 0,
      max: 0.5,
      step: 0.01,
      defaultValue: 0.05,
      description: 'How strongly nodes are pulled to center',
    },
    {
      key: 'alphaDecay',
      label: 'Simulation Decay',
      type: 'number' as const,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      defaultValue: 0.05,
      description: 'How quickly simulation settles',
    },
  ],
};

/**
 * Create D3 force simulation
 * Returns simulation object (dynamic layout)
 */
export function applyForceLayout(
  nodes: NodeData[],
  edges: EdgeData[],
  dimensions: LayoutDimensions,
  options: ForceLayoutOptions = {}
): d3.Simulation<any, undefined> {
  const {
    linkDistance = 250,
    linkStrength = 0.1,
    chargeStrength = -150,
    collisionRadius = 65,
    centerStrength = 0.05,
    alphaDecay = 0.05,
    initialAlpha = 0.3,
  } = options;

  const { width, height } = dimensions;

  // Release any fixed positions
  nodes.forEach((n) => {
    n.fx = null;
    n.fy = null;
  });

  // Create simulation
  const simulation = d3.forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(edges)
        .id((d: any) => d.id)
        .distance(typeof linkDistance === 'function'
          ? linkDistance
          : () => linkDistance
        )
        .strength(linkStrength)
    )
    .force('charge', d3.forceManyBody().strength(chargeStrength))
    .force('collision', d3.forceCollide().radius(collisionRadius))
    .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))
    .alphaDecay(alphaDecay)
    .alpha(initialAlpha);

  return simulation;
}
