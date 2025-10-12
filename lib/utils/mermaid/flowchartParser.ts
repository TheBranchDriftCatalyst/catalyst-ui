/**
 * Mermaid Flowchart Parser
 *
 * This module parses Mermaid flowchart syntax into structured data (ParsedMermaid).
 * It supports the full Mermaid flowchart syntax including:
 * - Multiple node shapes (rectangle, circle, diamond, database, etc.)
 * - Multiple edge types (solid, dotted, thick, bidirectional, etc.)
 * - Subgraphs with custom directions
 * - Class definitions and applications
 * - Edge labels
 *
 * @module mermaid/flowchartParser
 *
 * @example Basic Parsing
 * ```typescript
 * import { parseFlowchart } from '@/catalyst-ui/utils/mermaid/flowchartParser';
 *
 * const mermaid = `
 *   flowchart TB
 *     A[Start] --> B{Decision}
 *     B -->|Yes| C[Process]
 *     B -->|No| D[End]
 *     C --> D
 * `;
 *
 * const parsed = parseFlowchart(mermaid);
 * console.log(parsed.nodes.length); // 4
 * console.log(parsed.edges.length); // 4
 * ```
 *
 * @example Subgraph Parsing
 * ```typescript
 * const mermaid = `
 *   flowchart LR
 *     subgraph "Frontend"
 *       ui[UI Layer]
 *       state[State Management]
 *     end
 *     subgraph "Backend"
 *       api[API]
 *       db[(Database)]
 *     end
 *     ui --> api
 *     api --> db
 * `;
 *
 * const parsed = parseFlowchart(mermaid);
 * console.log(parsed.subgraphs.length); // 2
 * ```
 *
 * @example Class Definitions
 * ```typescript
 * const mermaid = `
 *   flowchart TB
 *     classDef critical fill:#ff6b6b,stroke:#c92a2a
 *     classDef success fill:#51cf66,stroke:#2f9e44
 *
 *     A[Normal Node]
 *     B[Critical Node]
 *     C[Success Node]
 *
 *     class B critical
 *     class C success
 * `;
 *
 * const parsed = parseFlowchart(mermaid);
 * console.log(parsed.classes.length); // 2
 * console.log(parsed.nodes[1].classes); // ['critical']
 * ```
 */

import type {
  ParsedMermaid,
  ParsedNode,
  ParsedEdge,
  ParsedSubgraph,
  ParsedClass,
  FlowDirection,
  NodeShape,
  EdgeType,
} from "./types";

/**
 * Parse a Mermaid flowchart into structured data
 *
 * Main entry point for parsing Mermaid flowchart text into a ParsedMermaid structure.
 * Handles all aspects of Mermaid flowchart syntax including nodes, edges, subgraphs, and styling.
 *
 * **Supported Syntax:**
 * - Node shapes: `[rect]`, `(round)`, `{diamond}`, `[(db)]`, `((circle))`, etc.
 * - Edge types: `-->`, `---`, `-.->`, `==>`, `~~~`, `<-->`
 * - Edge labels: `A -->|label| B` or `A --> "label" B`
 * - Subgraphs: `subgraph "title" ... end`
 * - Direction: `flowchart TB/LR/BT/RL`
 * - Classes: `classDef name fill:#color` + `class nodeId className`
 * - Comments: `%% comment` (ignored)
 *
 * @param mermaidText - Raw Mermaid flowchart syntax as a string
 * @returns Parsed Mermaid structure with nodes, edges, subgraphs, and classes
 *
 * @example Simple Flowchart
 * ```typescript
 * const result = parseFlowchart(`
 *   flowchart TB
 *     A[Start] --> B[Process]
 *     B --> C[End]
 * `);
 *
 * // result.nodes = [
 * //   { id: 'A', label: 'Start', shape: 'rectangle' },
 * //   { id: 'B', label: 'Process', shape: 'rectangle' },
 * //   { id: 'C', label: 'End', shape: 'rectangle' }
 * // ]
 * // result.edges = [
 * //   { src: 'A', dst: 'B', type: 'solid', bidirectional: false },
 * //   { src: 'B', dst: 'C', type: 'solid', bidirectional: false }
 * // ]
 * ```
 *
 * @example Complex Flowchart with Subgraphs
 * ```typescript
 * const result = parseFlowchart(`
 *   flowchart LR
 *     subgraph "User Interface"
 *       ui[UI] --> router[Router]
 *     end
 *     subgraph "Backend"
 *       api[API] --> db[(Database)]
 *     end
 *     router -.->|REST| api
 * `);
 *
 * // result.subgraphs = [
 * //   { id: 'user_interface', title: 'User Interface', nodeIds: ['ui', 'router'] },
 * //   { id: 'backend', title: 'Backend', nodeIds: ['api', 'db'] }
 * // ]
 * // result.edges includes dotted edge with label 'REST'
 * ```
 */
export function parseFlowchart(mermaidText: string): ParsedMermaid {
  const parser = new FlowchartParser(mermaidText);
  return parser.parse();
}

/**
 * Internal parser class for Mermaid flowchart syntax
 *
 * This class tokenizes and parses Mermaid flowchart text line-by-line.
 * It maintains state during parsing and builds up the complete ParsedMermaid structure.
 *
 * **Parsing Strategy:**
 * 1. Split text into lines, strip comments
 * 2. Parse direction statement
 * 3. Parse subgraph blocks (recursive)
 * 4. Parse class definitions and applications
 * 5. Parse edges (node connections with arrows)
 * 6. Parse standalone nodes
 *
 * @internal
 */
class FlowchartParser {
  /** Array of non-empty, non-comment lines */
  private lines: string[];

  /** Current line index being parsed */
  private currentLine = 0;

  /** Flow direction (TB, LR, etc.) */
  private direction: FlowDirection = "TB";

  /** Map of node ID to ParsedNode (deduplicates nodes) */
  private nodes = new Map<string, ParsedNode>();

  /** Array of parsed edges */
  private edges: ParsedEdge[] = [];

  /** Array of parsed subgraphs */
  private subgraphs: ParsedSubgraph[] = [];

  /** Array of parsed class definitions */
  private classes: ParsedClass[] = [];

  /** Current subgraph ID (null if not in a subgraph) */
  private currentSubgraph: string | null = null;

  /**
   * Create a new flowchart parser
   *
   * @param mermaidText - Raw Mermaid flowchart text
   */
  constructor(mermaidText: string) {
    this.lines = mermaidText
      .split("\n")
      .map(l => l.trim())
      .filter(l => l && !l.startsWith("%%"));
  }

  /**
   * Parse the Mermaid flowchart and return structured data
   *
   * Iterates through all lines and dispatches to specialized parsers
   * based on line content (direction, subgraph, class, edge, node).
   *
   * @returns Complete parsed Mermaid structure
   */
  parse(): ParsedMermaid {
    for (this.currentLine = 0; this.currentLine < this.lines.length; this.currentLine++) {
      const line = this.lines[this.currentLine];

      // Parse direction
      if (line.match(/^(graph|flowchart)\s+(TB|TD|BT|LR|RL)/)) {
        this.parseDirection(line);
        continue;
      }

      // Parse subgraph
      if (line.startsWith("subgraph")) {
        this.parseSubgraph();
        continue;
      }

      // Parse class definition
      if (line.startsWith("classDef")) {
        this.parseClassDef(line);
        continue;
      }

      // Parse class application
      if (line.startsWith("class ")) {
        this.parseClassApplication(line);
        continue;
      }

      // Parse edge (contains arrow)
      if (this.containsEdge(line)) {
        this.parseEdge(line);
        continue;
      }

      // Parse standalone node
      if (this.containsNode(line)) {
        this.parseNode(line);
      }
    }

    return {
      direction: this.direction,
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      subgraphs: this.subgraphs,
      classes: this.classes,
    };
  }

  /**
   * Parse direction statement (flowchart TB/LR/etc.)
   *
   * Extracts the flow direction from the header line.
   *
   * @param line - Line containing direction (e.g., "flowchart TB")
   *
   * @example
   * ```
   * flowchart TB  // Top to bottom
   * flowchart LR  // Left to right
   * ```
   */
  private parseDirection(line: string): void {
    const match = line.match(/^(?:graph|flowchart)\s+(TB|TD|BT|LR|RL)/);
    if (match) {
      this.direction = match[1] as FlowDirection;
    }
  }

  /**
   * Parse a subgraph block
   *
   * Parses a subgraph from the current line to the matching 'end' statement.
   * Handles nested nodes, edges, and subgraph-specific direction overrides.
   *
   * **Syntax:**
   * ```
   * subgraph "Title"
   *   direction LR
   *   A --> B
   * end
   * ```
   *
   * @example
   * ```mermaid
   * subgraph "Backend Services"
   *   direction LR
   *   api[API]
   *   db[(Database)]
   *   api --> db
   * end
   * ```
   */
  private parseSubgraph(): void {
    const startLine = this.lines[this.currentLine];
    const titleMatch = startLine.match(/subgraph\s+"?([^"]+)"?/);
    const title = titleMatch ? titleMatch[1].trim() : `subgraph_${this.subgraphs.length}`;
    const id = this.sanitizeId(title);

    let direction: FlowDirection | undefined;
    const nodeIds: string[] = [];

    // Find matching 'end'
    this.currentLine++;
    while (this.currentLine < this.lines.length && this.lines[this.currentLine] !== "end") {
      const line = this.lines[this.currentLine];

      // Check for direction statement
      if (line.match(/^direction\s+(TB|TD|BT|LR|RL)/)) {
        const dirMatch = line.match(/^direction\s+(TB|TD|BT|LR|RL)/);
        if (dirMatch) {
          direction = dirMatch[1] as FlowDirection;
        }
      }
      // Parse nodes within subgraph
      else if (this.containsNode(line) || this.containsEdge(line)) {
        const prevSubgraph = this.currentSubgraph;
        this.currentSubgraph = id;

        if (this.containsEdge(line)) {
          this.parseEdge(line);
        } else {
          this.parseNode(line);
        }

        this.currentSubgraph = prevSubgraph;
      }

      this.currentLine++;
    }

    // Collect all nodes that belong to this subgraph
    for (const node of this.nodes.values()) {
      if (node.subgraph === id) {
        nodeIds.push(node.id);
      }
    }

    this.subgraphs.push({ id, title, direction, nodeIds });
  }

  /**
   * Parse a class definition (classDef directive)
   *
   * Parses CSS-like styling definitions that can be applied to nodes.
   *
   * @param line - Line containing class definition
   *
   * @example
   * ```
   * classDef critical fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px
   * classDef success fill:#51cf66,stroke:#2f9e44
   * ```
   */
  private parseClassDef(line: string): void {
    const match = line.match(/classDef\s+(\w+)\s+(.+)/);
    if (!match) return;

    const [, name, styles] = match;
    const classObj: ParsedClass = { name };

    // Parse CSS-like properties
    const styleProps = styles.split(",").map(s => s.trim());
    for (const prop of styleProps) {
      const [key, value] = prop.split(":").map(s => s.trim());
      if (key && value) {
        classObj[key] = value;
      }
    }

    this.classes.push(classObj);
  }

  /**
   * Parse class application (class directive)
   *
   * Applies a previously defined class to one or more nodes.
   *
   * @param line - Line containing class application
   *
   * @example
   * ```
   * class A,B,C critical
   * class db1 storage
   * ```
   */
  private parseClassApplication(line: string): void {
    const match = line.match(/class\s+([\w,]+)\s+(\w+)/);
    if (!match) return;

    const [, nodeIds, className] = match;
    const ids = nodeIds.split(",").map(id => id.trim());

    for (const id of ids) {
      const node = this.nodes.get(id);
      if (node) {
        if (!node.classes) node.classes = [];
        node.classes.push(className);
      }
    }
  }

  /**
   * Check if line contains an edge (arrow)
   *
   * @param line - Line to check
   * @returns True if line contains any arrow syntax
   *
   * @example
   * ```
   * A --> B        // true
   * A --- B        // true
   * A -.-> B       // true
   * A ==> B        // true
   * A[Node]        // false
   * ```
   */
  private containsEdge(line: string): boolean {
    return /-->|---|\.->|==>|~~~|<-->/.test(line);
  }

  /**
   * Check if line contains a node definition
   *
   * @param line - Line to check
   * @returns True if line contains node syntax (shape delimiters)
   *
   * @example
   * ```
   * A[Node]        // true
   * B(Round)       // true
   * C{Diamond}     // true
   * A --> B        // false (edge, not standalone node)
   * ```
   */
  private containsNode(line: string): boolean {
    return /\w+[\[\(\{]/.test(line);
  }

  /**
   * Parse an edge (connection between nodes)
   *
   * Parses edge syntax including source, destination, arrow type, and optional label.
   * Handles multiple edges on a single line and bidirectional arrows.
   *
   * **Supported Arrow Types:**
   * - `-->`: Solid arrow
   * - `---`: Open line (no arrow)
   * - `.->`: Dotted arrow
   * - `==>`: Thick arrow
   * - `~~~`: Invisible link
   * - `<-->`: Bidirectional arrow
   *
   * **Label Syntax:**
   * - Pipe format: `A -->|label| B`
   * - Quote format: `A --> "label" B`
   *
   * @param line - Line containing edge(s)
   *
   * @example
   * ```
   * A --> B
   * A -->|Yes| B
   * A --> "No" C
   * A -.-> B
   * A ==> B
   * A <--> B
   * A --> B --> C  // Multiple edges
   * ```
   */
  private parseEdge(line: string): void {
    // Match edge patterns with optional labels
    const edgePattern =
      /([\w-]+)\s*(-->|---|\.->|==>|~~~|<-->)\s*(?:\|"([^"]+)"\||"([^"]+)")?\s*([\w-]+)/g;
    let match;

    while ((match = edgePattern.exec(line)) !== null) {
      const [, src, arrow, labelPipe, labelQuote, dst] = match;
      const label = labelPipe || labelQuote;

      const edgeType = this.getEdgeType(arrow);
      const bidirectional = arrow === "<-->";

      // Ensure nodes exist
      if (!this.nodes.has(src)) {
        this.nodes.set(src, this.createDefaultNode(src));
      }
      if (!this.nodes.has(dst)) {
        this.nodes.set(dst, this.createDefaultNode(dst));
      }

      this.edges.push({
        src,
        dst,
        type: edgeType,
        label,
        bidirectional,
      });
    }
  }

  /**
   * Parse a node definition
   *
   * Parses node syntax to extract ID, label, and shape.
   * Tries multiple shape patterns in priority order (most specific to least specific).
   *
   * **Shape Patterns (priority order):**
   * 1. Triple parentheses: `(((...)))` → double_circle
   * 2. Double braces: `{{...}}` → hexagon
   * 3. Double brackets: `[[...]]` → subroutine
   * 4. Double parentheses: `((...))` → circle
   * 5. Stadium: `([...])` → stadium
   * 6. Database: `[(...)]` → database
   * 7. Trapezoid: `[/...\]` or `[\../]` → trapezoid variants
   * 8. Parallelogram: `[/.../]` or `[\..\]` → parallelogram variants
   * 9. Asymmetric: `>...]` → asymmetric
   * 10. Diamond: `{...}` → diamond
   * 11. Round: `(...)` → round
   * 12. Rectangle: `[...]` → rectangle (default)
   *
   * @param line - Line containing node definition
   *
   * @example
   * ```
   * A[Rectangle]
   * B(Round)
   * C([Stadium])
   * D[[Subroutine]]
   * E[(Database)]
   * F((Circle))
   * G{Diamond}
   * H{{Hexagon}}
   * I[/Parallelogram/]
   * J(((Double Circle)))
   * ```
   */
  private parseNode(line: string): void {
    // Try to match different node patterns
    const patterns = [
      // Triple parentheses (must come before double)
      { regex: /([\w-]+)\(\(\(([^)]+)\)\)\)/, shape: "double_circle" as NodeShape },
      // Double braces
      { regex: /([\w-]+)\{\{([^}]+)\}\}/, shape: "hexagon" as NodeShape },
      // Double brackets
      { regex: /([\w-]+)\[\[([^\]]+)\]\]/, shape: "subroutine" as NodeShape },
      // Double parentheses
      { regex: /([\w-]+)\(\(([^)]+)\)\)/, shape: "circle" as NodeShape },
      // Stadium
      { regex: /([\w-]+)\(\[([^\]]+)\]\)/, shape: "stadium" as NodeShape },
      // Database
      { regex: /([\w-]+)\[\(([^)]+)\)\]/, shape: "database" as NodeShape },
      // Trapezoid variations
      { regex: /([\w-]+)\[\\([^/]+)\/\]/, shape: "trapezoid_alt" as NodeShape },
      { regex: /([\w-]+)\[\/([^\\]+)\\\]/, shape: "trapezoid" as NodeShape },
      // Parallelogram variations
      { regex: /([\w-]+)\[\\([^\\]+)\\\]/, shape: "parallelogram_alt" as NodeShape },
      { regex: /([\w-]+)\[\/([^\/]+)\/\]/, shape: "parallelogram" as NodeShape },
      // Asymmetric
      { regex: /([\w-]+)>([^\]]+)\]/, shape: "asymmetric" as NodeShape },
      // Diamond
      { regex: /([\w-]+)\{([^}]+)\}/, shape: "diamond" as NodeShape },
      // Round
      { regex: /([\w-]+)\(([^)]+)\)/, shape: "round" as NodeShape },
      // Rectangle (basic)
      { regex: /([\w-]+)\[([^\]]+)\]/, shape: "rectangle" as NodeShape },
    ];

    for (const { regex, shape } of patterns) {
      const match = line.match(regex);
      if (match) {
        const [, id, label] = match;
        if (!this.nodes.has(id)) {
          this.nodes.set(id, {
            id,
            label: label.replace(/<br\/?>/g, "\n").trim(),
            shape,
            subgraph: this.currentSubgraph || undefined,
          });
        }
        return;
      }
    }
  }

  /**
   * Create a default node (when node is referenced in edge but not explicitly defined)
   *
   * @param id - Node ID
   * @returns Default ParsedNode with rectangle shape
   */
  private createDefaultNode(id: string): ParsedNode {
    return {
      id,
      label: id,
      shape: "rectangle",
      subgraph: this.currentSubgraph || undefined,
    };
  }

  /**
   * Map arrow syntax to EdgeType
   *
   * @param arrow - Arrow string from Mermaid syntax
   * @returns Corresponding EdgeType
   *
   * @example
   * ```typescript
   * getEdgeType('-->') // 'solid'
   * getEdgeType('.->') // 'dotted'
   * getEdgeType('==>') // 'thick'
   * ```
   */
  private getEdgeType(arrow: string): EdgeType {
    switch (arrow) {
      case "-->":
        return "solid";
      case "---":
        return "open";
      case ".->":
        return "dotted";
      case "==>":
        return "thick";
      case "~~~":
        return "invisible";
      default:
        return "solid";
    }
  }

  /**
   * Sanitize string to create valid identifier
   *
   * Converts to lowercase and replaces non-alphanumeric chars with underscores.
   * Used for subgraph IDs.
   *
   * @param str - String to sanitize
   * @returns Sanitized identifier
   *
   * @example
   * ```typescript
   * sanitizeId('Backend Services') // 'backend_services'
   * sanitizeId('My-App 2.0')       // 'my_app_2_0'
   * ```
   */
  private sanitizeId(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "_");
  }
}
