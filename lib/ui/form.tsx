import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { Label } from "@/catalyst-ui/ui/label";
import { cn } from "@/catalyst-ui/utils";

/**
 * Form - Root form component for React Hook Form integration
 *
 * A re-export of React Hook Form's FormProvider that enables form context
 * throughout the component tree. Use this as the root wrapper for all forms.
 *
 * **React Hook Form Integration:**
 * Pass the form methods from `useForm()` hook to this component to provide
 * context to all form fields, validation, and error handling.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 *
 * const formSchema = z.object({
 *   username: z.string().min(2, "Username must be at least 2 characters"),
 *   email: z.string().email("Invalid email address"),
 * });
 *
 * function MyForm() {
 *   const form = useForm({
 *     resolver: zodResolver(formSchema),
 *     defaultValues: { username: "", email: "" }
 *   });
 *
 *   return (
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(onSubmit)}>
 *         <FormField
 *           control={form.control}
 *           name="username"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>Username</FormLabel>
 *               <FormControl>
 *                 <Input {...field} />
 *               </FormControl>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *       </form>
 *     </Form>
 *   );
 * }
 * ```
 */
const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

/**
 * FormField - Field-level controller for React Hook Form
 *
 * Wraps React Hook Form's Controller component to provide field context
 * and connect form inputs to the form state. Use the render prop pattern
 * to render form controls with proper registration and validation.
 *
 * **Key Features:**
 * - Automatic field registration and validation
 * - Access to field state (value, error, isDirty, etc.)
 * - Controlled component pattern
 * - Full TypeScript type inference
 *
 * @example
 * ```tsx
 * // Text input field
 * <FormField
 *   control={form.control}
 *   name="email"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <Input placeholder="you@example.com" {...field} />
 *       </FormControl>
 *       <FormDescription>We'll never share your email.</FormDescription>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 *
 * // Checkbox field
 * <FormField
 *   control={form.control}
 *   name="acceptTerms"
 *   render={({ field }) => (
 *     <FormItem className="flex items-center space-x-2">
 *       <FormControl>
 *         <Checkbox
 *           checked={field.value}
 *           onCheckedChange={field.onChange}
 *         />
 *       </FormControl>
 *       <FormLabel>Accept terms and conditions</FormLabel>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 * ```
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/**
 * useFormField - Hook for accessing form field context and state
 *
 * Provides access to the current field's state, validation errors, and IDs
 * for ARIA attributes. Used internally by form components but can also be
 * used in custom form components.
 *
 * **Returns:**
 * - `id` - Unique ID for the field
 * - `name` - Field name from FormField
 * - `formItemId` - ID for the input element (for label htmlFor)
 * - `formDescriptionId` - ID for description text (for aria-describedby)
 * - `formMessageId` - ID for error message (for aria-describedby)
 * - `error` - Validation error object (if any)
 * - `isDirty`, `isTouched`, `isValidating` - Field state flags
 *
 * @throws Error if used outside of a FormField context
 *
 * @example
 * ```tsx
 * function CustomFormInput() {
 *   const { error, formItemId } = useFormField();
 *
 *   return (
 *     <input
 *       id={formItemId}
 *       className={error ? "border-red-500" : "border-gray-300"}
 *     />
 *   );
 * }
 * ```
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

/**
 * FormItem - Container for a single form field and its label, description, and error
 *
 * Provides spacing and context for form field components. Generates unique IDs
 * that connect labels, inputs, descriptions, and error messages for accessibility.
 *
 * **Structure:**
 * Typically contains FormLabel, FormControl, FormDescription, and FormMessage
 * in that order, with automatic spacing between them.
 *
 * **Accessibility:**
 * Automatically generates and manages IDs used for:
 * - `htmlFor` on labels
 * - `id` on inputs
 * - `aria-describedby` linking descriptions and errors
 *
 * @example
 * ```tsx
 * <FormItem>
 *   <FormLabel>Username</FormLabel>
 *   <FormControl>
 *     <Input {...field} />
 *   </FormControl>
 *   <FormDescription>
 *     This will be your public display name
 *   </FormDescription>
 *   <FormMessage />
 * </FormItem>
 * ```
 */
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = "FormItem";

/**
 * FormLabel - Label for a form field with error state styling
 *
 * Extends the base Label component with automatic error styling and proper
 * `htmlFor` attribute linking to the form control. Automatically turns red
 * when the field has a validation error.
 *
 * **Accessibility:**
 * - Automatically linked to form control via `htmlFor`
 * - Color changes to indicate error state
 *
 * @example
 * ```tsx
 * <FormLabel>Email Address</FormLabel>
 * <FormLabel className="font-bold">Required Field</FormLabel>
 * ```
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

/**
 * FormControl - Wrapper for form input elements with accessibility attributes
 *
 * Uses Radix UI's Slot component to merge props onto the child input element
 * without adding extra DOM nodes. Automatically adds proper ARIA attributes
 * for accessibility including IDs, error states, and descriptions.
 *
 * **ARIA Attributes:**
 * - `id` - Links to FormLabel's `htmlFor`
 * - `aria-describedby` - Links to FormDescription and FormMessage
 * - `aria-invalid` - Indicates validation error state
 *
 * **Usage:**
 * Wrap your input component (Input, Textarea, Select, etc.) with FormControl
 * and it will receive all the necessary accessibility attributes.
 *
 * @example
 * ```tsx
 * // With Input
 * <FormControl>
 *   <Input placeholder="Enter your email" {...field} />
 * </FormControl>
 *
 * // With Textarea
 * <FormControl>
 *   <Textarea placeholder="Tell us about yourself" {...field} />
 * </FormControl>
 *
 * // With Select
 * <FormControl>
 *   <Select onValueChange={field.onChange} defaultValue={field.value}>
 *     <SelectTrigger>
 *       <SelectValue placeholder="Select an option" />
 *     </SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="option1">Option 1</SelectItem>
 *     </SelectContent>
 *   </Select>
 * </FormControl>
 * ```
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

/**
 * FormDescription - Helper text for a form field
 *
 * Displays additional information or instructions below the form control.
 * Automatically linked to the input via ARIA attributes for screen readers.
 *
 * **Styling:**
 * - Muted foreground color for subtlety
 * - Small text size
 * - Proper spacing within FormItem
 *
 * @example
 * ```tsx
 * <FormDescription>
 *   Your password must be at least 8 characters long
 * </FormDescription>
 *
 * <FormDescription>
 *   We'll use this email to send you notifications
 * </FormDescription>
 * ```
 */
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

/**
 * FormMessage - Validation error message display
 *
 * Automatically displays validation error messages from React Hook Form.
 * Only renders when there's an error or when children are provided.
 * Linked to the form control via ARIA for accessibility.
 *
 * **Behavior:**
 * - Shows error message from validation when field has error
 * - Can show custom content via children prop
 * - Returns null when no error and no children (no empty DOM node)
 * - Automatically styled in destructive/error color
 *
 * **Priority:**
 * Error messages from validation take precedence over children.
 *
 * @example
 * ```tsx
 * // Automatic error display from validation
 * <FormMessage />
 *
 * // Custom success message
 * <FormMessage className="text-green-600">
 *   Username is available!
 * </FormMessage>
 * ```
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
