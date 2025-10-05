import React from 'react';
import { NodeData } from '../types';
import { GraphFilters } from '../types/filterTypes';

/**
 * Props for custom node renderer components
 */
export interface NodeRendererProps {
  data: NodeData;
  width: number;
  height: number;
  pad: number;
  imgSize: number;
  showLogo?: boolean;
}

/**
 * Custom node renderer component type
 */
export type NodeRenderer = React.FC<NodeRendererProps>;

/**
 * Node type configuration
 */
export interface NodeTypeConfig {
  label: string;
  color: string;
  icon: string;
  renderer?: NodeRenderer;
}

/**
 * Edge type configuration
 */
export interface EdgeTypeConfig {
  label: string;
  color: string;
}

/**
 * Attribute filter predicate function
 * @param value - The filter value
 * @param node - The node being filtered
 * @param filter - The filter configuration (for accessing patterns, etc.)
 */
export type AttributeFilterPredicate<T = any> = (
  value: T,
  node: NodeData,
  filter?: AttributeFilter
) => boolean;

/**
 * Attribute filter configuration
 */
export interface AttributeFilter {
  name: string;
  label: string;
  type: 'text' | 'select' | 'boolean' | 'number';
  attributePath?: string; // Optional: direct path to attribute
  predicate: AttributeFilterPredicate;
  defaultValue?: any;
  options?: FilterOption<any>[]; // For select-type filters
  patterns?: string[]; // For pattern-matching filters (e.g., layer0)
}

/**
 * Filter option for UI components
 */
export interface FilterOption<T = string> {
  value: T;
  label: string;
}

/**
 * Quick filter button configuration
 */
export interface QuickFilter {
  label: string;
  icon: string;
  action: (currentFilters: GraphFilters) => Partial<GraphFilters>;
  className?: string; // Optional custom styling
}

/**
 * Generic graph configuration
 */
export interface GraphConfig<TNodeKind extends string = string, TEdgeKind extends string = string> {
  /** Node type configurations */
  nodeTypes: Record<TNodeKind, NodeTypeConfig>;

  /** Edge type configurations */
  edgeTypes: Record<TEdgeKind, EdgeTypeConfig>;

  /** Custom attribute-based filters */
  attributeFilters?: AttributeFilter[];

  /** Quick filter preset buttons */
  quickFilters?: QuickFilter[];

  /** Graph title (defaults to "FORCE GRAPH") */
  title?: string;

  /** Default node renderer (fallback) */
  defaultNodeRenderer?: NodeRenderer;

  /** Custom node dimension calculator */
  getNodeDimensions?: (node: NodeData) => { width: number; height: number };

  /**
   * Domain-specific status filter options for UI
   * Example: For Docker - running, stopped, in-use
   * These are specific to the domain and not graph-level properties
   */
  statusFilterOptions?: FilterOption<any>[];

  /**
   * Additional custom filter options for domain-specific filters
   * Use this for any other domain-specific filters beyond status
   */
  customFilterOptions?: Record<string, FilterOption<any>[]>;
}

/**
 * Utility type to extract node kinds from config
 */
export type ExtractNodeKind<T extends GraphConfig<any, any>> =
  T extends GraphConfig<infer K, any> ? K : never;

/**
 * Utility type to extract edge kinds from config
 */
export type ExtractEdgeKind<T extends GraphConfig<any, any>> =
  T extends GraphConfig<any, infer K> ? K : never;
