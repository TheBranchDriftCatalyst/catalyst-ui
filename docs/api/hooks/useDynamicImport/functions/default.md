[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useDynamicImport](../README.md) / default

# Function: default()

> **default**(`iconName`): `object`

Defined in: [workspace/catalyst-ui/lib/hooks/useDynamicImport.ts:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useDynamicImport.ts#L87)

useDynamicImport - Dynamically imports icons from @icons-pack/react-simple-icons

This hook provides lazy loading for icon components, reducing initial bundle size
by loading icons only when needed. It handles the asynchronous import process
and provides both the loaded component and any errors that occur during loading.

The hook is particularly useful for applications that use many icons but don't
need all of them loaded upfront. It automatically retries when the icon name changes.

## Parameters

### iconName

`string`

The name of the icon to import (without file extension)

## Returns

`object`

Object containing the loaded IconComponent (or null if loading/failed) and any import error

### IconComponent

> **IconComponent**: `null` \| `ComponentType`\<\{ \}\>

### error

> **error**: `null` \| `Error`

## Examples

```tsx
// Basic usage
const { IconComponent, error } = useDynamicImport("SiReact");

if (error) {
  return <div>Failed to load icon: {error.message}</div>;
}

if (!IconComponent) {
  return <div>Loading icon...</div>;
}

return <IconComponent />;
```

```tsx
// With dynamic icon selection
function TechIcon({ tech }: { tech: string }) {
  const iconMap: Record<string, string> = {
    react: "SiReact",
    typescript: "SiTypescript",
    nodejs: "SiNodedotjs",
  };

  const { IconComponent, error } = useDynamicImport(iconMap[tech] || "SiQuestion");

  return IconComponent ? <IconComponent /> : <span>?</span>;
}
```

```tsx
// With loading state and error handling
function IconDisplay({ iconName }: { iconName: string }) {
  const { IconComponent, error } = useDynamicImport(iconName);

  if (error) {
    return (
      <div className="icon-error" role="alert">
        <span>Icon not found</span>
      </div>
    );
  }

  if (!IconComponent) {
    return (
      <div className="icon-loading" aria-label="Loading icon">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="icon-wrapper">
      <IconComponent />
    </div>
  );
}
```

## Warning

This hook is specifically designed for @icons-pack/react-simple-icons.
The import path is hardcoded and cannot be customized for other icon libraries.

## Note

The icon component is memoized and will only re-import if iconName changes.
Errors are logged to the console with the "useDynamicImport" logger namespace.
