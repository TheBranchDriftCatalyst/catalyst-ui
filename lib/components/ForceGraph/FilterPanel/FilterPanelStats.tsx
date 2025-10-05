import React from 'react';
import { GraphData } from '../types';

interface FilterPanelStatsProps {
  rawData: GraphData | null;
  filteredData: GraphData | null;
}

export const FilterPanelStats: React.FC<FilterPanelStatsProps> = ({ rawData, filteredData }) => {
  if (!rawData || !filteredData) {
    return null;
  }

  const totalNodes = Object.keys(rawData.nodes).length;
  const visibleNodes = Object.keys(filteredData.nodes).length;
  const filteredCount = totalNodes - visibleNodes;
  const totalEdges = rawData.edges.length;
  const visibleEdges = filteredData.edges.length;
  const filteredEdges = totalEdges - visibleEdges;

  if (filteredCount === 0 && filteredEdges === 0) {
    return null;
  }

  return (
    <div className="mb-3 p-2 bg-destructive/5 border-l-2 border-destructive/40 rounded-sm text-[10px] leading-relaxed">
      <div className="font-bold mb-1 text-destructive text-xs">Filtered</div>
      <div className="text-foreground/80">
        {filteredCount > 0 && (
          <>
            • <strong>{filteredCount}</strong> node{filteredCount !== 1 ? 's' : ''} hidden
          </>
        )}
        {filteredCount > 0 && filteredEdges > 0 && <br />}
        {filteredEdges > 0 && (
          <>
            • <strong>{filteredEdges}</strong> edge{filteredEdges !== 1 ? 's' : ''} hidden
          </>
        )}
      </div>
    </div>
  );
};
