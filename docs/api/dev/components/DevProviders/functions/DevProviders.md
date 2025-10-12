[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/components/DevProviders](../README.md) / DevProviders

# Function: DevProviders()

> **DevProviders**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/components/DevProviders.tsx:24](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/DevProviders.tsx#L24)

Conditional wrapper for dev-mode providers

In development (or when VITE_CATALYST_DEV_UTILS_ENABLED=true):

- Wraps children with LocalizationProvider and AnnotationProvider
- Enables live translation editing and component annotations

In production (when flag not set):

- Renders children directly (pass-through)
- Entire dev provider code can be tree-shaken

This ensures dev utilities are completely removed from production bundles
when not explicitly enabled.

## Parameters

### \_\_namedParameters

`DevProvidersProps`

## Returns

`Element`
