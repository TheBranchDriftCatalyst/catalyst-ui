[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogTitle

# Variable: DialogTitle

> `const` **DialogTitle**: `ForwardRefExoticComponent`\<`Omit`\<`DialogTitleProps` & `RefAttributes`\<`HTMLHeadingElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLHeadingElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:387](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L387)

DialogTitle - Primary heading for the dialog

Renders as a semantically correct heading with prominent typography.
Required for accessibility - screen readers announce this as the dialog title.
Use inside DialogHeader for proper spacing.

**Accessibility:**
Radix UI automatically connects this to the dialog's aria-labelledby attribute.

## Example

```tsx
<DialogTitle>Confirm Your Action</DialogTitle>
```
