[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/annotation/ComponentInspector](../README.md) / ComponentInfo

# Interface: ComponentInfo

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:10](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L10)

Component information extracted from React Fiber

## Properties

### name

> **name**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L11)

---

### type

> **type**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L12)

---

### props

> **props**: `Record`\<`string`, `any`\>

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L13)

---

### state?

> `optional` **state**: `any`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L14)

---

### filePath?

> `optional` **filePath**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L15)

---

### lineNumber?

> `optional` **lineNumber**: `number`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L16)

---

### instanceId?

> `optional` **instanceId**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L18)

Unique instance identifier (Fiber path + props hash)

---

### treePath?

> `optional` **treePath**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:20](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L20)

Human-readable tree path (e.g., "App > Layout > Button")
