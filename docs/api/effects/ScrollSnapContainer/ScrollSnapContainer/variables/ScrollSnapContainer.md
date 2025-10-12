[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [effects/ScrollSnapContainer/ScrollSnapContainer](../README.md) / ScrollSnapContainer

# Variable: ScrollSnapContainer

> `const` **ScrollSnapContainer**: `ForwardRefExoticComponent`\<[`ScrollSnapContainerProps`](../interfaces/ScrollSnapContainerProps.md) & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/effects/ScrollSnapContainer/ScrollSnapContainer.tsx#L33)

ScrollSnapContainer - HOC for enabling CSS scroll snap on a container

Wraps a scrolling area to enable snap points for child elements.
Use with ScrollSnapItem to create smooth card-to-card scrolling.

## Example

```tsx
<ScrollSnapContainer type="y" behavior="proximity" snapOffset={10}>
  <ScrollSnapItem>
    <Card>1</Card>
  </ScrollSnapItem>
  <ScrollSnapItem>
    <Card>2</Card>
  </ScrollSnapItem>
</ScrollSnapContainer>
```
