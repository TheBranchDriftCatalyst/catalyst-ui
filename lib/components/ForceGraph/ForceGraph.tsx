import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ForceGraphProps, NodeKind, EdgeKind } from "./types";
import Legend from "./Legend";
import NodeDetails from "./NodeDetails";
import ReactD3Graph from "./ReactD3Graph";
import GraphHeader from "./GraphHeader";
import GraphContentPanel from "./GraphContentPanel";
import { GraphProvider } from "./context/GraphContext";
import { useGraphState } from "./hooks/useGraphState";
import { useGraphFilters } from "./hooks/useGraphFilters";
import { GraphConfig } from "./config/types";
import { DockerGraphConfig } from "./config/DockerGraphConfig";

// Inner component that uses the context
const ForceGraphInner: React.FC<{
  data: any;
  config?: GraphConfig<any, any>;
  storageKey?: string;
}> = ({ data, config, storageKey }) => {
  const {
    filteredData,
    hoveredNode,
    selectedNode,
    dimensions,
    setRawData,
    setHoveredNode,
    setSelectedNode,
    getNodeInfo,
  } = useGraphState();

  const { filters, toggleNodeVisibility, toggleEdgeVisibility, excludeNode } =
    useGraphFilters(config);
  const [activeTab, setActiveTab] = useState<"filters" | "layout" | null>(null);

  // Update raw data when props change
  useEffect(() => {
    if (data) {
      setRawData(data);
    }
  }, [data, setRawData]);

  // If no filtered data yet, show loading or use original data
  const displayData = filteredData || data;

  if (!displayData) {
    return (
      <div className="w-full h-screen relative bg-background overflow-hidden flex items-center justify-center">
        <GraphHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="text-foreground text-lg mt-16">Loading graph data...</div>
      </div>
    );
  }

  // Legacy setters for Legend component compatibility - memoized to prevent re-renders
  const setVisibleNodes = useCallback(
    (setter: React.SetStateAction<Record<string, boolean>>) => {
      if (typeof setter === "function") {
        const newVisibility = setter(filters.visibleNodes);
        Object.entries(newVisibility).forEach(([nodeKind, visible]) => {
          if (visible !== filters.visibleNodes[nodeKind as NodeKind]) {
            toggleNodeVisibility(nodeKind as NodeKind);
          }
        });
      } else {
        Object.entries(setter).forEach(([nodeKind, visible]) => {
          if (visible !== filters.visibleNodes[nodeKind as NodeKind]) {
            toggleNodeVisibility(nodeKind as NodeKind);
          }
        });
      }
    },
    [filters.visibleNodes, toggleNodeVisibility]
  );

  const setVisibleEdges = useCallback(
    (setter: React.SetStateAction<Record<string, boolean>>) => {
      if (typeof setter === "function") {
        const newVisibility = setter(filters.visibleEdges);
        Object.entries(newVisibility).forEach(([edgeKind, visible]) => {
          if (visible !== filters.visibleEdges[edgeKind as EdgeKind]) {
            toggleEdgeVisibility(edgeKind as EdgeKind);
          }
        });
      } else {
        Object.entries(setter).forEach(([edgeKind, visible]) => {
          if (visible !== filters.visibleEdges[edgeKind as EdgeKind]) {
            toggleEdgeVisibility(edgeKind as EdgeKind);
          }
        });
      }
    },
    [filters.visibleEdges, toggleEdgeVisibility]
  );

  // Wrapper for setSelectedNode - memoized to prevent re-renders
  // Since setSelectedNode from context only accepts string | null, not functions,
  // we handle the function case by getting current value manually
  const wrappedSetSelectedNode = useCallback<React.Dispatch<React.SetStateAction<string | null>>>(
    value => {
      if (typeof value === "function") {
        const fn = value as (prev: string | null) => string | null;
        const newValue = fn(selectedNode);
        setSelectedNode(newValue);
      } else {
        setSelectedNode(value);
      }
    },
    [setSelectedNode, selectedNode]
  );

  // Keyboard handling: Delete/Backspace to exclude selected node, Escape to clear selection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedNode) {
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        excludeNode(selectedNode);
        setSelectedNode(null);
      }
      if (e.key === "Escape") {
        setSelectedNode(null);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNode, excludeNode, setSelectedNode]);

  // Memoize dimensions to prevent ReactD3Graph re-renders
  // Reduce width by 384px (w-96) when side panel is open
  const graphDimensions = useMemo(
    () => ({
      width: activeTab ? dimensions.width - 384 : dimensions.width,
      height: dimensions.height - 64,
    }),
    [dimensions.width, dimensions.height, activeTab]
  );

  return (
    <div className="w-full h-screen relative bg-background overflow-hidden font-mono">
      <GraphHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="absolute top-16 left-0 right-0 bottom-0">
        <ReactD3Graph
          data={displayData}
          dimensions={graphDimensions}
          visibleNodes={filters.visibleNodes}
          visibleEdges={filters.visibleEdges}
          setHoveredNode={setHoveredNode}
          setSelectedNode={wrappedSetSelectedNode}
          hoveredNode={hoveredNode}
          selectedNode={selectedNode}
          config={config}
          storageKey={storageKey}
        />
        {!activeTab && (
          <Legend
            visibleNodes={filters.visibleNodes}
            setVisibleNodes={setVisibleNodes}
            visibleEdges={filters.visibleEdges}
            setVisibleEdges={setVisibleEdges}
            storageKey={storageKey}
          />
        )}
        {!activeTab && <NodeDetails node={getNodeInfo(hoveredNode || selectedNode)} />}
      </div>

      <GraphContentPanel
        activeTab={activeTab}
        onClose={() => setActiveTab(null)}
        storageKey={storageKey}
      />
    </div>
  );
};

// Main component with provider
const ForceGraph: React.FC<ForceGraphProps> = ({
  data,
  config = DockerGraphConfig,
  storageKey,
}) => {
  return (
    <GraphProvider key={storageKey} config={config} storageKey={storageKey}>
      <ForceGraphInner data={data} config={config} storageKey={storageKey} />
    </GraphProvider>
  );
};

export default ForceGraph;
export { GraphProvider, useGraphState, useGraphFilters };
