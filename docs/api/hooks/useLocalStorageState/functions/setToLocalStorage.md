[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLocalStorageState](../README.md) / setToLocalStorage

# Function: setToLocalStorage()

> **setToLocalStorage**\<`T`\>(`key`, `value`): `void`

Defined in: [workspace/catalyst-ui/lib/hooks/useLocalStorageState.ts:69](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLocalStorageState.ts#L69)

setToLocalStorage - Safely serializes and stores data in localStorage

Attempts to serialize a value as JSON and store it in localStorage under the
specified key. If localStorage is unavailable (SSR, private browsing, quota exceeded),
logs a warning and fails silently without throwing an error.

## Type Parameters

### T

`T`

The type of the value being stored

## Parameters

### key

`string`

The localStorage key to write to

### value

`T`

The value to serialize and store

## Returns

`void`

## Example

```tsx
setToLocalStorage("app-theme", "dark");
setToLocalStorage("user-settings", { notifications: true, theme: "light" });
setToLocalStorage("recent-searches", ["react", "typescript", "vite"]);
```

## Warning

This function uses JSON.stringify, so values must be JSON-serializable.
Functions, Symbols, and circular references will cause serialization to fail.

## Note

This function is SSR-safe and will no-op during server-side rendering

## Note

Does not throw on localStorage quota exceeded - check browser console for warnings

## See

[getFromLocalStorage](getFromLocalStorage.md) for the corresponding getter function
