[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedBounce/AnimatedBounce](../README.md) / AnimatedBounceProps

# Interface: AnimatedBounceProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L9)

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L11)

Content to animate

#### Overrides

`React.HTMLAttributes.children`

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L13)

How to trigger the bounce animation

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L15)

Animation duration in milliseconds

---

### intensity?

> `optional` **intensity**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L17)

Bounce intensity (scale multiplier)

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L19)

Additional class names for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isBouncing?

> `optional` **isBouncing**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L21)

Controlled bounce state

---

### onBounceChange()?

> `optional` **onBounceChange**: (`isBouncing`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedBounce/AnimatedBounce.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedBounce/AnimatedBounce.tsx#L23)

Callback when bounce state should change

#### Parameters

##### isBouncing

`boolean`

#### Returns

`void`
