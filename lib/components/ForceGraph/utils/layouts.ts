/**
 * Layout utilities for force graph
 *
 * This module provides a unified interface to multiple graph layout algorithms,
 * each optimized for different use cases and graph structures.
 *
 * @module ForceGraph/utils/layouts
 */

/**
 * Available layout algorithms for the force graph
 *
 * Each layout type is optimized for different graph structures:
 * - `force`: Standard physics-based simulation, good for general graphs
 * - `structured`: Organizes nodes by type into vertical columns
 * - `community`: Detects and groups related nodes automatically
 * - `dagre`: Hierarchical layered layout (used by Mermaid.js)
 * - `elk`: Advanced Eclipse Layout Kernel with multiple algorithms
 *
 * @see {@link applyForceLayout} for physics-based layout
 * @see {@link applyStructuredLayout} for column-based layout
 * @see {@link applyCommunityLayout} for community detection layout
 * @see {@link applyDagreLayout} for Mermaid-style hierarchical layout
 * @see {@link applyELKLayout} for advanced ELK algorithms
 */
export type LayoutKind =
  | "force" // D3 force simulation
  | "structured" // Column-based grouping by kind
  | "community" // Community detection + hierarchical force
  | "dagre" // Dagre layered graph (Mermaid-style)
  | "elk"; // ELK (Eclipse Layout Kernel) - Advanced hierarchical

/**
 * Viewport dimensions for layout calculations
 *
 * Used to constrain and center graph layouts within the visible area.
 */
export interface LayoutDimensions {
  /** Width of the viewport in pixels */
  width: number;
  /** Height of the viewport in pixels */
  height: number;
}

// Re-export layout algorithms
export { applyForceLayout, type ForceLayoutOptions } from "./layering/force";
export { applyStructuredLayout, type StructuredLayoutOptions } from "./layering/structured";
export { applyCommunityLayout, type CommunityLayoutOptions } from "./layering/community";
export { applyDagreLayout, type DagreLayoutOptions } from "./layering/dagre";
export { applyELKLayout, type ELKLayoutOptions } from "./layering/elk";

// Import configs
import { ForceLayoutConfig } from "./layering/force";
import { StructuredLayoutConfig } from "./layering/structured";
import { CommunityLayoutConfig } from "./layering/community";
import { DagreLayoutConfig } from "./layering/dagre";
import { ELKLayoutConfig } from "./layering/elk";

/**
 * Layout configuration registry
 *
 * Maps layout algorithm names to their configuration objects, which include:
 * - Human-readable name and description
 * - Configurable fields with UI metadata (labels, types, ranges, defaults)
 * - Field descriptions for user guidance
 *
 * Used to dynamically generate layout control UIs.
 *
 * @example
 * ```typescript
 * const forceConfig = LayoutConfigs.force;
 * console.log(forceConfig.name); // "Force-Directed"
 * console.log(forceConfig.fields[0].label); // "Node Repulsion"
 * ```
 */
export const LayoutConfigs = {
  force: ForceLayoutConfig,
  structured: StructuredLayoutConfig,
  community: CommunityLayoutConfig,
  dagre: DagreLayoutConfig,
  elk: ELKLayoutConfig,
};
