[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / useFormField

# Function: useFormField()

> **useFormField**(): `object`

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:171](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L171)

useFormField - Hook for accessing form field context and state

Provides access to the current field's state, validation errors, and IDs
for ARIA attributes. Used internally by form components but can also be
used in custom form components.

**Returns:**

- `id` - Unique ID for the field
- `name` - Field name from FormField
- `formItemId` - ID for the input element (for label htmlFor)
- `formDescriptionId` - ID for description text (for aria-describedby)
- `formMessageId` - ID for error message (for aria-describedby)
- `error` - Validation error object (if any)
- `isDirty`, `isTouched`, `isValidating` - Field state flags

## Returns

`object`

### id

> **id**: `string`

### name

> **name**: `string` = `fieldContext.name`

### formItemId

> **formItemId**: `string`

### formDescriptionId

> **formDescriptionId**: `string`

### formMessageId

> **formMessageId**: `string`

## Throws

Error if used outside of a FormField context

## Example

```tsx
function CustomFormInput() {
  const { error, formItemId } = useFormField();

  return <input id={formItemId} className={error ? "border-red-500" : "border-gray-300"} />;
}
```
