[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [dev/components/EditableText/EditableText](../README.md) / EditableText

# Function: EditableText()

> **EditableText**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/EditableText.tsx:62](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/EditableText.tsx#L62)

EditableText wrapper component that makes text editable in dev mode

In development:

- Shows edit icon (✏️) on hover
- Clicking icon opens edit dialog
- Changes are saved locally and can be dumped
- Edited text shows a subtle red dotted underline (dirty state)
- Supports Ctrl+Z to undo changes

In production:

- Completely transparent (no overhead)
- Only renders children

## Parameters

### \_\_namedParameters

`EditableTextProps`

## Returns

`Element`

## Example

```tsx
import { EditableText } from "@/catalyst-ui/components/EditableText";
import { useTranslation } from "react-i18next";

function WelcomePage() {
  const { t } = useTranslation("common");

  return (
    <h1>
      <EditableText id="app.title" namespace="common">
        {t("app.title", "Catalyst UI")}
      </EditableText>
    </h1>
  );
}
```
