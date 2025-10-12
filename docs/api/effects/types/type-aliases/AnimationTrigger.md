[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [effects/types](../README.md) / AnimationTrigger

# Type Alias: AnimationTrigger

> **AnimationTrigger** = `"click"` \| `"hover"`

Defined in: [workspace/catalyst-ui/lib/effects/types.ts:44](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/types.ts#L44)

AnimationTrigger - Defines how animations are triggered

## Remarks

All animation HOCs support these trigger modes for controlling when
animations execute. Each HOC respects the trigger mode while providing
component-specific animation behavior.

## Examples

```tsx
<AnimatedBounce trigger="hover">
  <Button>Bounce on hover</Button>
</AnimatedBounce>
```

```tsx
<AnimatedFade trigger="click">
  <div>Toggle visibility on click</div>
</AnimatedFade>
```

```tsx
// When using controlled props (isVisible, isFlipped, isBouncing),
// the trigger prop is ignored and animation is controlled by state
const [show, setShow] = useState(false);
<AnimatedSlide isVisible={show} trigger="click">
  <Panel>Controlled by external state</Panel>
</AnimatedSlide>;
```
