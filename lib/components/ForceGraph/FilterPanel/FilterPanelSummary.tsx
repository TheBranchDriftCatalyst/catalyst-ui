import React from 'react';
import { GraphFilters } from '../types/filterTypes';

interface FilterPanelSummaryProps {
  filters: GraphFilters;
}

export const FilterPanelSummary: React.FC<FilterPanelSummaryProps> = ({ filters }) => {
  return (
    <div className="mb-3 p-2 bg-primary/5 border-l-2 border-primary rounded-sm text-[10px] leading-relaxed">
      <div className="font-bold mb-1 text-primary text-xs">Active Filters</div>
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
  );
};
