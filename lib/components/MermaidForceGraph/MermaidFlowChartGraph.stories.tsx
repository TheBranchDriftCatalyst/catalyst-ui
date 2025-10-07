import type { Meta, StoryObj } from "@storybook/react";
import { MermaidFlowChartGraph } from "./MermaidFlowChartGraph";

const meta: Meta<typeof MermaidFlowChartGraph> = {
  title: "Components/MermaidFlowChartGraph",
  component: MermaidFlowChartGraph,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MermaidFlowChartGraph>;

export const SolarPowerSystem: Story = {
  args: {
    filename: "/mermaid/solar-system.mmd",
    configuratorOptions: {
      title: "SOLAR POWER SYSTEM",
      colorStrategy: "subgraph",
    },
  },
  render: args => (
    <div className="h-screen w-full">
      <MermaidFlowChartGraph {...args} />
    </div>
  ),
};

export const BasicFlowchart: Story = {
  args: {
    mermaidText: `flowchart TB
      A[Start] --> B{Is it working?}
      B -->|Yes| C[Great!]
      B -->|No| D[Fix it]
      D --> B
      C --> E[End]`,
    configuratorOptions: {
      title: "BASIC FLOWCHART",
    },
  },
  render: args => (
    <div className="h-screen w-full">
      <MermaidFlowChartGraph {...args} />
    </div>
  ),
};

export const ProcessFlow: Story = {
  args: {
    mermaidText: `flowchart LR
      subgraph "Input Stage"
        A[Data Source] --> B[(Database)]
      end

      subgraph "Processing"
        B --> C{Valid?}
        C -->|Yes| D[Process]
        C -->|No| E[Reject]
      end

      subgraph "Output Stage"
        D --> F([API Response])
        E --> F
      end`,
    configuratorOptions: {
      title: "DATA PROCESSING FLOW",
      colorStrategy: "subgraph",
    },
  },
  render: args => (
    <div className="h-screen w-full">
      <MermaidFlowChartGraph {...args} />
    </div>
  ),
};

export const NetworkDiagram: Story = {
  args: {
    mermaidText: `flowchart TB
      subgraph "DMZ"
        LB[Load Balancer]
        Web1[Web Server 1]
        Web2[Web Server 2]
      end

      subgraph "Internal Network"
        App1[App Server 1]
        App2[App Server 2]
        DB[(Database Cluster)]
        Cache[(Redis Cache)]
      end

      subgraph "Monitoring"
        Mon[Monitoring System]
        Log[Log Aggregator]
      end

      Internet[Internet] --> LB
      LB --> Web1
      LB --> Web2
      Web1 --> App1
      Web2 --> App2
      App1 --> DB
      App2 --> DB
      App1 --> Cache
      App2 --> Cache

      App1 -.-> Mon
      App2 -.-> Mon
      DB -.-> Mon
      Web1 -.-> Log
      Web2 -.-> Log`,
    configuratorOptions: {
      title: "NETWORK TOPOLOGY",
      colorStrategy: "subgraph",
    },
  },
  render: args => (
    <div className="h-screen w-full">
      <MermaidFlowChartGraph {...args} />
    </div>
  ),
};

export const DecisionTree: Story = {
  args: {
    mermaidText: `flowchart TD
      Start([Start]) --> Q1{Is user logged in?}
      Q1 -->|No| Login[Redirect to login]
      Q1 -->|Yes| Q2{Has permission?}
      Q2 -->|No| Error[Show error]
      Q2 -->|Yes| Q3{Valid input?}
      Q3 -->|No| Validate[Show validation errors]
      Q3 -->|Yes| Process[Process request]
      Process --> Success([Success])
      Login --> End([End])
      Error --> End
      Validate --> End
      Success --> End`,
    configuratorOptions: {
      title: "AUTHORIZATION FLOW",
      colorStrategy: "shape",
    },
  },
  render: args => (
    <div className="h-screen w-full">
      <MermaidFlowChartGraph {...args} />
    </div>
  ),
};

export const WithCustomColors: Story = {
  args: {
    mermaidText: `flowchart LR
      A[Input] --> B[Transform]
      B --> C[Validate]
      C --> D[Output]`,
    configuratorOptions: {
      title: "CUSTOM STYLED GRAPH",
      neonPalette: ["#00ff00", "#ff00ff", "#00ffff", "#ffff00"],
      nodeTypeOverrides: {
        process: {
          icon: "⚙️",
          color: "#00ff00",
        },
      },
    },
  },
  render: args => (
    <div className="h-screen w-full">
      <MermaidFlowChartGraph {...args} />
    </div>
  ),
};
