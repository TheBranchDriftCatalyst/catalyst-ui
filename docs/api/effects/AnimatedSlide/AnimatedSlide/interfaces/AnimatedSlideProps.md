[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedSlide/AnimatedSlide](../README.md) / AnimatedSlideProps

# Interface: AnimatedSlideProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L9)

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L11)

Content to animate

#### Overrides

`React.HTMLAttributes.children`

---

### direction?

> `optional` **direction**: [`SlideDirection`](../../../types/type-aliases/SlideDirection.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L13)

Direction to slide from

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L15)

How to trigger the slide animation

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L17)

Animation duration in milliseconds

---

### distance?

> `optional` **distance**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L19)

Distance to slide in pixels

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L21)

Additional class names for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isVisible?

> `optional` **isVisible**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L23)

Controlled visibility state

---

### onVisibilityChange()?

> `optional` **onVisibilityChange**: (`isVisible`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L25)

Callback when visibility should change

#### Parameters

##### isVisible

`boolean`

#### Returns

`void`
