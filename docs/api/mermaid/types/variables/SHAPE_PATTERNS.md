[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/types](../README.md) / SHAPE_PATTERNS

# Variable: SHAPE_PATTERNS

> `const` **SHAPE_PATTERNS**: `Record`\<[`NodeShape`](../type-aliases/NodeShape.md), \{ `open`: `string`; `close`: `string`; \}\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:356](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L356)

Shape pattern definitions for regex matching

Maps each node shape to its opening and closing delimiters in Mermaid syntax.
Used internally by the parser to identify and extract node shapes.

## Example

```typescript
const pattern = SHAPE_PATTERNS["circle"]; // { open: '((', close: '))' }
const regex = new RegExp(`${pattern.open}(.+?)${pattern.close}`);
```
