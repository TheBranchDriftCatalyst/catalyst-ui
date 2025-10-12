[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Debug/DebugProvider](../README.md) / DebuggerProvider

# Variable: DebuggerProvider

> `const` **DebuggerProvider**: `React.FC`\<`DebuggerProviderProps`\>

Defined in: [workspace/catalyst-ui/lib/contexts/Debug/DebugProvider.tsx:145](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Debug/DebugProvider.tsx#L145)

Debug provider component - manages debug logger instances

## Param

Component props

## Param

Child components to render

## Remarks

This provider should wrap your application (typically in `App.tsx`).
It provides centralized debug logging using the `debug` package.

**Features:**

- Namespace-based logging (e.g., "catalyst:theme", "catalyst:api")
- Logger caching to avoid recreation
- Controlled via localStorage `DEBUG` key
- Supports wildcards: `DEBUG=catalyst:*`

**How to enable debug logs:**

1. Open browser DevTools Console
2. Run: `localStorage.setItem('DEBUG', 'catalyst:*')`
3. Refresh page
4. All catalyst logs will appear in console

**Namespace conventions:**

- Use colon-separated hierarchy: `catalyst:context:theme`
- Use wildcards for filtering: `catalyst:*` or `catalyst:context:*`
- Component logs: `catalyst:component:ForceGraph`
- Context logs: `catalyst:context:theme`
- API logs: `catalyst:api:fetch`

## Examples

```tsx
// App.tsx
import { DebuggerProvider } from "@/catalyst-ui/contexts/Debug";

function App() {
  return (
    <DebuggerProvider>
      <YourApp />
    </DebuggerProvider>
  );
}
```

```tsx
import { useDebugger } from "@/catalyst-ui/contexts/Debug";

function MyComponent() {
  const debug = useDebugger("catalyst:component:MyComponent");

  useEffect(() => {
    debug("Component mounted");
    debug("Props:", props);
  }, []);

  return <div>...</div>;
}
```

```tsx
import { useDebugger } from "@/catalyst-ui/contexts/Debug";

export function useFetchData(url: string) {
  const debug = useDebugger("catalyst:hooks:useFetchData");

  const [data, setData] = useState(null);

  useEffect(() => {
    debug("Fetching:", url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        debug("Received:", json);
        setData(json);
      });
  }, [url]);

  return data;
}
```
