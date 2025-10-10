[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [utils/markdown/changelog-parser](../README.md) / changelogEntryToTimelineData

# Function: changelogEntryToTimelineData()

> **changelogEntryToTimelineData**(`entry`): `object`

Defined in: [workspace/catalyst-ui/lib/utils/markdown/changelog-parser.ts:185](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/markdown/changelog-parser.ts#L185)

Convert changelog entry to timeline-friendly format

## Parameters

### entry

[`ChangelogEntry`](../interfaces/ChangelogEntry.md)

## Returns

`object`

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
