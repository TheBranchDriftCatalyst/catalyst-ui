[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/ForceGraph/ReactD3Node](../README.md) / ReactD3NodeProps

# Interface: ReactD3NodeProps

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:8](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L8)

## Properties

### data

> **data**: [`NodeData`](../../../../ForceGraph/types/interfaces/NodeData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L9)

---

### isSelected?

> `optional` **isSelected**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:10](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L10)

---

### isHovered?

> `optional` **isHovered**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L11)

---

### zoom?

> `optional` **zoom**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L12)

---

### isDimmed?

> `optional` **isDimmed**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L13)

---

### showLogo?

> `optional` **showLogo**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L14)

---

### customRenderer?

> `optional` **customRenderer**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L15)

---

### getNodeDimensionsFn()?

> `optional` **getNodeDimensionsFn**: (`node`) => `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L16)

#### Parameters

##### node

[`NodeData`](../../../../ForceGraph/types/interfaces/NodeData.md)

#### Returns

`object`

##### width

> **width**: `number`

##### height

> **height**: `number`

---

### onMouseEnter()?

> `optional` **onMouseEnter**: () => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L17)

#### Returns

`void`

---

### onMouseLeave()?

> `optional` **onMouseLeave**: () => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L18)

#### Returns

`void`

---

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L19)

#### Returns

`void`

---

### onDoubleClick()?

> `optional` **onDoubleClick**: () => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:20](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L20)

#### Returns

`void`

---

### onDragStart()?

> `optional` **onDragStart**: (`event`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L21)

#### Parameters

##### event

`any`

#### Returns

`void`

---

### onDrag()?

> `optional` **onDrag**: (`event`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L22)

#### Parameters

##### event

`any`

#### Returns

`void`

---

### onDragEnd()?

> `optional` **onDragEnd**: (`event`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/ReactD3Node.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/ReactD3Node.tsx#L23)

#### Parameters

##### event

`any`

#### Returns

`void`
