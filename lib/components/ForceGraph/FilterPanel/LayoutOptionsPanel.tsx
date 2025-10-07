import React, { useEffect } from "react";
import { useGraphState } from "../hooks/useGraphState";
import { useNodePositions } from "../hooks/useNodePositions";
import { LayoutConfigs } from "../utils/layouts";
import { Label } from "@/catalyst-ui/ui/label";
import { Button } from "@/catalyst-ui/ui/button";

interface LayoutField {
  key: string;
  label: string;
  type: "select" | "number";
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  description?: string;
  options?: Array<{ value: any; label: string }>;
}

interface LayoutOptionsPanelProps {
  storageKey?: string;
}

export const LayoutOptionsPanel: React.FC<LayoutOptionsPanelProps> = ({ storageKey }) => {
  const { layout, layoutOptions, setLayoutOptions } = useGraphState();
  const { clearPositions } = useNodePositions(storageKey, layout);
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
        <p className="text-xs text-foreground/60">
          No configuration options available for this layout.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .range-slider {
          background: rgba(0, 200, 255, 0.15);
          border-radius: 3px;
        }
        .range-slider::-webkit-slider-track {
          height: 6px;
          border-radius: 3px;
          background: rgba(0, 200, 255, 0.25);
          border: 1px solid rgba(0, 200, 255, 0.5);
        }
        .range-slider::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: rgba(0, 200, 255, 0.25);
          border: 1px solid rgba(0, 200, 255, 0.5);
        }
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--background);
          box-shadow: 0 0 10px rgba(0, 200, 255, 0.6);
          cursor: pointer;
          margin-top: -5px;
        }
        .range-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--background);
          box-shadow: 0 0 10px rgba(0, 200, 255, 0.6);
          cursor: pointer;
        }
      `}</style>
      <div className="mb-3 pb-3 border-b border-primary/30">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-primary/80 tracking-wide uppercase">
            Layout Options
          </h4>
          <div className="flex items-center gap-1">
            {storageKey && (
              <button
                onClick={clearPositions}
                className="p-1 hover:bg-primary/10 rounded transition-colors opacity-60 hover:opacity-100"
                title="Reset saved node positions for this layout"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-primary">
                  <path d="M13.65 2.35a7.958 7.958 0 00-11.3 0A7.958 7.958 0 000 8c0 2.137.833 4.146 2.35 5.65l1.06-1.06A6.459 6.459 0 011.5 8c0-1.736.676-3.369 1.904-4.596a6.459 6.459 0 014.596-1.904c1.736 0 3.369.676 4.596 1.904A6.459 6.459 0 0114.5 8c0 1.736-.676 3.369-1.904 4.596l-1.06 1.06A7.958 7.958 0 0016 8c0-2.137-.833-4.146-2.35-5.65zM8 4v5l3.5 2-1 1.5L6 10V4h2z" />
                </svg>
              </button>
            )}
            <Button
              onClick={handleReset}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-foreground/60 hover:text-primary"
            >
              Reset
            </Button>
          </div>
        </div>

        <p className="text-[10px] text-foreground/50 mb-3">{config.description}</p>

        <div className="space-y-3">
          {config.fields.map((field: LayoutField) => {
            const value = layoutOptions[field.key] ?? field.defaultValue;

            if (field.type === "select") {
              return (
                <div key={field.key} className="space-y-1">
                  <Label htmlFor={field.key} className="text-xs text-foreground/80">
                    {field.label}
                  </Label>
                  <select
                    id={field.key}
                    value={value}
                    onChange={e => handleChange(field.key, e.target.value)}
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

            if (field.type === "number") {
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
                    onChange={e => handleChange(field.key, parseFloat(e.target.value))}
                    className="w-full h-2 appearance-none cursor-pointer range-slider"
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
    </>
  );
};
