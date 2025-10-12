[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedSlide/AnimatedSlide](../README.md) / AnimatedSlideProps

# Interface: AnimatedSlideProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L21)

Props for AnimatedSlide component

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L23)

Content to animate (any React nodes)

#### Overrides

`React.HTMLAttributes.children`

---

### direction?

> `optional` **direction**: [`SlideDirection`](../../../types/type-aliases/SlideDirection.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L25)

Direction to slide from (default: "bottom")

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:27](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L27)

How to trigger the slide animation (default: "click")

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:29](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L29)

Animation duration in milliseconds (default: 400)

---

### distance?

> `optional` **distance**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L31)

Distance to slide in pixels (default: 50)

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L33)

Additional CSS classes for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isVisible?

> `optional` **isVisible**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:35](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L35)

Controlled visibility state (makes component controlled)

---

### onVisibilityChange()?

> `optional` **onVisibilityChange**: (`isVisible`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedSlide/AnimatedSlide.tsx:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedSlide/AnimatedSlide.tsx#L37)

Callback fired when visibility state changes

#### Parameters

##### isVisible

`boolean`

#### Returns

`void`
