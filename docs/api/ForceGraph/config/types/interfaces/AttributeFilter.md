[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / AttributeFilter

# Interface: AttributeFilter

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:268](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L268)

Configuration for a custom attribute-based filter.

## Remarks

Attribute filters allow filtering nodes based on custom logic. They can
operate on node attributes, names, or any other node properties. The filter
UI is automatically generated based on the `type` field.

Filter types:

- `boolean`: Checkbox toggle
- `select`: Dropdown menu (requires `options`)
- `text`: Text input field
- `number`: Number input field

## Example

```typescript
// Boolean filter to hide infrastructure nodes
const layer0Filter: AttributeFilter = {
  name: "layer0",
  label: "Hide Infrastructure",
  type: "boolean",
  defaultValue: false,
  patterns: ["bridge", "host", "default"],
  predicate: (enabled, node, filter) => {
    if (!enabled) return true;
    const name = node.name?.toLowerCase() || "";
    return !filter?.patterns?.some(p => name.includes(p));
  },
};

// Select filter for namespace
const namespaceFilter: AttributeFilter = {
  name: "namespace",
  label: "Namespace",
  type: "select",
  defaultValue: "all",
  options: [
    { value: "all", label: "All Namespaces" },
    { value: "production", label: "Production" },
    { value: "staging", label: "Staging" },
  ],
  predicate: (namespace, node) => {
    if (namespace === "all") return true;
    return node.attributes?.namespace === namespace;
  },
};
```

## Properties

### name

> **name**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:270](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L270)

Unique filter identifier (used as key in attributeFilterValues)

---

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:273](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L273)

Human-readable label for UI display

---

### type

> **type**: `"number"` \| `"boolean"` \| `"text"` \| `"select"`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:276](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L276)

Filter input type (determines UI component)

---

### attributePath?

> `optional` **attributePath**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:285](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L285)

Optional direct path to node attribute.

#### Remarks

If provided, can be used for simple equality checks without custom predicate.
Example: "attributes.status" to filter by node.attributes?.status

---

### predicate

> **predicate**: [`AttributeFilterPredicate`](../type-aliases/AttributeFilterPredicate.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:288](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L288)

Predicate function to evaluate whether a node passes the filter

---

### defaultValue?

> `optional` **defaultValue**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:291](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L291)

Default value when filter is initialized

---

### options?

> `optional` **options**: [`FilterOption`](FilterOption.md)\<`any`\>[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:299](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L299)

Options for select-type filters.

#### Remarks

Required when type is "select". Each option represents a value in the dropdown.

---

### patterns?

> `optional` **patterns**: `string`[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:308](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L308)

String patterns for pattern-matching filters.

#### Remarks

Useful for filters that match node names against a list of patterns.
Example: ['bridge', 'host', 'default'] for hiding Docker infrastructure.
