[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/select](../README.md) / SelectLabel

# Variable: SelectLabel

> `const` **SelectLabel**: `ForwardRefExoticComponent`\<`Omit`\<`SelectLabelProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/select.tsx:252](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/select.tsx#L252)

SelectLabel - Label for a group of select options

Non-selectable label text that describes a group of options.
Use inside SelectGroup to organize related options.

## Example

```tsx
<SelectGroup>
  <SelectLabel>Fruits</SelectLabel>
  <SelectItem value="apple">Apple</SelectItem>
</SelectGroup>
```
