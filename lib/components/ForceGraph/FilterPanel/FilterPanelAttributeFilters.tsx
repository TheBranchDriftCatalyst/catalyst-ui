import React from 'react';
import { AttributeFilter } from '../config/types';

interface FilterPanelAttributeFiltersProps {
  attributeFilters: AttributeFilter[];
  currentValues: Record<string, any>;
  onSetValue: (filterName: string, value: any) => void;
}

export const FilterPanelAttributeFilters: React.FC<FilterPanelAttributeFiltersProps> = ({
  attributeFilters,
  currentValues,
  onSetValue,
}) => {
  if (!attributeFilters || attributeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide" style={{ textShadow: '0 0 6px var(--primary)' }}>
        Advanced
      </div>
      <div className="flex flex-col gap-1">
        {attributeFilters.map((filter) => {
          const currentValue = currentValues[filter.name] ?? filter.defaultValue ?? false;
          const isEnabled = Boolean(currentValue);

          // For boolean filters, render as ghost button toggle
          if (filter.type === 'boolean') {
            return (
              <button
                key={filter.name}
                onClick={() => onSetValue(filter.name, !currentValue)}
                className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all text-[11px] ${
                  isEnabled ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <span className="text-sm">{isEnabled ? '✓' : '○'}</span>
                <span
                  className={`flex-1 text-left font-medium ${isEnabled ? 'border-b border-primary' : ''}`}
                  style={{ color: isEnabled ? 'var(--primary)' : 'var(--foreground)' }}
                >
                  {filter.label}
                </span>
              </button>
            );
          }

          // For other filter types, could add more UI components here
          return null;
        })}
      </div>
    </div>
  );
};
