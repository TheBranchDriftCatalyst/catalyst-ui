/**
 * Community-Based Force Layout
 * Detects node communities and layouts them hierarchically
 */

import * as d3 from "d3";
import { NodeData, EdgeData } from "../../types";
import { LayoutDimensions } from "../layouts";
import { detectCommunities, getCommunityGroups } from "../community";

export type CommunityLayoutStrategy = "grid" | "horizontal" | "vertical" | "circular";
export type CommunitySortStrategy = "size" | "nodeCount" | "none";
export type CommunityInternalLayout = "force" | "structured";

export interface CommunityLayoutOptions {
  communityStrength?: number; // Attraction within communities (0-1) - force only
  communityPadding?: number; // Space between community bounding boxes
  localIterations?: number; // Force iterations for local layouts - force only
  layoutStrategy?: CommunityLayoutStrategy; // How to arrange communities
  gridColumns?: number; // Override auto-calculated columns (grid only)
  sortBy?: CommunitySortStrategy; // How to sort communities before positioning
  internalLayout?: CommunityInternalLayout; // Layout algorithm within communities
  internalNodeSpacing?: number; // Node spacing within communities - structured only
}

export const CommunityLayoutConfig = {
  name: "Community (Smart)",
  description: "Groups related nodes using community detection with calculated positioning",
  fields: [
    {
      key: "layoutStrategy",
      label: "Layout Strategy",
      type: "select" as const,
      options: [
        { value: "grid", label: "Grid (Auto)" },
        { value: "horizontal", label: "Horizontal Row" },
        { value: "vertical", label: "Vertical Column" },
        { value: "circular", label: "Circular" },
      ],
      defaultValue: "grid",
      description: "How to arrange communities in the viewport",
    },
    {
      key: "internalLayout",
      label: "Internal Layout",
      type: "select" as const,
      options: [
        { value: "structured", label: "Structured (Columns by Type)" },
        { value: "force", label: "Force Simulation" },
      ],
      defaultValue: "structured",
      description: "How to organize nodes within each community",
    },
    {
      key: "sortBy",
      label: "Sort Communities By",
      type: "select" as const,
      options: [
        { value: "size", label: "Size (Largest First)" },
        { value: "nodeCount", label: "Node Count" },
        { value: "none", label: "None" },
      ],
      defaultValue: "size",
      description: "Sort order for community placement",
    },
    {
      key: "communityPadding",
      label: "Community Spacing",
      type: "number" as const,
      min: 50,
      max: 300,
      step: 10,
      defaultValue: 120,
      description: "Space between communities",
    },
    {
      key: "gridColumns",
      label: "Grid Columns",
      type: "number" as const,
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 0,
      description: "Override auto-calculated columns (0 = auto)",
    },
    {
      key: "internalNodeSpacing",
      label: "Internal Node Spacing",
      type: "number" as const,
      min: 50,
      max: 200,
      step: 10,
      defaultValue: 100,
      description: "Vertical spacing between nodes (structured layout)",
    },
    {
      key: "communityStrength",
      label: "Force Cohesion",
      type: "number" as const,
      min: 0.1,
      max: 1,
      step: 0.1,
      defaultValue: 0.8,
      description: "Attraction strength (force layout only)",
    },
    {
      key: "localIterations",
      label: "Force Iterations",
      type: "number" as const,
      min: 50,
      max: 200,
      step: 10,
      defaultValue: 120,
      description: "Simulation quality (force layout only)",
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
 * Apply community-based layout with calculated positioning
 * Returns simulation for compatibility (nodes are already positioned)
 */
export function applyCommunityLayout(
  nodes: NodeData[],
  edges: EdgeData[],
  dimensions: LayoutDimensions,
  options: CommunityLayoutOptions = {}
): d3.Simulation<any, undefined> {
  const {
    communityStrength = 0.8,
    communityPadding = 120,
    localIterations = 120,
    layoutStrategy = "grid",
    gridColumns = 0,
    sortBy = "size",
    internalLayout = "structured",
    internalNodeSpacing = 100,
  } = options;

  const { width, height } = dimensions;

  // Step 1: Detect communities
  const nodeToCommunity = detectCommunities(nodes, edges);
  const communityGroups = getCommunityGroups(nodes, nodeToCommunity);

  // Step 2: Layout each community locally
  const communityLayouts: CommunityLayout[] = [];

  communityGroups.forEach(community => {
    const communityNodes = nodes.filter(n => community.nodes.includes(n.id));
    const communityEdges = edges.filter(
      e => community.nodes.includes(e.src) && community.nodes.includes(e.dst)
    );

    if (internalLayout === "structured") {
      // Structured layout: organize nodes by kind into columns
      const kinds = Array.from(new Set(communityNodes.map(n => n.kind)));
      const colCount = kinds.length || 1;

      // Estimate dimensions for this community
      const estimatedWidth = colCount * 150; // Column width

      const colWidth = estimatedWidth / colCount;

      // Group and position nodes by kind
      const grouped: Record<string, NodeData[]> = {};
      kinds.forEach(k => (grouped[k] = []));
      communityNodes.forEach(n => grouped[n.kind].push(n));

      kinds.forEach((kind, colIndex) => {
        const colNodes = grouped[kind];
        const nodesInColumn = colNodes.length;

        const totalHeight = nodesInColumn > 1 ? (nodesInColumn - 1) * internalNodeSpacing : 0;
        const startY = -totalHeight / 2; // Center vertically around 0
        const x = (colIndex - (colCount - 1) / 2) * colWidth; // Center horizontally around 0

        colNodes.forEach((node, i) => {
          node.x = x;
          node.y = startY + i * internalNodeSpacing;
        });
      });
    } else {
      // Force layout: use D3 force simulation
      // Initialize nodes in a circle for better starting positions
      const circleRadius = Math.sqrt(communityNodes.length) * 30;
      communityNodes.forEach((node, i) => {
        const angle = (i / communityNodes.length) * 2 * Math.PI;
        node.x = circleRadius * Math.cos(angle);
        node.y = circleRadius * Math.sin(angle);
      });

      // Local force simulation for this community
      const localSim = d3
        .forceSimulation(communityNodes)
        .force(
          "link",
          d3
            .forceLink(communityEdges)
            .id((d: any) => d.id)
            .distance(100)
            .strength(communityStrength)
        )
        .force("charge", d3.forceManyBody().strength(-150))
        .force("collision", d3.forceCollide().radius(60))
        .force("center", d3.forceCenter(0, 0).strength(0.05))
        .alphaDecay(0.02)
        .alpha(1);

      // Run local simulation to completion
      for (let i = 0; i < localIterations; i++) {
        localSim.tick();
      }
      localSim.stop();
    }

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

  // Step 3: Sort communities (optional)
  if (sortBy !== "none") {
    communityLayouts.sort((a, b) => {
      if (sortBy === "size") {
        const areaA = a.bounds.width * a.bounds.height;
        const areaB = b.bounds.width * b.bounds.height;
        return areaB - areaA; // Largest first
      } else if (sortBy === "nodeCount") {
        return b.nodes.length - a.nodes.length; // Most nodes first
      }
      return 0;
    });
  }

  // Step 4: Calculate community positions based on layout strategy
  switch (layoutStrategy) {
    case "grid": {
      // Calculate optimal grid dimensions
      const numCommunities = communityLayouts.length;
      const cols = gridColumns > 0 ? gridColumns : Math.ceil(Math.sqrt(numCommunities));
      const rows = Math.ceil(numCommunities / cols);

      // Calculate cell sizes based on actual community bounds
      const maxWidth = Math.max(...communityLayouts.map(c => c.bounds.width));
      const maxHeight = Math.max(...communityLayouts.map(c => c.bounds.height));
      const cellWidth = maxWidth + communityPadding;
      const cellHeight = maxHeight + communityPadding;

      // Center the grid in viewport
      const gridWidth = cellWidth * cols;
      const gridHeight = cellHeight * rows;
      const startX = (width - gridWidth) / 2;
      const startY = (height - gridHeight) / 2;

      // Position each community in grid cells
      communityLayouts.forEach((layout, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const centerX = startX + col * cellWidth + cellWidth / 2;
        const centerY = startY + row * cellHeight + cellHeight / 2;

        layout.center = { x: centerX, y: centerY };
      });
      break;
    }

    case "horizontal": {
      // Single row, distribute horizontally with even spacing
      const totalWidth = communityLayouts.reduce((sum, c) => sum + c.bounds.width, 0);
      const totalPadding = (communityLayouts.length + 1) * communityPadding;
      const availableWidth = width - totalPadding;
      const scale = Math.min(1, availableWidth / totalWidth);

      let currentX = communityPadding;
      communityLayouts.forEach(layout => {
        const scaledWidth = layout.bounds.width * scale;
        const centerX = currentX + scaledWidth / 2;
        const centerY = height / 2;

        layout.center = { x: centerX, y: centerY };

        currentX += scaledWidth + communityPadding;
      });
      break;
    }

    case "vertical": {
      // Single column, distribute vertically with even spacing
      const totalHeight = communityLayouts.reduce((sum, c) => sum + c.bounds.height, 0);
      const totalPadding = (communityLayouts.length + 1) * communityPadding;
      const availableHeight = height - totalPadding;
      const scale = Math.min(1, availableHeight / totalHeight);

      let currentY = communityPadding;
      communityLayouts.forEach(layout => {
        const scaledHeight = layout.bounds.height * scale;
        const centerX = width / 2;
        const centerY = currentY + scaledHeight / 2;

        layout.center = { x: centerX, y: centerY };

        currentY += scaledHeight + communityPadding;
      });
      break;
    }

    case "circular": {
      // Arrange communities in a circle around viewport center
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3; // Use 1/3 of smaller dimension
      const angleStep = (2 * Math.PI) / communityLayouts.length;

      communityLayouts.forEach((layout, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start at top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        layout.center = { x, y };
      });
      break;
    }
  }

  // Step 5: Position all nodes based on calculated community centers
  communityLayouts.forEach(layout => {
    const { x: centerX, y: centerY } = layout.center;

    layout.nodes.forEach(node => {
      node.x = (node.x || 0) + centerX;
      node.y = (node.y || 0) + centerY;
      node.fx = node.x; // Fix positions after community layout
      node.fy = node.y;
    });
  });

  // Return a dummy simulation (nodes are already positioned)
  const dummySim = d3.forceSimulation(nodes).alphaDecay(1).alpha(0);

  return dummySim;
}
