[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / markdown/changelog-parser

# markdown/changelog-parser

## Description

Specialized parser for conventional CHANGELOG.md files.

Parses structured changelog markdown into timeline-ready data with versions,
dates, categories, and change entries. Designed for Conventional Changelog format.

**Expected CHANGELOG.md structure:**

```markdown
## [1.0.0](https://github.com/user/repo/compare/v0.9.0...v1.0.0) (2025-10-06)

### ✨ FEATURES

- Added new feature X
- Implemented feature Y

### 🐛 BUG FIXES

- Fixed issue with Z
```

**Parsing rules:**

- H2 headers = Version entries with optional date and comparison URL
- H3 headers = Categories (FEATURES, BUG FIXES, etc.) with optional emoji
- Lists = Change items under each category

## Example

```ts
import { parseChangelog } from "@/catalyst-ui/utils/markdown/changelog-parser";

const changelogMd = `
## [1.0.0](https://github.com/user/repo/compare/v0.9.0...v1.0.0) (2025-10-06)

### ✨ FEATURES
- Added new feature

### 🐛 BUG FIXES
- Fixed critical bug
`;

const entries = parseChangelog(changelogMd);
// entries[0].version === "1.0.0"
// entries[0].categories[0].name === "FEATURES"
// entries[0].categories[0].emoji === "✨"
```

## See

[parseMarkdown](../parser/functions/parseMarkdown.md) for underlying markdown parsing

## Interfaces

- [ChangelogEntry](interfaces/ChangelogEntry.md)
- [ChangelogCategory](interfaces/ChangelogCategory.md)

## Functions

- [parseChangelog](functions/parseChangelog.md)
- [changelogEntryToTimelineData](functions/changelogEntryToTimelineData.md)
