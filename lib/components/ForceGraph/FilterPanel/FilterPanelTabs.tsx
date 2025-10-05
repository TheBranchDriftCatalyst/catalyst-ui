import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/catalyst-ui/ui/tabs';
import { useGraphFilters } from '../hooks/useGraphFilters';
import { useGraphState } from '../hooks/useGraphState';
import { useGraphConfig } from '../context/GraphContext';
import { FilterPanelProps } from '../types/filterTypes';
import {
  FilterPanelSearch,
  FilterPanelQuickFilters,
  FilterPanelNodeTypes,
  FilterPanelEdgeTypes,
  FilterPanelDropdown,
  FilterPanelAdvanced,
  FilterPanelAttributeFilters,
  FilterPanelExcluded,
  FilterPanelSummary,
  FilterPanelStats,
  FilterPanelActions,
  FilterPanelLayout,
} from '.';
import { GRAPH_CONNECTION_FILTER_OPTIONS } from '../types/filterTypes';
import { LayoutOptionsPanel } from './LayoutOptionsPanel';

const FilterPanelTabs: React.FC<Omit<FilterPanelProps, 'isVisible' | 'onToggle'>> = () => {
  const config = useGraphConfig();
  const {
    filters,
    toggleNodeVisibility,
    toggleEdgeVisibility,
    setStatusFilter,
    setConnectionFilter,
    setSearchQuery,
    toggleOrphanedOnly,
    toggleRunningOnly,
    toggleInUseOnly,
    setAttributeFilterValue,
    resetFilters,
    includeNode,
    clearExcluded,
    updateFilters,
  } = useGraphFilters();

  const { getNodeInfo, rawData, filteredData, layout, orthogonalEdges, setLayout, toggleOrthogonalEdges } = useGraphState();

  // Build filter options from config
  const NODE_TYPE_OPTIONS = React.useMemo(
    () =>
      Object.entries(config.nodeTypes).map(([kind, typeConfig]) => ({
        kind: kind as keyof typeof config.nodeTypes,
        label: typeConfig.label,
        color: typeConfig.color,
      })),
    [config.nodeTypes]
  );

  const EDGE_TYPE_OPTIONS = React.useMemo(
    () =>
      Object.entries(config.edgeTypes).map(([kind, typeConfig]) => ({
        kind: kind as keyof typeof config.edgeTypes,
        label: typeConfig.label,
      })),
    [config.edgeTypes]
  );

  const STATUS_FILTER_OPTIONS = config.statusFilterOptions || [];
  const CONNECTION_FILTER_OPTIONS = GRAPH_CONNECTION_FILTER_OPTIONS;

  return (
    <Tabs defaultValue="filters" className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-3 bg-background/50 border border-primary/30">
        <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
        <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
      </TabsList>

      <TabsContent value="filters" className="mt-0">
        <FilterPanelSearch searchQuery={filters.searchQuery} onSearchChange={setSearchQuery} />

        <FilterPanelQuickFilters
          quickFilters={config.quickFilters || []}
          currentFilters={filters}
          onApplyFilter={updateFilters}
          onReset={resetFilters}
        />

        <FilterPanelNodeTypes
          nodeTypes={NODE_TYPE_OPTIONS}
          visibleNodes={filters.visibleNodes}
          onToggle={toggleNodeVisibility}
        />

        <FilterPanelEdgeTypes
          edgeTypes={EDGE_TYPE_OPTIONS}
          visibleEdges={filters.visibleEdges}
          onToggle={toggleEdgeVisibility}
          config={config}
        />

        {STATUS_FILTER_OPTIONS.length > 0 && (
          <FilterPanelDropdown
            label="Status"
            value={filters.statusFilter}
            options={STATUS_FILTER_OPTIONS}
            onChange={setStatusFilter}
          />
        )}

        <FilterPanelDropdown
          label="Connection"
          value={filters.connectionFilter}
          options={CONNECTION_FILTER_OPTIONS}
          onChange={(value: string) => setConnectionFilter(value as any)}
        />

        <FilterPanelAdvanced
          filters={filters}
          onToggleOrphanedOnly={toggleOrphanedOnly}
          onToggleRunningOnly={toggleRunningOnly}
          onToggleInUseOnly={toggleInUseOnly}
        />

        <FilterPanelAttributeFilters
          attributeFilters={config.attributeFilters || []}
          currentValues={filters.attributeFilterValues || {}}
          onSetValue={setAttributeFilterValue}
        />

        <FilterPanelExcluded
          excludedNodeIds={filters.excludedNodeIds || []}
          getNodeInfo={getNodeInfo}
          onInclude={includeNode}
          onClearAll={clearExcluded}
        />

        <FilterPanelStats rawData={rawData} filteredData={filteredData} />

        <FilterPanelSummary filters={filters} />

        <FilterPanelActions onReset={resetFilters} />
      </TabsContent>

      <TabsContent value="layout" className="mt-0">
        <FilterPanelLayout
          layout={layout}
          orthogonalEdges={orthogonalEdges}
          onSetLayout={setLayout}
          onToggleOrthogonalEdges={toggleOrthogonalEdges}
        />

        <LayoutOptionsPanel />
      </TabsContent>
    </Tabs>
  );
};

export default FilterPanelTabs;
