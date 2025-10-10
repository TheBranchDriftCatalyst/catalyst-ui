[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/usePrefersReducedMotion](../README.md) / usePrefersReducedMotion

# Function: usePrefersReducedMotion()

> **usePrefersReducedMotion**(): `boolean`

Defined in: [workspace/catalyst-ui/lib/hooks/usePrefersReducedMotion.ts:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/usePrefersReducedMotion.ts#L23)

usePrefersReducedMotion - Detects user's motion preferences

Respects the `prefers-reduced-motion` media query, which indicates
that the user has requested that the system minimize the amount of
non-essential motion it uses.

This is crucial for accessibility, as some users experience motion
sickness or vestibular disorders triggered by animations.

## Returns

`boolean`

boolean - true if user prefers reduced motion

## Example

```tsx
const prefersReducedMotion = usePrefersReducedMotion();
const duration = prefersReducedMotion ? 0 : 300;
```

## See

https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
