import React from 'react';
import { EdgeKind } from '../types';

interface FilterPanelEdgeTypesProps {
  edgeTypes: Array<{ kind: any; label: string }>;
  visibleEdges: Record<EdgeKind, boolean>;
  onToggle: (kind: any) => void;
  config: any;
}

export const FilterPanelEdgeTypes: React.FC<FilterPanelEdgeTypesProps> = ({
  edgeTypes,
  visibleEdges,
  onToggle,
  config,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide" style={{ textShadow: '0 0 6px var(--primary)' }}>
        Edge Types
      </div>
      <div className="flex flex-col gap-0.5">
        {edgeTypes.map(({ kind, label }) => {
          // @ts-ignore - kind is from config which can be any edge type
          const isVisible = visibleEdges[kind];
          const edgeConfig = config.edgeTypes[kind];
          const color = edgeConfig?.color || 'var(--primary)';

          return (
            <button
              key={kind}
              onClick={() => onToggle(kind)}
              className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all text-[11px] ${
                isVisible ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <div
                className={`h-0.5 rounded-full transition-all ${isVisible ? 'w-4' : 'w-3'}`}
                style={{
                  backgroundColor: color,
                  boxShadow: isVisible ? `0 0 4px ${color}` : 'none',
                }}
              />
              <span
                className={`flex-1 text-left font-medium ${isVisible ? 'border-b' : ''}`}
                style={{
                  color: isVisible ? color : 'var(--foreground)',
                  borderColor: isVisible ? color : 'transparent',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
