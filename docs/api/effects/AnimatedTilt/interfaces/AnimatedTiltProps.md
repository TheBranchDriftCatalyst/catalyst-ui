[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [effects/AnimatedTilt](../README.md) / AnimatedTiltProps

# Interface: AnimatedTiltProps

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedTilt.tsx:32](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedTilt.tsx#L32)

AnimatedTilt - 3D tilt effect that respects user's motion preferences

A wrapper around @jdion/tilt-react that automatically disables tilt animations
when the user has `prefers-reduced-motion` enabled. This ensures the component
is accessible to users with vestibular disorders or motion sensitivity.

## Param

Whether tilt is enabled (default: true). When false, children render without tilt.

## Param

The content to wrap with tilt effect

## Param

All standard Tilt component props (tiltMaxAngleX, tiltMaxAngleY, scale, etc.)

## Examples

```tsx
<AnimatedTilt tiltMaxAngleX={20} tiltMaxAngleY={20} scale={1.05}>
  <Card>Content</Card>
</AnimatedTilt>
```

```tsx
<AnimatedTilt enabled={!isMobile} tiltMaxAngleX={10} tiltMaxAngleY={10}>
  <Card>Content</Card>
</AnimatedTilt>
```

## See

https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html

## Extends

- `Omit`\<[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md), `"children"`\>

## Properties

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedTilt.tsx:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedTilt.tsx#L33)

---

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/effects/AnimatedTilt.tsx:34](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/AnimatedTilt.tsx#L34)

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L13)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`className`](../../../types/tilt-react/interfaces/TiltProps.md#classname)

---

### tiltEnable?

> `optional` **tiltEnable**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L14)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltEnable`](../../../types/tilt-react/interfaces/TiltProps.md#tiltenable)

---

### tiltReverse?

> `optional` **tiltReverse**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L15)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltReverse`](../../../types/tilt-react/interfaces/TiltProps.md#tiltreverse)

---

### tiltAngleXInitial?

> `optional` **tiltAngleXInitial**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L16)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltAngleXInitial`](../../../types/tilt-react/interfaces/TiltProps.md#tiltanglexinitial)

---

### tiltAngleYInitial?

> `optional` **tiltAngleYInitial**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L17)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltAngleYInitial`](../../../types/tilt-react/interfaces/TiltProps.md#tiltangleyinitial)

---

### tiltMaxAngleX?

> `optional` **tiltMaxAngleX**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L18)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltMaxAngleX`](../../../types/tilt-react/interfaces/TiltProps.md#tiltmaxanglex)

---

### tiltMaxAngleY?

> `optional` **tiltMaxAngleY**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L19)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltMaxAngleY`](../../../types/tilt-react/interfaces/TiltProps.md#tiltmaxangley)

---

### tiltAxis?

> `optional` **tiltAxis**: `null` \| `"x"` \| `"y"`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:20](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L20)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltAxis`](../../../types/tilt-react/interfaces/TiltProps.md#tiltaxis)

---

### tiltAngleXManual?

> `optional` **tiltAngleXManual**: `null` \| `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L21)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltAngleXManual`](../../../types/tilt-react/interfaces/TiltProps.md#tiltanglexmanual)

---

### tiltAngleYManual?

> `optional` **tiltAngleYManual**: `null` \| `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L22)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`tiltAngleYManual`](../../../types/tilt-react/interfaces/TiltProps.md#tiltangleymanual)

---

### glareEnable?

> `optional` **glareEnable**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L23)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`glareEnable`](../../../types/tilt-react/interfaces/TiltProps.md#glareenable)

---

### glareMaxOpacity?

> `optional` **glareMaxOpacity**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:24](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L24)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`glareMaxOpacity`](../../../types/tilt-react/interfaces/TiltProps.md#glaremaxopacity)

---

### glareColor?

> `optional` **glareColor**: `string`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L25)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`glareColor`](../../../types/tilt-react/interfaces/TiltProps.md#glarecolor)

---

### glareBorderRadius?

> `optional` **glareBorderRadius**: `string`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L26)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`glareBorderRadius`](../../../types/tilt-react/interfaces/TiltProps.md#glareborderradius)

---

### glarePosition?

> `optional` **glarePosition**: `"all"` \| `"left"` \| `"right"` \| `"top"` \| `"bottom"`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:27](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L27)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`glarePosition`](../../../types/tilt-react/interfaces/TiltProps.md#glareposition)

---

### glareReverse?

> `optional` **glareReverse**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:28](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L28)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`glareReverse`](../../../types/tilt-react/interfaces/TiltProps.md#glarereverse)

---

### scale?

> `optional` **scale**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:29](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L29)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`scale`](../../../types/tilt-react/interfaces/TiltProps.md#scale)

---

### perspective?

> `optional` **perspective**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L30)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`perspective`](../../../types/tilt-react/interfaces/TiltProps.md#perspective)

---

### flipVertically?

> `optional` **flipVertically**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L31)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`flipVertically`](../../../types/tilt-react/interfaces/TiltProps.md#flipvertically)

---

### flipHorizontally?

> `optional` **flipHorizontally**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:32](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L32)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`flipHorizontally`](../../../types/tilt-react/interfaces/TiltProps.md#fliphorizontally)

---

### reset?

> `optional` **reset**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L33)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`reset`](../../../types/tilt-react/interfaces/TiltProps.md#reset)

---

### transitionEasing?

> `optional` **transitionEasing**: `string`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:34](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L34)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`transitionEasing`](../../../types/tilt-react/interfaces/TiltProps.md#transitioneasing)

---

### transitionSpeed?

> `optional` **transitionSpeed**: `number`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:35](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L35)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`transitionSpeed`](../../../types/tilt-react/interfaces/TiltProps.md#transitionspeed)

---

### trackOnWindow?

> `optional` **trackOnWindow**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:36](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L36)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`trackOnWindow`](../../../types/tilt-react/interfaces/TiltProps.md#trackonwindow)

---

### gyroscope?

> `optional` **gyroscope**: `boolean`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L37)

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`gyroscope`](../../../types/tilt-react/interfaces/TiltProps.md#gyroscope)

---

### onMove()?

> `optional` **onMove**: (`tiltAngleX`, `tiltAngleY`, `tiltAngleXPercentage`, `tiltAngleYPercentage`, `glareAngle`, `glareOpacity`) => `void`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:38](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L38)

#### Parameters

##### tiltAngleX

`number`

##### tiltAngleY

`number`

##### tiltAngleXPercentage

`number`

##### tiltAngleYPercentage

`number`

##### glareAngle

`number`

##### glareOpacity

`number`

#### Returns

`void`

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`onMove`](../../../types/tilt-react/interfaces/TiltProps.md#onmove)

---

### onEnter()?

> `optional` **onEnter**: (`event`) => `void`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L46)

#### Parameters

##### event

`MouseEvent` | `TouchEvent`

#### Returns

`void`

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`onEnter`](../../../types/tilt-react/interfaces/TiltProps.md#onenter)

---

### onLeave()?

> `optional` **onLeave**: (`event`) => `void`

Defined in: [workspace/catalyst-ui/lib/types/tilt-react.d.ts:47](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/types/tilt-react.d.ts#L47)

#### Parameters

##### event

`MouseEvent` | `TouchEvent`

#### Returns

`void`

#### Inherited from

[`TiltProps`](../../../types/tilt-react/interfaces/TiltProps.md).[`onLeave`](../../../types/tilt-react/interfaces/TiltProps.md#onleave)
