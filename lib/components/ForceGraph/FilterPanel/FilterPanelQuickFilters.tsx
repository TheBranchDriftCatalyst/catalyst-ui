import React from "react";
import { QuickFilter } from "../config/types";
import { GraphFilters } from "../types/filterTypes";

interface FilterPanelQuickFiltersProps {
  quickFilters: QuickFilter[];
  currentFilters: GraphFilters;
  onApplyFilter: (filterUpdate: Partial<GraphFilters>) => void;
  onReset: () => void;
}

export const FilterPanelQuickFilters: React.FC<FilterPanelQuickFiltersProps> = ({
  quickFilters,
  currentFilters,
  onApplyFilter,
  onReset,
}) => {
  if (!quickFilters || quickFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div
        className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide"
        style={{ textShadow: "0 0 6px var(--primary)" }}
      >
        Quick Filters
      </div>
      <div className="flex flex-wrap gap-1">
        {quickFilters.map((quickFilter, index) => (
          <button
            key={index}
            className="px-2 py-1 bg-neon-red/10 border border-neon-red/30 rounded text-neon-red text-[10px] font-semibold transition-all hover:bg-neon-red/20"
            onClick={() => onApplyFilter(quickFilter.action(currentFilters))}
          >
            {quickFilter.icon} {quickFilter.label}
          </button>
        ))}
        <button
          className="px-2 py-1 bg-primary/5 border border-primary/20 rounded text-foreground/70 text-[10px] transition-all hover:text-foreground"
          onClick={onReset}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};
