[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/AnimatedFade/AnimatedFade](../README.md) / AnimatedFadeProps

# Interface: AnimatedFadeProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L19)

Props for AnimatedFade component

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L21)

Content to animate (any React nodes)

#### Overrides

`React.HTMLAttributes.children`

---

### trigger?

> `optional` **trigger**: [`AnimationTrigger`](../../../types/type-aliases/AnimationTrigger.md)

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L23)

How to trigger the fade animation (default: "click")

---

### duration?

> `optional` **duration**: `number`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L25)

Animation duration in milliseconds (default: 300)

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:27](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L27)

Additional CSS classes for the container

#### Overrides

`React.HTMLAttributes.className`

---

### isVisible?

> `optional` **isVisible**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:29](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L29)

Controlled visibility state (makes component controlled)

---

### onVisibilityChange()?

> `optional` **onVisibilityChange**: (`isVisible`) => `void`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedFade/AnimatedFade.tsx:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedFade/AnimatedFade.tsx#L31)

Callback fired when visibility state changes

#### Parameters

##### isVisible

`boolean`

#### Returns

`void`
