/**
 * MermaidFlowChartGraph Component
 * Converts Mermaid flowchart syntax to interactive ForceGraph
 */

import React, { useEffect, useState } from "react";
import { ForceGraph } from "../ForceGraph";
import type { ForceGraphProps } from "../ForceGraph/types";
import { MermaidFlowChartGraphConfigurator, ConfiguratorOptions } from "../../utils/mermaid";
import type { GraphConfig } from "../ForceGraph/config/types";
import type { GraphData } from "../ForceGraph/types";

/**
 * Props for the MermaidFlowChartGraph component
 * @interface MermaidFlowChartGraphProps
 */
export interface MermaidFlowChartGraphProps {
  /** Path to .mmd file in public folder (e.g., "/mermaid/solar-system.mmd") */
  filename?: string;

  /** Raw Mermaid flowchart text */
  mermaidText?: string;

  /** Configurator options for customization */
  configuratorOptions?: ConfiguratorOptions;

  /** Pass-through props to ForceGraph */
  forceGraphProps?: Partial<Omit<ForceGraphProps, "data" | "config">>;
}

/**
 * Internal state for managing Mermaid graph parsing and rendering
 * @interface MermaidGraphState
 */
interface MermaidGraphState {
  /** Parsed graph configuration */
  config: GraphConfig<string, string> | null;
  /** Parsed graph data (nodes and edges) */
  data: GraphData | null;
  /** Loading state while fetching or parsing */
  loading: boolean;
  /** Error message if parsing or fetching failed */
  error: string | null;
}

/**
 * MermaidFlowChartGraph
 *
 * Renders a Mermaid flowchart as an interactive force-directed graph.
 * Supports loading from file or raw text input.
 *
 * @example
 * ```tsx
 * // Load from file
 * <MermaidFlowChartGraph
 *   filename="/mermaid/solar-system.mmd"
 *   configuratorOptions={{
 *     title: "Solar Power System",
 *     colorStrategy: 'subgraph'
 *   }}
 * />
 *
 * // Use raw text
 * <MermaidFlowChartGraph
 *   mermaidText={`
 *     flowchart TB
 *       A[Start] --> B{Decision}
 *       B -->|Yes| C[End]
 *   `}
 * />
 * ```
 */
export const MermaidFlowChartGraph: React.FC<MermaidFlowChartGraphProps> = ({
  filename,
  mermaidText: rawMermaidText,
  configuratorOptions = {},
  forceGraphProps = {},
}) => {
  const [state, setState] = useState<MermaidGraphState>({
    config: null,
    data: null,
    loading: true,
    error: null,
  });

  const [mermaidText, setMermaidText] = useState<string | null>(rawMermaidText || null);

  // Fetch mermaid file if filename provided
  useEffect(() => {
    if (!filename) {
      setMermaidText(rawMermaidText || null);
      return;
    }

    const fetchMermaid = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(filename);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
        }

        const text = await response.text();
        setMermaidText(text);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
      }
    };

    fetchMermaid();
  }, [filename, rawMermaidText]);

  // Parse and configure when mermaidText changes
  useEffect(() => {
    if (!mermaidText) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const configurator = new MermaidFlowChartGraphConfigurator(mermaidText, configuratorOptions);

      const config = configurator.generateConfig();
      const data = configurator.generateData();

      setState({
        config,
        data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to parse Mermaid diagram";
      setState({
        config: null,
        data: null,
        loading: false,
        error: errorMsg,
      });
    }
  }, [mermaidText, configuratorOptions]);

  // Loading state
  if (state.loading) {
    return (
      <div
        className="flex items-center justify-center h-full min-h-[400px]"
        role="status"
        aria-live="polite"
      >
        <div className="text-foreground/60">Loading Mermaid diagram...</div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div
        className="flex items-center justify-center h-full min-h-[400px]"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-destructive space-y-2">
          <div className="font-semibold">Error loading Mermaid diagram</div>
          <div className="text-sm">{state.error}</div>
        </div>
      </div>
    );
  }

  // No data state
  if (!state.config || !state.data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]" role="status">
        <div className="text-foreground/60">
          No Mermaid diagram provided. Use `filename` or `mermaidText` prop.
        </div>
      </div>
    );
  }

  // Render ForceGraph
  return <ForceGraph data={state.data} config={state.config} {...forceGraphProps} />;
};

export default MermaidFlowChartGraph;
