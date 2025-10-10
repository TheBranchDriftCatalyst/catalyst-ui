[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/utils/layouts](../README.md) / LayoutConfigs

# Variable: LayoutConfigs

> `const` **LayoutConfigs**: `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layouts.ts:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layouts.ts#L30)

## Type Declaration

### force

> **force**: `object` = `ForceLayoutConfig`

#### force.name

> **name**: `string` = `"Force-Directed"`

#### force.description

> **description**: `string` = `"Physics-based force simulation for natural graph layouts"`

#### force.fields

> **fields**: `object`[]

### structured

> **structured**: `object` = `StructuredLayoutConfig`

#### structured.name

> **name**: `string` = `"Structured (Columns)"`

#### structured.description

> **description**: `string` = `"Organizes nodes into vertical columns by type"`

#### structured.fields

> **fields**: `object`[]

### community

> **community**: `object` = `CommunityLayoutConfig`

#### community.name

> **name**: `string` = `"Community (Smart)"`

#### community.description

> **description**: `string` = `"Groups related nodes using community detection with calculated positioning"`

#### community.fields

> **fields**: (\{ `key`: `string`; `label`: `string`; `type`: `"select"`; `options`: `object`[]; `defaultValue`: `string`; `description`: `string`; `min?`: `undefined`; `max?`: `undefined`; `step?`: `undefined`; \} \| \{ `options?`: `undefined`; `key`: `string`; `label`: `string`; `type`: `"number"`; `min`: `number`; `max`: `number`; `step`: `number`; `defaultValue`: `number`; `description`: `string`; \})[]

### dagre

> **dagre**: `object` = `DagreLayoutConfig`

#### dagre.name

> **name**: `string` = `"Dagre (Mermaid)"`

#### dagre.description

> **description**: `string` = `"Layered graph layout algorithm used by Mermaid.js"`

#### dagre.fields

> **fields**: (\{ `min?`: `undefined`; `max?`: `undefined`; `step?`: `undefined`; `key`: `string`; `label`: `string`; `type`: `"select"`; `options`: `object`[]; `defaultValue`: `string`; \} \| \{ `options?`: `undefined`; `key`: `string`; `label`: `string`; `type`: `"number"`; `min`: `number`; `max`: `number`; `step`: `number`; `defaultValue`: `number`; \})[]

### elk

> **elk**: `object` = `ELKLayoutConfig`

#### elk.name

> **name**: `string` = `"ELK (Advanced)"`

#### elk.description

> **description**: `string` = `"Eclipse Layout Kernel with multiple advanced algorithms"`

#### elk.fields

> **fields**: (\{ `min?`: `undefined`; `max?`: `undefined`; `step?`: `undefined`; `key`: `string`; `label`: `string`; `type`: `"select"`; `options`: `object`[]; `defaultValue`: `string`; `description`: `string`; \} \| \{ `options?`: `undefined`; `key`: `string`; `label`: `string`; `type`: `"number"`; `min`: `number`; `max`: `number`; `step`: `number`; `defaultValue`: `number`; `description`: `string`; \})[]
