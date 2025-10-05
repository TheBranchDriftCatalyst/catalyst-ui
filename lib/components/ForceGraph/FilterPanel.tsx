import React, { useMemo } from 'react';
import { useGraphFilters } from './hooks/useGraphFilters';
import { useGraphState } from './hooks/useGraphState';
import { clearPersistedFilters, useGraphConfig } from './context/GraphContext';
import { FilterPanelProps, NodeStatusFilter, NodeConnectionFilter } from './types/filterTypes';

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
    resetFilters,
    includeNode,
    clearExcluded,
    updateFilters,
  } = useGraphFilters();

  const { getNodeInfo } = useGraphState();

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
  const CONNECTION_FILTER_OPTIONS = config.connectionFilterOptions || [];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-[98px] w-12 h-12 bg-background/95 border-2 border-primary rounded-full text-primary cursor-pointer flex items-center justify-center transition-all duration-400 z-[1001] text-lg shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)] backdrop-blur-[10px] hover:shadow-[0_6px_30px_rgba(var(--primary-rgb),0.5)] hover:bg-background hover:scale-110"
        style={{
          right: isVisible ? '368px' : '16px',
          transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
        title="Toggle Filters"
      >
        ⚙️
      </button>

      {/* Panel */}
      {isVisible && (
        <div className="fixed top-[72px] w-[360px] h-[calc(100vh-120px)] bg-background/98 backdrop-blur-[20px] border-2 border-primary border-t-0 border-b-0 text-foreground p-6 overflow-y-auto transition-all duration-400 z-[1000] text-sm shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]"
          style={{ right: 0 }}>

          <h3 className="mb-5 text-xl font-bold text-primary tracking-wide" style={{ textShadow: '0 0 12px var(--primary)' }}>
            Graph Filters
          </h3>

          {/* Search */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Search
            </div>
            <input
              type="text"
              placeholder="Search nodes by name or ID..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 px-4 bg-background/50 border border-primary/30 rounded-lg text-foreground text-sm font-mono transition-all outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"
            />
          </div>

          {/* Quick Presets */}
          {config.quickFilters && config.quickFilters.length > 0 && (
            <div className="mb-7 pb-5 border-b border-primary/20">
              <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
                Quick Filters
              </div>
              <div className="flex flex-wrap gap-2">
                {config.quickFilters.map((quickFilter, index) => (
                  <button
                    key={index}
                    className={quickFilter.className || 'px-3 py-2 bg-neon-red/15 border border-neon-red/40 rounded-md text-neon-red cursor-pointer text-xs font-semibold transition-all hover:bg-neon-red/25 hover:-translate-y-0.5'}
                    onClick={() => updateFilters(quickFilter.action(filters))}
                  >
                    {quickFilter.icon} {quickFilter.label}
                  </button>
                ))}
                <button
                  className="px-3 py-2 bg-primary/10 border border-primary/30 rounded-md text-foreground cursor-pointer text-xs font-normal transition-all hover:bg-foreground/10 hover:-translate-y-0.5"
                  onClick={resetFilters}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          )}

          {/* Node Types */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Node Types
            </div>
            {NODE_TYPE_OPTIONS.map(({ kind, label, color }) => {
              // @ts-ignore - kind is from config which can be any node type
              const isVisible = filters.visibleNodes[kind];
              return (
                <label
                  key={kind}
                  className="flex items-center gap-3 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-all mb-2 text-xs"
                  style={{
                    backgroundColor: isVisible ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                    borderColor: isVisible ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleNodeVisibility(kind as any)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}40`,
                    }}
                  />
                  <span className="flex-1 text-foreground">{label}</span>
                </label>
              );
            })}
          </div>

          {/* Edge Types */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Edge Types
            </div>
            {EDGE_TYPE_OPTIONS.map(({ kind, label }) => {
              // @ts-ignore - kind is from config which can be any edge type
              const isVisible = filters.visibleEdges[kind];
              return (
                <label
                  key={kind}
                  className="flex items-center gap-3 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-all mb-2 text-xs"
                  style={{
                    backgroundColor: isVisible ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleEdgeVisibility(kind as any)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span className="text-xs text-primary mr-2">━━</span>
                  <span className="flex-1 text-foreground">{label}</span>
                </label>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Status Filter
            </div>
            <select
              value={filters.statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as NodeStatusFilter)}
              className="w-full p-3 px-4 bg-background/50 border border-primary/30 rounded-lg text-foreground text-sm cursor-pointer outline-none appearance-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300D4FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px',
              }}
            >
              {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value} className="bg-background">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Connection Filter */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Connection Filter
            </div>
            <select
              value={filters.connectionFilter}
              onChange={(e) => setConnectionFilter(e.target.value as NodeConnectionFilter)}
              className="w-full p-3 px-4 bg-background/50 border border-primary/30 rounded-lg text-foreground text-sm cursor-pointer outline-none appearance-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300D4FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px',
              }}
            >
              {CONNECTION_FILTER_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value} className="bg-background">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Advanced Filters
            </div>

            <label
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-all mb-2 text-xs"
              style={{
                backgroundColor: filters.showOrphanedOnly ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={filters.showOrphanedOnly}
                onChange={toggleOrphanedOnly}
                className="w-4 h-4 cursor-pointer"
                style={{ transform: 'scale(1.2)' }}
              />
              🔍 Show orphaned nodes only
            </label>

            <label
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-all mb-2 text-xs"
              style={{
                backgroundColor: filters.showRunningOnly ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={filters.showRunningOnly}
                onChange={toggleRunningOnly}
                className="w-4 h-4 cursor-pointer"
                style={{ transform: 'scale(1.2)' }}
              />
              ▶️ Show running containers only
            </label>

            <label
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-all mb-2 text-xs"
              style={{
                backgroundColor: filters.showInUseOnly ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={filters.showInUseOnly}
                onChange={toggleInUseOnly}
                className="w-4 h-4 cursor-pointer"
                style={{ transform: 'scale(1.2)' }}
              />
              💾 Show in-use resources only
            </label>

          </div>

          {/* Excluded Nodes */}
          <div className="mb-7 pb-5 border-b border-primary/20">
            <div className="text-base font-semibold mb-4 text-primary" style={{ textShadow: '0 0 8px var(--primary)', letterSpacing: '0.5px' }}>
              Excluded Nodes
            </div>
            {filters.excludedNodeIds && filters.excludedNodeIds.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filters.excludedNodeIds.map((id) => {
                  const info = getNodeInfo(id);
                  const label = info ? (info.name || info.Name || info.id) : id;
                  return (
                    <div key={id} className="flex justify-between items-center bg-background/30 p-2 rounded-md">
                      <div className="text-foreground/90 text-xs truncate flex-1">{label}</div>
                      <button
                        className="px-2 py-1 bg-foreground/5 border border-foreground/10 rounded text-xs hover:bg-foreground/10 transition-all"
                        onClick={() => includeNode(id)}
                        title="Include back"
                      >
                        ✖️
                      </button>
                    </div>
                  );
                })}
                <button
                  className="px-3 py-1 mt-1 bg-primary/10 border border-primary/30 rounded-md text-foreground cursor-pointer text-xs transition-all hover:bg-foreground/10"
                  onClick={clearExcluded}
                >
                  Clear Excluded
                </button>
              </div>
            ) : (
              <div className="text-muted-foreground text-xs">No excluded nodes</div>
            )}
          </div>

          {/* Filter Summary */}
          <div className="mb-4 p-3 bg-primary/5 border-l-4 border-primary rounded-sm text-xs leading-relaxed">
            <div className="font-bold mb-2 text-primary">Active Filters Summary</div>
            <div className="text-foreground/80">
              • Status: <strong>{filters.statusFilter}</strong>
              {filters.showOrphanedOnly && (
                <>
                  <br />• 🔍 <strong>Orphaned only</strong>
                </>
              )}
              {filters.showRunningOnly && (
                <>
                  <br />• ▶️ <strong>Running only</strong>
                </>
              )}
              {filters.showInUseOnly && (
                <>
                  <br />• 💾 <strong>In-use only</strong>
                </>
              )}
              {filters.searchQuery && (
                <>
                  <br />• 🔍 Search: <strong>"{filters.searchQuery}"</strong>
                </>
              )}
            </div>
          </div>

          {/* Clear Saved Filters */}
          <button
            className="w-full px-3 py-2 bg-destructive/15 border border-destructive/40 rounded-md text-destructive cursor-pointer text-xs font-semibold transition-all hover:bg-destructive/25"
            onClick={() => {
              clearPersistedFilters();
              resetFilters();
            }}
            title="Clear saved filters from local storage and reset"
          >
            🗑️ Clear Saved Filters
          </button>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
