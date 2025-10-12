[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / FormLabel

# Variable: FormLabel

> `const` **FormLabel**: `ForwardRefExoticComponent`\<`Omit`\<`LabelProps` & `RefAttributes`\<`HTMLLabelElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLLabelElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:260](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L260)

FormLabel - Label for a form field with error state styling

Extends the base Label component with automatic error styling and proper
`htmlFor` attribute linking to the form control. Automatically turns red
when the field has a validation error.

**Accessibility:**

- Automatically linked to form control via `htmlFor`
- Color changes to indicate error state

## Example

```tsx
<FormLabel>Email Address</FormLabel>
<FormLabel className="font-bold">Required Field</FormLabel>
```
