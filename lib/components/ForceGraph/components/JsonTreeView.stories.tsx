import type { Meta, StoryObj } from "@storybook/react";
import JsonTreeView from "./JsonTreeView";

const meta = {
  title: "Display/JsonTreeView",
  component: JsonTreeView,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "The data to display in the tree view",
    },
    rootName: {
      control: "text",
      description: "Optional root node name to display",
    },
    initialExpanded: {
      control: "object",
      description: "Array of paths to initially expand",
    },
  },
} satisfies Meta<typeof JsonTreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
  user: {
    id: 12345,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    profile: {
      age: 28,
      location: "San Francisco, CA",
      interests: ["coding", "music", "hiking"],
    },
    settings: {
      notifications: true,
      theme: "dark",
      privacy: {
        shareEmail: false,
        showActivity: true,
      },
    },
  },
  metadata: {
    lastLogin: "2025-01-15T10:30:00Z",
    accountCreated: "2023-03-20T14:22:00Z",
    verified: true,
  },
};

const dockerContainerData = {
  id: "abc123def456",
  name: "my-app-container",
  image: "node:18-alpine",
  status: "running",
  ports: [
    { host: 3000, container: 3000, protocol: "tcp" },
    { host: 8080, container: 80, protocol: "tcp" },
  ],
  environment: {
    NODE_ENV: "production",
    DATABASE_URL: "postgres://localhost:5432/myapp",
    REDIS_HOST: "redis",
    LOG_LEVEL: "info",
  },
  volumes: [
    {
      source: "/var/lib/docker/volumes/app-data",
      destination: "/app/data",
      mode: "rw",
    },
  ],
  networks: ["bridge", "app-network"],
  labels: {
    "com.docker.compose.project": "my-app",
    "com.docker.compose.service": "web",
    version: "1.2.3",
  },
};

const complexNestedData = {
  project: {
    name: "My Awesome Project",
    version: "2.1.0",
    dependencies: {
      react: "^19.0.0",
      typescript: "^5.7.2",
      vite: "^6.0.5",
    },
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      test: "vitest",
    },
    config: {
      build: {
        outDir: "dist",
        sourcemap: true,
        minify: "terser",
        target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
      },
      server: {
        port: 3000,
        host: "0.0.0.0",
        cors: true,
      },
    },
  },
  team: [
    { name: "Alice", role: "Lead Developer", active: true },
    { name: "Bob", role: "Designer", active: true },
    { name: "Charlie", role: "QA Engineer", active: false },
  ],
};

export const Default: Story = {
  args: {
    data: sampleData,
    rootName: "user_data",
  },
};

export const WithoutRootName: Story = {
  args: {
    data: {
      status: "success",
      code: 200,
      message: "Request completed successfully",
    },
  },
};

export const DockerContainer: Story = {
  args: {
    data: dockerContainerData,
    rootName: "container",
    initialExpanded: ["container", "container.environment"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Displays Docker container inspection data with environment variables initially expanded.",
      },
    },
  },
};

export const DeepNesting: Story = {
  args: {
    data: complexNestedData,
    rootName: "workspace",
    initialExpanded: ["workspace", "workspace.project", "workspace.project.config"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates deeply nested objects with arrays. Try expanding different sections to explore the data structure.",
      },
    },
  },
};

export const SimpleArray: Story = {
  args: {
    data: {
      fruits: ["apple", "banana", "cherry", "date"],
      numbers: [1, 2, 3, 5, 8, 13, 21],
      mixed: ["text", 42, true, null, { nested: "object" }],
    },
    rootName: "arrays",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows how arrays are displayed with indices and various data types.",
      },
    },
  },
};

export const NullAndPrimitive: Story = {
  args: {
    data: {
      string: "Hello World",
      number: 42,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined,
      empty: {},
      emptyArray: [],
    },
    rootName: "primitives",
  },
  parameters: {
    docs: {
      description: {
        story: "Displays various primitive types including null and undefined values.",
      },
    },
  },
};

export const GraphNodeAttributes: Story = {
  args: {
    data: {
      State: "running",
      Status: "Up 2 hours",
      Created: "2025-01-15T08:30:00Z",
      Platform: "linux/arm64",
      Config: {
        Hostname: "web-server-01",
        ExposedPorts: {
          "80/tcp": {},
          "443/tcp": {},
        },
        Env: [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
          "NODE_ENV=production",
          "PORT=3000",
        ],
      },
      NetworkSettings: {
        IPAddress: "172.17.0.2",
        Gateway: "172.17.0.1",
        MacAddress: "02:42:ac:11:00:02",
      },
    },
    rootName: "attributes",
    initialExpanded: ["attributes"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of node attributes from a ForceGraph component, showing container inspection data.",
      },
    },
  },
};
