[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogOverlay

# Variable: DialogOverlay

> `const` **DialogOverlay**: `ForwardRefExoticComponent`\<`Omit`\<`DialogOverlayProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:188](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L188)

DialogOverlay - Semi-transparent backdrop behind dialog

Renders a dark overlay (black at 80% opacity) that covers the entire screen behind
the dialog. Includes fade-in/fade-out animations synchronized with dialog state.
Automatically managed by DialogContent.

## Example

```tsx
// Custom overlay styling
<DialogOverlay className="bg-red-500/50" />
```
