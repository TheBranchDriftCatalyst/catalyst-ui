[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/hooks/useNodePositions](../README.md) / useNodePositions

# Function: useNodePositions()

> **useNodePositions**(`storageKey?`, `layout?`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/hooks/useNodePositions.ts:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/hooks/useNodePositions.ts#L33)

Hook to persist and restore node positions per layout type

Positions are stored in localStorage with key: `${storageKey}.positions.${layout}`
This allows each layout type to maintain its own node arrangement

## Parameters

### storageKey?

`string`

Optional localStorage key prefix (from ForceGraph prop)

### layout?

[`LayoutKind`](../../../../../ForceGraph/utils/layouts/type-aliases/LayoutKind.md) = `"force"`

Current layout type (force, dagre, elk, etc.)

## Returns

Methods to load, save, apply, and clear node positions

### loadPositions()

> **loadPositions**: () => [`SavedPositions`](../type-aliases/SavedPositions.md)

Load saved positions from localStorage for current layout
Returns empty object if no positions saved or storage disabled

#### Returns

[`SavedPositions`](../type-aliases/SavedPositions.md)

### savePositions()

> **savePositions**: (`nodes`, `immediate`) => `void`

Save node positions to localStorage (debounced)
Only saves nodes that have been positioned (have x, y coordinates)

#### Parameters

##### nodes

[`NodeData`](../../../../../ForceGraph/types/interfaces/NodeData.md)[]

Array of nodes to save positions for

##### immediate

`boolean` = `false`

Skip debounce and save immediately

#### Returns

`void`

### applyPositions()

> **applyPositions**: (`nodes`) => `void`

Apply saved positions to a node array
Mutates the nodes in-place to restore their positions

#### Parameters

##### nodes

[`NodeData`](../../../../../ForceGraph/types/interfaces/NodeData.md)[]

Array of nodes to apply positions to

#### Returns

`void`

### clearPositions()

> **clearPositions**: () => `void`

Clear all saved positions for current layout
Useful for "reset layout" functionality

#### Returns

`void`

### clearAllPositions()

> **clearAllPositions**: () => `void`

Clear all saved positions for ALL layouts
Useful for complete reset

#### Returns

`void`
