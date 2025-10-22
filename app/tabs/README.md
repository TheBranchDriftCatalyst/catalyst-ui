# Tab Components

This directory contains all tab components for the Catalyst UI application.

## Naming Convention

All tab components **must** follow this naming pattern:

- Filename: `{Name}Tab.tsx`
- Export: `export function {Name}Tab() { ... }`

## Export Pattern (REQUIRED)

**✓ Correct:**

```typescript
export function WelcomeTab() {
  return <div>Welcome</div>;
}
```

**✗ Wrong:**

```typescript
export default function WelcomeTab() {
  return <div>Welcome</div>;
}
```

## Why Named Exports?

The tab loader (`loader.ts`) uses dynamic imports that require named exports matching the filename. Using default exports will cause:

1. **Build-time error**: The eager validation in `loader.ts` will throw an error immediately
2. **Clear error message**: You'll see exactly which tab has the wrong export pattern

## Validation

The loader includes automatic validation that runs at startup:

- ✅ Checks all `*Tab.tsx` files for correct named exports
- ✅ Fails fast with clear error messages
- ✅ Lists found exports vs expected exports

## Creating a New Tab

1. Create `app/tabs/{Name}Tab.tsx`
2. Export the component: `export function {Name}Tab() { ... }`
3. The tab will be automatically discovered and added to the manifest

The build system will automatically:

- Discover your tab via glob patterns
- Generate an entry in `.tabs.manifest.json`
- Lazy-load the component for optimal performance
