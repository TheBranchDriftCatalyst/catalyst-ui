/**
 * Force-Directed Layout using D3 force simulation
 *
 * Implements a physics-based layout algorithm that simulates attractive and
 * repulsive forces between nodes to achieve natural, aesthetically pleasing
 * graph arrangements.
 *
 * **Algorithm Overview:**
 * - Nodes repel each other (charge force)
 * - Edges pull connected nodes together (link force)
 * - Nodes avoid overlapping (collision force)
 * - Graph is centered in viewport (center force)
 *
 * **Performance Characteristics:**
 * - Time Complexity: O(n²) per iteration (can be optimized with Barnes-Hut to O(n log n))
 * - Space Complexity: O(n + e) where n = nodes, e = edges
 * - Typical iterations: 100-300 depending on alphaDecay
 * - Best for: General graphs with <500 nodes
 *
 * @module ForceGraph/utils/layering/force
 * @see {@link https://github.com/d3/d3-force|D3 Force Documentation}
 */

import * as d3 from "d3";
import { NodeData, EdgeData } from "../../types";
import { LayoutDimensions } from "../layouts";

/**
 * Configuration options for force-directed layout
 *
 * All forces can be tuned to achieve different visual effects:
 * - Tighter clusters: Increase linkStrength, decrease chargeStrength
 * - More spread out: Decrease linkStrength, increase chargeStrength magnitude
 * - Faster convergence: Increase alphaDecay
 * - Slower, smoother animation: Decrease alphaDecay
 */
export interface ForceLayoutOptions {
  /**
   * Target distance between connected nodes
   * Can be a constant or a function for per-edge distances
   * @default 250
   */
  linkDistance?: number | ((edge: EdgeData) => number);

  /**
   * Strength of link attraction (0-1)
   * Higher values pull connected nodes closer together
   * @default 0.1
   */
  linkStrength?: number;

  /**
   * Strength of node repulsion (negative value)
   * More negative = stronger repulsion = more spread out
   * @default -150
   */
  chargeStrength?: number;

  /**
   * Collision detection radius (prevents node overlap)
   * Should be >= visual node radius
   * @default 65
   */
  collisionRadius?: number;

  /**
   * Strength of centering force (0-1)
   * Pulls all nodes toward viewport center
   * @default 0.05
   */
  centerStrength?: number;

  /**
   * Rate at which simulation energy decreases (0-1)
   * Higher values = faster convergence but less stable
   * @default 0.05
   */
  alphaDecay?: number;

  /**
   * Initial simulation energy (0-1)
   * Higher values = more initial movement
   * @default 0.3
   */
  initialAlpha?: number;
}

export const ForceLayoutConfig = {
  name: "Force-Directed",
  description: "Physics-based force simulation for natural graph layouts",
  fields: [
    {
      key: "chargeStrength",
      label: "Node Repulsion",
      type: "number" as const,
      min: -500,
      max: -50,
      step: 10,
      defaultValue: -150,
      description: "How strongly nodes repel each other",
    },
    {
      key: "linkStrength",
      label: "Link Strength",
      type: "number" as const,
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.1,
      description: "How strongly links pull nodes together",
    },
    {
      key: "collisionRadius",
      label: "Collision Radius",
      type: "number" as const,
      min: 30,
      max: 150,
      step: 5,
      defaultValue: 65,
      description: "Minimum distance between nodes",
    },
    {
      key: "centerStrength",
      label: "Center Force",
      type: "number" as const,
      min: 0,
      max: 0.5,
      step: 0.01,
      defaultValue: 0.05,
      description: "How strongly nodes are pulled to center",
    },
    {
      key: "alphaDecay",
      label: "Simulation Decay",
      type: "number" as const,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      defaultValue: 0.05,
      description: "How quickly simulation settles",
    },
  ],
};

/**
 * Create and configure a D3 force simulation
 *
 * This function creates a dynamic layout where node positions are continuously
 * updated by the simulation. The returned simulation object should be managed
 * by the caller (e.g., stopped when component unmounts).
 *
 * **Usage:**
 * ```typescript
 * const simulation = applyForceLayout(nodes, edges, { width: 800, height: 600 }, {
 *   chargeStrength: -200,  // Stronger repulsion
 *   linkStrength: 0.2,     // Stronger attraction
 *   collisionRadius: 80    // Larger collision radius
 * });
 *
 * // The simulation will automatically update node.x and node.y
 * simulation.on('tick', () => {
 *   // Re-render graph with updated positions
 *   updateVisualization();
 * });
 *
 * // Stop simulation when done
 * simulation.stop();
 * ```
 *
 * **Behavior:**
 * - Releases any fixed positions (node.fx, node.fy)
 * - Creates forces: link, charge, collision, center
 * - Returns live simulation object that updates node positions
 * - Simulation runs until alpha (energy) decays to alphaMin
 *
 * @param nodes - Array of nodes to layout (will be mutated with x, y coordinates)
 * @param edges - Array of edges defining graph connectivity
 * @param dimensions - Viewport dimensions for centering
 * @param options - Optional force parameters to customize behavior
 * @returns D3 simulation object (can be stopped, restarted, or configured further)
 *
 * @see {@link ForceLayoutOptions} for configuration details
 * @see {@link https://github.com/d3/d3-force#simulation|D3 Simulation API}
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
  nodes.forEach(n => {
    n.fx = null;
    n.fy = null;
  });

  // Create simulation
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(edges)
        .id((d: any) => d.id)
        .distance(typeof linkDistance === "function" ? linkDistance : () => linkDistance)
        .strength(linkStrength)
    )
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("collision", d3.forceCollide().radius(collisionRadius))
    .force("center", d3.forceCenter(width / 2, height / 2).strength(centerStrength))
    .alphaDecay(alphaDecay)
    .alpha(initialAlpha);

  return simulation;
}
