[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/sheet](../README.md) / SheetClose

# Variable: SheetClose

> `const` **SheetClose**: `ForwardRefExoticComponent`\<`DialogCloseProps` & `RefAttributes`\<`HTMLButtonElement`\>\> = `SheetPrimitive.Close`

Defined in: [workspace/catalyst-ui/lib/ui/sheet.tsx:105](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/sheet.tsx#L105)

SheetClose - Element that closes the sheet.

Can be used inside SheetContent to programmatically close the sheet.

## Component

## Example

```tsx
<SheetContent>
  <SheetClose asChild>
    <button>Cancel</button>
  </SheetClose>
</SheetContent>
```
