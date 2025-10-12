[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/MarkdownRenderer/MarkdownRenderer](../README.md) / MarkdownRendererProps

# Interface: MarkdownRendererProps

Defined in: [workspace/catalyst-ui/lib/components/MarkdownRenderer/MarkdownRenderer.tsx:8](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MarkdownRenderer/MarkdownRenderer.tsx#L8)

## Properties

### content

> **content**: `string`

Defined in: [workspace/catalyst-ui/lib/components/MarkdownRenderer/MarkdownRenderer.tsx:10](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MarkdownRenderer/MarkdownRenderer.tsx#L10)

Raw markdown content

---

### componentMap?

> `optional` **componentMap**: `Partial`\<\{ `code`: `FC`\<\{ `node`: `Code`; `index`: `number`; \}\>; `table`: `FC`\<\{ `node`: `Table`; `index`: `number`; \}\>; `heading`: `FC`\<\{ `node`: `Heading`; `index`: `number`; \}\>; `paragraph`: `FC`\<\{ `node`: `Paragraph`; `index`: `number`; \}\>; `list`: `FC`\<\{ `node`: `List`; `index`: `number`; \}\>; `blockquote`: `FC`\<\{ `node`: `Blockquote`; `index`: `number`; \}\>; `image`: `FC`\<\{ `node`: `Image`; `index`: `number`; \}\>; \}\>

Defined in: [workspace/catalyst-ui/lib/components/MarkdownRenderer/MarkdownRenderer.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MarkdownRenderer/MarkdownRenderer.tsx#L13)

Override default component mappings

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/components/MarkdownRenderer/MarkdownRenderer.tsx:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MarkdownRenderer/MarkdownRenderer.tsx#L16)

Additional CSS classes
