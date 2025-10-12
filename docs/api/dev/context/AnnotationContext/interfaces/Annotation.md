[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/context/AnnotationContext](../README.md) / Annotation

# Interface: Annotation

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:7](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L7)

Annotation type - represents a user-created annotation

## Properties

### id

> **id**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L9)

Unique identifier (UUID)

---

### componentName

> **componentName**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L11)

Component name (user-typed, no React Fiber introspection)

---

### note

> **note**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L13)

Annotation note/content

---

### type

> **type**: `"todo"` \| `"bug"` \| `"note"` \| `"docs"`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L15)

Annotation type

---

### priority

> **priority**: `"low"` \| `"medium"` \| `"high"`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L17)

Priority level

---

### timestamp

> **timestamp**: `number`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L19)

Creation timestamp (milliseconds since epoch)

---

### filePath?

> `optional` **filePath**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L21)

Optional: File path (for instance-scoped annotations - legacy)

---

### lineNumber?

> `optional` **lineNumber**: `number`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L23)

Optional: Line number (for instance-scoped annotations - legacy)

---

### instanceId?

> `optional` **instanceId**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L25)

Optional: Instance identifier (for instance-scoped annotations)

---

### treePath?

> `optional` **treePath**: `string`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:27](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L27)

Optional: Tree path (for instance-scoped annotations)
