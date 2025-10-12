"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * DropdownMenu - Root component for dropdown menu state management
 *
 * Radix UI DropdownMenu primitive that handles open/close state, positioning, and accessibility.
 * Use this as the root wrapper for all dropdown menus.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const DropdownMenu = DropdownMenuPrimitive.Root;

/**
 * DropdownMenuTrigger - Button/element that opens the dropdown
 *
 * Radix UI trigger primitive that automatically connects to the DropdownMenu state.
 * Renders as a button by default but can be composed with any element using asChild.
 *
 * @example
 * ```tsx
 * <DropdownMenuTrigger asChild>
 *   <Button variant="outline">Actions</Button>
 * </DropdownMenuTrigger>
 * ```
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/**
 * DropdownMenuGroup - Logical grouping for menu items
 *
 * Groups related menu items together. Does not add visual styling - use
 * DropdownMenuSeparator between groups for visual separation.
 *
 * @example
 * ```tsx
 * <DropdownMenuGroup>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 * </DropdownMenuGroup>
 * ```
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * DropdownMenuPortal - Portal for rendering menu outside DOM hierarchy
 *
 * Radix UI portal primitive that renders menu content in a portal at document.body.
 * Usually not used directly - DropdownMenuContent handles this automatically.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * DropdownMenuSub - Root component for nested sub-menus
 *
 * Container for creating nested dropdown menus. Use with DropdownMenuSubTrigger
 * and DropdownMenuSubContent to create hierarchical menu structures.
 *
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * DropdownMenuRadioGroup - Container for mutually exclusive radio items
 *
 * Groups DropdownMenuRadioItem components for single-selection behavior.
 * Only one radio item can be selected at a time within the group.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
 *   <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/**
 * DropdownMenuSubTrigger - Trigger for opening nested sub-menus
 *
 * Menu item that opens a nested sub-menu on hover or click. Automatically includes
 * a chevron-right icon to indicate expandability. Use within DropdownMenuSub.
 *
 * **Props:**
 * - `inset` - Add extra left padding to align with checkbox/radio items
 *
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>
 *     Export Options
 *   </DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Export as PDF</DropdownMenuItem>
 *     <DropdownMenuItem>Export as CSV</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

/**
 * DropdownMenuSubContent - Container for nested sub-menu items
 *
 * Popover content for nested sub-menus. Automatically positions itself relative
 * to the trigger and includes smooth animations. Minimum width of 8rem.
 * Use within DropdownMenuSub after DropdownMenuSubTrigger.
 *
 * @example
 * ```tsx
 * <DropdownMenuSubContent>
 *   <DropdownMenuItem>Nested Item 1</DropdownMenuItem>
 *   <DropdownMenuItem>Nested Item 2</DropdownMenuItem>
 * </DropdownMenuSubContent>
 * ```
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

/**
 * DropdownMenuContent - Main popover container for menu items
 *
 * The primary container for dropdown menu items. Automatically positioned relative to
 * the trigger with collision detection. Includes smooth zoom and slide animations based
 * on placement side. Renders in a portal at document.body for proper z-index stacking.
 *
 * **Features:**
 * - Automatic positioning with collision detection
 * - Minimum width of 8rem
 * - Smooth entrance/exit animations
 * - 4px default offset from trigger
 * - Click outside to close
 * - ESC key to close
 *
 * @example
 * ```tsx
 * // Default positioning
 * <DropdownMenuContent>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 * </DropdownMenuContent>
 *
 * // Custom offset
 * <DropdownMenuContent sideOffset={8}>
 *   {items}
 * </DropdownMenuContent>
 * ```
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

/**
 * DropdownMenuItem - Individual menu item for actions
 *
 * A clickable menu item that triggers an action when selected. Includes hover/focus
 * states and supports disabled state. Can be used with `asChild` for custom elements.
 *
 * **Props:**
 * - `inset` - Add extra left padding to align with checkbox/radio items
 * - `onSelect` - Callback fired when item is clicked or Enter is pressed
 *
 * @example
 * ```tsx
 * <DropdownMenuItem onSelect={() => handleEdit()}>
 *   Edit Profile
 * </DropdownMenuItem>
 *
 * // With icon and inset alignment
 * <DropdownMenuItem inset>
 *   <PencilIcon className="mr-2 h-4 w-4" />
 *   Edit
 * </DropdownMenuItem>
 *
 * // Disabled item
 * <DropdownMenuItem disabled>
 *   Coming Soon
 * </DropdownMenuItem>
 * ```
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

/**
 * DropdownMenuCheckboxItem - Toggleable checkbox menu item
 *
 * A menu item with checkbox behavior for toggling boolean states. Displays a check
 * icon when checked. Use for multi-select options where multiple items can be active.
 *
 * **Props:**
 * - `checked` - Boolean or "indeterminate" state
 * - `onCheckedChange` - Callback fired when checkbox state changes
 *
 * @example
 * ```tsx
 * <DropdownMenuCheckboxItem
 *   checked={showToolbar}
 *   onCheckedChange={setShowToolbar}
 * >
 *   Show Toolbar
 * </DropdownMenuCheckboxItem>
 *
 * // Multiple checkboxes for settings
 * <DropdownMenuCheckboxItem
 *   checked={settings.notifications}
 *   onCheckedChange={(checked) => updateSettings({ notifications: checked })}
 * >
 *   Enable Notifications
 * </DropdownMenuCheckboxItem>
 * ```
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

/**
 * DropdownMenuRadioItem - Single-selection radio menu item
 *
 * A menu item with radio button behavior for mutually exclusive selections.
 * Displays a filled circle when selected. Use within DropdownMenuRadioGroup
 * where only one option can be selected at a time.
 *
 * **Props:**
 * - `value` - Unique value for this radio option
 * - RadioGroup manages selection via `value` and `onValueChange` props
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
 *   <DropdownMenuRadioItem value="name">
 *     Sort by Name
 *   </DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="date">
 *     Sort by Date
 *   </DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="size">
 *     Sort by Size
 *   </DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

/**
 * DropdownMenuLabel - Non-interactive label for grouping menu items
 *
 * A text label that provides context or categorization for groups of menu items.
 * Not focusable or clickable. Typically placed at the top of a group.
 *
 * **Props:**
 * - `inset` - Add extra left padding to align with checkbox/radio items
 *
 * @example
 * ```tsx
 * <DropdownMenuLabel>My Account</DropdownMenuLabel>
 * <DropdownMenuSeparator />
 * <DropdownMenuItem>Profile</DropdownMenuItem>
 * <DropdownMenuItem>Settings</DropdownMenuItem>
 *
 * // With inset alignment
 * <DropdownMenuLabel inset>Actions</DropdownMenuLabel>
 * ```
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

/**
 * DropdownMenuSeparator - Visual divider between menu sections
 *
 * A thin horizontal line to separate groups of menu items for better visual organization.
 * Use between logical groups to improve menu scanability.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>Edit</DropdownMenuItem>
 * <DropdownMenuItem>Duplicate</DropdownMenuItem>
 * <DropdownMenuSeparator />
 * <DropdownMenuItem>Archive</DropdownMenuItem>
 * <DropdownMenuItem>Delete</DropdownMenuItem>
 * ```
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

/**
 * DropdownMenuShortcut - Keyboard shortcut hint display
 *
 * A small text component for displaying keyboard shortcuts next to menu items.
 * Automatically positioned to the right with muted styling. Does not implement
 * the actual keyboard functionality - use for display only.
 *
 * **Note:** This is purely visual. Implement actual keyboard shortcuts separately
 * using onKeyDown handlers or a keyboard shortcut library.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   Save
 *   <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
 * </DropdownMenuItem>
 *
 * <DropdownMenuItem>
 *   Copy
 *   <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
 * </DropdownMenuItem>
 *
 * <DropdownMenuItem>
 *   Delete
 *   <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
