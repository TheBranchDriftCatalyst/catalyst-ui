[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / markdown/mapper

# markdown/mapper

## Description

Transforms markdown Abstract Syntax Trees (AST) into React components.

This module maps mdast nodes to styled React components using catalyst-ui's design system.
It completes the markdown → React transformation pipeline started by the parser.

**Architecture:**

- Each markdown node type has a dedicated renderer component
- Renderers use catalyst-ui components (Typography, Table, Card, CodeBlock)
- Custom component mappings can override defaults via `componentMap` parameter
- Inline elements (bold, italic, links) handled by `renderChildren()`

## Examples

```tsx
import { parseMarkdown } from "@/catalyst-ui/utils/markdown/parser";
import { renderMarkdown } from "@/catalyst-ui/utils/markdown/mapper";

function MarkdownViewer({ content }: { content: string }) {
  const ast = parseMarkdown(content);
  const reactElements = renderMarkdown(ast);
  return <div>{reactElements}</div>;
}
```

```tsx
import { renderMarkdown, MARKDOWN_COMPONENT_MAP } from "@/catalyst-ui/utils/markdown/mapper";

// Override heading renderer
const customMap = {
  ...MARKDOWN_COMPONENT_MAP,
  heading: ({ node }: { node: Heading }) => <h1 className="my-custom-heading">{node.children}</h1>,
};

const elements = renderMarkdown(ast, customMap);
```

## See

parser.ts for parsing markdown to AST

## Variables

- [MARKDOWN_COMPONENT_MAP](variables/MARKDOWN_COMPONENT_MAP.md)

## Functions

- [renderMarkdown](functions/renderMarkdown.md)
