[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogDescription

# Variable: DialogDescription

> `const` **DialogDescription**: `ForwardRefExoticComponent`\<`Omit`\<`DialogDescriptionProps` & `RefAttributes`\<`HTMLParagraphElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLParagraphElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:417](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L417)

DialogDescription - Supporting text for the dialog

Muted text that provides additional context below the DialogTitle.
Important for accessibility - screen readers use this for the dialog description.
Use inside DialogHeader below DialogTitle.

**Accessibility:**
Radix UI automatically connects this to the dialog's aria-describedby attribute.

## Example

```tsx
<DialogDescription>
  You are about to perform a permanent action. Please review carefully before proceeding.
</DialogDescription>
```
