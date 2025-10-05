/**
 * Mermaid Flowchart to ForceGraph Config Converter
 * Converts parsed Mermaid flowcharts into GraphConfig and GraphData
 */

import type { GraphConfig, NodeTypeConfig, EdgeTypeConfig } from '../../components/ForceGraph/config/types';
import type { GraphData, NodeData, EdgeData } from '../../components/ForceGraph/types';
import type { ParsedMermaid, NodeShape, EdgeType } from './types';
import { parseFlowchart } from './flowchartParser';

/**
 * Color assignment strategy
 */
export type ColorStrategy = 'subgraph' | 'shape' | 'auto';

/**
 * Configurator options
 */
export interface ConfiguratorOptions {
  /** Auto-detect node types from shapes */
  autoDetectNodeTypes?: boolean;

  /** Auto-detect edge types from arrow styles */
  autoDetectEdgeTypes?: boolean;

  /** Color assignment strategy */
  colorStrategy?: ColorStrategy;

  /** Custom neon color palette */
  neonPalette?: string[];

  /** Node type overrides */
  nodeTypeOverrides?: Record<string, Partial<NodeTypeConfig>>;

  /** Edge type overrides */
  edgeTypeOverrides?: Record<string, Partial<EdgeTypeConfig>>;

  /** Graph title */
  title?: string;

  /** Enable visual subgraph grouping/fencing */
  enableSubgraphGrouping?: boolean;

  /** Subgraph border color */
  subgraphBorderColor?: string;
}

/**
 * Default neon color palette
 */
const DEFAULT_NEON_PALETTE = [
  'var(--neon-cyan)',
  'var(--neon-purple)',
  'var(--neon-yellow)',
  'var(--neon-red)',
  'var(--neon-blue)',
  'var(--neon-gold)',
  'var(--neon-pink)',
];

/**
 * Shape to icon mapping
 */
const SHAPE_ICONS: Record<NodeShape, string> = {
  rectangle: '▭',
  round: '●',
  stadium: '⬭',
  subroutine: '▢',
  database: '🗄️',
  circle: '○',
  asymmetric: '⯈',
  diamond: '◆',
  hexagon: '⬡',
  parallelogram: '▱',
  parallelogram_alt: '▱',
  trapezoid: '⏢',
  trapezoid_alt: '⏢',
  double_circle: '◎',
};

/**
 * Shape to node kind mapping
 */
const SHAPE_TO_KIND: Record<NodeShape, string> = {
  rectangle: 'process',
  round: 'process',
  stadium: 'start_end',
  subroutine: 'subroutine',
  database: 'storage',
  circle: 'connector',
  asymmetric: 'flag',
  diamond: 'decision',
  hexagon: 'preparation',
  parallelogram: 'input',
  parallelogram_alt: 'output',
  trapezoid: 'manual',
  trapezoid_alt: 'manual',
  double_circle: 'junction',
};

/**
 * Edge type to kind mapping
 */
const EDGE_TO_KIND: Record<EdgeType, string> = {
  solid: 'flow',
  open: 'association',
  dotted: 'data',
  thick: 'primary',
  invisible: 'hidden',
};

/**
 * Mermaid Flowchart to ForceGraph Configurator
 */
export class MermaidFlowChartGraphConfigurator {
  private parsed: ParsedMermaid;
  private options: Required<ConfiguratorOptions>;
  private nodeKindMap = new Map<string, string>(); // node ID -> kind
  private edgeKindMap = new Map<string, string>(); // edge type -> kind

  constructor(
    mermaidText: string,
    options: ConfiguratorOptions = {}
  ) {
    this.parsed = parseFlowchart(mermaidText);
    this.options = {
      autoDetectNodeTypes: true,
      autoDetectEdgeTypes: true,
      colorStrategy: 'auto',
      neonPalette: DEFAULT_NEON_PALETTE,
      nodeTypeOverrides: {},
      edgeTypeOverrides: {},
      title: 'MERMAID FLOWCHART',
      enableSubgraphGrouping: true,
      subgraphBorderColor: 'var(--primary)',
      ...options,
    };
  }

  /**
   * Generate complete GraphConfig
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
   */
  getParsedData(): ParsedMermaid {
    return this.parsed;
  }

  /**
   * Generate node types from parsed data
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
      const icon = SHAPE_ICONS[shape] || '●';

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
      flow: 'var(--primary)',
      data: 'var(--secondary)',
      primary: 'var(--neon-red)',
      association: 'var(--neon-yellow)',
      hidden: 'transparent',
    };

    for (const kind of kindsSeen) {
      edgeTypes[kind] = {
        label: this.formatLabel(kind),
        color: edgeColors[kind as keyof typeof edgeColors] || 'var(--primary)',
        ...this.options.edgeTypeOverrides[kind],
      };
    }

    return edgeTypes;
  }

  /**
   * Get node kind from parsed node
   */
  private getNodeKind(nodeId: string, shape: NodeShape): string {
    if (this.nodeKindMap.has(nodeId)) {
      return this.nodeKindMap.get(nodeId)!;
    }

    let kind: string;

    if (this.options.colorStrategy === 'subgraph') {
      // Use subgraph as kind
      const node = this.parsed.nodes.find(n => n.id === nodeId);
      if (node?.subgraph) {
        const subgraph = this.parsed.subgraphs.find(s => s.id === node.subgraph);
        kind = subgraph?.id || SHAPE_TO_KIND[shape];
      } else {
        kind = 'default';
      }
    } else if (this.options.colorStrategy === 'shape') {
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
   * Assign color based on strategy
   */
  private assignColor(_kind: string, index: number): string {
    const paletteIndex = index % this.options.neonPalette.length;
    return this.options.neonPalette[paletteIndex];
  }

  /**
   * Get shape for a given kind (reverse lookup)
   */
  private getShapeForKind(kind: string): NodeShape {
    for (const [shape, shapeKind] of Object.entries(SHAPE_TO_KIND)) {
      if (kind.includes(shapeKind)) {
        return shape as NodeShape;
      }
    }
    return 'rectangle';
  }

  /**
   * Format label from kind
   */
  private formatLabel(kind: string): string {
    return kind
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
