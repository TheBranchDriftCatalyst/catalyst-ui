import { useEffect, useMemo } from 'react';
import { useGraphContext } from '../context/GraphContext';
import { NodeData, EdgeData, NodeKind, EdgeKind } from '../types';
import { GraphFilters, GraphConnectionFilter } from '../types/filterTypes';
import { GraphConfig } from '../config/types';
import {
  isOrphanedNode,
  matchesStatusFilter,
  matchesConnectionFilter,
  matchesSearchQuery,
  matchesAttributeFilters,
  matchesRunningOnly,
  matchesInUseOnly,
} from '../utils/filterPredicates';

export const useGraphFilters = (config?: GraphConfig<any, any>) => {
  const { state, dispatch } = useGraphContext();

  // Main filtering function
  const applyFilters = useMemo(() => {
    if (!state.rawData) {
      return null;
    }

    const { filters } = state;
    const { nodes: rawNodes, edges: rawEdges } = state.rawData;

    // Convert nodes to array for easier filtering
    const nodeArray = Object.values(rawNodes) as NodeData[];
    const edgeArray = rawEdges as EdgeData[];

    // Optimize excluded nodes lookup with Set (O(1) instead of O(n))
    const excludedSet = filters.excludedNodeIds
      ? new Set(filters.excludedNodeIds)
      : null;

    // Filter nodes
    let filteredNodes = nodeArray.filter(node => {
      // Excluded nodes filter (O(1) lookup)
      if (excludedSet?.has(node.id)) {
        return false;
      }

      // Basic visibility filter (early exit for hidden types)
      if (!filters.visibleNodes[node.kind]) {
        return false;
      }

      // Status filter
      if (!matchesStatusFilter(node, filters.statusFilter)) {
        return false;
      }

      // Search query filter
      if (!matchesSearchQuery(node, filters.searchQuery)) {
        return false;
      }

      // Running only filter
      if (!matchesRunningOnly(node, filters.showRunningOnly)) {
        return false;
      }

      // In-use only filter
      if (!matchesInUseOnly(node, filters.showInUseOnly)) {
        return false;
      }

      // Apply generic attribute filters from config
      if (!matchesAttributeFilters(node, filters, config)) {
        return false;
      }

      return true;
    });

    // Create a map of filtered node IDs for edge filtering
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

    // Filter edges based on visible edge types and whether both nodes are visible
    let filteredEdges = edgeArray.filter(edge => {
      if (!filters.visibleEdges[edge.kind]) {
        return false;
      }
      return filteredNodeIds.has(edge.src) && filteredNodeIds.has(edge.dst);
    });

    // Apply connection filter (must be done after initial edge filtering)
    if (filters.connectionFilter !== 'all' || filters.showOrphanedOnly) {
      filteredNodes = filteredNodes.filter(node => {
        const isOrphaned = isOrphanedNode(node.id, filteredEdges);

        if (filters.showOrphanedOnly && !isOrphaned) {
          return false;
        }
        if (!matchesConnectionFilter(node.id, filters.connectionFilter, filteredEdges)) {
          return false;
        }

        return true;
      });

      // Update filtered node IDs after connection filtering
      const finalNodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(edge =>
        finalNodeIds.has(edge.src) && finalNodeIds.has(edge.dst)
      );
    }

    // Convert filtered nodes back to object format
    const filteredNodesObj: Record<string, NodeData> = {};
    filteredNodes.forEach(node => {
      filteredNodesObj[node.id] = node;
    });

    return {
      nodes: filteredNodesObj,
      edges: filteredEdges
    };
  }, [state.rawData, state.filters, config]);

  // Update filtered data when filters change
  useEffect(() => {
    if (applyFilters) {
      dispatch({ type: 'SET_FILTERED_DATA', payload: applyFilters });
    }
  }, [applyFilters, dispatch]);

  // Filter actions
  const updateFilters = (newFilters: Partial<GraphFilters>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: newFilters });
  };

  const toggleNodeVisibility = (nodeKind: NodeKind) => {
    dispatch({ type: 'TOGGLE_NODE_VISIBILITY', payload: nodeKind });
  };

  const toggleEdgeVisibility = (edgeKind: EdgeKind) => {
    dispatch({ type: 'TOGGLE_EDGE_VISIBILITY', payload: edgeKind });
  };

  const setStatusFilter = (filter: string) => {
    updateFilters({ statusFilter: filter });
  };

  const setConnectionFilter = (filter: GraphConnectionFilter) => {
    updateFilters({ connectionFilter: filter });
  };

  const setSearchQuery = (query: string) => {
    updateFilters({ searchQuery: query });
  };

  const setAttributeFilterValue = (filterName: string, value: any) => {
    const current = state.filters.attributeFilterValues || {};
    updateFilters({
      attributeFilterValues: {
        ...current,
        [filterName]: value,
      },
    });
  };

  const clearAttributeFilter = (filterName: string) => {
    const current = state.filters.attributeFilterValues || {};
    const { [filterName]: removed, ...remaining } = current;
    updateFilters({ attributeFilterValues: remaining });
  };

  const toggleOrphanedOnly = () => {
    updateFilters({ showOrphanedOnly: !state.filters.showOrphanedOnly });
  };

  const toggleRunningOnly = () => {
    updateFilters({ showRunningOnly: !state.filters.showRunningOnly });
  };

  const toggleInUseOnly = () => {
    updateFilters({ showInUseOnly: !state.filters.showInUseOnly });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  // Exclusion helpers
  const excludeNode = (nodeId: string) => {
    const existing = state.filters.excludedNodeIds || [];
    if (!existing.includes(nodeId)) {
      updateFilters({ excludedNodeIds: [...existing, nodeId] });
    }
  };

  const includeNode = (nodeId: string) => {
    const existing = state.filters.excludedNodeIds || [];
    updateFilters({ excludedNodeIds: existing.filter(id => id !== nodeId) });
  };

  const clearExcluded = () => {
    updateFilters({ excludedNodeIds: [] });
  };

  // Quick filter presets
  const showOnlyOrphaned = () => {
    updateFilters({
      showOrphanedOnly: true,
      statusFilter: 'all',
      connectionFilter: 'orphaned',
      showRunningOnly: false,
      showInUseOnly: false
    });
  };

  const showOnlyRunning = () => {
    updateFilters({
      showRunningOnly: true,
      statusFilter: 'running',
      showOrphanedOnly: false,
      showInUseOnly: false
    });
  };

  const showMinimalView = () => {
    updateFilters({
      showOrphanedOnly: false,
      statusFilter: 'in-use',
      connectionFilter: 'connected'
    });
  };

  return {
    // State
    filters: state.filters,
    filteredData: state.filteredData,

    // Basic filter actions
    updateFilters,
    toggleNodeVisibility,
    toggleEdgeVisibility,
    resetFilters,

    // Specific filter actions
    setStatusFilter,
    setConnectionFilter,
    setSearchQuery,
    toggleOrphanedOnly,
    toggleRunningOnly,
    toggleInUseOnly,

    // Attribute filter actions
    setAttributeFilterValue,
    clearAttributeFilter,

    // Exclusion helpers
    excludeNode,
    includeNode,
    clearExcluded,

    // Quick presets
    showOnlyOrphaned,
    showOnlyRunning,
    showMinimalView,

    // Helper functions
    isOrphanedNode: (nodeId: string) =>
      state.filteredData ? isOrphanedNode(nodeId, state.filteredData.edges) : false,
  };
};
