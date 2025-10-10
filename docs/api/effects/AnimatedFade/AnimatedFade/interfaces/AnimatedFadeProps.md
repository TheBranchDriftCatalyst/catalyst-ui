[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedFade/AnimatedFade](../README.md) / AnimatedFadeProps

# Interface: AnimatedFadeProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L9)

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L11)

Content to animate

#### Overrides

`React.HTMLAttributes.children`

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L13)

How to trigger the fade animation

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L15)

Animation duration in milliseconds

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L17)

Additional class names for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isVisible?

> `optional` **isVisible**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L19)

Controlled visibility state

---

### onVisibilityChange()?

> `optional` **onVisibilityChange**: (`isVisible`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L21)

Callback when visibility should change

#### Parameters

##### isVisible

`boolean`

#### Returns

`void`
