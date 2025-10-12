[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / FormField

# Function: FormField()

> **FormField**\<`TFieldValues`, `TName`\>(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:126](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L126)

FormField - Field-level controller for React Hook Form

Wraps React Hook Form's Controller component to provide field context
and connect form inputs to the form state. Use the render prop pattern
to render form controls with proper registration and validation.

**Key Features:**

- Automatic field registration and validation
- Access to field state (value, error, isDirty, etc.)
- Controlled component pattern
- Full TypeScript type inference

## Type Parameters

### TFieldValues

`TFieldValues` _extends_ `FieldValues` = `FieldValues`

### TName

`TName` _extends_ `string` = `FieldPath`\<`TFieldValues`\>

## Parameters

### \_\_namedParameters

`ControllerProps`\<`TFieldValues`, `TName`\>

## Returns

`Element`

## Example

```tsx
// Text input field
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="you@example.com" {...field} />
      </FormControl>
      <FormDescription>We'll never share your email.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

// Checkbox field
<FormField
  control={form.control}
  name="acceptTerms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel>Accept terms and conditions</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
```
