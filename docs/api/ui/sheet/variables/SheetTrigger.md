[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/sheet](../README.md) / SheetTrigger

# Variable: SheetTrigger

> `const` **SheetTrigger**: `ForwardRefExoticComponent`\<`DialogTriggerProps` & `RefAttributes`\<`HTMLButtonElement`\>\> = `SheetPrimitive.Trigger`

Defined in: [workspace/catalyst-ui/lib/ui/sheet.tsx:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/sheet.tsx#L87)

SheetTrigger - Element that opens the sheet.

The button or element users click to open the sheet.

## Component

## Example

```tsx
<Sheet>
  <SheetTrigger asChild>
    <button>Open Filters</button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>
```
