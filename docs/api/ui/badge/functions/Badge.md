[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/badge](../README.md) / Badge

# Function: Badge()

> **Badge**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/ui/badge.tsx:79](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/badge.tsx#L79)

Badge - Small label for status, categories, or counts

A compact, pill-shaped badge component for displaying status indicators, tags, categories,
or notification counts. Features multiple color variants and smooth hover transitions.
Renders as an inline element that flows with text.

**Variants:**

- `default` - Primary badge with theme colors (blue/purple)
- `secondary` - Muted badge for less prominent labels (gray)
- `destructive` - Error or warning badge (red)
- `outline` - Border-only badge for subtle emphasis

**Use cases:**

- Status indicators (Active, Pending, Completed)
- Category tags (TypeScript, React, Documentation)
- Notification counts (3 unread, 12 new)
- Feature flags (Beta, New, Premium)

## Parameters

### \_\_namedParameters

[`BadgeProps`](../interfaces/BadgeProps.md)

## Returns

`Element`

## Example

```tsx
// Status badge
<Badge variant="default">Active</Badge>

// Category tag
<Badge variant="secondary">TypeScript</Badge>

// Error indicator
<Badge variant="destructive">Failed</Badge>

// Outline badge
<Badge variant="outline">Draft</Badge>

// Custom styling with notification count
<Badge className="ml-2">
  3 new
</Badge>
```
