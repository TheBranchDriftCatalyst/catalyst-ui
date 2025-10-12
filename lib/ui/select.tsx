"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Select - Root component for dropdown selection
 *
 * A fully accessible dropdown select component built on Radix UI primitives.
 * Provides keyboard navigation, search, and proper ARIA attributes.
 *
 * **Composition Pattern:**
 * Use with SelectTrigger, SelectContent, and SelectItem to build complete dropdowns.
 *
 * **Accessibility:**
 * - Keyboard navigation (Arrow keys, Home, End, Page Up/Down)
 * - Type-ahead search
 * - Focus management
 * - Screen reader support
 *
 * **React Hook Form Integration:**
 * Use `value` with `field.value` and `onValueChange` with `field.onChange`
 *
 * @example
 * ```tsx
 * <Select value={value} onValueChange={setValue}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const Select = SelectPrimitive.Root;

/**
 * SelectGroup - Groups related select options with an optional label
 *
 * Use to organize options into logical sections within a dropdown.
 * Should contain a SelectLabel followed by SelectItem components.
 *
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectGroup>
 *     <SelectLabel>Fruits</SelectLabel>
 *     <SelectItem value="apple">Apple</SelectItem>
 *     <SelectItem value="banana">Banana</SelectItem>
 *   </SelectGroup>
 *   <SelectGroup>
 *     <SelectLabel>Vegetables</SelectLabel>
 *     <SelectItem value="carrot">Carrot</SelectItem>
 *   </SelectGroup>
 * </SelectContent>
 * ```
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * SelectValue - Displays the selected value in the trigger
 *
 * Shows the current selection or placeholder text when nothing is selected.
 * Place inside SelectTrigger.
 *
 * @example
 * ```tsx
 * <SelectTrigger>
 *   <SelectValue placeholder="Choose an option" />
 * </SelectTrigger>
 * ```
 */
const SelectValue = SelectPrimitive.Value;

/**
 * SelectTrigger - Button that opens the select dropdown
 *
 * The clickable element that displays the current selection and opens
 * the dropdown menu. Should contain a SelectValue component.
 *
 * **Styling:**
 * - Matches Input component styling for consistency
 * - Focus ring for keyboard navigation
 * - Disabled state styling
 * - Chevron icon indicator
 *
 * @example
 * ```tsx
 * <SelectTrigger>
 *   <SelectValue placeholder="Select a fruit" />
 * </SelectTrigger>
 *
 * // Custom width
 * <SelectTrigger className="w-[200px]">
 *   <SelectValue />
 * </SelectTrigger>
 * ```
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * SelectScrollUpButton - Scroll button for long option lists
 *
 * Appears at the top of the dropdown when there are more options above.
 * Automatically shown/hidden by Radix UI based on scroll position.
 *
 * Typically not used directly - included automatically in SelectContent.
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

/**
 * SelectScrollDownButton - Scroll button for long option lists
 *
 * Appears at the bottom of the dropdown when there are more options below.
 * Automatically shown/hidden by Radix UI based on scroll position.
 *
 * Typically not used directly - included automatically in SelectContent.
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

/**
 * SelectContent - Dropdown menu container for select options
 *
 * The popover that appears when the SelectTrigger is clicked. Contains
 * SelectItem components and optional SelectGroup/SelectLabel for organization.
 *
 * **Features:**
 * - Portal rendering (appears above other content)
 * - Smooth animations (fade + zoom + slide)
 * - Automatic positioning relative to trigger
 * - Scroll buttons for long lists
 * - Max height with overflow scrolling
 *
 * **Position Modes:**
 * - `popper` (default) - Floats above content, matches trigger width
 * - `item-aligned` - Aligns with selected item
 *
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="option1">Option 1</SelectItem>
 *   <SelectItem value="option2">Option 2</SelectItem>
 * </SelectContent>
 *
 * // With groups
 * <SelectContent>
 *   <SelectGroup>
 *     <SelectLabel>Category 1</SelectLabel>
 *     <SelectItem value="1a">Item 1A</SelectItem>
 *   </SelectGroup>
 *   <SelectSeparator />
 *   <SelectGroup>
 *     <SelectLabel>Category 2</SelectLabel>
 *     <SelectItem value="2a">Item 2A</SelectItem>
 *   </SelectGroup>
 * </SelectContent>
 * ```
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * SelectLabel - Label for a group of select options
 *
 * Non-selectable label text that describes a group of options.
 * Use inside SelectGroup to organize related options.
 *
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 * </SelectGroup>
 * ```
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * SelectItem - Individual selectable option in a dropdown
 *
 * A single option within the select dropdown. Must have a unique `value` prop.
 * Shows a check icon when selected and highlights on hover/focus.
 *
 * **Accessibility:**
 * - Keyboard navigable
 * - Focus styling
 * - Disabled state support
 * - Screen reader friendly
 *
 * **Visual States:**
 * - Default: Plain text with left padding for check icon space
 * - Hover/Focus: Accent background color
 * - Selected: Check icon appears on left
 * - Disabled: Reduced opacity, not interactive
 *
 * @example
 * ```tsx
 * <SelectItem value="apple">Apple</SelectItem>
 * <SelectItem value="banana" disabled>Banana (Out of stock)</SelectItem>
 * ```
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * SelectSeparator - Visual divider between select options or groups
 *
 * Horizontal line to separate sections of options for better visual organization.
 *
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="edit">Edit</SelectItem>
 *   <SelectSeparator />
 *   <SelectItem value="delete">Delete</SelectItem>
 * </SelectContent>
 * ```
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
