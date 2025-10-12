[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/annotation/AnnotationToggle](../README.md) / AnnotationToggle

# Function: AnnotationToggle()

> **AnnotationToggle**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/AnnotationToggle.tsx:47](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/AnnotationToggle.tsx#L47)

Toggle button with dropdown menu for annotation features

Provides two options:

1. View Annotations - Opens right side sheet with annotation list
2. Inspect Component - Activates inspector mode to select a component

## Parameters

### \_\_namedParameters

`AnnotationToggleProps`

## Returns

`Element`

## Example

```tsx
// In header/toolbar
<AnnotationToggle variant="ghost" showCount />

// Icon only
<AnnotationToggle size="icon" variant="outline" />
```
