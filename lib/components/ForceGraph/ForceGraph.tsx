import React, { useState, useEffect } from 'react';
import { ForceGraphProps } from './types';
import Legend from './Legend';
import NodeDetails from './NodeDetails';
import Title from './Title';
import ReactD3Graph from './ReactD3Graph';
import FilterPanel from './FilterPanel';
import { GraphProvider } from './context/GraphContext';
import { useGraphState } from './hooks/useGraphState';
import { useGraphFilters } from './hooks/useGraphFilters';
import { GraphConfig } from './config/types';
import { DockerGraphConfig } from './config/DockerGraphConfig';

// Inner component that uses the context
const ForceGraphInner: React.FC<{ data: any; config?: GraphConfig<any, any> }> = ({ data, config }) => {
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

  const { filters, toggleNodeVisibility, toggleEdgeVisibility, excludeNode } = useGraphFilters(config);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);

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
      <div className="w-full h-[calc(100vh-120px)] relative bg-background overflow-hidden flex items-center justify-center">
        <div className="text-foreground text-lg">
          Loading graph data...
        </div>
      </div>
    );
  }

  // Legacy setters for Legend component compatibility
  const setVisibleNodes = (setter: React.SetStateAction<Record<any, boolean>>) => {
    if (typeof setter === 'function') {
      const newVisibility = setter(filters.visibleNodes);
      Object.entries(newVisibility).forEach(([nodeKind, visible]) => {
        // @ts-ignore - nodeKind from config can be any node type
        if (visible !== filters.visibleNodes[nodeKind as any]) {
          toggleNodeVisibility(nodeKind as any);
        }
      });
    } else {
      Object.entries(setter).forEach(([nodeKind, visible]) => {
        // @ts-ignore - nodeKind from config can be any node type
        if (visible !== filters.visibleNodes[nodeKind as any]) {
          toggleNodeVisibility(nodeKind as any);
        }
      });
    }
  };

  const setVisibleEdges = (setter: React.SetStateAction<Record<any, boolean>>) => {
    if (typeof setter === 'function') {
      const newVisibility = setter(filters.visibleEdges);
      Object.entries(newVisibility).forEach(([edgeKind, visible]) => {
        // @ts-ignore - edgeKind from config can be any edge type
        if (visible !== filters.visibleEdges[edgeKind as any]) {
          toggleEdgeVisibility(edgeKind as any);
        }
      });
    } else {
      Object.entries(setter).forEach(([edgeKind, visible]) => {
        // @ts-ignore - edgeKind from config can be any edge type
        if (visible !== filters.visibleEdges[edgeKind as any]) {
          toggleEdgeVisibility(edgeKind as any);
        }
      });
    }
  };

  // Wrapper for setSelectedNode
  const wrappedSetSelectedNode: React.Dispatch<React.SetStateAction<string | null>> = (value) => {
    if (typeof value === 'function') {
      setSelectedNode(value(selectedNode));
    } else {
      setSelectedNode(value);
    }
  };

  // Keyboard handling: Delete/Backspace to exclude selected node, Escape to clear selection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedNode) {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        excludeNode(selectedNode);
        setSelectedNode(null);
      }
      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNode, excludeNode, setSelectedNode]);

  return (
    <div className="w-full h-[calc(100vh-120px)] relative bg-background overflow-hidden font-mono">
      <ReactD3Graph
        data={displayData}
        dimensions={dimensions}
        visibleNodes={filters.visibleNodes}
        visibleEdges={filters.visibleEdges}
        setHoveredNode={setHoveredNode}
        setSelectedNode={wrappedSetSelectedNode}
        hoveredNode={hoveredNode}
        selectedNode={selectedNode}
        config={config}
      />
      {!filterPanelVisible && (
        <Legend
          visibleNodes={filters.visibleNodes}
          setVisibleNodes={setVisibleNodes}
          visibleEdges={filters.visibleEdges}
          setVisibleEdges={setVisibleEdges}
        />
      )}
      <div className="pointer-events-none">
        <NodeDetails node={getNodeInfo(hoveredNode || selectedNode)} />
      </div>
      <Title />

      <FilterPanel
        isVisible={filterPanelVisible}
        onToggle={() => setFilterPanelVisible(!filterPanelVisible)}
      />
    </div>
  );
};

// Main component with provider
const ForceGraph: React.FC<ForceGraphProps> = ({ data, config = DockerGraphConfig }) => {
  return (
    <GraphProvider config={config}>
      <ForceGraphInner data={data} config={config} />
    </GraphProvider>
  );
};

export default ForceGraph;
export { GraphProvider, useGraphState, useGraphFilters };
