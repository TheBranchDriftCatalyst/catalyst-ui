import React from 'react';

interface FilterPanelExcludedProps {
  excludedNodeIds: string[];
  getNodeInfo: (id: string) => any;
  onInclude: (id: string) => void;
  onClearAll: () => void;
}

export const FilterPanelExcluded: React.FC<FilterPanelExcludedProps> = ({
  excludedNodeIds,
  getNodeInfo,
  onInclude,
  onClearAll,
}) => {
  if (!excludedNodeIds || excludedNodeIds.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide" style={{ textShadow: '0 0 6px var(--primary)' }}>
        Excluded Nodes
      </div>
      <div className="flex flex-col gap-1">
        {excludedNodeIds.map((id) => {
          const info = getNodeInfo(id);
          const label = info ? (info.name || info.Name || info.id) : id;
          return (
            <div key={id} className="flex justify-between items-center bg-background/30 px-2 py-1 rounded text-[10px]">
              <div className="text-foreground/90 truncate flex-1">{label}</div>
              <button
                className="px-1 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-[10px] hover:bg-foreground/10 transition-all"
                onClick={() => onInclude(id)}
                title="Include back"
              >
                ✖️
              </button>
            </div>
          );
        })}
        <button
          className="px-2 py-1 mt-0.5 bg-primary/10 border border-primary/30 rounded text-foreground text-[10px] transition-all hover:bg-foreground/10"
          onClick={onClearAll}
        >
          Clear Excluded
        </button>
      </div>
    </div>
  );
};
