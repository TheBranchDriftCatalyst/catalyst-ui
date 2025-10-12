[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/annotation/ComponentInspector](../README.md) / ComponentInspector

# Function: ComponentInspector()

> **ComponentInspector**(`__namedParameters`): `null` \| `Element`

Defined in: [workspace/catalyst-ui/lib/dev/annotation/ComponentInspector.tsx:190](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/annotation/ComponentInspector.tsx#L190)

ComponentInspector - Click-to-inspect React components

Features:

- Click any component to inspect it
- Shows component name, props, state
- Extracts file path and line number (dev mode)
- Visual highlight on hover

## Parameters

### \_\_namedParameters

`ComponentInspectorProps`

## Returns

`null` \| `Element`

## Example

```tsx
const [active, setActive] = useState(false);

<ComponentInspector
  active={active}
  onToggle={setActive}
  onComponentSelect={info => console.log(info)}
/>;
```
