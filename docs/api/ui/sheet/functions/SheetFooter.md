[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/sheet](../README.md) / SheetFooter

# Function: SheetFooter()

> **SheetFooter**(`className`): `Element`

Defined in: [workspace/catalyst-ui/lib/ui/sheet.tsx:305](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/sheet.tsx#L305)

SheetFooter - Footer container for action buttons.

Provides consistent spacing and layout for sheet footer actions.
Typically contains submit/cancel buttons or other actions.

## Parameters

### className

`HTMLAttributes`\<`HTMLDivElement`\>

Additional CSS classes

## Returns

`Element`

## Component

## Example

```tsx
<SheetContent>
  <SheetHeader>...</SheetHeader>
  <div>Form content</div>
  <SheetFooter>
    <SheetClose asChild>
      <button>Cancel</button>
    </SheetClose>
    <button type="submit">Save</button>
  </SheetFooter>
</SheetContent>
```
