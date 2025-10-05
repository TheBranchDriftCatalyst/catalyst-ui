/**
 * Mermaid Flowchart Parser
 * Parses Mermaid flowchart syntax into structured data
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
} from './types';

/**
 * Parse a Mermaid flowchart into structured data
 */
export function parseFlowchart(mermaidText: string): ParsedMermaid {
  const parser = new FlowchartParser(mermaidText);
  return parser.parse();
}

class FlowchartParser {
  private lines: string[];
  private currentLine = 0;
  private direction: FlowDirection = 'TB';
  private nodes = new Map<string, ParsedNode>();
  private edges: ParsedEdge[] = [];
  private subgraphs: ParsedSubgraph[] = [];
  private classes: ParsedClass[] = [];
  private currentSubgraph: string | null = null;

  constructor(mermaidText: string) {
    this.lines = mermaidText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'));
  }

  parse(): ParsedMermaid {
    for (this.currentLine = 0; this.currentLine < this.lines.length; this.currentLine++) {
      const line = this.lines[this.currentLine];

      // Parse direction
      if (line.match(/^(graph|flowchart)\s+(TB|TD|BT|LR|RL)/)) {
        this.parseDirection(line);
        continue;
      }

      // Parse subgraph
      if (line.startsWith('subgraph')) {
        this.parseSubgraph();
        continue;
      }

      // Parse class definition
      if (line.startsWith('classDef')) {
        this.parseClassDef(line);
        continue;
      }

      // Parse class application
      if (line.startsWith('class ')) {
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

  private parseDirection(line: string): void {
    const match = line.match(/^(?:graph|flowchart)\s+(TB|TD|BT|LR|RL)/);
    if (match) {
      this.direction = match[1] as FlowDirection;
    }
  }

  private parseSubgraph(): void {
    const startLine = this.lines[this.currentLine];
    const titleMatch = startLine.match(/subgraph\s+"?([^"]+)"?/);
    const title = titleMatch ? titleMatch[1].trim() : `subgraph_${this.subgraphs.length}`;
    const id = this.sanitizeId(title);

    let direction: FlowDirection | undefined;
    const nodeIds: string[] = [];

    // Find matching 'end'
    this.currentLine++;
    while (this.currentLine < this.lines.length && this.lines[this.currentLine] !== 'end') {
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

  private parseClassDef(line: string): void {
    const match = line.match(/classDef\s+(\w+)\s+(.+)/);
    if (!match) return;

    const [, name, styles] = match;
    const classObj: ParsedClass = { name };

    // Parse CSS-like properties
    const styleProps = styles.split(',').map(s => s.trim());
    for (const prop of styleProps) {
      const [key, value] = prop.split(':').map(s => s.trim());
      if (key && value) {
        classObj[key] = value;
      }
    }

    this.classes.push(classObj);
  }

  private parseClassApplication(line: string): void {
    const match = line.match(/class\s+([\w,]+)\s+(\w+)/);
    if (!match) return;

    const [, nodeIds, className] = match;
    const ids = nodeIds.split(',').map(id => id.trim());

    for (const id of ids) {
      const node = this.nodes.get(id);
      if (node) {
        if (!node.classes) node.classes = [];
        node.classes.push(className);
      }
    }
  }

  private containsEdge(line: string): boolean {
    return /-->|---|\.->|==>|~~~|<-->/.test(line);
  }

  private containsNode(line: string): boolean {
    return /\w+[\[\(\{]/.test(line);
  }

  private parseEdge(line: string): void {
    // Match edge patterns with optional labels
    const edgePattern = /([\w-]+)\s*(-->|---|\.->|==>|~~~|<-->)\s*(?:\|"([^"]+)"\||"([^"]+)")?\s*([\w-]+)/g;
    let match;

    while ((match = edgePattern.exec(line)) !== null) {
      const [, src, arrow, labelPipe, labelQuote, dst] = match;
      const label = labelPipe || labelQuote;

      const edgeType = this.getEdgeType(arrow);
      const bidirectional = arrow === '<-->';

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

  private parseNode(line: string): void {
    // Try to match different node patterns
    const patterns = [
      // Triple parentheses (must come before double)
      { regex: /([\w-]+)\(\(\(([^)]+)\)\)\)/, shape: 'double_circle' as NodeShape },
      // Double braces
      { regex: /([\w-]+)\{\{([^}]+)\}\}/, shape: 'hexagon' as NodeShape },
      // Double brackets
      { regex: /([\w-]+)\[\[([^\]]+)\]\]/, shape: 'subroutine' as NodeShape },
      // Double parentheses
      { regex: /([\w-]+)\(\(([^)]+)\)\)/, shape: 'circle' as NodeShape },
      // Stadium
      { regex: /([\w-]+)\(\[([^\]]+)\]\)/, shape: 'stadium' as NodeShape },
      // Database
      { regex: /([\w-]+)\[\(([^)]+)\)\]/, shape: 'database' as NodeShape },
      // Trapezoid variations
      { regex: /([\w-]+)\[\\([^/]+)\/\]/, shape: 'trapezoid_alt' as NodeShape },
      { regex: /([\w-]+)\[\/([^\\]+)\\\]/, shape: 'trapezoid' as NodeShape },
      // Parallelogram variations
      { regex: /([\w-]+)\[\\([^\\]+)\\\]/, shape: 'parallelogram_alt' as NodeShape },
      { regex: /([\w-]+)\[\/([^\/]+)\/\]/, shape: 'parallelogram' as NodeShape },
      // Asymmetric
      { regex: /([\w-]+)>([^\]]+)\]/, shape: 'asymmetric' as NodeShape },
      // Diamond
      { regex: /([\w-]+)\{([^}]+)\}/, shape: 'diamond' as NodeShape },
      // Round
      { regex: /([\w-]+)\(([^)]+)\)/, shape: 'round' as NodeShape },
      // Rectangle (basic)
      { regex: /([\w-]+)\[([^\]]+)\]/, shape: 'rectangle' as NodeShape },
    ];

    for (const { regex, shape } of patterns) {
      const match = line.match(regex);
      if (match) {
        const [, id, label] = match;
        if (!this.nodes.has(id)) {
          this.nodes.set(id, {
            id,
            label: label.replace(/<br\/?>/g, '\n').trim(),
            shape,
            subgraph: this.currentSubgraph || undefined,
          });
        }
        return;
      }
    }
  }

  private createDefaultNode(id: string): ParsedNode {
    return {
      id,
      label: id,
      shape: 'rectangle',
      subgraph: this.currentSubgraph || undefined,
    };
  }

  private getEdgeType(arrow: string): EdgeType {
    switch (arrow) {
      case '-->': return 'solid';
      case '---': return 'open';
      case '.->': return 'dotted';
      case '==>': return 'thick';
      case '~~~': return 'invisible';
      default: return 'solid';
    }
  }

  private sanitizeId(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
}
