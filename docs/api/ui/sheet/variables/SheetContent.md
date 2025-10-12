[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/sheet](../README.md) / SheetContent

# Variable: SheetContent

> `const` **SheetContent**: `ForwardRefExoticComponent`\<`SheetContentProps` & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/sheet.tsx:237](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/sheet.tsx#L237)

SheetContent - The main content panel of the sheet.

Slides in from specified screen edge with backdrop overlay.
Includes automatic close button and portal rendering.

## Component

## Param

Edge to slide from: "top" | "right" | "bottom" | "left" (default: "right")

## Param

Additional CSS classes

## Param

Sheet content

## Examples

```tsx
// Right-side sheet (default)
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
    </SheetHeader>
    <div>Your content here</div>
  </SheetContent>
</Sheet>
```

```tsx
// Left-side navigation drawer
<Sheet>
  <SheetTrigger>Menu</SheetTrigger>
  <SheetContent side="left">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </SheetContent>
</Sheet>
```

```tsx
// Bottom sheet for mobile filters
<Sheet>
  <SheetTrigger>Filters</SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Filter Options</SheetTitle>
    </SheetHeader>
    <FilterForm />
  </SheetContent>
</Sheet>
```

## Accessibility

- Traps focus within sheet when open
- Closes on Escape key
- Restores focus to trigger on close
- ARIA attributes managed by Radix UI
- Backdrop click closes sheet
