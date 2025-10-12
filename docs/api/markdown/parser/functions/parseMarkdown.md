[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/parser](../README.md) / parseMarkdown

# Function: parseMarkdown()

> **parseMarkdown**(`markdown`): `Root`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/parser.ts:86](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/parser.ts#L86)

Parse a markdown string into an Abstract Syntax Tree (AST).

Uses the unified/remark pipeline with GitHub Flavored Markdown (GFM) support.
The AST follows the mdast specification and can be used with renderMarkdown
to convert to React components.

**Supported Markdown Features:**

- Standard markdown syntax (headings, paragraphs, lists, etc.)
- GitHub Flavored Markdown (GFM) extensions:
  - Tables
  - Task lists
  - Strikethrough
  - Autolinks
  - Footnotes

**Pipeline stages:**

1. `remarkParse` - Parse markdown text into AST
2. `remarkGfm` - Add GFM syntax support

## Parameters

### markdown

`string`

Raw markdown string to parse

## Returns

`Root`

Parsed AST tree conforming to mdast Root node specification

## Examples

```ts
const ast = parseMarkdown("# Hello\n\nWorld");
console.log(ast.type); // 'root'
console.log(ast.children.length); // 2 (heading + paragraph)
```

```ts
const markdown = `
| Name | Age |
|------|-----|
| John | 30  |
`;
const ast = parseMarkdown(markdown);
// ast.children[0].type === 'table'
```

```ts
import { parseMarkdown } from "@/catalyst-ui/utils/markdown/parser";
import { renderMarkdown } from "@/catalyst-ui/utils/markdown/mapper";

const markdown = "# Title\n\nSome **bold** text.";
const ast = parseMarkdown(markdown);
const reactElement = renderMarkdown(ast);
```

## See

- [specification](https://github.com/syntax-tree/mdast|mdast)
- [documentation](https://github.com/remarkjs/remark-gfm|remark-gfm)
- renderMarkdown to convert AST to React components
