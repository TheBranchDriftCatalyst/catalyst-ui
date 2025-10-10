[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useAnimationTriggers](../README.md) / useAnimationTriggers

# Function: useAnimationTriggers()

> **useAnimationTriggers**(`trigger`, `setState`): `object`

Defined in: [workspace/catalyst-ui/lib/hooks/useAnimationTriggers.ts:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useAnimationTriggers.ts#L33)

useAnimationTriggers - Shared trigger handling for animation HOCs

Provides consistent event handlers for hover, click, and manual triggers
across all animation components. Eliminates duplication of trigger logic.

## Parameters

### trigger

[`AnimationTrigger`](../../../effects/types/type-aliases/AnimationTrigger.md)

How the animation should be triggered

### setState

(`value`) => `void`

Function to update animation state

## Returns

`object`

Object containing event handlers for mouse events and clicks

### handleMouseEnter()

> **handleMouseEnter**: () => `void`

#### Returns

`void`

### handleMouseLeave()

> **handleMouseLeave**: () => `void`

#### Returns

`void`

### handleClick()

> **handleClick**: () => `void`

#### Returns

`void`

## Example

```tsx
const [isVisible, setIsVisible] = useControllableState(props.isVisible, false);
const { handleMouseEnter, handleMouseLeave, handleClick } = useAnimationTriggers(
  "hover",
  setIsVisible
);

return (
  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
    {children}
  </div>
);
```
