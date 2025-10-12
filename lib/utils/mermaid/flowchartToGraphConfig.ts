/**
 * Mermaid Flowchart to ForceGraph Config Converter
 *
 * This module converts parsed Mermaid flowcharts into ForceGraph-compatible
 * GraphConfig and GraphData structures. It provides intelligent defaults for
 * node/edge styling based on Mermaid syntax, with extensive customization options.
 *
 * @module mermaid/flowchartToGraphConfig
 *
 * @example Basic Conversion
 * ```typescript
 * import { MermaidFlowChartGraphConfigurator } from '@/catalyst-ui/utils/mermaid/flowchartToGraphConfig';
 *
 * const mermaid = `
 *   flowchart TB
 *     A[Start] --> B{Decision}
 *     B --> C[End]
 * `;
 *
 * const configurator = new MermaidFlowChartGraphConfigurator(mermaid);
 * const config = configurator.generateConfig();
 * const data = configurator.generateData();
 *
 * // Use with ForceGraph component
 * <ForceGraph config={config} data={data} />
 * ```
 *
 * @example Custom Color Strategy
 * ```typescript
 * const configurator = new MermaidFlowChartGraphConfigurator(mermaid, {
 *   colorStrategy: 'subgraph', // Color nodes by their subgraph
 *   neonPalette: ['#00ffff', '#ff00ff', '#ffff00']
 * });
 * ```
 *
 * @example Node Type Overrides
 * ```typescript
 * const configurator = new MermaidFlowChartGraphConfigurator(mermaid, {
 *   nodeTypeOverrides: {
 *     'decision': { color: '#ff0000', icon: '?' },
 *     'database': { color: '#00ff00', icon: 'DB' }
 *   }
 * });
 * ```
 */

import type {
  GraphConfig,
  NodeTypeConfig,
  EdgeTypeConfig,
} from "../../components/ForceGraph/config/types";
import type { GraphData, NodeData, EdgeData } from "../../components/ForceGraph/types";
import type { ParsedMermaid, NodeShape, EdgeType } from "./types";
import { parseFlowchart } from "./flowchartParser";

/**
 * Color assignment strategy for nodes
 *
 * Determines how nodes are grouped and colored:
 * - `subgraph`: Group by subgraph membership (nodes in same subgraph get same color)
 * - `shape`: Group by node shape (all circles same color, all rectangles same color, etc.)
 * - `auto`: Combine subgraph + shape (most fine-grained, each subgraph-shape combo gets unique color)
 *
 * @example Strategy Comparison
 * ```typescript
 * // With subgraph strategy:
 * // Frontend subgraph: blue (UI, Router, State all blue)
 * // Backend subgraph: green (API, DB, Cache all green)
 *
 * // With shape strategy:
 * // All rectangles: blue
 * // All circles: green
 * // All databases: yellow
 *
 * // With auto strategy:
 * // Frontend rectangles: blue
 * // Frontend circles: light blue
 * // Backend rectangles: green
 * // Backend databases: yellow
 * ```
 */
export type ColorStrategy = "subgraph" | "shape" | "auto";

/**
 * Configuration options for MermaidFlowChartGraphConfigurator
 *
 * Controls how Mermaid flowcharts are converted to ForceGraph structures.
 */
export interface ConfiguratorOptions {
  /**
   * Auto-detect node types from Mermaid shapes
   *
   * When true, creates a unique node type for each distinct shape
   * encountered in the flowchart.
   *
   * @defaultValue true
   */
  autoDetectNodeTypes?: boolean;

  /**
   * Auto-detect edge types from Mermaid arrow styles
   *
   * When true, creates a unique edge type for each distinct arrow
   * style (solid, dotted, thick, etc.).
   *
   * @defaultValue true
   */
  autoDetectEdgeTypes?: boolean;

  /**
   * Color assignment strategy
   *
   * @see ColorStrategy
   * @defaultValue "auto"
   */
  colorStrategy?: ColorStrategy;

  /**
   * Custom neon color palette for node coloring
   *
   * Nodes are assigned colors from this palette in round-robin fashion.
   * Defaults to CSS variables for neon colors.
   *
   * @defaultValue ["var(--neon-cyan)", "var(--neon-purple)", ...]
   */
  neonPalette?: string[];

  /**
   * Node type configuration overrides
   *
   * Override auto-generated node type configs by kind.
   *
   * @example
   * ```typescript
   * {
   *   nodeTypeOverrides: {
   *     'decision': { color: '#ff0000', icon: '?' },
   *     'database': { color: '#00ff00', icon: 'DB' }
   *   }
   * }
   * ```
   */
  nodeTypeOverrides?: Record<string, Partial<NodeTypeConfig>>;

  /**
   * Edge type configuration overrides
   *
   * Override auto-generated edge type configs by kind.
   *
   * @example
   * ```typescript
   * {
   *   edgeTypeOverrides: {
   *     'data': { color: '#00ffff', strokeWidth: 2 },
   *     'primary': { color: '#ff00ff', strokeWidth: 3 }
   *   }
   * }
   * ```
   */
  edgeTypeOverrides?: Record<string, Partial<EdgeTypeConfig>>;

  /**
   * Graph title
   *
   * @defaultValue "MERMAID FLOWCHART"
   */
  title?: string;

  /**
   * Enable visual subgraph grouping/fencing
   *
   * When true, nodes in subgraphs are visually grouped
   * (exact implementation depends on ForceGraph rendering).
   *
   * @defaultValue true
   */
  enableSubgraphGrouping?: boolean;

  /**
   * Subgraph border color
   *
   * @defaultValue "var(--primary)"
   */
  subgraphBorderColor?: string;
}

/**
 * Default neon color palette
 *
 * CSS custom properties for cyberpunk/synthwave aesthetic.
 * Colors are cycled through when assigning node types.
 */
const DEFAULT_NEON_PALETTE = [
  "var(--neon-cyan)",
  "var(--neon-purple)",
  "var(--neon-yellow)",
  "var(--neon-red)",
  "var(--neon-blue)",
  "var(--neon-gold)",
  "var(--neon-pink)",
];

/**
 * Shape to icon mapping
 *
 * Unicode symbols that visually represent each Mermaid node shape.
 * Used as default icons in NodeTypeConfig.
 */
const SHAPE_ICONS: Record<NodeShape, string> = {
  rectangle: "▭",
  round: "●",
  stadium: "⬭",
  subroutine: "▢",
  database: "🗄️",
  circle: "○",
  asymmetric: "⯈",
  diamond: "◆",
  hexagon: "⬡",
  parallelogram: "▱",
  parallelogram_alt: "▱",
  trapezoid: "⏢",
  trapezoid_alt: "⏢",
  double_circle: "◎",
};

/**
 * Shape to node kind mapping
 *
 * Maps Mermaid node shapes to semantic node kinds for ForceGraph.
 * Follows flowchart conventions:
 * - Rectangle/round: general process
 * - Stadium: start/end points
 * - Diamond: decision points
 * - Database: data storage
 * - Parallelogram: input/output
 * - Hexagon: preparation/setup
 * - etc.
 */
const SHAPE_TO_KIND: Record<NodeShape, string> = {
  rectangle: "process",
  round: "process",
  stadium: "start_end",
  subroutine: "subroutine",
  database: "storage",
  circle: "connector",
  asymmetric: "flag",
  diamond: "decision",
  hexagon: "preparation",
  parallelogram: "input",
  parallelogram_alt: "output",
  trapezoid: "manual",
  trapezoid_alt: "manual",
  double_circle: "junction",
};

/**
 * Edge type to kind mapping
 *
 * Maps Mermaid arrow styles to semantic edge kinds for ForceGraph:
 * - Solid: standard control flow
 * - Open: loose association
 * - Dotted: data flow
 * - Thick: primary/emphasized flow
 * - Invisible: hidden (layout-only)
 */
const EDGE_TO_KIND: Record<EdgeType, string> = {
  solid: "flow",
  open: "association",
  dotted: "data",
  thick: "primary",
  invisible: "hidden",
};

/**
 * Mermaid Flowchart to ForceGraph Configurator
 *
 * Main class for converting Mermaid flowcharts to ForceGraph structures.
 * Handles parsing, type generation, and data transformation.
 *
 * **Workflow:**
 * 1. Parse Mermaid text → ParsedMermaid
 * 2. Auto-detect node/edge types from parsed data
 * 3. Generate GraphConfig (node/edge type definitions)
 * 4. Generate GraphData (actual nodes/edges)
 *
 * @example Complete Workflow
 * ```typescript
 * const mermaid = `
 *   flowchart TB
 *     subgraph "Frontend"
 *       ui[UI Layer] --> state[State]
 *     end
 *     subgraph "Backend"
 *       api[API] --> db[(Database)]
 *     end
 *     state -.->|REST| api
 * `;
 *
 * const configurator = new MermaidFlowChartGraphConfigurator(mermaid, {
 *   colorStrategy: 'subgraph',
 *   title: 'System Architecture'
 * });
 *
 * const config = configurator.generateConfig();
 * // config.nodeTypes = { frontend_process: {...}, backend_storage: {...}, ... }
 * // config.edgeTypes = { flow: {...}, data: {...} }
 *
 * const data = configurator.generateData();
 * // data.nodes = { ui: {...}, state: {...}, api: {...}, db: {...} }
 * // data.edges = [{ src: 'ui', dst: 'state', ... }, ...]
 *
 * // Use with ForceGraph
 * <ForceGraph config={config} data={data} />
 * ```
 *
 * @example Accessing Parsed Data
 * ```typescript
 * const configurator = new MermaidFlowChartGraphConfigurator(mermaid);
 * const parsed = configurator.getParsedData();
 *
 * console.log(parsed.direction); // 'TB'
 * console.log(parsed.subgraphs); // [{ id: 'frontend', ... }, { id: 'backend', ... }]
 * ```
 */
export class MermaidFlowChartGraphConfigurator {
  /** Parsed Mermaid structure */
  private parsed: ParsedMermaid;

  /** Merged configurator options with defaults */
  private options: Required<ConfiguratorOptions>;

  /** Cache: node ID → node kind */
  private nodeKindMap = new Map<string, string>();

  /** Cache: edge type → edge kind */
  private edgeKindMap = new Map<string, string>();

  /**
   * Create a new Mermaid flowchart configurator
   *
   * Parses the Mermaid text and initializes options with defaults.
   *
   * @param mermaidText - Raw Mermaid flowchart syntax
   * @param options - Configuration options (optional)
   *
   * @example
   * ```typescript
   * const configurator = new MermaidFlowChartGraphConfigurator(`
   *   flowchart TB
   *     A --> B
   * `, {
   *   colorStrategy: 'shape',
   *   title: 'My Flowchart'
   * });
   * ```
   */
  constructor(mermaidText: string, options: ConfiguratorOptions = {}) {
    this.parsed = parseFlowchart(mermaidText);
    this.options = {
      autoDetectNodeTypes: true,
      autoDetectEdgeTypes: true,
      colorStrategy: "auto",
      neonPalette: DEFAULT_NEON_PALETTE,
      nodeTypeOverrides: {},
      edgeTypeOverrides: {},
      title: "MERMAID FLOWCHART",
      enableSubgraphGrouping: true,
      subgraphBorderColor: "var(--primary)",
      ...options,
    };
  }

  /**
   * Generate complete GraphConfig
   *
   * Creates ForceGraph-compatible node and edge type definitions
   * based on the parsed Mermaid flowchart.
   *
   * @returns GraphConfig with node types, edge types, and title
   *
   * @example
   * ```typescript
   * const config = configurator.generateConfig();
   * // {
   * //   nodeTypes: {
   * //     'process': { label: 'Process', color: 'var(--neon-cyan)', icon: '▭' },
   * //     'decision': { label: 'Decision', color: 'var(--neon-purple)', icon: '◆' },
   * //     'storage': { label: 'Storage', color: 'var(--neon-yellow)', icon: '🗄️' }
   * //   },
   * //   edgeTypes: {
   * //     'flow': { label: 'Flow', color: 'var(--primary)' },
   * //     'data': { label: 'Data', color: 'var(--secondary)' }
   * //   },
   * //   title: 'MERMAID FLOWCHART'
   * // }
   * ```
   */
  generateConfig(): GraphConfig<string, string> {
    const nodeTypes = this.generateNodeTypes();
    const edgeTypes = this.generateEdgeTypes();

    return {
      nodeTypes,
      edgeTypes,
      title: this.options.title,
    };
  }

  /**
   * Generate GraphData from parsed Mermaid
   *
   * Transforms parsed nodes and edges into ForceGraph-compatible
   * NodeData and EdgeData structures.
   *
   * **Node Kind Assignment:**
   * - Based on `colorStrategy` option
   * - Nodes in subgraphs have `attributes.subgraph` and `attributes.group` set
   *
   * **Edge Kind Assignment:**
   * - Based on Mermaid arrow type (solid, dotted, thick, etc.)
   * - Labels preserved in `attributes.label`
   * - Bidirectional flag preserved in `attributes.bidirectional`
   *
   * @returns GraphData with nodes and edges ready for ForceGraph
   *
   * @example
   * ```typescript
   * const data = configurator.generateData();
   * // {
   * //   nodes: {
   * //     'A': { id: 'A', kind: 'process', name: 'Start', attributes: { shape: 'rectangle' } },
   * //     'B': { id: 'B', kind: 'decision', name: 'Check?', attributes: { shape: 'diamond' } },
   * //     'C': { id: 'C', kind: 'storage', name: 'DB', attributes: { shape: 'database', subgraph: 'backend' } }
   * //   },
   * //   edges: [
   * //     { src: 'A', dst: 'B', kind: 'flow', attributes: { bidirectional: false }, source: {...}, target: {...} },
   * //     { src: 'B', dst: 'C', kind: 'data', attributes: { label: 'Query', bidirectional: false }, source: {...}, target: {...} }
   * //   ]
   * // }
   * ```
   */
  generateData(): GraphData {
    const nodes: Record<string, NodeData> = {};
    const edges: EdgeData[] = [];

    // Build nodes
    for (const parsedNode of this.parsed.nodes) {
      const kind = this.getNodeKind(parsedNode.id, parsedNode.shape);

      nodes[parsedNode.id] = {
        id: parsedNode.id,
        kind: kind as any, // Dynamic kind from Mermaid parsing
        name: parsedNode.label,
        attributes: {
          shape: parsedNode.shape,
          ...(parsedNode.subgraph && {
            subgraph: parsedNode.subgraph,
            group: this.parsed.subgraphs.find(s => s.id === parsedNode.subgraph)?.title,
          }),
        },
      };
    }

    // Build edges
    for (const parsedEdge of this.parsed.edges) {
      const kind = this.getEdgeKind(parsedEdge.type);

      edges.push({
        src: parsedEdge.src,
        dst: parsedEdge.dst,
        kind: kind as any, // Dynamic kind from Mermaid parsing
        attributes: {
          ...(parsedEdge.label && { label: parsedEdge.label }),
          bidirectional: parsedEdge.bidirectional,
        },
        source: nodes[parsedEdge.src],
        target: nodes[parsedEdge.dst],
      });
    }

    return { nodes, edges };
  }

  /**
   * Get parsed Mermaid data
   *
   * Returns the raw parsed Mermaid structure before transformation
   * to GraphData. Useful for inspecting parse results or debugging.
   *
   * @returns ParsedMermaid structure with nodes, edges, subgraphs, etc.
   *
   * @example
   * ```typescript
   * const parsed = configurator.getParsedData();
   * console.log(parsed.direction);  // 'TB' | 'LR' | etc.
   * console.log(parsed.subgraphs);  // [{ id: 'frontend', title: 'Frontend', ... }]
   * console.log(parsed.classes);    // [{ name: 'critical', fill: '#ff0000', ... }]
   * ```
   */
  getParsedData(): ParsedMermaid {
    return this.parsed;
  }

  /**
   * Generate node types from parsed data
   *
   * Scans all parsed nodes, extracts unique kinds (based on colorStrategy),
   * and generates NodeTypeConfig for each kind with color, icon, and label.
   *
   * @returns Record of node kind → NodeTypeConfig
   * @private
   */
  private generateNodeTypes(): Record<string, NodeTypeConfig> {
    const nodeTypes: Record<string, NodeTypeConfig> = {};
    const kindsSeen = new Set<string>();

    // Collect unique node kinds
    for (const node of this.parsed.nodes) {
      const kind = this.getNodeKind(node.id, node.shape);
      kindsSeen.add(kind);
    }

    // Build node type configs
    let colorIndex = 0;
    for (const kind of kindsSeen) {
      const color = this.assignColor(kind, colorIndex++);
      const shape = this.getShapeForKind(kind);
      const icon = SHAPE_ICONS[shape] || "●";

      nodeTypes[kind] = {
        label: this.formatLabel(kind),
        color,
        icon,
        ...this.options.nodeTypeOverrides[kind],
      };
    }

    return nodeTypes;
  }

  /**
   * Generate edge types from parsed data
   *
   * Scans all parsed edges, extracts unique kinds (based on arrow type),
   * and generates EdgeTypeConfig for each kind with color and label.
   *
   * @returns Record of edge kind → EdgeTypeConfig
   * @private
   */
  private generateEdgeTypes(): Record<string, EdgeTypeConfig> {
    const edgeTypes: Record<string, EdgeTypeConfig> = {};
    const kindsSeen = new Set<string>();

    // Collect unique edge kinds
    for (const edge of this.parsed.edges) {
      const kind = this.getEdgeKind(edge.type);
      kindsSeen.add(kind);
    }

    // Build edge type configs
    const edgeColors = {
      flow: "var(--primary)",
      data: "var(--secondary)",
      primary: "var(--neon-red)",
      association: "var(--neon-yellow)",
      hidden: "transparent",
    };

    for (const kind of kindsSeen) {
      edgeTypes[kind] = {
        label: this.formatLabel(kind),
        color: edgeColors[kind as keyof typeof edgeColors] || "var(--primary)",
        ...this.options.edgeTypeOverrides[kind],
      };
    }

    return edgeTypes;
  }

  /**
   * Get node kind from parsed node
   *
   * Determines the node's "kind" based on colorStrategy:
   * - `subgraph`: Use subgraph ID as kind (or 'default' if no subgraph)
   * - `shape`: Use semantic kind from SHAPE_TO_KIND mapping
   * - `auto`: Combine subgraph + shape (e.g., 'frontend_process', 'backend_storage')
   *
   * Results are cached in nodeKindMap for consistency.
   *
   * @param nodeId - Node ID
   * @param shape - Node shape from Mermaid
   * @returns Node kind string
   * @private
   *
   * @example
   * ```typescript
   * // colorStrategy: 'shape'
   * getNodeKind('A', 'rectangle') // 'process'
   * getNodeKind('B', 'diamond')   // 'decision'
   *
   * // colorStrategy: 'subgraph'
   * getNodeKind('ui', 'rectangle')  // 'frontend' (if ui is in frontend subgraph)
   * getNodeKind('db', 'database')   // 'backend' (if db is in backend subgraph)
   *
   * // colorStrategy: 'auto'
   * getNodeKind('ui', 'rectangle')  // 'frontend_process'
   * getNodeKind('db', 'database')   // 'backend_storage'
   * ```
   */
  private getNodeKind(nodeId: string, shape: NodeShape): string {
    if (this.nodeKindMap.has(nodeId)) {
      return this.nodeKindMap.get(nodeId)!;
    }

    let kind: string;

    if (this.options.colorStrategy === "subgraph") {
      // Use subgraph as kind
      const node = this.parsed.nodes.find(n => n.id === nodeId);
      if (node?.subgraph) {
        const subgraph = this.parsed.subgraphs.find(s => s.id === node.subgraph);
        kind = subgraph?.id || SHAPE_TO_KIND[shape];
      } else {
        kind = "default";
      }
    } else if (this.options.colorStrategy === "shape") {
      // Use shape as kind
      kind = SHAPE_TO_KIND[shape];
    } else {
      // Auto: combine subgraph + shape
      const node = this.parsed.nodes.find(n => n.id === nodeId);
      if (node?.subgraph) {
        const subgraph = this.parsed.subgraphs.find(s => s.id === node.subgraph);
        kind = `${subgraph?.id}_${SHAPE_TO_KIND[shape]}`;
      } else {
        kind = SHAPE_TO_KIND[shape];
      }
    }

    this.nodeKindMap.set(nodeId, kind);
    return kind;
  }

  /**
   * Get edge kind from edge type
   *
   * Maps Mermaid arrow type to semantic edge kind using EDGE_TO_KIND.
   * Results are cached in edgeKindMap.
   *
   * @param edgeType - Mermaid edge type (solid, dotted, thick, etc.)
   * @returns Edge kind string
   * @private
   *
   * @example
   * ```typescript
   * getEdgeKind('solid')    // 'flow'
   * getEdgeKind('dotted')   // 'data'
   * getEdgeKind('thick')    // 'primary'
   * getEdgeKind('open')     // 'association'
   * ```
   */
  private getEdgeKind(edgeType: EdgeType): string {
    if (this.edgeKindMap.has(edgeType)) {
      return this.edgeKindMap.get(edgeType)!;
    }

    const kind = EDGE_TO_KIND[edgeType];
    this.edgeKindMap.set(edgeType, kind);
    return kind;
  }

  /**
   * Assign color from palette
   *
   * Cycles through the neon palette using modulo arithmetic.
   *
   * @param _kind - Node kind (currently unused, for future expansion)
   * @param index - Color index
   * @returns CSS color value
   * @private
   */
  private assignColor(_kind: string, index: number): string {
    const paletteIndex = index % this.options.neonPalette.length;
    return this.options.neonPalette[paletteIndex];
  }

  /**
   * Get shape for a given kind (reverse lookup)
   *
   * Attempts to extract the original shape from a kind string
   * by matching against SHAPE_TO_KIND values.
   *
   * @param kind - Node kind (may contain subgraph prefix)
   * @returns NodeShape (defaults to 'rectangle' if no match)
   * @private
   *
   * @example
   * ```typescript
   * getShapeForKind('process')             // 'rectangle'
   * getShapeForKind('decision')            // 'diamond'
   * getShapeForKind('frontend_storage')    // 'database'
   * ```
   */
  private getShapeForKind(kind: string): NodeShape {
    for (const [shape, shapeKind] of Object.entries(SHAPE_TO_KIND)) {
      if (kind.includes(shapeKind)) {
        return shape as NodeShape;
      }
    }
    return "rectangle";
  }

  /**
   * Format label from kind string
   *
   * Converts snake_case kind to Title Case label.
   *
   * @param kind - Node or edge kind
   * @returns Formatted label
   * @private
   *
   * @example
   * ```typescript
   * formatLabel('process')              // 'Process'
   * formatLabel('start_end')            // 'Start End'
   * formatLabel('frontend_storage')     // 'Frontend Storage'
   * ```
   */
  private formatLabel(kind: string): string {
    return kind
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
