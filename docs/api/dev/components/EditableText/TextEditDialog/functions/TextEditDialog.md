[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [dev/components/EditableText/TextEditDialog](../README.md) / TextEditDialog

# Function: TextEditDialog()

> **TextEditDialog**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/TextEditDialog.tsx:64](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/TextEditDialog.tsx#L64)

TextEditDialog - Modal for editing translation text

Shows:

- Translation key and file path
- Textarea for editing text
- Save/Cancel buttons

On save:

- Updates LocalizationContext (offline)
- Shows toast notification
- Closes dialog
- Text updates immediately via i18next resource update

## Parameters

### \_\_namedParameters

`TextEditDialogProps`

## Returns

`Element`
