[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/mapper](../README.md) / renderMarkdown

# Function: renderMarkdown()

> **renderMarkdown**(`ast`, `componentMap`): `ReactElement`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/mapper.tsx:546](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/mapper.tsx#L546)

Main renderer: Transform markdown AST into React components.

This is the primary entry point for rendering markdown. It maps mdast nodes
to React components using [MARKDOWN_COMPONENT_MAP](../variables/MARKDOWN_COMPONENT_MAP.md) and allows custom
renderer overrides.

**Rendering pipeline:**

1. Iterate through AST children (block-level nodes)
2. Look up renderer for each node type
3. Instantiate renderer component with node and index
4. Inline elements handled by renderChildren
5. Unhandled types logged as warnings

## Parameters

### ast

`Root`

Markdown Abstract Syntax Tree from parseMarkdown

### componentMap

`Partial`\<_typeof_ [`MARKDOWN_COMPONENT_MAP`](../variables/MARKDOWN_COMPONENT_MAP.md)\> = `{}`

Optional custom component mappings to override defaults

## Returns

`ReactElement`

React fragment containing all rendered elements

## Examples

```tsx
import { parseMarkdown } from "@/catalyst-ui/utils/markdown/parser";
import { renderMarkdown } from "@/catalyst-ui/utils/markdown/mapper";

function MarkdownViewer({ content }: { content: string }) {
  const ast = parseMarkdown(content);
  const elements = renderMarkdown(ast);
  return <div className="markdown-content">{elements}</div>;
}
```

```tsx
import { renderMarkdown, MARKDOWN_COMPONENT_MAP } from "@/catalyst-ui/utils/markdown/mapper";

const customMap = {
  code: ({ node }) => (
    <pre className="custom-code">
      <code>{node.value}</code>
    </pre>
  ),
};

const elements = renderMarkdown(ast, customMap);
```

```tsx
import { parseMarkdown } from "@/catalyst-ui/utils/markdown/parser";
import { renderMarkdown } from "@/catalyst-ui/utils/markdown/mapper";

const markdown = `
# Hello World

This is **bold** and *italic* text with \`code\`.

- List item 1
- List item 2
`;

const ast = parseMarkdown(markdown);
const reactElement = renderMarkdown(ast);
// Returns: <>{heading}{paragraph}{list}</>
```

## See

- parseMarkdown to generate the AST
- [MARKDOWN_COMPONENT_MAP](../variables/MARKDOWN_COMPONENT_MAP.md) for default renderers
