[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLocalStorageState](../README.md) / useLocalStorageState

# Function: useLocalStorageState()

> **useLocalStorageState**\<`T`\>(`key`, `defaultValue`): \[`T`, `Dispatch`\<`SetStateAction`\<`T`\>\>\]

Defined in: [workspace/catalyst-ui/lib/hooks/useLocalStorageState.ts:36](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLocalStorageState.ts#L36)

Custom hook for managing state in local storage with synchronization across tabs/windows.

## Type Parameters

### T

`T`

## Parameters

### key

`string`

The key to use in local storage.

### defaultValue

`T`

The default value to use if no value is found in local storage.

## Returns

\[`T`, `Dispatch`\<`SetStateAction`\<`T`\>\>\]

- A tuple containing the stored value and a function to update it.
