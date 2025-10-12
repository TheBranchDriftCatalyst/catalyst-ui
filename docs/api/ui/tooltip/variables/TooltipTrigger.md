[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/tooltip](../README.md) / TooltipTrigger

# Variable: TooltipTrigger

> `const` **TooltipTrigger**: `ForwardRefExoticComponent`\<`TooltipTriggerProps` & `RefAttributes`\<`HTMLButtonElement`\>\> = `TooltipPrimitive.Trigger`

Defined in: [workspace/catalyst-ui/lib/ui/tooltip.tsx:90](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/tooltip.tsx#L90)

TooltipTrigger - Element that triggers the tooltip.

The element users interact with (hover/focus) to show the tooltip.
Can be any React element or component.

## Component

## Example

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <button>Hover me</button>
  </TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```
