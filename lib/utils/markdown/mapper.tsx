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

/**
 * Component renderers for each markdown node type
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

const ParagraphRenderer: React.FC<{ node: Paragraph; index: number }> = ({ node, index }) => {
  const content = renderChildren(node.children);
  return (
    <Typography key={index} variant="p" className="my-2">
      {content}
    </Typography>
  );
};

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
 * Central mapping configuration: markdown node type → React component
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
 * Render children nodes (handles inline elements)
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
 * Main renderer: AST → React components
 *
 * @param ast - Markdown Abstract Syntax Tree
 * @param componentMap - Optional custom component mappings to override defaults
 * @returns React elements
 */
export function renderMarkdown(
  ast: Root,
  componentMap: Partial<typeof MARKDOWN_COMPONENT_MAP> = {}
): React.ReactElement {
  const map = { ...MARKDOWN_COMPONENT_MAP, ...componentMap };

  const elements = ast.children.map((node, index) => {
    const renderer = map[node.type as keyof typeof map];

    if (renderer) {
      return React.createElement(renderer, { node: node as any, index });
    }

    // Fallback for unhandled types
    console.warn(`Unhandled markdown node type: ${node.type}`);
    return null;
  });

  return <>{elements}</>;
}
