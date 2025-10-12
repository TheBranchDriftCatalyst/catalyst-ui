/**
 * Community Detection using simplified Louvain Algorithm
 *
 * Identifies densely connected groups of nodes within a graph, which is useful
 * for understanding graph structure and organizing layouts.
 *
 * **Algorithm: Simplified Louvain Method**
 *
 * The Louvain method is a greedy optimization algorithm that maximizes modularity
 * (a measure of how well-separated communities are). This implementation uses a
 * simplified version that's fast and works well for visualization purposes.
 *
 * **Process:**
 * 1. Initialize: Each node starts in its own community
 * 2. Iterate: For each node, try moving it to neighbor communities
 * 3. Evaluate: Choose the community with the most connections
 * 4. Repeat: Continue until no improvements are made
 * 5. Renumber: Assign sequential community IDs
 *
 * **Performance Characteristics:**
 * - Time Complexity: O(k × (n + e)) where k = iterations (typically 5-20)
 * - Space Complexity: O(n + e) for adjacency lists and community maps
 * - Best for: Graphs with 10-10,000 nodes
 * - Quality: Good approximation of true Louvain, optimized for speed
 *
 * **Limitations:**
 * - Simplified version (doesn't use full modularity calculation)
 * - May not find optimal communities on highly complex graphs
 * - Randomized (different runs may produce different results)
 *
 * @module ForceGraph/utils/community
 * @see {@link https://en.wikipedia.org/wiki/Louvain_method|Louvain Method}
 */

import { NodeData, EdgeData } from "../types";

/**
 * Represents a detected community of nodes
 */
export interface Community {
  /** Unique identifier for this community */
  id: number;
  /** Array of node IDs belonging to this community */
  nodes: string[];
}

/**
 * Detect communities using simplified Louvain algorithm
 *
 * This function analyzes graph connectivity to identify groups of nodes that are
 * more densely connected to each other than to the rest of the graph.
 *
 * **Usage:**
 * ```typescript
 * const nodeToCommunity = detectCommunities(nodes, edges);
 *
 * // Check which community a node belongs to
 * const community = nodeToCommunity.get(nodeId);
 *
 * // Count communities
 * const numCommunities = new Set(nodeToCommunity.values()).size;
 *
 * // Get all nodes in a specific community
 * const communityNodes = nodes.filter(n =>
 *   nodeToCommunity.get(n.id) === targetCommunityId
 * );
 * ```
 *
 * **Algorithm Details:**
 * - Uses greedy optimization to maximize intra-community connections
 * - Randomizes node order each iteration for better convergence
 * - Runs up to 20 iterations or until convergence
 * - Communities are renumbered sequentially (0, 1, 2, ...)
 *
 * @param nodes - Array of nodes to analyze
 * @param edges - Array of edges defining connectivity
 * @returns Map from node ID to community ID (sequential integers starting at 0)
 *
 * @see {@link getCommunityGroups} to convert map to Community objects
 */
export function detectCommunities(nodes: NodeData[], edges: EdgeData[]): Map<string, number> {
  // Build adjacency list
  const adjacency = new Map<string, Set<string>>();
  const degrees = new Map<string, number>();

  nodes.forEach(node => {
    adjacency.set(node.id, new Set());
    degrees.set(node.id, 0);
  });

  edges.forEach(edge => {
    adjacency.get(edge.src)?.add(edge.dst);
    adjacency.get(edge.dst)?.add(edge.src);
    degrees.set(edge.src, (degrees.get(edge.src) || 0) + 1);
    degrees.set(edge.dst, (degrees.get(edge.dst) || 0) + 1);
  });

  // Initialize: each node in its own community
  const nodeToCommunity = new Map<string, number>();
  nodes.forEach((node, index) => {
    nodeToCommunity.set(node.id, index);
  });

  // Iterative optimization
  let improved = true;
  let iterations = 0;
  const maxIterations = 20; // Increased for better community detection

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    // Shuffle nodes for randomness
    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);

    for (const node of shuffledNodes) {
      const currentCommunity = nodeToCommunity.get(node.id)!;
      const neighbors = Array.from(adjacency.get(node.id) || []);

      if (neighbors.length === 0) continue;

      // Calculate modularity gain for moving to each neighbor's community
      const communityCandidates = new Map<number, number>();

      neighbors.forEach(neighborId => {
        const neighborCommunity = nodeToCommunity.get(neighborId);
        if (neighborCommunity === undefined) return;

        communityCandidates.set(
          neighborCommunity,
          (communityCandidates.get(neighborCommunity) || 0) + 1
        );
      });

      // Find best community (most connections)
      let bestCommunity = currentCommunity;
      let bestScore = communityCandidates.get(currentCommunity) || 0;

      communityCandidates.forEach((score, community) => {
        if (score > bestScore) {
          bestScore = score;
          bestCommunity = community;
        }
      });

      // Move if beneficial
      if (bestCommunity !== currentCommunity && bestScore > 0) {
        nodeToCommunity.set(node.id, bestCommunity);
        improved = true;
      }
    }
  }

  // Renumber communities to be sequential (0, 1, 2, ...)
  const communityMap = new Map<number, number>();
  let nextCommunityId = 0;

  nodeToCommunity.forEach((oldCommunity, nodeId) => {
    if (!communityMap.has(oldCommunity)) {
      communityMap.set(oldCommunity, nextCommunityId++);
    }
    nodeToCommunity.set(nodeId, communityMap.get(oldCommunity)!);
  });

  return nodeToCommunity;
}

/**
 * Convert community map to structured Community objects
 *
 * Transforms the flat node-to-community map returned by {@link detectCommunities}
 * into an array of Community objects, each containing its member nodes.
 *
 * **Usage:**
 * ```typescript
 * const nodeToCommunity = detectCommunities(nodes, edges);
 * const communities = getCommunityGroups(nodes, nodeToCommunity);
 *
 * // Iterate through communities
 * communities.forEach(community => {
 *   console.log(`Community ${community.id} has ${community.nodes.length} nodes`);
 *   community.nodes.forEach(nodeId => {
 *     // Access node data
 *     const node = nodes.find(n => n.id === nodeId);
 *   });
 * });
 *
 * // Find largest community
 * const largest = communities.reduce((max, c) =>
 *   c.nodes.length > max.nodes.length ? c : max
 * );
 * ```
 *
 * @param _nodes - Original node array (currently unused, kept for API compatibility)
 * @param nodeToCommunity - Map from node ID to community ID
 * @returns Array of Community objects, each containing an ID and member node IDs
 *
 * @see {@link detectCommunities} for generating the node-to-community map
 */
export function getCommunityGroups(
  _nodes: NodeData[],
  nodeToCommunity: Map<string, number>
): Community[] {
  const communities = new Map<number, string[]>();

  nodeToCommunity.forEach((communityId, nodeId) => {
    if (!communities.has(communityId)) {
      communities.set(communityId, []);
    }
    communities.get(communityId)!.push(nodeId);
  });

  return Array.from(communities.entries()).map(([id, nodes]) => ({
    id,
    nodes,
  }));
}
