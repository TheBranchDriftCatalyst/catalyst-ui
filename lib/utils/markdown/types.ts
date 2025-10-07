import type {
  Root,
  Content,
  Code,
  Table,
  Heading,
  Paragraph,
  List,
  Blockquote,
  Link,
  Image,
  Strong,
  Emphasis,
  InlineCode,
  Break,
} from "mdast";

// Re-export mdast types for convenience
export type {
  Root,
  Content,
  Code,
  Table,
  Heading,
  Paragraph,
  List,
  Blockquote,
  Link,
  Image,
  Strong,
  Emphasis,
  InlineCode,
  Break,
};

/**
 * Extracted markdown section with heading and content
 */
export interface MarkdownSection {
  heading: string;
  level: number;
  content: Content[];
}

/**
 * Extracted code block with metadata
 */
export interface ExtractedCodeBlock {
  language: string | null;
  value: string;
  meta?: string | null;
}

/**
 * Extracted table structure
 */
export interface ExtractedTable {
  headers: string[];
  rows: string[][];
  align: ("left" | "right" | "center" | null)[];
}

/**
 * Repository metadata from catalyst_repo.yaml (future use)
 */
export interface CatalystRepoMetadata {
  name: string;
  description: string;
  repo_url: string;
  private?: boolean;
  status: "active" | "archived" | "wip" | "experimental";
  tech_stack: {
    languages: string[];
    frameworks?: string[];
    tools?: string[];
  };
  groups?: string[];
  badges?: {
    stars?: boolean;
    issues?: boolean;
    prs?: boolean;
    license?: boolean;
  };
  highlights?: string[];
}
