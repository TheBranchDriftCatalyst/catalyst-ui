[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/label](../README.md) / Label

# Variable: Label

> `const` **Label**: `ForwardRefExoticComponent`\<`Omit`\<`LabelProps` & `RefAttributes`\<`HTMLLabelElement`\>, `"ref"`\> & `VariantProps`\<(`props?`) => `string`\> & `RefAttributes`\<`HTMLLabelElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/label.tsx:54](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/label.tsx#L54)

Label - Accessible label component for form inputs

Built on Radix UI's Label primitive with proper accessibility support.
Automatically associates with form controls via `htmlFor` prop.

**Accessibility Features:**

- Properly links to form controls via `htmlFor` attribute
- Supports Radix UI's Label primitive ARIA attributes
- Automatically adjusts cursor and opacity when associated input is disabled

**Peer Disabled Pattern:**
When the associated input has the `peer` class and is disabled, the label
automatically shows disabled styling (not-allowed cursor, 70% opacity).

**Usage:**
Can be used standalone or within FormLabel for automatic error handling.

## Example

```tsx
// Standalone label
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" className="peer" />

// With disabled input
<Label htmlFor="disabled-field">Disabled Field</Label>
<Input id="disabled-field" disabled className="peer" />

// Custom styling
<Label htmlFor="name" className="text-lg font-bold">
  Full Name
</Label>

// Within a form (via FormLabel)
<FormLabel>Username</FormLabel>
```
