import React from 'react';
import { NodeKind } from '../types';

interface FilterPanelNodeTypesProps {
  nodeTypes: Array<{ kind: any; label: string; color: string }>;
  visibleNodes: Record<NodeKind, boolean>;
  onToggle: (kind: any) => void;
}

export const FilterPanelNodeTypes: React.FC<FilterPanelNodeTypesProps> = ({
  nodeTypes,
  visibleNodes,
  onToggle,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide" style={{ textShadow: '0 0 6px var(--primary)' }}>
        Node Types
      </div>
      <div className="flex flex-col gap-0.5">
        {nodeTypes.map(({ kind, label, color }) => {
          // @ts-ignore - kind is from config which can be any node type
          const isVisible = visibleNodes[kind];
          return (
            <button
              key={kind}
              onClick={() => onToggle(kind)}
              className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all text-[11px] ${
                isVisible ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
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
