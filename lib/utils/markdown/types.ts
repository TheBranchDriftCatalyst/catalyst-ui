/**
 * @module markdown/types
 * @description Type definitions for the markdown parsing and rendering system.
 *
 * This module re-exports mdast types and defines custom types for markdown
 * processing utilities. It provides TypeScript type safety for the entire
 * markdown → React transformation pipeline.
 *
 * **Type categories:**
 * - **mdast types** - Standard markdown AST node types (re-exported from mdast)
 * - **Extraction types** - Structured data extracted from markdown (sections, tables, code blocks)
 * - **Metadata types** - Repository and project metadata (for catalyst_repo.yaml)
 *
 * @example Using mdast types
 * ```ts
 * import type { Root, Heading, Paragraph } from '@/catalyst-ui/utils/markdown/types';
 *
 * function processHeading(heading: Heading) {
 *   console.log(heading.depth);    // 1-6
 *   console.log(heading.children);  // Array of inline nodes
 * }
 * ```
 *
 * @example Using extraction types
 * ```ts
 * import type { MarkdownSection, ExtractedCodeBlock } from '@/catalyst-ui/utils/markdown/types';
 *
 * const section: MarkdownSection = {
 *   heading: "Installation",
 *   level: 2,
 *   content: [] // Array of mdast nodes
 * };
 * ```
 *
 * @see {@link https://github.com/syntax-tree/mdast|mdast specification}
 */

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

/**
 * Re-exported mdast types for markdown Abstract Syntax Tree nodes.
 *
 * These types represent the structure of parsed markdown documents following
 * the mdast specification. They are used throughout the parser and mapper modules.
 *
 * **Block-level nodes:**
 * - {@link Root} - Document root containing all top-level nodes
 * - {@link Heading} - Heading (h1-h6) with depth and children
 * - {@link Paragraph} - Paragraph with inline children
 * - {@link Code} - Fenced code block with language and value
 * - {@link Table} - Table with rows and cells
 * - {@link List} - Ordered or unordered list
 * - {@link Blockquote} - Blockquote with nested content
 *
 * **Inline nodes:**
 * - {@link Link} - Link with URL and children
 * - {@link Image} - Image with URL and alt text
 * - {@link Strong} - Bold text (** or __)
 * - {@link Emphasis} - Italic text (* or _)
 * - {@link InlineCode} - Inline code (`)
 * - {@link Break} - Hard line break
 *
 * **Base types:**
 * - {@link Content} - Union of all possible mdast node types
 *
 * @see {@link https://github.com/syntax-tree/mdast#nodes|mdast node types}
 */
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
 * Represents an extracted markdown section with heading and content.
 *
 * Used for parsing documents into logical sections based on heading structure.
 * Useful for table of contents generation, section navigation, or content chunking.
 *
 * @property heading - Plain text heading content (without markdown formatting)
 * @property level - Heading level (1-6 corresponding to h1-h6)
 * @property content - Array of mdast nodes contained in this section
 *
 * @example
 * ```ts
 * const section: MarkdownSection = {
 *   heading: "Getting Started",
 *   level: 2,
 *   content: [
 *     { type: 'paragraph', children: [{ type: 'text', value: 'Welcome...' }] },
 *     { type: 'code', lang: 'bash', value: 'npm install' }
 *   ]
 * };
 * ```
 *
 * @example Extracting sections from document
 * ```ts
 * function extractSections(ast: Root): MarkdownSection[] {
 *   const sections: MarkdownSection[] = [];
 *   let currentSection: MarkdownSection | null = null;
 *
 *   for (const node of ast.children) {
 *     if (node.type === 'heading') {
 *       if (currentSection) sections.push(currentSection);
 *       currentSection = {
 *         heading: getHeadingText(node),
 *         level: node.depth,
 *         content: []
 *       };
 *     } else if (currentSection) {
 *       currentSection.content.push(node);
 *     }
 *   }
 *
 *   if (currentSection) sections.push(currentSection);
 *   return sections;
 * }
 * ```
 */
export interface MarkdownSection {
  heading: string;
  level: number;
  content: Content[];
}

/**
 * Represents an extracted code block with language and metadata.
 *
 * Simplified structure for working with code blocks parsed from markdown.
 * The `meta` field can contain additional information like file names or highlighting hints.
 *
 * @property language - Programming language identifier (e.g., "typescript", "bash") or null
 * @property value - Raw code content
 * @property meta - Optional metadata string (often used for file names or line numbers)
 *
 * @example Basic code block
 * ```ts
 * const codeBlock: ExtractedCodeBlock = {
 *   language: "typescript",
 *   value: "const hello = 'world';",
 *   meta: null
 * };
 * ```
 *
 * @example With filename in meta
 * ```ts
 * // From markdown: ```typescript:src/hello.ts
 * const codeBlock: ExtractedCodeBlock = {
 *   language: "typescript",
 *   value: "export const hello = 'world';",
 *   meta: "src/hello.ts"
 * };
 * ```
 *
 * @example Extracting from mdast Code node
 * ```ts
 * function extractCodeBlock(node: Code): ExtractedCodeBlock {
 *   return {
 *     language: node.lang,
 *     value: node.value,
 *     meta: node.meta
 *   };
 * }
 * ```
 */
export interface ExtractedCodeBlock {
  language: string | null;
  value: string;
  meta?: string | null;
}

/**
 * Represents an extracted table with structured data.
 *
 * Simplified structure for working with markdown tables. Provides easy access
 * to headers, rows, and column alignment information.
 *
 * @property headers - Array of header cell values
 * @property rows - 2D array of cell values (rows × columns)
 * @property align - Column alignment hints (left, right, center, or null for default)
 *
 * @example Basic table
 * ```ts
 * const table: ExtractedTable = {
 *   headers: ["Name", "Age", "City"],
 *   rows: [
 *     ["John", "30", "NYC"],
 *     ["Jane", "25", "LA"]
 *   ],
 *   align: ["left", "right", "left"]
 * };
 * ```
 *
 * @example From markdown
 * ```markdown
 * | Name | Age | City |
 * |:-----|----:|------|
 * | John | 30  | NYC  |
 * | Jane | 25  | LA   |
 * ```
 *
 * @example Extracting from mdast Table node
 * ```ts
 * function extractTable(node: Table): ExtractedTable {
 *   const headers = node.children[0].children.map(cell =>
 *     cell.children.map(c => 'value' in c ? c.value : '').join('')
 *   );
 *
 *   const rows = node.children.slice(1).map(row =>
 *     row.children.map(cell =>
 *       cell.children.map(c => 'value' in c ? c.value : '').join('')
 *     )
 *   );
 *
 *   const align = node.align || [];
 *
 *   return { headers, rows, align };
 * }
 * ```
 *
 * @example Rendering with React
 * ```tsx
 * function TableRenderer({ table }: { table: ExtractedTable }) {
 *   return (
 *     <table>
 *       <thead>
 *         <tr>
 *           {table.headers.map((header, i) => (
 *             <th key={i} style={{ textAlign: table.align[i] || 'left' }}>
 *               {header}
 *             </th>
 *           ))}
 *         </tr>
 *       </thead>
 *       <tbody>
 *         {table.rows.map((row, i) => (
 *           <tr key={i}>
 *             {row.map((cell, j) => (
 *               <td key={j} style={{ textAlign: table.align[j] || 'left' }}>
 *                 {cell}
 *               </td>
 *             ))}
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *   );
 * }
 * ```
 */
export interface ExtractedTable {
  headers: string[];
  rows: string[][];
  align: ("left" | "right" | "center" | null)[];
}

/**
 * Repository metadata from catalyst_repo.yaml files.
 *
 * This type represents the standardized metadata structure used across
 * catalyst-devspace projects. It's designed to support automated documentation
 * generation, GitHub profile pages, and resume building.
 *
 * **Use cases:**
 * - GitHub profile page generation (@TheBranchDriftCatalyst)
 * - Automated documentation indexing
 * - Tech stack visualization
 * - Project status tracking
 * - Resume generation (future)
 *
 * @property name - Project name (e.g., "catalyst-ui")
 * @property description - Brief project description
 * @property repo_url - Full GitHub repository URL
 * @property private - Whether repository is private (optional)
 * @property status - Current project status
 * @property tech_stack - Technologies used in the project
 * @property tech_stack.languages - Programming languages (e.g., ["typescript", "python"])
 * @property tech_stack.frameworks - Frameworks used (e.g., ["react", "storybook"])
 * @property tech_stack.tools - Development tools (e.g., ["docker", "ansible"])
 * @property groups - Category groupings for organization (e.g., ["catalyst-core", "web-apps"])
 * @property badges - GitHub badge configuration
 * @property badges.stars - Show stars badge
 * @property badges.issues - Show issues badge
 * @property badges.prs - Show pull requests badge
 * @property badges.license - Show license badge
 * @property highlights - Key features or achievements to highlight
 *
 * @example Complete metadata
 * ```yaml
 * # catalyst_repo.yaml
 * version: "0.1.1"
 * name: "catalyst-ui"
 * description: "React component library with Storybook and Radix UI"
 * repo_url: "https://github.com/TheBranchDriftCatalyst/catalyst-ui"
 * status: "active"
 * tech_stack:
 *   languages:
 *     - "typescript"
 *     - "javascript"
 *   frameworks:
 *     - "react"
 *     - "storybook"
 *     - "vite"
 *   tools:
 *     - "eslint"
 *     - "prettier"
 * groups:
 *   - "catalyst-core"
 *   - "web-apps"
 * badges:
 *   stars: true
 *   issues: true
 *   prs: true
 *   license: true
 * highlights:
 *   - "50+ documented components with Storybook"
 *   - "Full TypeScript support with generated types"
 *   - "Radix UI primitives with Tailwind styling"
 * ```
 *
 * @example TypeScript usage
 * ```ts
 * import type { CatalystRepoMetadata } from '@/catalyst-ui/utils/markdown/types';
 *
 * const metadata: CatalystRepoMetadata = {
 *   name: "my-project",
 *   description: "A cool project",
 *   repo_url: "https://github.com/user/my-project",
 *   status: "active",
 *   tech_stack: {
 *     languages: ["typescript"],
 *     frameworks: ["react"]
 *   },
 *   highlights: ["Fast", "Type-safe"]
 * };
 * ```
 *
 * @example Parsing from YAML
 * ```ts
 * import yaml from 'yaml';
 * import fs from 'fs';
 *
 * const yamlContent = fs.readFileSync('catalyst_repo.yaml', 'utf-8');
 * const metadata: CatalystRepoMetadata = yaml.parse(yamlContent);
 *
 * console.log(metadata.status);      // "active"
 * console.log(metadata.tech_stack);  // { languages: [...], frameworks: [...] }
 * ```
 *
 * @see {@link https://github.com/TheBranchDriftCatalyst/@git-repo-template|Template repository}
 * @see {@link https://github.com/TheBranchDriftCatalyst/@TheBranchDriftCatalyst|Profile page generator}
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
