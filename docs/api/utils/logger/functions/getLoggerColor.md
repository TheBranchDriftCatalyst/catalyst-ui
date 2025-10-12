[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / getLoggerColor

# Function: getLoggerColor()

> **getLoggerColor**(`loggerName`): `string`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:132](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L132)

getLoggerColor - Get consistent color for a logger name

Returns a color from the logger palette based on a hash of the logger name.
The same name always returns the same color, enabling visual consistency
across console output and UI components (like LoggerControl).

## Parameters

### loggerName

`string`

Name of the logger (e.g., "ForceGraph", "ThemeProvider")

## Returns

`string`

Hex color string from LOGGER_NAME_COLORS palette

## Example

```tsx
const color = getLoggerColor("ForceGraph");
// Returns "#10B981" (always the same for "ForceGraph")

// Use in UI components
<span style={{ color: getLoggerColor(loggerName) }}>{loggerName}</span>;
```

## See

LoggerControl - UI component that displays logger names with colors
