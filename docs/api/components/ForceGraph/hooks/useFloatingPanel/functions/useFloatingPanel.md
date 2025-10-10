[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/hooks/useFloatingPanel](../README.md) / useFloatingPanel

# Function: useFloatingPanel()

> **useFloatingPanel**(`options`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/hooks/useFloatingPanel.ts:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/hooks/useFloatingPanel.ts#L30)

Combined hook for floating panels with drag, resize, and collapse functionality
Provides a unified interface for all floating panel behaviors

## Parameters

### options

[`UseFloatingPanelOptions`](../interfaces/UseFloatingPanelOptions.md) = `{}`

## Returns

`object`

### panelRef()

> **panelRef**: (`el`) => `void` = `mergedRef`

#### Parameters

##### el

`null` | `HTMLDivElement`

#### Returns

`void`

### dragHandleRef

> **dragHandleRef**: `undefined` \| `RefObject`\<`null` \| `HTMLDivElement`\>

### position

> **position**: [`Position`](../../useDraggable/interfaces/Position.md) = `draggable.position`

### resizeHandleRef

> **resizeHandleRef**: `undefined` \| `RefObject`\<`null` \| `HTMLDivElement`\>

### size

> **size**: [`Size`](../../useResizable/interfaces/Size.md) = `resizable.size`

### isCollapsed

> **isCollapsed**: `boolean`

### toggleCollapse()

> **toggleCollapse**: () => `void`

#### Returns

`void`

### setIsCollapsed()

> **setIsCollapsed**: (`value`) => `void`

#### Parameters

##### value

`boolean`

#### Returns

`void`

### style

> **style**: `object` = `combinedStyle`

#### style.position

> **position**: `"fixed"`

#### style.left

> **left**: `string`

#### style.top

> **top**: `string`

#### style.width?

> `optional` **width**: `string`

#### style.height?

> `optional` **height**: `string`

### isDraggable

> **isDraggable**: `boolean` = `enableDragging`

### isResizable

> **isResizable**: `boolean` = `enableResizing`

### isCollapsible

> **isCollapsible**: `boolean` = `enableCollapse`
