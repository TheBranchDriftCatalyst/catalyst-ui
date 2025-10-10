[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedFlip/AnimatedFlip](../README.md) / AnimatedFlipProps

# Interface: AnimatedFlipProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L9)

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### front

> **front**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L11)

Content to display on the front face

---

### back

> **back**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L13)

Content to display on the back face

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L15)

How to trigger the flip animation

---

### direction?

> `optional` **direction**: [`FlipDirection`](../../../types/type-aliases/FlipDirection.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L17)

Direction of flip animation

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L19)

Animation duration in milliseconds

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L21)

Additional class names for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isFlipped?

> `optional` **isFlipped**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L23)

Controlled flip state

---

### onFlipChange()?

> `optional` **onFlipChange**: (`isFlipped`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFlip/AnimatedFlip.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFlip/AnimatedFlip.tsx#L25)

Callback when flip state should change

#### Parameters

##### isFlipped

`boolean`

#### Returns

`void`
