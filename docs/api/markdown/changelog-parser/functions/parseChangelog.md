[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [markdown/changelog-parser](../README.md) / parseChangelog

# Function: parseChangelog()

> **parseChangelog**(`markdown`): [`ChangelogEntry`](../interfaces/ChangelogEntry.md)[]

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:299](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L299)

Parse a CHANGELOG.md file into structured entries.

Transforms conventional changelog markdown into a structured format suitable
for rendering timelines or displaying version history. Supports GitHub
comparison URLs and emoji-prefixed categories.

**Expected structure:**

```markdown
## [version](comparison-url) (YYYY-MM-DD)

### emoji CATEGORY_NAME

- Change item 1
- Change item 2
```

**Parsing algorithm:**

1. Parse markdown to AST via [parseMarkdown](../../parser/functions/parseMarkdown.md)
2. Iterate through AST nodes:
   - H2 = Version header (extracts version, date, URL)
   - H3 = Category header (extracts name and emoji)
   - List = Change items for current category
3. Group changes into categories within entries

## Parameters

### markdown

`string`

Raw CHANGELOG.md content

## Returns

[`ChangelogEntry`](../interfaces/ChangelogEntry.md)[]

Array of structured changelog entries, newest first

## Examples

```ts
const changelog = `
## [1.0.0](https://github.com/user/repo/compare/v0.9.0...v1.0.0) (2025-10-06)

### ✨ FEATURES
- Added dark mode
- Implemented search

### 🐛 BUG FIXES
- Fixed memory leak
`;

const entries = parseChangelog(changelog);
console.log(entries[0].version); // "1.0.0"
console.log(entries[0].date); // "2025-10-06"
console.log(entries[0].categories[0].name); // "FEATURES"
console.log(entries[0].categories[0].emoji); // "✨"
console.log(entries[0].categories[0].items.length); // 2
```

```ts
const changelog = `
## [0.5.0](https://github.com/user/repo/compare/v0.4.0...v0.5.0)

### 📚 DOCUMENTATION
- Updated README
`;

const entries = parseChangelog(changelog);
console.log(entries[0].date); // "Unknown"
```

```ts
const changelog = `
## [2.0.0] (2025-11-01)
### 💥 BREAKING CHANGES
- Removed deprecated API

## [1.5.0] (2025-10-15)
### ✨ FEATURES
- New feature
`;

const entries = parseChangelog(changelog);
console.log(entries.length); // 2
console.log(entries[0].version); // "2.0.0"
console.log(entries[1].version); // "1.5.0"
```

## See

- [ChangelogEntry](../interfaces/ChangelogEntry.md) for return type structure
- [changelogEntryToTimelineData](changelogEntryToTimelineData.md) to convert entries for timeline display
