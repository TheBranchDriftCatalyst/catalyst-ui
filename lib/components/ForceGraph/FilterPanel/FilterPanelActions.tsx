import React from "react";
import { clearPersistedFilters } from "../context/GraphContext";

interface FilterPanelActionsProps {
  onReset: () => void;
}

export const FilterPanelActions: React.FC<FilterPanelActionsProps> = ({ onReset }) => {
  const handleClearAll = () => {
    clearPersistedFilters();
    onReset();
  };

  return (
    <button
      className="w-full px-2 py-1.5 bg-destructive/15 border border-destructive/40 rounded text-destructive text-xs font-semibold transition-all hover:bg-destructive/25"
      onClick={handleClearAll}
      title="Clear saved filters from local storage and reset"
    >
      🗑️ Clear Saved Filters
    </button>
  );
};
