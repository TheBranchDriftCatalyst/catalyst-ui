[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogContent

# Variable: DialogContent

> `const` **DialogContent**: `ForwardRefExoticComponent`\<`DialogContentProps` & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:292](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L292)

DialogContent - Main dialog panel with content and close button

The primary container for dialog content. Automatically includes an overlay, portal rendering,
and a close button (X icon) in the top-right corner. Centered on screen with configurable
entrance/exit animations.

**Features:**

- Centered positioning (absolute center of viewport)
- Max width constraint (lg = 512px)
- Built-in close button with hover effects
- Configurable animation variants
- Focus trap and accessibility (via Radix UI)
- ESC key to close
- Click outside to close

## Example

```tsx
// Default scale animation
<DialogContent>
  <DialogHeader>
    <DialogTitle>Confirmation</DialogTitle>
  </DialogHeader>
</DialogContent>

// Custom animation
<DialogContent animation="slide-up">
  {content}
</DialogContent>

// Dramatic zoom effect
<DialogContent animation="zoom">
  <DialogHeader>
    <DialogTitle>Welcome!</DialogTitle>
  </DialogHeader>
</DialogContent>
```
