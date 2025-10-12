[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/flowchartToGraphConfig](../README.md) / ColorStrategy

# Type Alias: ColorStrategy

> **ColorStrategy** = `"subgraph"` \| `"shape"` \| `"auto"`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L82)

Color assignment strategy for nodes

Determines how nodes are grouped and colored:

- `subgraph`: Group by subgraph membership (nodes in same subgraph get same color)
- `shape`: Group by node shape (all circles same color, all rectangles same color, etc.)
- `auto`: Combine subgraph + shape (most fine-grained, each subgraph-shape combo gets unique color)

## Example

```typescript
// With subgraph strategy:
// Frontend subgraph: blue (UI, Router, State all blue)
// Backend subgraph: green (API, DB, Cache all green)

// With shape strategy:
// All rectangles: blue
// All circles: green
// All databases: yellow

// With auto strategy:
// Frontend rectangles: blue
// Frontend circles: light blue
// Backend rectangles: green
// Backend databases: yellow
```
