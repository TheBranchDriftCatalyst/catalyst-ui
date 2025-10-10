[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/ScrollSnapContainer/ScrollSnapContainer](../README.md) / ScrollSnapContainerProps

# Interface: ScrollSnapContainerProps

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:4](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L4)

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### type?

> `optional` **type**: `"x"` \| `"y"` \| `"none"` \| `"both"`

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:6](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L6)

Direction of scroll snapping

---

### behavior?

> `optional` **behavior**: `"proximity"` \| `"mandatory"`

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:8](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L8)

Snap behavior - proximity is more natural, mandatory is aggressive

---

### smooth?

> `optional` **smooth**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:10](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L10)

Enable smooth scrolling

---

### snapOffset?

> `optional` **snapOffset**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L12)

Offset from top for snap point (in pixels)

---

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L14)

Children to render

#### Overrides

`React.HTMLAttributes.children`

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L16)

Additional class names

#### Overrides

`React.HTMLAttributes.className`
