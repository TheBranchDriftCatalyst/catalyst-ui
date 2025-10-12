[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/changelog-parser](../README.md) / changelogEntryToTimelineData

# Function: changelogEntryToTimelineData()

> **changelogEntryToTimelineData**(`entry`): `object`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:477](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L477)

Convert a changelog entry to timeline-compatible format.

Flattens the nested category structure into a flat array of achievements
suitable for display in a timeline component. Combines category emoji/name
with each change item.

## Parameters

### entry

[`ChangelogEntry`](../interfaces/ChangelogEntry.md)

Parsed changelog entry

## Returns

`object`

Timeline-ready data structure

### date

> **date**: `string` = `entry.date`

### version

> **version**: `string` = `entry.version`

### url

> **url**: `undefined` \| `string` = `entry.url`

### repoBaseUrl

> **repoBaseUrl**: `undefined` \| `string`

### achievements

> **achievements**: `object`[]

## Examples

```ts
const entry: ChangelogEntry = {
  version: "1.0.0",
  date: "2025-10-06",
  url: "https://github.com/user/repo/compare/v0.9.0...v1.0.0",
  categories: [
    {
      name: "FEATURES",
      emoji: "✨",
      items: ["Added dark mode", "Implemented search"],
    },
    {
      name: "BUG FIXES",
      emoji: "🐛",
      items: ["Fixed memory leak"],
    },
  ],
};

const timelineData = changelogEntryToTimelineData(entry);
console.log(timelineData.version); // "1.0.0"
console.log(timelineData.date); // "2025-10-06"
console.log(timelineData.achievements.length); // 3
console.log(timelineData.achievements[0].text); // "✨ FEATURES: Added dark mode"
console.log(timelineData.achievements[1].text); // "✨ FEATURES: Implemented search"
console.log(timelineData.achievements[2].text); // "🐛 BUG FIXES: Fixed memory leak"
```

```ts
const entry: ChangelogEntry = {
  version: "0.5.0",
  date: "2025-09-01",
  categories: [{ name: "DOCUMENTATION", items: ["Updated README"] }],
};

const timelineData = changelogEntryToTimelineData(entry);
console.log(timelineData.achievements[0].text); // "• DOCUMENTATION: Updated README"
```

## See

[ChangelogEntry](../interfaces/ChangelogEntry.md) for input type
