[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/changelog-parser](../README.md) / ChangelogEntry

# Interface: ChangelogEntry

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:74](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L74)

Represents a single changelog entry for a version.

Each entry corresponds to one version release with categorized changes.

## Example

```ts
const entry: ChangelogEntry = {
  version: "1.0.0",
  date: "2025-10-06",
  url: "https://github.com/user/repo/compare/v0.9.0...v1.0.0",
  categories: [
    { name: "FEATURES", emoji: "✨", items: ["New feature"] },
    { name: "BUG FIXES", emoji: "🐛", items: ["Fixed bug"] },
  ],
};
```

## Properties

### version

> **version**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:75](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L75)

Semantic version string (e.g., "1.0.0")

---

### date

> **date**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:76](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L76)

Release date in ISO format (YYYY-MM-DD) or "Unknown"

---

### url?

> `optional` **url**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:77](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L77)

Optional GitHub comparison URL for this version

---

### categories

> **categories**: [`ChangelogCategory`](ChangelogCategory.md)[]

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:78](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L78)

Array of change categories (features, fixes, etc.)
