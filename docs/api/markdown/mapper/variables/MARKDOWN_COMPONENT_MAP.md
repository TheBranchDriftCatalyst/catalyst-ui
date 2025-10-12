[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/mapper](../README.md) / MARKDOWN_COMPONENT_MAP

# Variable: MARKDOWN_COMPONENT_MAP

> `const` **MARKDOWN_COMPONENT_MAP**: `object`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/mapper.tsx:395](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/mapper.tsx#L395)

Central mapping configuration: markdown node type → React component.

This map defines the default renderers for each mdast node type. Custom
renderers can be provided via the `componentMap` parameter in [renderMarkdown](../functions/renderMarkdown.md).

**Supported node types:**

- `code` - Fenced code blocks → [CodeBlock](../../../components/CodeBlock/CodeBlock/variables/CodeBlock.md)
- `table` - Tables → Table
- `heading` - Headings (h1-h6) → [Typography](../../../ui/typography/variables/ResponsiveTypography.md)
- `paragraph` - Paragraphs → [Typography](../../../ui/typography/variables/ResponsiveTypography.md)
- `list` - Ordered/unordered lists → `<ol>` or `<ul>`
- `blockquote` - Blockquotes → [Card](../../../ui/card/variables/Card.md)
- `image` - Images → `<img>`

**Inline elements** (handled by renderChildren):

- `text` - Plain text
- `strong` - Bold text → `<strong>`
- `emphasis` - Italic text → `<em>`
- `inlineCode` - Inline code → `<code>`
- `link` - Links → `<a>`
- `break` - Line breaks → `<br>`

## Type Declaration

### code

> `readonly` **code**: `FC`\<\{ `node`: `Code`; `index`: `number`; \}\> = `CodeRenderer`

### table

> `readonly` **table**: `FC`\<\{ `node`: `Table`; `index`: `number`; \}\> = `TableRenderer`

### heading

> `readonly` **heading**: `FC`\<\{ `node`: `Heading`; `index`: `number`; \}\> = `HeadingRenderer`

### paragraph

> `readonly` **paragraph**: `FC`\<\{ `node`: `Paragraph`; `index`: `number`; \}\> = `ParagraphRenderer`

### list

> `readonly` **list**: `FC`\<\{ `node`: `List`; `index`: `number`; \}\> = `ListRenderer`

### blockquote

> `readonly` **blockquote**: `FC`\<\{ `node`: `Blockquote`; `index`: `number`; \}\> = `BlockquoteRenderer`

### image

> `readonly` **image**: `FC`\<\{ `node`: `Image`; `index`: `number`; \}\> = `ImageRenderer`

## Example

```tsx
import { MARKDOWN_COMPONENT_MAP } from "@/catalyst-ui/utils/markdown/mapper";

const customMap = {
  ...MARKDOWN_COMPONENT_MAP,
  heading: ({ node }) => <h1 className="custom-heading">...</h1>,
};
```
