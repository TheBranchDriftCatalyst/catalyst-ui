/**
 * @module markdown/parser
 * @description Core markdown parsing utilities that convert markdown strings into
 * Abstract Syntax Trees (AST) using the unified/remark ecosystem.
 *
 * This module provides the foundation for the markdown → React transformation pipeline.
 * The parsed AST can be consumed by the mapper module to render React components.
 *
 * @example Basic usage
 * ```ts
 * import { parseMarkdown } from '@/catalyst-ui/utils/markdown/parser';
 *
 * const markdown = `
 * # Hello World
 *
 * This is a **bold** statement with \`code\`.
 * `;
 *
 * const ast = parseMarkdown(markdown);
 * // Use ast with renderMarkdown() from mapper.tsx
 * ```
 *
 * @see {@link mapper.tsx} for rendering AST to React components
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

/**
 * Parse a markdown string into an Abstract Syntax Tree (AST).
 *
 * Uses the unified/remark pipeline with GitHub Flavored Markdown (GFM) support.
 * The AST follows the mdast specification and can be used with {@link renderMarkdown}
 * to convert to React components.
 *
 * **Supported Markdown Features:**
 * - Standard markdown syntax (headings, paragraphs, lists, etc.)
 * - GitHub Flavored Markdown (GFM) extensions:
 *   - Tables
 *   - Task lists
 *   - Strikethrough
 *   - Autolinks
 *   - Footnotes
 *
 * **Pipeline stages:**
 * 1. `remarkParse` - Parse markdown text into AST
 * 2. `remarkGfm` - Add GFM syntax support
 *
 * @param markdown - Raw markdown string to parse
 * @returns Parsed AST tree conforming to mdast Root node specification
 *
 * @example Parse simple markdown
 * ```ts
 * const ast = parseMarkdown('# Hello\n\nWorld');
 * console.log(ast.type); // 'root'
 * console.log(ast.children.length); // 2 (heading + paragraph)
 * ```
 *
 * @example Parse GFM table
 * ```ts
 * const markdown = `
 * | Name | Age |
 * |------|-----|
 * | John | 30  |
 * `;
 * const ast = parseMarkdown(markdown);
 * // ast.children[0].type === 'table'
 * ```
 *
 * @example Full transformation pipeline
 * ```ts
 * import { parseMarkdown } from '@/catalyst-ui/utils/markdown/parser';
 * import { renderMarkdown } from '@/catalyst-ui/utils/markdown/mapper';
 *
 * const markdown = '# Title\n\nSome **bold** text.';
 * const ast = parseMarkdown(markdown);
 * const reactElement = renderMarkdown(ast);
 * ```
 *
 * @see {@link https://github.com/syntax-tree/mdast|mdast specification}
 * @see {@link https://github.com/remarkjs/remark-gfm|remark-gfm documentation}
 * @see {@link renderMarkdown} to convert AST to React components
 */
export function parseMarkdown(markdown: string): Root {
  const processor = unified()
    .use(remarkParse) // Parse markdown to AST
    .use(remarkGfm); // Add GitHub Flavored Markdown support

  const ast = processor.parse(markdown);
  return ast as Root;
}
