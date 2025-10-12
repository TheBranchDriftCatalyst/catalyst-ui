[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [effects/types](../README.md) / SlideDirection

# Type Alias: SlideDirection

> **SlideDirection** = `"top"` \| `"right"` \| `"bottom"` \| `"left"`

Defined in: [workspace/catalyst-ui/lib/effects/types.ts:110](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/types.ts#L110)

SlideDirection - Defines the entry direction for slide animations

## Remarks

Used exclusively by AnimatedSlide to control which direction content
slides in from. The content will slide FROM the specified direction
INTO the visible area.

## Examples

```tsx
<AnimatedSlide direction="left" distance={300}>
  <Drawer>Slides in from left edge</Drawer>
</AnimatedSlide>
```

```tsx
<AnimatedSlide direction="top" distance={100}>
  <Alert>Slides down from top</Alert>
</AnimatedSlide>
```

```tsx
<AnimatedSlide direction="bottom" distance={400}>
  <Sheet>Slides up from bottom</Sheet>
</AnimatedSlide>
```
