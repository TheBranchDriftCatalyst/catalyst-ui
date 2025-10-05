/**
 * Community-Based Force Layout
 * Detects node communities and layouts them hierarchically
 */

import * as d3 from 'd3';
import { NodeData, EdgeData } from '../../types';
import { LayoutDimensions } from '../layouts';
import { detectCommunities, getCommunityGroups } from '../community';

export interface CommunityLayoutOptions {
  communityStrength?: number;     // Attraction within communities (0-1)
  separationStrength?: number;    // Repulsion between communities
  communityPadding?: number;      // Space between community bounding boxes
  localIterations?: number;       // Force iterations for local layouts
  globalIterations?: number;      // Force iterations for community positioning
}

export const CommunityLayoutConfig = {
  name: 'Community (Smart)',
  description: 'Groups related nodes using community detection',
  fields: [
    {
      key: 'communityStrength',
      label: 'Community Cohesion',
      type: 'number' as const,
      min: 0.1,
      max: 1,
      step: 0.1,
      defaultValue: 0.8,
      description: 'How tightly grouped each community is',
    },
    {
      key: 'separationStrength',
      label: 'Community Separation',
      type: 'number' as const,
      min: -1000,
      max: -100,
      step: 50,
      defaultValue: -500,
      description: 'How far apart communities are pushed',
    },
    {
      key: 'communityPadding',
      label: 'Community Padding',
      type: 'number' as const,
      min: 50,
      max: 300,
      step: 10,
      defaultValue: 120,
      description: 'Space between community boundaries',
    },
    {
      key: 'localIterations',
      label: 'Local Precision',
      type: 'number' as const,
      min: 50,
      max: 200,
      step: 10,
      defaultValue: 120,
      description: 'Layout quality within communities',
    },
    {
      key: 'globalIterations',
      label: 'Global Precision',
      type: 'number' as const,
      min: 30,
      max: 100,
      step: 10,
      defaultValue: 60,
      description: 'Layout quality for community positioning',
    },
  ],
};

interface CommunityLayout {
  id: number;
  nodes: NodeData[];
  center: { x: number; y: number };
  bounds: { width: number; height: number };
}

/**
 * Apply community-based force layout
 * Returns simulation for global positioning
 */
export function applyCommunityLayout(
  nodes: NodeData[],
  edges: EdgeData[],
  dimensions: LayoutDimensions,
  options: CommunityLayoutOptions = {}
): d3.Simulation<any, undefined> {
  const {
    communityStrength = 0.8,
    separationStrength = -500,
    communityPadding = 100,
    localIterations = 50,
    globalIterations = 30,
  } = options;

  const { width, height } = dimensions;

  // Step 1: Detect communities
  const nodeToCommunity = detectCommunities(nodes, edges);
  const communityGroups = getCommunityGroups(nodes, nodeToCommunity);

  console.log(`Detected ${communityGroups.length} communities`);

  // Step 2: Layout each community locally
  const communityLayouts: CommunityLayout[] = [];

  communityGroups.forEach(community => {
    const communityNodes = nodes.filter(n => community.nodes.includes(n.id));
    const communityEdges = edges.filter(e =>
      community.nodes.includes(e.src) && community.nodes.includes(e.dst)
    );

    // Initialize nodes in a circle for better starting positions
    const circleRadius = Math.sqrt(communityNodes.length) * 30;
    communityNodes.forEach((node, i) => {
      const angle = (i / communityNodes.length) * 2 * Math.PI;
      node.x = circleRadius * Math.cos(angle);
      node.y = circleRadius * Math.sin(angle);
    });

    // Local force simulation for this community
    const localSim = d3.forceSimulation(communityNodes)
      .force(
        'link',
        d3.forceLink(communityEdges)
          .id((d: any) => d.id)
          .distance(100)  // Increased spacing
          .strength(communityStrength)
      )
      .force('charge', d3.forceManyBody().strength(-150))  // Stronger repulsion
      .force('collision', d3.forceCollide().radius(60))  // Larger collision radius
      .force('center', d3.forceCenter(0, 0).strength(0.05))  // Center within community
      .alphaDecay(0.02)  // Slower decay for more settling
      .alpha(1);

    // Run local simulation to completion
    for (let i = 0; i < localIterations; i++) {
      localSim.tick();
    }
    localSim.stop();

    // Calculate bounding box
    const xs = communityNodes.map(n => n.x || 0);
    const ys = communityNodes.map(n => n.y || 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const boundsWidth = maxX - minX + communityPadding;
    const boundsHeight = maxY - minY + communityPadding;

    // Center the community nodes around (0, 0) for now
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    communityNodes.forEach(n => {
      n.x = (n.x || 0) - centerX;
      n.y = (n.y || 0) - centerY;
    });

    communityLayouts.push({
      id: community.id,
      nodes: communityNodes,
      center: { x: 0, y: 0 }, // Will be set by global layout
      bounds: { width: boundsWidth, height: boundsHeight },
    });
  });

  // Step 3: Position community centers using force simulation
  const communityPositions = communityLayouts.map((layout, index) => ({
    id: layout.id,
    x: (index % 3) * 300 + width / 2 - 300, // Initial grid
    y: Math.floor(index / 3) * 300 + height / 2 - 300,
    bounds: layout.bounds,
  }));

  const globalSim = d3.forceSimulation(communityPositions as any)
    .force('charge', d3.forceManyBody().strength(separationStrength))
    .force('collision', d3.forceCollide()
      .radius((d: any) => Math.max(d.bounds.width, d.bounds.height) / 2 + communityPadding / 2)
      .strength(1)  // Full strength collision avoidance
    )
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
    .alphaDecay(0.02)  // Slower decay for better settling
    .alpha(1);

  // Run global simulation
  for (let i = 0; i < globalIterations; i++) {
    globalSim.tick();
  }
  globalSim.stop();

  // Step 4: Position all nodes based on community centers
  communityLayouts.forEach(layout => {
    const communityPos = communityPositions.find(p => p.id === layout.id);
    if (!communityPos) return;

    layout.center = { x: communityPos.x, y: communityPos.y };

    layout.nodes.forEach(node => {
      node.x = (node.x || 0) + communityPos.x;
      node.y = (node.y || 0) + communityPos.y;
      node.fx = node.x; // Fix positions after community layout
      node.fy = node.y;
    });
  });

  // Return a dummy simulation (nodes are already positioned)
  const dummySim = d3.forceSimulation(nodes)
    .alphaDecay(1)
    .alpha(0);

  return dummySim;
}
