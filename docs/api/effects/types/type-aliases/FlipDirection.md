[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [effects/types](../README.md) / FlipDirection

# Type Alias: FlipDirection

> **FlipDirection** = `"horizontal"` \| `"vertical"`

Defined in: [workspace/catalyst-ui/lib/effects/types.ts:74](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/types.ts#L74)

FlipDirection - Defines the rotation axis for 3D flip animations

## Remarks

Used exclusively by AnimatedFlip to control the flip transformation axis.
Affects the rotateX/rotateY CSS transform applied during animation.

## Examples

```tsx
<AnimatedFlip
  front={<Card>Front</Card>}
  back={<Card>Back</Card>}
  direction="horizontal" // Default - flips left to right
/>
```

```tsx
<AnimatedFlip
  front={<Card>Front</Card>}
  back={<Card>Back</Card>}
  direction="vertical" // Flips top to bottom
/>
```
