import React, { useMemo } from 'react';
import { useGraphFilters } from '../hooks/useGraphFilters';
import { useGraphState } from '../hooks/useGraphState';
import { useGraphConfig } from '../context/GraphContext';
import { FilterPanelProps, GRAPH_CONNECTION_FILTER_OPTIONS } from '../types/filterTypes';
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
} from '.';

const FilterPanel: React.FC<FilterPanelProps> = ({ isVisible, onToggle }) => {
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

  const { getNodeInfo, rawData, filteredData } = useGraphState();

  // Build filter options from config
  const NODE_TYPE_OPTIONS = useMemo(
    () =>
      Object.entries(config.nodeTypes).map(([kind, typeConfig]) => ({
        kind: kind as keyof typeof config.nodeTypes,
        label: typeConfig.label,
        color: typeConfig.color,
      })),
    [config.nodeTypes]
  );

  const EDGE_TYPE_OPTIONS = useMemo(
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
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-[98px] w-10 h-10 bg-background/95 border-2 border-primary rounded-full text-primary cursor-pointer flex items-center justify-center transition-all duration-300 z-[1001] shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)] backdrop-blur-[10px] hover:shadow-[0_6px_30px_rgba(var(--primary-rgb),0.5)] hover:bg-background"
        style={{
          right: isVisible ? '312px' : '16px',
        }}
        title="Toggle Filters"
      >
        <span
          className="text-base transition-transform duration-300"
          style={{
            display: 'inline-block',
            transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ⚙️
        </span>
      </button>

      {/* Panel */}
      {isVisible && (
        <div
          className="fixed top-[72px] w-[300px] h-[calc(100vh-120px)] bg-background/98 backdrop-blur-[20px] border-2 border-primary border-t-0 border-b-0 text-foreground p-3 overflow-y-auto transition-all duration-400 z-[1000] shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]"
          style={{ right: 0 }}
        >
          <h3 className="mb-3 text-sm font-bold text-primary tracking-wide uppercase" style={{ textShadow: '0 0 12px var(--primary)' }}>
            Filters
          </h3>

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
        </div>
      )}
    </>
  );
};

export default FilterPanel;
