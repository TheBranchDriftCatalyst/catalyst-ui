[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [utils/mermaid/flowchartToGraphConfig](../README.md) / MermaidFlowChartGraphConfigurator

# Class: MermaidFlowChartGraphConfigurator

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:119](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L119)

Mermaid Flowchart to ForceGraph Configurator

## Constructors

### Constructor

> **new MermaidFlowChartGraphConfigurator**(`mermaidText`, `options`): `MermaidFlowChartGraphConfigurator`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:125](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L125)

#### Parameters

##### mermaidText

`string`

##### options

[`ConfiguratorOptions`](../interfaces/ConfiguratorOptions.md) = `{}`

#### Returns

`MermaidFlowChartGraphConfigurator`

## Methods

### generateConfig()

> **generateConfig**(): [`GraphConfig`](../../../../components/ForceGraph/config/types/interfaces/GraphConfig.md)\<`string`, `string`\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:144](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L144)

Generate complete GraphConfig

#### Returns

[`GraphConfig`](../../../../components/ForceGraph/config/types/interfaces/GraphConfig.md)\<`string`, `string`\>

---

### generateData()

> **generateData**(): [`GraphData`](../../../../components/ForceGraph/types/interfaces/GraphData.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:158](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L158)

Generate GraphData from parsed Mermaid

#### Returns

[`GraphData`](../../../../components/ForceGraph/types/interfaces/GraphData.md)

---

### getParsedData()

> **getParsedData**(): [`ParsedMermaid`](../../types/interfaces/ParsedMermaid.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:203](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L203)

Get parsed Mermaid data

#### Returns

[`ParsedMermaid`](../../types/interfaces/ParsedMermaid.md)
