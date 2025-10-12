[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Debug/DebugProvider](../README.md) / useDebugger

# Function: useDebugger()

> **useDebugger**(`namespace`): `Debugger`

Defined in: [workspace/catalyst-ui/lib/contexts/Debug/DebugProvider.tsx:219](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Debug/DebugProvider.tsx#L219)

Hook to access debug logger for a namespace

## Parameters

### namespace

`string`

Logger namespace (e.g., "catalyst:theme")

## Returns

`Debugger`

Debug.Debugger instance for logging

## Remarks

Must be used within a [DebuggerProvider](../variables/DebuggerProvider.md)

Logs are disabled by default. Enable via localStorage:

```javascript
localStorage.setItem("DEBUG", "catalyst:*"); // All catalyst logs
```

## Examples

```tsx
import { useDebugger } from "@/catalyst-ui/contexts/Debug";

function MyComponent() {
  const debug = useDebugger("catalyst:MyComponent");

  debug("Component rendered");
  debug("State:", { count: 5 });

  return <div>...</div>;
}
```

```tsx
import { useDebugger } from "@/catalyst-ui/contexts/Debug";

function DataFetcher() {
  const debug = useDebugger("catalyst:api:DataFetcher");

  const fetchData = async () => {
    debug("Starting fetch...");
    try {
      const res = await fetch("/api/data");
      debug("Response status:", res.status);
      const json = await res.json();
      debug("Data received:", json);
    } catch (error) {
      debug("Fetch failed:", error);
    }
  };

  return <button onClick={fetchData}>Fetch</button>;
}
```
