import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

/**
 * Parse markdown string into Abstract Syntax Tree (AST)
 *
 * @param markdown - Raw markdown string
 * @returns Parsed AST tree
 *
 * @example
 * ```ts
 * const ast = parseMarkdown('# Hello\n\nWorld');
 * // Returns: { type: 'root', children: [...] }
 * ```
 */
export function parseMarkdown(markdown: string): Root {
  const processor = unified()
    .use(remarkParse) // Parse markdown to AST
    .use(remarkGfm); // Add GitHub Flavored Markdown support

  const ast = processor.parse(markdown);
  return ast as Root;
}
