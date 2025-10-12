[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CatalystHeader/HeaderProvider](../README.md) / useHeader

# Function: useHeader()

> **useHeader**(): `HeaderContextType`

Defined in: [workspace/catalyst-ui/lib/components/CatalystHeader/HeaderProvider.tsx:147](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CatalystHeader/HeaderProvider.tsx#L147)

Hook to access the HeaderContext

Provides access to header state and methods for managing header components,
breadcrumbs, and page title. Must be used within a HeaderProvider.

## Returns

`HeaderContextType`

HeaderContextType object with state and methods

## Throws

If used outside of HeaderProvider

## Example

```tsx
function MyPage() {
  const { setPageTitle, setBreadcrumbs } = useHeader();

  useEffect(() => {
    setPageTitle("My Page");
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: "My Page" }]);
  }, []);

  return <div>Page content</div>;
}
```
