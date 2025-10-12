[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/tooltip](../README.md) / TooltipProvider

# Variable: TooltipProvider

> `const` **TooltipProvider**: `FC`\<`TooltipProviderProps`\> = `TooltipPrimitive.Provider`

Defined in: [workspace/catalyst-ui/lib/ui/tooltip.tsx:56](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/tooltip.tsx#L56)

TooltipProvider - Context provider for tooltip configuration.

Wraps tooltip components and provides shared configuration like
delay timing and skip-delay behavior. Required at the root of
tooltip usage.

## Component

## Example

```tsx
<TooltipProvider delayDuration={300}>
  <Tooltip>...</Tooltip>
  <Tooltip>...</Tooltip>
</TooltipProvider>
```
