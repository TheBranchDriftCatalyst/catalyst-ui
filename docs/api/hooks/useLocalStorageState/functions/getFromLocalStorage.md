[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLocalStorageState](../README.md) / getFromLocalStorage

# Function: getFromLocalStorage()

> **getFromLocalStorage**\<`T`\>(`key`, `defaultValue`): `T`

Defined in: [workspace/catalyst-ui/lib/hooks/useLocalStorageState.ts:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLocalStorageState.ts#L33)

getFromLocalStorage - Safely retrieves and deserializes data from localStorage

Attempts to read a value from localStorage by key, parse it as JSON, and return
it with the expected type. If localStorage is unavailable (SSR, private browsing)
or the key doesn't exist, returns the provided default value.

## Type Parameters

### T

`T`

The type of the value being retrieved

## Parameters

### key

`string`

The localStorage key to read from

### defaultValue

`T`

Fallback value if key doesn't exist or localStorage unavailable

## Returns

`T`

The parsed value from localStorage, or defaultValue if not found

## Example

```tsx
const theme = getFromLocalStorage<string>("app-theme", "dark");
const settings = getFromLocalStorage<UserSettings>("user-settings", defaultSettings);
```

## Note

This function is SSR-safe and will return defaultValue during server-side rendering

## Note

Logs a warning if localStorage is unavailable but continues gracefully

## See

[setToLocalStorage](setToLocalStorage.md) for the corresponding setter function
