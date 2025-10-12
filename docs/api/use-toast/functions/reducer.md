[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [use-toast](../README.md) / reducer

# Function: reducer()

> **reducer**(`state`, `action`): `State`

Defined in: [workspace/catalyst-ui/lib/ui/use-toast.ts:185](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/use-toast.ts#L185)

**`Internal`**

Toast state reducer that handles all toast lifecycle actions.

Manages toast queue with automatic limiting, dismissal scheduling,
and removal cleanup. Supports add, update, dismiss, and remove operations.

## Parameters

### state

`State`

Current toast state

### action

`Action`

Action to perform

## Returns

`State`

Updated state
