// Layout utilities for force graph

export type LayoutKind =
  | 'force'       // D3 force simulation
  | 'structured'  // Column-based grouping by kind
  | 'community'   // Community detection + hierarchical force
  | 'dagre';      // Dagre layered graph (Mermaid-style)

export interface LayoutDimensions {
  width: number;
  height: number;
}

// Re-export layout algorithms
export { applyForceLayout, type ForceLayoutOptions } from './layering/force';
export { applyStructuredLayout, type StructuredLayoutOptions } from './layering/structured';
export { applyCommunityLayout, type CommunityLayoutOptions } from './layering/community';
export { applyDagreLayout, type DagreLayoutOptions } from './layering/dagre';

// Import configs
import { ForceLayoutConfig } from './layering/force';
import { StructuredLayoutConfig } from './layering/structured';
import { CommunityLayoutConfig } from './layering/community';
import { DagreLayoutConfig } from './layering/dagre';

// Layout configuration registry
export const LayoutConfigs = {
  force: ForceLayoutConfig,
  structured: StructuredLayoutConfig,
  community: CommunityLayoutConfig,
  dagre: DagreLayoutConfig,
};
