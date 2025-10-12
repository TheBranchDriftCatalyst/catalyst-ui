[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/context/GraphContext](../README.md) / GraphProvider

# Variable: GraphProvider

> `const` **GraphProvider**: `React.FC`\<\{ `children`: `ReactNode`; `config?`: [`GraphConfig`](../../../../../ForceGraph/config/types/interfaces/GraphConfig.md)\<`any`, `any`\>; `storageKey?`: `string`; \}\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/GraphContext.tsx:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/GraphContext.tsx#L30)

GraphProvider - Provides graph state to all child components

Features:

- Manages graph data, filters, layout, and UI state
- Persists filters to localStorage
- Restores filters from localStorage on mount
