[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuRadioItem

# Variable: DropdownMenuRadioItem

> `const` **DropdownMenuRadioItem**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuRadioItemProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:343](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L343)

DropdownMenuRadioItem - Single-selection radio menu item

A menu item with radio button behavior for mutually exclusive selections.
Displays a filled circle when selected. Use within DropdownMenuRadioGroup
where only one option can be selected at a time.

**Props:**

- `value` - Unique value for this radio option
- RadioGroup manages selection via `value` and `onValueChange` props

## Example

```tsx
<DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
  <DropdownMenuRadioItem value="name">Sort by Name</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="date">Sort by Date</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="size">Sort by Size</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```
