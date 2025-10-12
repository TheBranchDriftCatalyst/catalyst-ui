[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / useDialog

# Function: useDialog()

> **useDialog**(): `DialogContextType`

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:127](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L127)

useDialog - Hook for imperative dialog control

Access dialog methods to programmatically open and close dialogs from anywhere
in the component tree. Must be used within a DialogProvider.

**Returns:**

- `openDialog(children)` - Function to open a dialog with given content
- `closeDialog()` - Function to close the currently open dialog

## Returns

`DialogContextType`

## Throws

Error if used outside of DialogProvider

## Example

```tsx
function DeleteButton({ itemId }) {
  const { openDialog, closeDialog } = useDialog();

  const handleDelete = () => {
    openDialog(
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteItem(itemId);
              closeDialog();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  return <Button onClick={handleDelete}>Delete</Button>;
}
```
