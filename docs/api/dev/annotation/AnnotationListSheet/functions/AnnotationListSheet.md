[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/annotation/AnnotationListSheet](../README.md) / AnnotationListSheet

# Function: AnnotationListSheet()

> **AnnotationListSheet**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/AnnotationListSheet.tsx:49](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/AnnotationListSheet.tsx#L49)

Right side sheet displaying list of all annotations

Features:

- View all annotations in a list
- Status indicator for backend sync
- Export and clear actions

## Parameters

### \_\_namedParameters

`AnnotationListSheetProps`

## Returns

`Element`

## Example

```tsx
const [open, setOpen] = useState(false);

<AnnotationListSheet open={open} onOpenChange={setOpen} />;
```
