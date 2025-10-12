[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/tooltip](../README.md) / TooltipContent

# Variable: TooltipContent

> `const` **TooltipContent**: `ForwardRefExoticComponent`\<`Omit`\<`TooltipContentProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/tooltip.tsx:138](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/tooltip.tsx#L138)

TooltipContent - The tooltip content panel.

Displays the tooltip message in a floating panel positioned
relative to the trigger element. Automatically handles positioning,
collision detection, and animations.

## Component

## Param

Preferred placement: "top" | "right" | "bottom" | "left"

## Param

Distance in pixels from the trigger (default: 4)

## Param

Alignment relative to trigger: "start" | "center" | "end"

## Param

Additional CSS classes

## Examples

```tsx
<Tooltip>
  <TooltipTrigger>Info</TooltipTrigger>
  <TooltipContent side="top" align="center">
    This is helpful information
  </TooltipContent>
</Tooltip>
```

```tsx
// Multi-line tooltip with custom styling
<Tooltip>
  <TooltipTrigger asChild>
    <InfoIcon />
  </TooltipTrigger>
  <TooltipContent className="max-w-xs">
    <p className="font-semibold">Pro Tip</p>
    <p className="text-sm">You can use keyboard shortcuts to speed up your workflow.</p>
  </TooltipContent>
</Tooltip>
```

## Accessibility

- Automatically manages focus and ARIA attributes
- Keyboard accessible (shows on focus, hides on Escape)
- Screen reader announcements via ARIA
- Respects prefers-reduced-motion
