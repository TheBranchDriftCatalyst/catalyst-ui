[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogProvider

# Variable: DialogProvider

> `const` **DialogProvider**: `React.FC`\<\{ `children`: `React.ReactNode`; \}\>

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:63](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L63)

DialogProvider - Context provider for imperative dialog control

Wraps your application (or a subtree) to enable programmatic dialog management
via the `useDialog` hook. Allows opening dialogs from anywhere in the component tree
without prop drilling or state management.

**Use case:**
When you need to trigger dialogs from deep in the component tree (e.g., from buttons,
forms, or event handlers) without passing callbacks through multiple layers.

## Example

```tsx
// Wrap your app
function App() {
  return (
    <DialogProvider>
      <YourComponents />
    </DialogProvider>
  );
}

// Use anywhere in the tree
function SomeButton() {
  const { openDialog } = useDialog();

  return (
    <Button
      onClick={() =>
        openDialog(
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
          </DialogContent>
        )
      }
    >
      Open Dialog
    </Button>
  );
}
```
