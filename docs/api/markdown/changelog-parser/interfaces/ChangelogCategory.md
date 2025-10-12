[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/changelog-parser](../README.md) / ChangelogCategory

# Interface: ChangelogCategory

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:102](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L102)

Represents a category of changes within a changelog entry.

Categories group related changes (e.g., FEATURES, BUG FIXES, DOCUMENTATION).

## Example

```ts
const category: ChangelogCategory = {
  name: "FEATURES",
  emoji: "✨",
  items: ["Added dark mode support", "Implemented user authentication"],
};
```

## Properties

### name

> **name**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:103](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L103)

Category name in uppercase (e.g., "FEATURES", "BUG FIXES")

---

### emoji?

> `optional` **emoji**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:104](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L104)

Optional emoji prefix (e.g., "✨", "🐛", "📚")

---

### items

> **items**: `string`[]

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:105](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L105)

Array of change descriptions
