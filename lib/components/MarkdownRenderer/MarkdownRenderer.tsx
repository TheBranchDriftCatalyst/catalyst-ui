import React from "react";
import {
  parseMarkdown,
  renderMarkdown,
  MARKDOWN_COMPONENT_MAP,
} from "@/catalyst-ui/utils/markdown";

export interface MarkdownRendererProps {
  /** Raw markdown content */
  content: string;

  /** Override default component mappings */
  componentMap?: Partial<typeof MARKDOWN_COMPONENT_MAP>;

  /** Additional CSS classes */
  className?: string;
}

/**
 * MarkdownRenderer
 *
 * Parses markdown and renders it using themed React components
 *
 * @example
 * ```tsx
 * <MarkdownRenderer content="# Hello\n\nWorld" />
 * ```
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  componentMap,
  className,
}) => {
  const ast = React.useMemo(() => parseMarkdown(content), [content]);

  const rendered = React.useMemo(() => renderMarkdown(ast, componentMap), [ast, componentMap]);

  return <div className={className}>{rendered}</div>;
};
