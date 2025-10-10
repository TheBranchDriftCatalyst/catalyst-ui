[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [utils/markdown/mapper](../README.md) / MARKDOWN_COMPONENT_MAP

# Variable: MARKDOWN_COMPONENT_MAP

> `const` **MARKDOWN_COMPONENT_MAP**: `object`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/mapper.tsx:157](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/mapper.tsx#L157)

Central mapping configuration: markdown node type → React component

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
