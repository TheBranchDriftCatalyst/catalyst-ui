[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CatalystHeader/HeaderProvider](../README.md) / HeaderProvider

# Variable: HeaderProvider

> `const` **HeaderProvider**: `React.FC`\<\{ `children`: `ReactNode`; \}\>

Defined in: [workspace/catalyst-ui/lib/components/CatalystHeader/HeaderProvider.tsx:209](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CatalystHeader/HeaderProvider.tsx#L209)

HeaderProvider - Context provider for dynamic header management

Provides a context for managing header state across the application, including:

- Dynamic header component registration
- Breadcrumb navigation
- Page title management

Child components can register themselves in the header using the `useHeader` hook
and calling `registerHeaderComponent` in a useEffect. This allows for dynamic,
contextual header content that changes based on the active page or component.

## Param

Component props

## Param

Child components to wrap with HeaderProvider

## Returns

Provider component wrapping children

## Examples

Basic usage:

```tsx
function App() {
  return (
    <HeaderProvider>
      <CatalystHeader title="My App" />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HeaderProvider>
  );
}
```

Component registering itself in header:

```tsx
function SettingsPage() {
  const { registerHeaderComponent, deregisterHeaderComponent, setPageTitle } = useHeader();

  useEffect(() => {
    setPageTitle("Settings");

    const saveButton = <Button onClick={handleSave}>Save Changes</Button>;

    registerHeaderComponent(saveButton);
    return () => deregisterHeaderComponent(saveButton);
  }, []);

  return <div>Settings content...</div>;
}
```
