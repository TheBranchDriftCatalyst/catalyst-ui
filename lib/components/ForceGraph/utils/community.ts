/**
 * Community Detection using Louvain Algorithm
 * Groups nodes into communities based on connection density
 */

import { NodeData, EdgeData } from '../types';

export interface Community {
  id: number;
  nodes: string[];
}

/**
 * Detect communities using simplified Louvain algorithm
 * Returns map of nodeId -> communityId
 */
export function detectCommunities(
  nodes: NodeData[],
  edges: EdgeData[]
): Map<string, number> {
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
 * Get communities as groups of nodes
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
