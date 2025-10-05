import React from 'react';
import { createPortal } from 'react-dom';
import { useGraphFilters } from './hooks/useGraphFilters';
import { useGraphState } from './hooks/useGraphState';
import { useGraphConfig } from './context/GraphContext';
import {
  FilterPanelSearch,
  FilterPanelNodeTypes,
  FilterPanelEdgeTypes,
  FilterPanelDropdown,
  FilterPanelAdvanced,
  FilterPanelAttributeFilters,
  FilterPanelExcluded,
  FilterPanelStats,
  FilterPanelActions,
  FilterPanelLayout,
} from './FilterPanel';
import { GRAPH_CONNECTION_FILTER_OPTIONS } from './types/filterTypes';
import { LayoutOptionsPanel } from './FilterPanel/LayoutOptionsPanel';

interface GraphContentPanelProps {
  activeTab: 'filters' | 'layout' | null;
  onClose: () => void;
}

const GraphContentPanel: React.FC<GraphContentPanelProps> = ({ activeTab, onClose }) => {
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

  if (!activeTab) {
    return null;
  }

  return createPortal(
    <div
      className="fixed top-16 right-0 w-96 bottom-0 bg-background/98 backdrop-blur-[20px] z-50 overflow-y-auto border-l-2 border-primary shadow-[-8px_0_30px_rgba(var(--primary-rgb),0.2)]"
      style={{
        animation: 'slideInRight 0.3s ease-out',
        transform: 'translateZ(0)',
      }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-8 h-8 bg-background/95 border border-primary/50 rounded-full text-primary cursor-pointer flex items-center justify-center transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
        title="Close Panel"
      >
        <span className="text-xs">✖</span>
      </button>

      <div className="p-4 pt-12">
        {activeTab === 'filters' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Search & Quick Filters
              </h3>
              <FilterPanelSearch searchQuery={filters.searchQuery} onSearchChange={setSearchQuery} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Node & Edge Types
              </h3>
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
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Advanced Filters
              </h3>
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
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Excluded Nodes
              </h3>
              <FilterPanelExcluded
                excludedNodeIds={filters.excludedNodeIds || []}
                getNodeInfo={getNodeInfo}
                onInclude={includeNode}
                onClearAll={clearExcluded}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Statistics & Summary
              </h3>
              <FilterPanelStats rawData={rawData} filteredData={filteredData} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Actions
              </h3>
              <FilterPanelActions onReset={resetFilters} />
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-wide uppercase mb-2" style={{ textShadow: '0 0 12px var(--primary)' }}>
                Layout Mode
              </h3>
              <FilterPanelLayout
                layout={layout}
                orthogonalEdges={orthogonalEdges}
                onSetLayout={setLayout}
                onToggleOrthogonalEdges={toggleOrthogonalEdges}
              />
            </div>

            <div className="space-y-3">
              <LayoutOptionsPanel />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default GraphContentPanel;
