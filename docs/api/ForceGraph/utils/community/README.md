[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/utils/community

# ForceGraph/utils/community

Community Detection using simplified Louvain Algorithm

Identifies densely connected groups of nodes within a graph, which is useful
for understanding graph structure and organizing layouts.

**Algorithm: Simplified Louvain Method**

The Louvain method is a greedy optimization algorithm that maximizes modularity
(a measure of how well-separated communities are). This implementation uses a
simplified version that's fast and works well for visualization purposes.

**Process:**

1. Initialize: Each node starts in its own community
2. Iterate: For each node, try moving it to neighbor communities
3. Evaluate: Choose the community with the most connections
4. Repeat: Continue until no improvements are made
5. Renumber: Assign sequential community IDs

**Performance Characteristics:**

- Time Complexity: O(k × (n + e)) where k = iterations (typically 5-20)
- Space Complexity: O(n + e) for adjacency lists and community maps
- Best for: Graphs with 10-10,000 nodes
- Quality: Good approximation of true Louvain, optimized for speed

**Limitations:**

- Simplified version (doesn't use full modularity calculation)
- May not find optimal communities on highly complex graphs
- Randomized (different runs may produce different results)

## See

[Method](https://en.wikipedia.org/wiki/Louvain_method|Louvain)

## Interfaces

- [Community](interfaces/Community.md)

## Functions

- [detectCommunities](functions/detectCommunities.md)
- [getCommunityGroups](functions/getCommunityGroups.md)
