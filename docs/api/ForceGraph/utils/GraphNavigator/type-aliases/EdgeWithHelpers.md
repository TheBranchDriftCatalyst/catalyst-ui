[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/GraphNavigator](../README.md) / EdgeWithHelpers

# Type Alias: EdgeWithHelpers

> **EdgeWithHelpers** = [`EdgeData`](../../../types/interfaces/EdgeData.md) & `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/GraphNavigator.ts:47](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/GraphNavigator.ts#L47)

Edge with direct source/target references

Extends base EdgeData with convenience references to connected nodes.

## Type Declaration

### source

> **source**: [`NodeWithHelpers`](NodeWithHelpers.md)

Source node (instead of just src ID)

### target

> **target**: [`NodeWithHelpers`](NodeWithHelpers.md)

Target node (instead of just dst ID)

### get()

> **get**: (`path`) => `any`

Safely access nested properties

#### Parameters

##### path

`string`

#### Returns

`any`
