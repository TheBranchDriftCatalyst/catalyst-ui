[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/ScrollSnapItem/ScrollSnapItem](../README.md) / ScrollSnapItem

# Variable: ScrollSnapItem

> `const` **ScrollSnapItem**: `ForwardRefExoticComponent`\<[`ScrollSnapItemProps`](../interfaces/ScrollSnapItemProps.md) & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapItem/ScrollSnapItem.tsx:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapItem/ScrollSnapItem.tsx#L30)

ScrollSnapItem - HOC for marking scroll snap points

Wraps an element to make it a scroll snap point within a ScrollSnapContainer.
Typically used to wrap Card components for smooth scrolling.

## Example

```tsx
<ScrollSnapItem align="start" offset={80}>
  <Card>Content that snaps to viewport</Card>
</ScrollSnapItem>
```
