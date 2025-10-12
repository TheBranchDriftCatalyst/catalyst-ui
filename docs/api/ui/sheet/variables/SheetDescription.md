[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/sheet](../README.md) / SheetDescription

# Variable: SheetDescription

> `const` **SheetDescription**: `ForwardRefExoticComponent`\<`Omit`\<`DialogDescriptionProps` & `RefAttributes`\<`HTMLParagraphElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLParagraphElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/sheet.tsx:365](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/sheet.tsx#L365)

SheetDescription - Description text for the sheet.

Provides additional context about the sheet's purpose.
Important for accessibility.

## Component

## Param

Additional CSS classes

## Example

```tsx
<SheetContent>
  <SheetHeader>
    <SheetTitle>Delete Account</SheetTitle>
    <SheetDescription>
      This action cannot be undone. All your data will be permanently removed.
    </SheetDescription>
  </SheetHeader>
</SheetContent>
```
