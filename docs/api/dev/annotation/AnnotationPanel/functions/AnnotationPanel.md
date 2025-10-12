[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/annotation/AnnotationPanel](../README.md) / AnnotationPanel

# Function: AnnotationPanel()

> **AnnotationPanel**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/AnnotationPanel.tsx:53](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/AnnotationPanel.tsx#L53)

Main annotation panel - Sheet with tabs for creating and viewing annotations

Features:

- "Create" tab with AnnotationForm
- "View All" tab with AnnotationList
- Status indicator for backend sync
- Export and clear actions

## Parameters

### \_\_namedParameters

`AnnotationPanelProps`

## Returns

`Element`

## Example

```tsx
const [open, setOpen] = useState(false);

<AnnotationPanel open={open} onOpenChange={setOpen} />;
```
