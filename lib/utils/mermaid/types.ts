/**
 * Mermaid Flowchart Parser Types
 * These types represent the parsed structure of a Mermaid flowchart
 */

/**
 * Node shape types supported by Mermaid flowcharts
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
 */
export type EdgeType =
  | "solid" // -->
  | "open" // ---
  | "dotted" // -.->
  | "thick" // ==>
  | "invisible"; // ~~~

/**
 * Flow direction
 */
export type FlowDirection = "TB" | "TD" | "BT" | "LR" | "RL";

/**
 * Parsed node from Mermaid flowchart
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
 */
export interface ParsedSubgraph {
  id: string;
  title: string;
  direction?: FlowDirection;
  nodeIds: string[];
}

/**
 * Parsed class definition
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
