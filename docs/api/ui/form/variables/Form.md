[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / Form

# Variable: Form()

> `const` **Form**: \<`TFieldValues`, `TContext`, `TTransformedValues`\>(`props`) => `Element` = `FormProvider`

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:65](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L65)

Form - Root form component for React Hook Form integration

A re-export of React Hook Form's FormProvider that enables form context
throughout the component tree. Use this as the root wrapper for all forms.

**React Hook Form Integration:**
Pass the form methods from `useForm()` hook to this component to provide
context to all form fields, validation, and error handling.

A provider component that propagates the `useForm` methods to all children components via [React Context](https://reactjs.org/docs/context.html) API. To be used with useFormContext.

## Type Parameters

### TFieldValues

`TFieldValues` _extends_ `FieldValues`

### TContext

`TContext` = `any`

### TTransformedValues

`TTransformedValues` = `TFieldValues`

## Parameters

### props

`FormProviderProps`\<`TFieldValues`, `TContext`, `TTransformedValues`\>

all useForm methods

## Returns

`Element`

## Remarks

[API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)

## Example

```tsx
function App() {
  const methods = useForm();
  const onSubmit = data => console.log(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}
```

## Example

```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```
