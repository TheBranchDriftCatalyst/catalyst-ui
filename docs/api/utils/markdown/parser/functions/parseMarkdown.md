[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [utils/markdown/parser](../README.md) / parseMarkdown

# Function: parseMarkdown()

> **parseMarkdown**(`markdown`): `Root`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/parser.ts:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/parser.ts#L18)

Parse markdown string into Abstract Syntax Tree (AST)

## Parameters

### markdown

`string`

Raw markdown string

## Returns

`Root`

Parsed AST tree

## Example

```ts
const ast = parseMarkdown("# Hello\n\nWorld");
// Returns: { type: 'root', children: [...] }
```
