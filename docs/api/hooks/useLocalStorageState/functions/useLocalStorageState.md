[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLocalStorageState](../README.md) / useLocalStorageState

# Function: useLocalStorageState()

> **useLocalStorageState**\<`T`\>(`key`, `defaultValue`): \[`T`, `Dispatch`\<`SetStateAction`\<`T`\>\>\]

Defined in: [workspace/catalyst-ui/lib/hooks/useLocalStorageState.ts:190](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLocalStorageState.ts#L190)

useLocalStorageState - React state hook with localStorage persistence and cross-tab sync

This hook provides a drop-in replacement for useState that automatically persists
state to localStorage and synchronizes changes across browser tabs/windows in real-time.

Changes made in one tab are immediately reflected in all other tabs via the
`storage` event, making it ideal for user preferences, theme settings, and other
shared application state.

The hook is SSR-safe and gracefully degrades to in-memory state when localStorage
is unavailable (server-side rendering, private browsing mode, or disabled storage).

## Type Parameters

### T

`T`

The type of the state value (must be JSON-serializable)

## Parameters

### key

`string`

The localStorage key to use for persistence

### defaultValue

`T`

Initial value if no stored value exists

## Returns

\[`T`, `Dispatch`\<`SetStateAction`\<`T`\>\>\]

A tuple [value, setValue] identical to useState, with automatic persistence

## Examples

```tsx
// Basic usage - theme preference
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorageState("app-theme", "dark");

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current theme: {theme}
    </button>
  );
}
```

```tsx
// Complex object storage - user settings
interface UserSettings {
  notifications: boolean;
  autoSave: boolean;
  theme: string;
}

function SettingsPanel() {
  const [settings, setSettings] = useLocalStorageState<UserSettings>("user-settings", {
    notifications: true,
    autoSave: true,
    theme: "dark",
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={e => setSettings({ ...settings, notifications: e.target.checked })}
        />
        Enable notifications
      </label>
    </div>
  );
}
```

```tsx
// Functional updates (like useState)
function Counter() {
  const [count, setCount] = useLocalStorageState("counter", 0);

  return <button onClick={() => setCount(prev => prev + 1)}>Clicks: {count}</button>;
}
```

```tsx
// Cross-tab synchronization demo
function SyncDemo() {
  const [message, setMessage] = useLocalStorageState("shared-message", "");

  return (
    <div>
      <p>Open this page in multiple tabs and type below:</p>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type here..."
      />
      <p>Changes will sync across all tabs instantly!</p>
    </div>
  );
}
```

## Warning

Values must be JSON-serializable. Functions, Symbols, and circular
references cannot be stored. Attempting to store non-serializable values will
cause the hook to fail silently and fall back to in-memory state.

## Note

Cross-tab synchronization only works for changes made via this hook or
the `setToLocalStorage` utility. Direct `localStorage.setItem()` calls won't
trigger synchronization in other tabs.

## Note

The hook listens to the `storage` event which only fires when localStorage
is modified from a different browsing context (tab/window). Changes in the same
tab are handled via React state updates.

## See

- [getFromLocalStorage](getFromLocalStorage.md) for manual localStorage reads
- [setToLocalStorage](setToLocalStorage.md) for manual localStorage writes
- https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
