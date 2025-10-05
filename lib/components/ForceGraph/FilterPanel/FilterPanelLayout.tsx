import React from 'react';
import { LayoutKind } from '../utils/layouts';

interface FilterPanelLayoutProps {
  layout: LayoutKind;
  orthogonalEdges: boolean;
  onSetLayout: (layout: LayoutKind) => void;
  onToggleOrthogonalEdges: () => void;
}

const LAYOUT_OPTIONS = [
  { value: 'force' as LayoutKind, label: 'Force-Directed' },
  { value: 'structured' as LayoutKind, label: 'Structured (Columns)' },
  { value: 'community' as LayoutKind, label: 'Community (Smart)' },
  { value: 'dagre' as LayoutKind, label: 'Dagre (Mermaid)' },
];

const FilterPanelLayout: React.FC<FilterPanelLayoutProps> = ({
  layout,
  orthogonalEdges,
  onSetLayout,
  onToggleOrthogonalEdges,
}) => {
  return (
    <div className="mb-3 pb-3 border-b border-primary/30">
      <h4 className="text-xs font-semibold text-primary/80 mb-2 tracking-wide uppercase">
        Layout
      </h4>

      {/* Layout Selector */}
      <div className="mb-2">
        <select
          value={layout}
          onChange={(e) => onSetLayout(e.target.value as LayoutKind)}
          className="w-full px-2 py-1.5 text-xs bg-background/50 border border-primary/30 rounded text-foreground cursor-pointer transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          {LAYOUT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orthogonal Edges Toggle */}
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={orthogonalEdges}
          onChange={onToggleOrthogonalEdges}
          className="w-3.5 h-3.5 rounded border-primary/30 bg-background/50 text-primary cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
        />
        <span className="text-xs text-foreground/80 group-hover:text-primary transition-colors duration-200">
          Orthogonal Edges
        </span>
      </label>
    </div>
  );
};

export default FilterPanelLayout;
