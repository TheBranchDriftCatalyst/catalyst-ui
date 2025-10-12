[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useA11yError](../README.md) / useA11yError

# Function: useA11yError()

> **useA11yError**(`inputId`, `hasError`): `object`

Defined in: [workspace/catalyst-ui/lib/hooks/useA11yError.ts:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useA11yError.ts#L31)

useA11yError - Creates accessible error message associations for form inputs

Generates proper ARIA attributes for inputs with error states, ensuring
screen readers announce error messages correctly.

This hook follows WCAG 3.3.1 (Error Identification) and 3.3.3 (Error Suggestion)
guidelines by properly associating error messages with form inputs.

## Parameters

### inputId

`string`

The ID of the input element

### hasError

`boolean`

Whether the input currently has an error

## Returns

`object`

Object with errorId and ARIA props for input and error message

### errorId

> **errorId**: `string`

### inputProps

> **inputProps**: `object`

#### inputProps.aria-invalid

> **aria-invalid**: `"true"` \| `"false"`

#### inputProps.aria-describedby

> **aria-describedby**: `undefined` \| `string`

### errorProps

> **errorProps**: `object`

#### errorProps.id

> **id**: `string` = `errorId`

#### errorProps.role

> **role**: `"alert"`

#### errorProps.aria-live

> **aria-live**: `"polite"`

## Example

```tsx
const { errorId, inputProps, errorProps } = useA11yError("email", !!errors.email);

return (
  <>
    <Input {...inputProps} />
    {errors.email && <p {...errorProps}>{errors.email.message}</p>}
  </>
);
```

## See

- https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html
- https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html
