[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedBounce/AnimatedBounce](../README.md) / AnimatedBounceProps

# Interface: AnimatedBounceProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:20](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L20)

Props for AnimatedBounce component

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L22)

Content to animate (any React nodes)

#### Overrides

`React.HTMLAttributes.children`

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:24](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L24)

How to trigger the bounce animation (default: "hover")

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L26)

Animation duration in milliseconds (default: 500)

---

### intensity?

> `optional` **intensity**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:28](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L28)

Bounce intensity as scale multiplier (default: 1.1)

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L30)

Additional CSS classes for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isBouncing?

> `optional` **isBouncing**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:32](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L32)

Controlled bounce state (makes component controlled)

---

### onBounceChange()?

> `optional` **onBounceChange**: (`isBouncing`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:34](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L34)

Callback fired when bounce state changes

#### Parameters

##### isBouncing

`boolean`

#### Returns

`void`
