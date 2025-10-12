[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/select](../README.md) / SelectContent

# Variable: SelectContent

> `const` **SelectContent**: `ForwardRefExoticComponent`\<`Omit`\<`SelectContentProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/select.tsx:206](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/select.tsx#L206)

SelectContent - Dropdown menu container for select options

The popover that appears when the SelectTrigger is clicked. Contains
SelectItem components and optional SelectGroup/SelectLabel for organization.

**Features:**

- Portal rendering (appears above other content)
- Smooth animations (fade + zoom + slide)
- Automatic positioning relative to trigger
- Scroll buttons for long lists
- Max height with overflow scrolling

**Position Modes:**

- `popper` (default) - Floats above content, matches trigger width
- `item-aligned` - Aligns with selected item

## Example

```tsx
<SelectContent>
  <SelectItem value="option1">Option 1</SelectItem>
  <SelectItem value="option2">Option 2</SelectItem>
</SelectContent>

// With groups
<SelectContent>
  <SelectGroup>
    <SelectLabel>Category 1</SelectLabel>
    <SelectItem value="1a">Item 1A</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Category 2</SelectLabel>
    <SelectItem value="2a">Item 2A</SelectItem>
  </SelectGroup>
</SelectContent>
```
