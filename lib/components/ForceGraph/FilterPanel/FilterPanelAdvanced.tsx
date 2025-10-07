import React from "react";
import { GraphFilters } from "../types/filterTypes";

interface FilterPanelAdvancedProps {
  filters: GraphFilters;
  onToggleOrphanedOnly: () => void;
  onToggleRunningOnly: () => void;
  onToggleInUseOnly: () => void;
}

export const FilterPanelAdvanced: React.FC<FilterPanelAdvancedProps> = ({
  filters,
  onToggleOrphanedOnly,
  onToggleRunningOnly,
  onToggleInUseOnly,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div
        className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide"
        style={{ textShadow: "0 0 6px var(--primary)" }}
      >
        Advanced
      </div>
      <div className="flex flex-col gap-0.5">
        <button
          onClick={onToggleOrphanedOnly}
          className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all text-[11px] ${
            filters.showOrphanedOnly ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        >
          <span className="text-sm">🔍</span>
          <span
            className={`flex-1 text-left font-medium ${filters.showOrphanedOnly ? "border-b border-primary" : ""}`}
            style={{ color: filters.showOrphanedOnly ? "var(--primary)" : "var(--foreground)" }}
          >
            Orphaned only
          </span>
        </button>

        <button
          onClick={onToggleRunningOnly}
          className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all text-[11px] ${
            filters.showRunningOnly ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        >
          <span className="text-sm">▶️</span>
          <span
            className={`flex-1 text-left font-medium ${filters.showRunningOnly ? "border-b border-primary" : ""}`}
            style={{ color: filters.showRunningOnly ? "var(--primary)" : "var(--foreground)" }}
          >
            Running only
          </span>
        </button>

        <button
          onClick={onToggleInUseOnly}
          className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all text-[11px] ${
            filters.showInUseOnly ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        >
          <span className="text-sm">💾</span>
          <span
            className={`flex-1 text-left font-medium ${filters.showInUseOnly ? "border-b border-primary" : ""}`}
            style={{ color: filters.showInUseOnly ? "var(--primary)" : "var(--foreground)" }}
          >
            In-use only
          </span>
        </button>
      </div>
    </div>
  );
};
