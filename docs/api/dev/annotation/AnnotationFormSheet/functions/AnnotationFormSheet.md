[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/annotation/AnnotationFormSheet](../README.md) / AnnotationFormSheet

# Function: AnnotationFormSheet()

> **AnnotationFormSheet**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/AnnotationFormSheet.tsx:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/AnnotationFormSheet.tsx#L82)

Bottom sheet for creating new annotations

Features:

- Pre-filled component identifiers from inspector
- Scope selection: "This instance" vs "All instances"
- Form validation

## Parameters

### \_\_namedParameters

`AnnotationFormSheetProps`

## Returns

`Element`

## Example

```tsx
const [open, setOpen] = useState(false);
const [component, setComponent] = useState<ComponentInfo | null>(null);

<AnnotationFormSheet open={open} onOpenChange={setOpen} selectedComponent={component} />;
```
