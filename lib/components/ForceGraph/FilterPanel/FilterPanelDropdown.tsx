import React from 'react';
import { FilterOption } from '../config/types';

interface FilterPanelDropdownProps {
  label: string;
  value: string;
  options: FilterOption<any>[];
  onChange: (value: string) => void;
}

export const FilterPanelDropdown: React.FC<FilterPanelDropdownProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-primary/20">
      <div className="text-xs font-semibold mb-2 text-primary uppercase tracking-wide" style={{ textShadow: '0 0 6px var(--primary)' }}>
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 bg-background/50 border border-primary/30 rounded text-foreground text-xs cursor-pointer outline-none appearance-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300D4FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '12px',
          paddingRight: '28px',
        }}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value} className="bg-background">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
