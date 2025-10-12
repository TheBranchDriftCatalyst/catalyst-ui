/**
 * Mermaid Flowchart Parser Types
 *
 * This module defines TypeScript types for parsing Mermaid flowchart syntax into structured data.
 * These types represent the intermediate representation (IR) between raw Mermaid text and ForceGraph data.
 *
 * @module mermaid/types
 *
 * @example Basic Usage
 * ```typescript
 * import type { ParsedMermaid, NodeShape, EdgeType } from '@/catalyst-ui/utils/mermaid/types';
 *
 * const parsed: ParsedMermaid = {
 *   direction: 'TB',
 *   nodes: [
 *     { id: 'A', label: 'Start', shape: 'circle' },
 *     { id: 'B', label: 'Process', shape: 'rectangle' }
 *   ],
 *   edges: [
 *     { src: 'A', dst: 'B', type: 'solid', bidirectional: false }
 *   ],
 *   subgraphs: [],
 *   classes: []
 * };
 * ```
 */

/**
 * Node shape types supported by Mermaid flowcharts
 *
 * Each shape has a specific syntax in Mermaid:
 * - `rectangle`: Standard box `[text]`
 * - `round`: Rounded corners `(text)`
 * - `stadium`: Pill shape `([text])`
 * - `subroutine`: Double-line box `[[text]]`
 * - `database`: Cylinder shape `[(text)]`
 * - `circle`: Circle `((text))`
 * - `asymmetric`: Flag shape `>text]`
 * - `diamond`: Decision diamond `{text}`
 * - `hexagon`: Hexagon `{{text}}`
 * - `parallelogram`: Input/output shape `[/text/]`
 * - `parallelogram_alt`: Alternative parallelogram `[\text\]`
 * - `trapezoid`: Trapezoid `[/text\]`
 * - `trapezoid_alt`: Alternative trapezoid `[\text/]`
 * - `double_circle`: Double circle `(((text)))`
 *
 * @example Shape Examples
 * ```mermaid
 * flowchart TB
 *   A[Rectangle]
 *   B(Round)
 *   C([Stadium])
 *   D[[Subroutine]]
 *   E[(Database)]
 *   F((Circle))
 *   G>Asymmetric]
 *   H{Diamond}
 *   I{{Hexagon}}
 *   J[/Parallelogram/]
 *   K[\Parallelogram Alt\]
 *   L[/Trapezoid\]
 *   M[\Trapezoid Alt/]
 *   N(((Double Circle)))
 * ```
 */
export type NodeShape =
  | "rectangle" // [text]
  | "round" // (text)
  | "stadium" // ([text])
  | "subroutine" // [[text]]
  | "database" // [(text)]
  | "circle" // ((text))
  | "asymmetric" // >text]
  | "diamond" // {text}
  | "hexagon" // {{text}}
  | "parallelogram" // [/text/]
  | "parallelogram_alt" // [\text\]
  | "trapezoid" // [/text\]
  | "trapezoid_alt" // [\text/]
  | "double_circle"; // (((text)))

/**
 * Edge/arrow types supported by Mermaid flowcharts
 *
 * Each edge type has a specific arrow syntax:
 * - `solid`: Standard arrow `-->`
 * - `open`: Line without arrow `---`
 * - `dotted`: Dashed arrow `-.->` (for data flow)
 * - `thick`: Bold arrow `==>` (for emphasis)
 * - `invisible`: Hidden link `~~~` (for layout spacing)
 *
 * @example Edge Type Examples
 * ```mermaid
 * flowchart LR
 *   A -->|solid| B
 *   C ---|open| D
 *   E -.->|dotted| F
 *   G ==>|thick| H
 *   I ~~~|invisible| J
 *   K <-->|bidirectional| L
 * ```
 */
export type EdgeType =
  | "solid" // -->
  | "open" // ---
  | "dotted" // -.->
  | "thick" // ==>
  | "invisible"; // ~~~

/**
 * Flow direction for Mermaid flowcharts
 *
 * Determines the primary layout direction:
 * - `TB` / `TD`: Top to bottom (default)
 * - `BT`: Bottom to top
 * - `LR`: Left to right
 * - `RL`: Right to left
 *
 * @example Direction Examples
 * ```mermaid
 * flowchart TB
 *   A --> B --> C
 * ```
 *
 * ```mermaid
 * flowchart LR
 *   A --> B --> C
 * ```
 */
export type FlowDirection = "TB" | "TD" | "BT" | "LR" | "RL";

/**
 * Parsed node from Mermaid flowchart
 *
 * Represents a single node/vertex in the graph after parsing.
 *
 * @property id - Unique node identifier
 * @property label - Display text for the node
 * @property shape - Visual shape (rectangle, circle, diamond, etc.)
 * @property subgraph - Optional parent subgraph ID (for grouping)
 * @property classes - CSS classes applied via `class` directive
 * @property style - Inline CSS styles (for custom styling)
 *
 * @example Node with Shape
 * ```typescript
 * const node: ParsedNode = {
 *   id: 'process1',
 *   label: 'Process Data',
 *   shape: 'rectangle'
 * };
 * ```
 *
 * @example Node in Subgraph with Classes
 * ```typescript
 * const node: ParsedNode = {
 *   id: 'db1',
 *   label: 'Database',
 *   shape: 'database',
 *   subgraph: 'backend',
 *   classes: ['critical', 'storage']
 * };
 * ```
 */
export interface ParsedNode {
  id: string;
  label: string;
  shape: NodeShape;
  subgraph?: string; // ID of parent subgraph
  classes?: string[]; // CSS classes applied
  style?: string; // Inline style
}

/**
 * Parsed edge from Mermaid flowchart
 *
 * Represents a connection/link between two nodes.
 *
 * @property src - Source node ID
 * @property dst - Destination node ID
 * @property type - Arrow style (solid, dotted, thick, etc.)
 * @property label - Optional edge label
 * @property bidirectional - True if edge has arrows on both ends (`<-->`)
 *
 * @example Basic Edge
 * ```typescript
 * const edge: ParsedEdge = {
 *   src: 'A',
 *   dst: 'B',
 *   type: 'solid',
 *   bidirectional: false
 * };
 * ```
 *
 * @example Labeled Bidirectional Edge
 * ```typescript
 * const edge: ParsedEdge = {
 *   src: 'client',
 *   dst: 'server',
 *   type: 'thick',
 *   label: 'WebSocket',
 *   bidirectional: true
 * };
 * ```
 */
export interface ParsedEdge {
  src: string;
  dst: string;
  type: EdgeType;
  label?: string;
  bidirectional: boolean;
}

/**
 * Parsed subgraph (group/fence)
 *
 * Represents a logical grouping of nodes in the flowchart.
 * Subgraphs can have their own direction and are used for visual organization.
 *
 * @property id - Unique subgraph identifier (sanitized from title)
 * @property title - Display title for the subgraph
 * @property direction - Optional flow direction override for this subgraph
 * @property nodeIds - Array of node IDs contained in this subgraph
 *
 * @example Subgraph with Direction
 * ```typescript
 * const subgraph: ParsedSubgraph = {
 *   id: 'frontend',
 *   title: 'Frontend Services',
 *   direction: 'LR',
 *   nodeIds: ['ui', 'state', 'router']
 * };
 * ```
 *
 * @example Mermaid Subgraph
 * ```mermaid
 * flowchart TB
 *   subgraph "Backend Services"
 *     direction LR
 *     api[API]
 *     db[(Database)]
 *     cache[(Cache)]
 *   end
 * ```
 */
export interface ParsedSubgraph {
  id: string;
  title: string;
  direction?: FlowDirection;
  nodeIds: string[];
}

/**
 * Parsed class definition
 *
 * Represents a CSS class definition from Mermaid's `classDef` directive.
 * Classes can be applied to nodes for custom styling.
 *
 * @property name - Class name
 * @property fill - Background color
 * @property stroke - Border color
 * @property strokeWidth - Border width
 * @property [key] - Additional CSS properties
 *
 * @example Class Definition
 * ```typescript
 * const classStyle: ParsedClass = {
 *   name: 'critical',
 *   fill: '#ff6b6b',
 *   stroke: '#c92a2a',
 *   strokeWidth: '3px'
 * };
 * ```
 *
 * @example Mermaid Class Definition
 * ```mermaid
 * flowchart TB
 *   classDef critical fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px
 *   A[Node A]
 *   class A critical
 * ```
 */
export interface ParsedClass {
  name: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  [key: string]: string | undefined;
}

/**
 * Complete parsed Mermaid flowchart
 *
 * The top-level structure returned by the parser, containing all parsed elements.
 *
 * @property direction - Primary flow direction
 * @property nodes - All parsed nodes
 * @property edges - All parsed edges
 * @property subgraphs - All parsed subgraphs
 * @property classes - All class definitions
 *
 * @example Complete Parsed Structure
 * ```typescript
 * const parsed: ParsedMermaid = {
 *   direction: 'TB',
 *   nodes: [
 *     { id: 'start', label: 'Start', shape: 'circle' },
 *     { id: 'process', label: 'Process', shape: 'rectangle', subgraph: 'main' },
 *     { id: 'end', label: 'End', shape: 'circle' }
 *   ],
 *   edges: [
 *     { src: 'start', dst: 'process', type: 'solid', bidirectional: false },
 *     { src: 'process', dst: 'end', type: 'solid', bidirectional: false }
 *   ],
 *   subgraphs: [
 *     { id: 'main', title: 'Main Process', nodeIds: ['process'] }
 *   ],
 *   classes: [
 *     { name: 'highlight', fill: '#ffeb3b' }
 *   ]
 * };
 * ```
 *
 * @example Mermaid Source
 * ```mermaid
 * flowchart TB
 *   classDef highlight fill:#ffeb3b
 *   start((Start))
 *   subgraph "Main Process"
 *     process[Process]
 *   end
 *   end1((End))
 *   start --> process --> end1
 *   class process highlight
 * ```
 */
export interface ParsedMermaid {
  direction: FlowDirection;
  nodes: ParsedNode[];
  edges: ParsedEdge[];
  subgraphs: ParsedSubgraph[];
  classes: ParsedClass[];
}

/**
 * Shape pattern definitions for regex matching
 *
 * Maps each node shape to its opening and closing delimiters in Mermaid syntax.
 * Used internally by the parser to identify and extract node shapes.
 *
 * @example Pattern Matching
 * ```typescript
 * const pattern = SHAPE_PATTERNS['circle']; // { open: '((', close: '))' }
 * const regex = new RegExp(`${pattern.open}(.+?)${pattern.close}`);
 * ```
 */
export const SHAPE_PATTERNS: Record<NodeShape, { open: string; close: string }> = {
  rectangle: { open: "[", close: "]" },
  round: { open: "(", close: ")" },
  stadium: { open: "([", close: "])" },
  subroutine: { open: "[[", close: "]]" },
  database: { open: "[(", close: ")]" },
  circle: { open: "((", close: "))" },
  asymmetric: { open: ">", close: "]" },
  diamond: { open: "{", close: "}" },
  hexagon: { open: "{{", close: "}}" },
  parallelogram: { open: "[/", close: "/]" },
  parallelogram_alt: { open: "[\\", close: "\\]" },
  trapezoid: { open: "[/", close: "\\]" },
  trapezoid_alt: { open: "[\\", close: "/]" },
  double_circle: { open: "(((", close: ")))" },
};

/**
 * Edge pattern definitions
 */
export const EDGE_PATTERNS: Record<EdgeType, string> = {
  solid: "-->",
  open: "---",
  dotted: "-.->",
  thick: "==>",
  invisible: "~~~",
};
