import React, { useEffect } from 'react';
import { useGraphState } from '../hooks/useGraphState';
import { LayoutConfigs } from '../utils/layouts';
import { Label } from '@/catalyst-ui/ui/label';
import { Button } from '@/catalyst-ui/ui/button';

interface LayoutField {
  key: string;
  label: string;
  type: 'select' | 'number';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  description?: string;
  options?: Array<{ value: any; label: string }>;
}

export const LayoutOptionsPanel: React.FC = () => {
  const { layout, layoutOptions, setLayoutOptions } = useGraphState();
  const config = LayoutConfigs[layout];

  // Initialize with defaults when layout changes
  useEffect(() => {
    const defaults: Record<string, any> = {};
    config.fields.forEach((field: LayoutField) => {
      defaults[field.key] = field.defaultValue;
    });
    setLayoutOptions(defaults);
  }, [layout, config, setLayoutOptions]); // Reset to defaults when layout changes

  const handleChange = (key: string, value: any) => {
    const updated = { ...layoutOptions, [key]: value };
    setLayoutOptions(updated);
  };

  const handleReset = () => {
    const defaults: Record<string, any> = {};
    config.fields.forEach((field: LayoutField) => {
      defaults[field.key] = field.defaultValue;
    });
    setLayoutOptions(defaults);
  };

  if (!config || config.fields.length === 0) {
    return (
      <div className="mb-3 pb-3 border-b border-primary/30">
        <p className="text-xs text-foreground/60">No configuration options available for this layout.</p>
      </div>
    );
  }

  return (
    <div className="mb-3 pb-3 border-b border-primary/30">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-primary/80 tracking-wide uppercase">
          Layout Options
        </h4>
        <Button
          onClick={handleReset}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[10px] text-foreground/60 hover:text-primary"
        >
          Reset
        </Button>
      </div>

      <p className="text-[10px] text-foreground/50 mb-3">{config.description}</p>

      <div className="space-y-3">
        {config.fields.map((field: LayoutField) => {
          const value = layoutOptions[field.key] ?? field.defaultValue;

          if (field.type === 'select') {
            return (
              <div key={field.key} className="space-y-1">
                <Label htmlFor={field.key} className="text-xs text-foreground/80">
                  {field.label}
                </Label>
                <select
                  id={field.key}
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-background/50 border border-primary/30 rounded text-foreground cursor-pointer transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  {field.options?.map((opt: { value: any; label: string }) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.description && (
                  <p className="text-[10px] text-foreground/40">{field.description}</p>
                )}
              </div>
            );
          }

          if (field.type === 'number') {
            return (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.key} className="text-xs text-foreground/80">
                    {field.label}
                  </Label>
                  <span className="text-[10px] text-primary font-mono">{value}</span>
                </div>
                <input
                  id={field.key}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value}
                  onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-background/50 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                {field.description && (
                  <p className="text-[10px] text-foreground/40">{field.description}</p>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
