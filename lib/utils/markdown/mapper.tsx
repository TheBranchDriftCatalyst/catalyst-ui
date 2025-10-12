/**
 * @module markdown/mapper
 * @description Transforms markdown Abstract Syntax Trees (AST) into React components.
 *
 * This module maps mdast nodes to styled React components using catalyst-ui's design system.
 * It completes the markdown → React transformation pipeline started by the parser.
 *
 * **Architecture:**
 * - Each markdown node type has a dedicated renderer component
 * - Renderers use catalyst-ui components (Typography, Table, Card, CodeBlock)
 * - Custom component mappings can override defaults via `componentMap` parameter
 * - Inline elements (bold, italic, links) handled by `renderChildren()`
 *
 * @example Basic usage
 * ```tsx
 * import { parseMarkdown } from '@/catalyst-ui/utils/markdown/parser';
 * import { renderMarkdown } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * function MarkdownViewer({ content }: { content: string }) {
 *   const ast = parseMarkdown(content);
 *   const reactElements = renderMarkdown(ast);
 *   return <div>{reactElements}</div>;
 * }
 * ```
 *
 * @example Custom component mapping
 * ```tsx
 * import { renderMarkdown, MARKDOWN_COMPONENT_MAP } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * // Override heading renderer
 * const customMap = {
 *   ...MARKDOWN_COMPONENT_MAP,
 *   heading: ({ node }: { node: Heading }) => (
 *     <h1 className="my-custom-heading">{node.children}</h1>
 *   ),
 * };
 *
 * const elements = renderMarkdown(ast, customMap);
 * ```
 *
 * @see {@link parser.ts} for parsing markdown to AST
 */

import React from "react";
import type {
  Content,
  Root,
  Code,
  Table,
  Heading,
  Paragraph,
  List,
  Blockquote,
  Link,
  Image,
} from "mdast";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import { Typography } from "@/catalyst-ui/ui/typography";
import {
  Table as TableComponent,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/catalyst-ui/ui/table";
import { Card, CardContent } from "@/catalyst-ui/ui/card";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("MarkdownMapper");

/**
 * Component renderers for each markdown node type.
 *
 * These renderers transform mdast nodes into styled React components using
 * catalyst-ui's design system. Each renderer receives a node and index prop.
 */

/**
 * Renders fenced code blocks with syntax highlighting.
 *
 * Transforms mdast `code` nodes into {@link CodeBlock} components with language
 * detection and optional file name display.
 *
 * @param props - Renderer props
 * @param props.node - mdast Code node with language and value
 * @param props.index - Node index for React key
 *
 * @example Markdown input
 * ```markdown
 * ```typescript
 * const hello = "world";
 * ```
 * ```
 *
 * @example With filename (meta)
 * ```markdown
 * ```typescript:src/hello.ts
 * export const hello = "world";
 * ```
 * ```
 *
 * @see {@link CodeBlock} for the underlying component
 */
const CodeRenderer: React.FC<{ node: Code; index: number }> = ({ node, index }) => {
  return (
    <CodeBlock
      key={index}
      code={node.value}
      language={node.lang || "text"}
      fileName={node.meta || undefined}
      useCardContext={false}
    />
  );
};

/**
 * Renders markdown tables with proper formatting.
 *
 * Transforms mdast `table` nodes into catalyst-ui Table components with
 * headers and data rows. Extracts text from table cells recursively.
 *
 * @param props - Renderer props
 * @param props.node - mdast Table node with rows and cells
 * @param props.index - Node index for React key
 *
 * @example Markdown input
 * ```markdown
 * | Name | Age | City |
 * |------|-----|------|
 * | John | 30  | NYC  |
 * | Jane | 25  | LA   |
 * ```
 *
 * @see {@link Table} from catalyst-ui/ui/table
 */
const TableRenderer: React.FC<{ node: Table; index: number }> = ({ node, index }) => {
  const headers =
    node.children[0]?.children.map(cell =>
      cell.children.map(c => ("value" in c ? c.value : "")).join("")
    ) || [];

  const rows = node.children
    .slice(1)
    .map(row =>
      row.children.map(cell => cell.children.map(c => ("value" in c ? c.value : "")).join(""))
    );

  return (
    <div key={index} className="my-4 rounded-md border overflow-hidden">
      <TableComponent>
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <TableCell key={cellIdx}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    </div>
  );
};

/**
 * Renders markdown headings (h1-h6).
 *
 * Maps heading depth (1-6) to Typography variants. Headings 1-4 use h1-h4,
 * while h5-h6 fall back to paragraph styling.
 *
 * @param props - Renderer props
 * @param props.node - mdast Heading node with depth (1-6) and children
 * @param props.index - Node index for React key
 *
 * @example Markdown input
 * ```markdown
 * # H1 Title
 * ## H2 Subtitle
 * ### H3 Section
 * ```
 *
 * @see {@link Typography} from catalyst-ui/ui/typography
 */
const HeadingRenderer: React.FC<{ node: Heading; index: number }> = ({ node, index }) => {
  const content = renderChildren(node.children);
  const variants = ["h1", "h2", "h3", "h4", "p", "p"] as const;
  const variant = variants[node.depth - 1] || "p";

  return (
    <Typography key={index} variant={variant} className="mt-6 mb-2">
      {content}
    </Typography>
  );
};

/**
 * Renders markdown paragraphs.
 *
 * Transforms mdast `paragraph` nodes into Typography components with
 * proper spacing and inline element support.
 *
 * @param props - Renderer props
 * @param props.node - mdast Paragraph node with children
 * @param props.index - Node index for React key
 *
 * @example Markdown input
 * ```markdown
 * This is a paragraph with **bold** and *italic* text.
 * ```
 *
 * @see {@link renderChildren} for inline element handling
 */
const ParagraphRenderer: React.FC<{ node: Paragraph; index: number }> = ({ node, index }) => {
  const content = renderChildren(node.children);
  return (
    <Typography key={index} variant="p" className="my-2">
      {content}
    </Typography>
  );
};

/**
 * Renders ordered and unordered lists.
 *
 * Transforms mdast `list` nodes into `<ol>` or `<ul>` elements with
 * styled list items. Supports nested lists via recursive rendering.
 *
 * @param props - Renderer props
 * @param props.node - mdast List node with ordered flag and children
 * @param props.index - Node index for React key
 *
 * @example Markdown input (unordered)
 * ```markdown
 * - Item 1
 * - Item 2
 *   - Nested item
 * - Item 3
 * ```
 *
 * @example Markdown input (ordered)
 * ```markdown
 * 1. First
 * 2. Second
 * 3. Third
 * ```
 */
const ListRenderer: React.FC<{ node: List; index: number }> = ({ node, index }) => {
  const Tag = node.ordered ? "ol" : "ul";

  return (
    <Tag key={index} className="my-4 ml-6 list-disc space-y-2">
      {node.children.map((item, i) => (
        <li key={i} className="text-foreground">
          {renderChildren(item.children as Content[])}
        </li>
      ))}
    </Tag>
  );
};

/**
 * Renders blockquotes with visual styling.
 *
 * Transforms mdast `blockquote` nodes into Card components with
 * a primary-colored left border and muted italic text.
 *
 * @param props - Renderer props
 * @param props.node - mdast Blockquote node with children
 * @param props.index - Node index for React key
 *
 * @example Markdown input
 * ```markdown
 * > This is a quote
 * > spanning multiple lines.
 * >
 * > - With a list item
 * ```
 *
 * @see {@link Card} from catalyst-ui/ui/card
 */
const BlockquoteRenderer: React.FC<{ node: Blockquote; index: number }> = ({ node, index }) => {
  const content = renderChildren(node.children);

  return (
    <Card key={index} className="my-4 border-l-4 border-primary">
      <CardContent className="pt-6">
        <div className="text-muted-foreground italic">{content}</div>
      </CardContent>
    </Card>
  );
};

/**
 * Renders inline links with proper attributes.
 *
 * Transforms mdast `link` nodes into `<a>` elements with:
 * - External links open in new tab (target="_blank")
 * - Security attributes (rel="noopener noreferrer")
 * - Primary color styling
 *
 * @param props - Renderer props
 * @param props.node - mdast Link node with url and optional title
 * @param props.children - Link text content
 *
 * @example Markdown input
 * ```markdown
 * [Click here](https://example.com "Optional title")
 * [Internal](/docs)
 * ```
 */
const LinkRenderer: React.FC<{ node: Link; children: React.ReactNode }> = ({ node, children }) => {
  return (
    <a
      href={node.url}
      title={node.title || undefined}
      className="text-primary hover:underline transition-all"
      target={node.url.startsWith("http") ? "_blank" : undefined}
      rel={node.url.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

/**
 * Renders images with responsive sizing and rounded corners.
 *
 * Transforms mdast `image` nodes into styled `<img>` elements with:
 * - Responsive max-width
 * - Automatic height adjustment
 * - Rounded corners
 *
 * @param props - Renderer props
 * @param props.node - mdast Image node with url, alt text, and optional title
 * @param props.index - Node index for React key
 *
 * @example Markdown input
 * ```markdown
 * ![Alt text](https://example.com/image.png "Optional title")
 * ```
 */
const ImageRenderer: React.FC<{ node: Image; index: number }> = ({ node, index }) => {
  return (
    <img
      key={index}
      src={node.url}
      alt={node.alt || ""}
      title={node.title || undefined}
      className="my-4 rounded-lg max-w-full h-auto"
    />
  );
};

/**
 * Central mapping configuration: markdown node type → React component.
 *
 * This map defines the default renderers for each mdast node type. Custom
 * renderers can be provided via the `componentMap` parameter in {@link renderMarkdown}.
 *
 * **Supported node types:**
 * - `code` - Fenced code blocks → {@link CodeBlock}
 * - `table` - Tables → {@link Table}
 * - `heading` - Headings (h1-h6) → {@link Typography}
 * - `paragraph` - Paragraphs → {@link Typography}
 * - `list` - Ordered/unordered lists → `<ol>` or `<ul>`
 * - `blockquote` - Blockquotes → {@link Card}
 * - `image` - Images → `<img>`
 *
 * **Inline elements** (handled by {@link renderChildren}):
 * - `text` - Plain text
 * - `strong` - Bold text → `<strong>`
 * - `emphasis` - Italic text → `<em>`
 * - `inlineCode` - Inline code → `<code>`
 * - `link` - Links → `<a>`
 * - `break` - Line breaks → `<br>`
 *
 * @example Custom renderer
 * ```tsx
 * import { MARKDOWN_COMPONENT_MAP } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * const customMap = {
 *   ...MARKDOWN_COMPONENT_MAP,
 *   heading: ({ node }) => <h1 className="custom-heading">...</h1>
 * };
 * ```
 */
export const MARKDOWN_COMPONENT_MAP = {
  code: CodeRenderer,
  table: TableRenderer,
  heading: HeadingRenderer,
  paragraph: ParagraphRenderer,
  list: ListRenderer,
  blockquote: BlockquoteRenderer,
  image: ImageRenderer,
} as const;

/**
 * Recursively render child nodes (handles inline elements).
 *
 * This function processes inline markdown elements like bold, italic, links,
 * inline code, etc. It's called by block-level renderers to handle text content.
 *
 * **Supported inline types:**
 * - `text` - Plain text nodes
 * - `strong` - Bold text (`**text**`) → `<strong>`
 * - `emphasis` - Italic text (`*text*`) → `<em>`
 * - `inlineCode` - Inline code (`` `code` ``) → `<code>`
 * - `link` - Links (`[text](url)`) → {@link LinkRenderer}
 * - `break` - Line breaks → `<br>`
 *
 * @param children - Array of mdast Content nodes to render
 * @returns Rendered React nodes (text, elements, or fragments)
 *
 * @example Usage in paragraph
 * ```tsx
 * const ParagraphRenderer = ({ node }) => {
 *   const content = renderChildren(node.children);
 *   return <p>{content}</p>;
 * };
 * ```
 *
 * @example Handling nested inline elements
 * ```markdown
 * This is **bold with *italic* inside** text.
 * // Produces: <strong>bold with <em>italic</em> inside</strong>
 * ```
 */
function renderChildren(children: Content[]): React.ReactNode {
  return children.map((child, i) => {
    if (child.type === "text") {
      return child.value;
    }

    if (child.type === "strong") {
      return <strong key={i}>{renderChildren(child.children)}</strong>;
    }

    if (child.type === "emphasis") {
      return <em key={i}>{renderChildren(child.children)}</em>;
    }

    if (child.type === "inlineCode") {
      return (
        <code key={i} className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">
          {child.value}
        </code>
      );
    }

    if (child.type === "link") {
      return (
        <LinkRenderer key={i} node={child}>
          {renderChildren(child.children)}
        </LinkRenderer>
      );
    }

    if (child.type === "break") {
      return <br key={i} />;
    }

    // Recursively handle other types
    if ("children" in child) {
      return renderChildren(child.children as Content[]);
    }

    return null;
  });
}

/**
 * Main renderer: Transform markdown AST into React components.
 *
 * This is the primary entry point for rendering markdown. It maps mdast nodes
 * to React components using {@link MARKDOWN_COMPONENT_MAP} and allows custom
 * renderer overrides.
 *
 * **Rendering pipeline:**
 * 1. Iterate through AST children (block-level nodes)
 * 2. Look up renderer for each node type
 * 3. Instantiate renderer component with node and index
 * 4. Inline elements handled by {@link renderChildren}
 * 5. Unhandled types logged as warnings
 *
 * @param ast - Markdown Abstract Syntax Tree from {@link parseMarkdown}
 * @param componentMap - Optional custom component mappings to override defaults
 * @returns React fragment containing all rendered elements
 *
 * @example Basic usage
 * ```tsx
 * import { parseMarkdown } from '@/catalyst-ui/utils/markdown/parser';
 * import { renderMarkdown } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * function MarkdownViewer({ content }: { content: string }) {
 *   const ast = parseMarkdown(content);
 *   const elements = renderMarkdown(ast);
 *   return <div className="markdown-content">{elements}</div>;
 * }
 * ```
 *
 * @example Custom renderer override
 * ```tsx
 * import { renderMarkdown, MARKDOWN_COMPONENT_MAP } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * const customMap = {
 *   code: ({ node }) => (
 *     <pre className="custom-code">
 *       <code>{node.value}</code>
 *     </pre>
 *   ),
 * };
 *
 * const elements = renderMarkdown(ast, customMap);
 * ```
 *
 * @example Complete transformation
 * ```tsx
 * import { parseMarkdown } from '@/catalyst-ui/utils/markdown/parser';
 * import { renderMarkdown } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * const markdown = `
 * # Hello World
 *
 * This is **bold** and *italic* text with \`code\`.
 *
 * - List item 1
 * - List item 2
 * `;
 *
 * const ast = parseMarkdown(markdown);
 * const reactElement = renderMarkdown(ast);
 * // Returns: <>{heading}{paragraph}{list}</>
 * ```
 *
 * @see {@link parseMarkdown} to generate the AST
 * @see {@link MARKDOWN_COMPONENT_MAP} for default renderers
 */
export function renderMarkdown(
  ast: Root,
  componentMap: Partial<typeof MARKDOWN_COMPONENT_MAP> = {}
): React.ReactElement {
  const map = { ...MARKDOWN_COMPONENT_MAP, ...componentMap };

  const elements = ast.children.map((node, index) => {
    const nodeType = node.type as keyof typeof map;
    const renderer = map[nodeType];

    if (renderer) {
      // Type assertion needed due to union types in renderer map
      return React.createElement(renderer as React.ComponentType<any>, { node, index });
    }

    // Fallback for unhandled types
    log.warn(`Unhandled markdown node type: ${node.type}`);
    return null;
  });

  return <>{elements}</>;
}
