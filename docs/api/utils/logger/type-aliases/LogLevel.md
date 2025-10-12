[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / LogLevel

# Type Alias: LogLevel

> **LogLevel** = `"debug"` \| `"info"` \| `"warn"` \| `"error"`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L22)

Centralized logging utility with environment-aware log levels

Features:

- Structured logging with consistent format
- Log level filtering (debug, info, warn, error)
- Automatic environment detection (dev vs prod)
- Context injection for better debugging
- Type-safe logging methods

Usage:

```tsx
import { logger } from "@/catalyst-ui/utils/logger";

logger.debug("ForceGraph", "Node selected", { nodeId: 123 });
logger.info("ThemeProvider", "Theme changed", { theme: "dark" });
logger.warn("FormValidation", "Invalid input", { field: "email" });
logger.error("ApiService", "Request failed", error);
```
