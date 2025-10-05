import React from 'react';

interface FilterPanelSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterPanelSearch: React.FC<FilterPanelSearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide" style={{ textShadow: '0 0 6px var(--primary)' }}>
        Search
      </div>
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-2 py-1.5 bg-background/50 border border-primary/30 rounded text-foreground text-xs font-mono transition-all outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"
      />
    </div>
  );
};
