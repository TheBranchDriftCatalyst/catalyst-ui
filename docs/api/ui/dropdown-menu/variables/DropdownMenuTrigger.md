[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuTrigger

# Variable: DropdownMenuTrigger

> `const` **DropdownMenuTrigger**: `ForwardRefExoticComponent`\<`DropdownMenuTriggerProps` & `RefAttributes`\<`HTMLButtonElement`\>\> = `DropdownMenuPrimitive.Trigger`

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:40](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L40)

DropdownMenuTrigger - Button/element that opens the dropdown

Radix UI trigger primitive that automatically connects to the DropdownMenu state.
Renders as a button by default but can be composed with any element using asChild.

## Example

```tsx
<DropdownMenuTrigger asChild>
  <Button variant="outline">Actions</Button>
</DropdownMenuTrigger>
```
