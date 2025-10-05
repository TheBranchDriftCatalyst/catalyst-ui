import type { Meta, StoryObj } from '@storybook/react';
import ForceGraph from './ForceGraph';
import { GraphData } from './types';

// Sample Docker-style graph data
const sampleGraphData: GraphData = {
  nodes: {
    'container-1': {
      id: 'container-1',
      kind: 'container',
      name: 'web-frontend',
      attributes: {
        status: 'running',
        image: 'nginx:latest',
        service: 'web',
        stack: 'myapp',
      },
    },
    'container-2': {
      id: 'container-2',
      kind: 'container',
      name: 'api-backend',
      attributes: {
        status: 'running',
        image: 'node:18',
        service: 'api',
        stack: 'myapp',
      },
    },
    'container-3': {
      id: 'container-3',
      kind: 'container',
      name: 'worker',
      attributes: {
        status: 'stopped',
        image: 'python:3.11',
        service: 'worker',
        stack: 'myapp',
      },
    },
    'network-1': {
      id: 'network-1',
      kind: 'network',
      name: 'myapp_network',
      attributes: {
        driver: 'bridge',
        scope: 'local',
      },
    },
    'network-2': {
      id: 'network-2',
      kind: 'network',
      name: 'backend_network',
      attributes: {
        driver: 'bridge',
        scope: 'local',
      },
    },
    'image-1': {
      id: 'image-1',
      kind: 'image',
      name: 'nginx',
      attributes: {
        tags: 'nginx:latest',
        size: '142000000',
        digests: 'sha256:abc123...',
      },
    },
    'image-2': {
      id: 'image-2',
      kind: 'image',
      name: 'node',
      attributes: {
        tags: 'node:18',
        size: '896000000',
        digests: 'sha256:def456...',
      },
    },
    'image-3': {
      id: 'image-3',
      kind: 'image',
      name: 'python',
      attributes: {
        tags: 'python:3.11',
        size: '1024000000',
        digests: 'sha256:ghi789...',
      },
    },
    'volume-1': {
      id: 'volume-1',
      kind: 'volume',
      name: 'data_volume',
      attributes: {
        driver: 'local',
        mountpoint: '/var/lib/docker/volumes/data_volume/_data',
        status: 'in-use',
      },
    },
    'volume-2': {
      id: 'volume-2',
      kind: 'volume',
      name: 'cache_volume',
      attributes: {
        driver: 'local',
        mountpoint: '/var/lib/docker/volumes/cache_volume/_data',
        status: 'in-use',
      },
    },
  },
  edges: [],
};

// Add edges with source/target references
const enrichEdges = (data: GraphData): GraphData => {
  const edges = [
    {
      src: 'container-1',
      dst: 'image-1',
      kind: 'derived_from' as const,
      source: data.nodes['container-1'],
      target: data.nodes['image-1'],
    },
    {
      src: 'container-2',
      dst: 'image-2',
      kind: 'derived_from' as const,
      source: data.nodes['container-2'],
      target: data.nodes['image-2'],
    },
    {
      src: 'container-3',
      dst: 'image-3',
      kind: 'derived_from' as const,
      source: data.nodes['container-3'],
      target: data.nodes['image-3'],
    },
    {
      src: 'container-1',
      dst: 'network-1',
      kind: 'connected_to' as const,
      attributes: { ip: '172.18.0.2' },
      source: data.nodes['container-1'],
      target: data.nodes['network-1'],
    },
    {
      src: 'container-2',
      dst: 'network-1',
      kind: 'connected_to' as const,
      attributes: { ip: '172.18.0.3' },
      source: data.nodes['container-2'],
      target: data.nodes['network-1'],
    },
    {
      src: 'container-2',
      dst: 'network-2',
      kind: 'connected_to' as const,
      attributes: { ip: '172.19.0.2' },
      source: data.nodes['container-2'],
      target: data.nodes['network-2'],
    },
    {
      src: 'container-1',
      dst: 'volume-1',
      kind: 'mounted_into' as const,
      attributes: { target: '/usr/share/nginx/html', rw: 'true' },
      source: data.nodes['container-1'],
      target: data.nodes['volume-1'],
    },
    {
      src: 'container-2',
      dst: 'volume-2',
      kind: 'mounted_into' as const,
      attributes: { target: '/app/cache', rw: 'true' },
      source: data.nodes['container-2'],
      target: data.nodes['volume-2'],
    },
  ];

  return {
    ...data,
    edges,
  };
};

const fullGraphData = enrichEdges(sampleGraphData);

const meta = {
  title: 'Components/ForceGraph',
  component: ForceGraph,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Graph data with nodes and edges',
      control: { type: 'object' },
    },
  },
} satisfies Meta<typeof ForceGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: fullGraphData,
  },
};

export const SimpleGraph: Story = {
  args: {
    data: enrichEdges({
      nodes: {
        'container-1': sampleGraphData.nodes['container-1'],
        'container-2': sampleGraphData.nodes['container-2'],
        'network-1': sampleGraphData.nodes['network-1'],
        'image-1': sampleGraphData.nodes['image-1'],
        'image-2': sampleGraphData.nodes['image-2'],
      },
      edges: [],
    }),
  },
};

export const NetworkFocus: Story = {
  args: {
    data: enrichEdges({
      nodes: {
        'container-1': sampleGraphData.nodes['container-1'],
        'container-2': sampleGraphData.nodes['container-2'],
        'container-3': sampleGraphData.nodes['container-3'],
        'network-1': sampleGraphData.nodes['network-1'],
        'network-2': sampleGraphData.nodes['network-2'],
      },
      edges: [],
    }),
  },
};

export const VolumeMounts: Story = {
  args: {
    data: enrichEdges({
      nodes: {
        'container-1': sampleGraphData.nodes['container-1'],
        'container-2': sampleGraphData.nodes['container-2'],
        'volume-1': sampleGraphData.nodes['volume-1'],
        'volume-2': sampleGraphData.nodes['volume-2'],
      },
      edges: [],
    }),
  },
};

export const EmptyGraph: Story = {
  args: {
    data: {
      nodes: {},
      edges: [],
    },
  },
};

export const LargeGraph: Story = {
  args: {
    data: (() => {
      const nodes: GraphData['nodes'] = {};
      const edges: any[] = [];

      // Create 20 containers
      for (let i = 0; i < 20; i++) {
        nodes[`container-${i}`] = {
          id: `container-${i}`,
          kind: 'container',
          name: `service-${i}`,
          attributes: {
            status: i % 3 === 0 ? 'stopped' : 'running',
            image: `image-${i % 5}:latest`,
            service: `svc-${i}`,
          },
        };

        // Connect to images
        if (!nodes[`image-${i % 5}`]) {
          nodes[`image-${i % 5}`] = {
            id: `image-${i % 5}`,
            kind: 'image',
            name: `image-${i % 5}`,
            attributes: {
              tags: `image-${i % 5}:latest`,
              size: '500000000',
            },
          };
        }
        edges.push({
          src: `container-${i}`,
          dst: `image-${i % 5}`,
          kind: 'derived_from',
          source: nodes[`container-${i}`],
          target: nodes[`image-${i % 5}`],
        });

        // Connect to networks
        const netId = `network-${i % 3}`;
        if (!nodes[netId]) {
          nodes[netId] = {
            id: netId,
            kind: 'network',
            name: netId,
            attributes: {
              driver: 'bridge',
              scope: 'local',
            },
          };
        }
        edges.push({
          src: `container-${i}`,
          dst: netId,
          kind: 'connected_to',
          attributes: { ip: `172.18.${i}.2` },
          source: nodes[`container-${i}`],
          target: nodes[netId],
        });
      }

      return { nodes, edges };
    })(),
  },
};

// Advanced Filtering Stories

export const WithOrphanedNodes: Story = {
  args: {
    data: (() => {
      const data = enrichEdges({
        ...sampleGraphData,
        nodes: {
          ...sampleGraphData.nodes,
          'orphaned-image-1': {
            id: 'orphaned-image-1',
            kind: 'image',
            name: 'unused-base',
            attributes: {
              tags: 'ubuntu:22.04',
              size: '77000000',
              digests: 'sha256:orphan1...',
            },
          },
          'orphaned-image-2': {
            id: 'orphaned-image-2',
            kind: 'image',
            name: 'old-version',
            attributes: {
              tags: 'myapp:v1.0',
              size: '250000000',
              digests: 'sha256:orphan2...',
            },
          },
          'orphaned-volume': {
            id: 'orphaned-volume',
            kind: 'volume',
            name: 'temp_data',
            attributes: {
              driver: 'local',
              mountpoint: '/var/lib/docker/volumes/temp_data/_data',
            },
          },
        },
      });
      return data;
    })(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates orphaned node filtering. Click the filter icon and try the "🔍 Orphaned" preset or enable the "Show orphaned nodes only" advanced filter to see only nodes with no connections.',
      },
    },
  },
};

export const MixedStatusContainers: Story = {
  args: {
    data: (() => {
      const nodes: GraphData['nodes'] = {};
      const edges: any[] = [];

      // Create containers with mixed statuses
      const containerStatuses = ['running', 'running', 'stopped', 'running', 'stopped', 'stopped', 'running'];
      for (let i = 0; i < 7; i++) {
        nodes[`container-${i}`] = {
          id: `container-${i}`,
          kind: 'container',
          name: `app-${i}`,
          attributes: {
            status: containerStatuses[i],
            image: `app-image:v${i}`,
            service: `service-${i}`,
          },
        };

        // Create corresponding images
        nodes[`image-${i}`] = {
          id: `image-${i}`,
          kind: 'image',
          name: `app-image`,
          attributes: {
            tags: `app-image:v${i}`,
            size: '300000000',
          },
        };

        edges.push({
          src: `container-${i}`,
          dst: `image-${i}`,
          kind: 'derived_from',
          source: nodes[`container-${i}`],
          target: nodes[`image-${i}`],
        });

        // Connect to shared network
        if (!nodes['shared-network']) {
          nodes['shared-network'] = {
            id: 'shared-network',
            kind: 'network',
            name: 'app_network',
            attributes: {
              driver: 'bridge',
              scope: 'local',
            },
          };
        }
        edges.push({
          src: `container-${i}`,
          dst: 'shared-network',
          kind: 'connected_to',
          attributes: { ip: `172.20.0.${i + 2}` },
          source: nodes[`container-${i}`],
          target: nodes['shared-network'],
        });
      }

      return { nodes, edges };
    })(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates status filtering with mixed running and stopped containers. Use the "▶️ Running" preset or the Status Filter dropdown to filter by container status.',
      },
    },
  },
};

export const WithInUseResources: Story = {
  args: {
    data: (() => {
      const nodes: GraphData['nodes'] = {
        'container-1': {
          id: 'container-1',
          kind: 'container',
          name: 'database',
          attributes: {
            status: 'running',
            image: 'postgres:15',
          },
        },
        'container-2': {
          id: 'container-2',
          kind: 'container',
          name: 'webapp',
          attributes: {
            status: 'running',
            image: 'nginx:latest',
          },
        },
        'volume-active': {
          id: 'volume-active',
          kind: 'volume',
          name: 'db_data',
          attributes: {
            driver: 'local',
            status: 'in-use',
            mountpoint: '/var/lib/docker/volumes/db_data/_data',
          },
        },
        'volume-unused': {
          id: 'volume-unused',
          kind: 'volume',
          name: 'old_backups',
          attributes: {
            driver: 'local',
            mountpoint: '/var/lib/docker/volumes/old_backups/_data',
          },
        },
        'image-active': {
          id: 'image-active',
          kind: 'image',
          name: 'postgres',
          attributes: {
            tags: 'postgres:15',
            size: '314000000',
          },
        },
        'image-unused': {
          id: 'image-unused',
          kind: 'image',
          name: 'redis',
          attributes: {
            tags: 'redis:7',
            size: '117000000',
          },
        },
        'network-1': {
          id: 'network-1',
          kind: 'network',
          name: 'app_network',
          attributes: {
            driver: 'bridge',
            scope: 'local',
          },
        },
      };

      const edges = [
        {
          src: 'container-1',
          dst: 'image-active',
          kind: 'derived_from' as const,
          source: nodes['container-1'],
          target: nodes['image-active'],
        },
        {
          src: 'container-1',
          dst: 'volume-active',
          kind: 'mounted_into' as const,
          attributes: { target: '/var/lib/postgresql/data', rw: 'true' },
          source: nodes['container-1'],
          target: nodes['volume-active'],
        },
        {
          src: 'container-1',
          dst: 'network-1',
          kind: 'connected_to' as const,
          attributes: { ip: '172.21.0.2' },
          source: nodes['container-1'],
          target: nodes['network-1'],
        },
        {
          src: 'container-2',
          dst: 'network-1',
          kind: 'connected_to' as const,
          attributes: { ip: '172.21.0.3' },
          source: nodes['container-2'],
          target: nodes['network-1'],
        },
      ];

      return { nodes, edges };
    })(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates in-use resource filtering. Try the "💾 Show in-use resources only" advanced filter to see only resources currently being used by containers.',
      },
    },
  },
};

export const WithSystemResources: Story = {
  args: {
    data: (() => {
      const nodes: GraphData['nodes'] = {
        'container-1': sampleGraphData.nodes['container-1'],
        'container-2': sampleGraphData.nodes['container-2'],
        'network-user': {
          id: 'network-user',
          kind: 'network',
          name: 'myapp_network',
          attributes: {
            driver: 'bridge',
            scope: 'local',
          },
        },
        'network-bridge': {
          id: 'network-bridge',
          kind: 'network',
          name: 'bridge',
          attributes: {
            driver: 'bridge',
            scope: 'local',
            system: true,
          },
        },
        'network-host': {
          id: 'network-host',
          kind: 'network',
          name: 'host',
          attributes: {
            driver: 'host',
            scope: 'local',
            system: true,
          },
        },
        'network-none': {
          id: 'network-none',
          kind: 'network',
          name: 'none',
          attributes: {
            driver: 'null',
            scope: 'local',
            system: true,
          },
        },
        'image-1': sampleGraphData.nodes['image-1'],
        'image-2': sampleGraphData.nodes['image-2'],
      };

      const edges = [
        {
          src: 'container-1',
          dst: 'image-1',
          kind: 'derived_from' as const,
          source: nodes['container-1'],
          target: nodes['image-1'],
        },
        {
          src: 'container-2',
          dst: 'image-2',
          kind: 'derived_from' as const,
          source: nodes['container-2'],
          target: nodes['image-2'],
        },
        {
          src: 'container-1',
          dst: 'network-user',
          kind: 'connected_to' as const,
          attributes: { ip: '172.22.0.2' },
          source: nodes['container-1'],
          target: nodes['network-user'],
        },
        {
          src: 'container-2',
          dst: 'network-bridge',
          kind: 'connected_to' as const,
          attributes: { ip: '172.17.0.3' },
          source: nodes['container-2'],
          target: nodes['network-bridge'],
        },
      ];

      return { nodes, edges };
    })(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates system resource filtering. Enable the "🚫 Hide system resources" advanced filter to hide default Docker networks (bridge, host, none).',
      },
    },
  },
};

export const WithSearchFiltering: Story = {
  args: {
    data: (() => {
      const nodes: GraphData['nodes'] = {};
      const edges: any[] = [];

      // Create containers with varied names
      const containerNames = [
        'web-frontend-prod',
        'web-frontend-staging',
        'api-backend-prod',
        'api-backend-staging',
        'worker-queue-prod',
        'worker-queue-staging',
        'database-primary',
        'database-replica',
        'cache-redis',
        'proxy-nginx',
      ];

      containerNames.forEach((name, i) => {
        nodes[`container-${i}`] = {
          id: `container-${i}`,
          kind: 'container',
          name,
          attributes: {
            status: i % 2 === 0 ? 'running' : 'stopped',
            image: `${name.split('-')[0]}:latest`,
          },
        };

        const imageId = `image-${name.split('-')[0]}`;
        if (!nodes[imageId]) {
          nodes[imageId] = {
            id: imageId,
            kind: 'image',
            name: name.split('-')[0],
            attributes: {
              tags: `${name.split('-')[0]}:latest`,
              size: '200000000',
            },
          };
        }

        edges.push({
          src: `container-${i}`,
          dst: imageId,
          kind: 'derived_from',
          source: nodes[`container-${i}`],
          target: nodes[imageId],
        });
      });

      return { nodes, edges };
    })(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates search functionality. Try searching for "prod", "staging", "web", or "api" in the filter panel search box to filter nodes by name.',
      },
    },
  },
};

export const AllFilteringFeatures: Story = {
  args: {
    data: (() => {
      const nodes: GraphData['nodes'] = {};
      const edges: any[] = [];

      // Create a comprehensive dataset with all filter scenarios
      // Running containers
      for (let i = 0; i < 3; i++) {
        nodes[`running-${i}`] = {
          id: `running-${i}`,
          kind: 'container',
          name: `prod-service-${i}`,
          attributes: {
            status: 'running',
            image: `service:v${i}`,
          },
        };
      }

      // Stopped containers
      for (let i = 0; i < 2; i++) {
        nodes[`stopped-${i}`] = {
          id: `stopped-${i}`,
          kind: 'container',
          name: `old-service-${i}`,
          attributes: {
            status: 'stopped',
            image: `old:v${i}`,
          },
        };
      }

      // Images (some orphaned)
      for (let i = 0; i < 5; i++) {
        nodes[`image-${i}`] = {
          id: `image-${i}`,
          kind: 'image',
          name: `image-${i}`,
          attributes: {
            tags: `image-${i}:latest`,
            size: '150000000',
          },
        };
      }

      // Networks (including system)
      nodes['network-user'] = {
        id: 'network-user',
        kind: 'network',
        name: 'app_network',
        attributes: { driver: 'bridge', scope: 'local' },
      };
      nodes['network-bridge'] = {
        id: 'network-bridge',
        kind: 'network',
        name: 'bridge',
        attributes: { driver: 'bridge', scope: 'local', system: true },
      };

      // Volumes (some in-use)
      nodes['volume-active'] = {
        id: 'volume-active',
        kind: 'volume',
        name: 'data_volume',
        attributes: {
          driver: 'local',
          status: 'in-use',
          mountpoint: '/var/lib/docker/volumes/data_volume/_data',
        },
      };
      nodes['volume-orphaned'] = {
        id: 'volume-orphaned',
        kind: 'volume',
        name: 'old_volume',
        attributes: {
          driver: 'local',
          mountpoint: '/var/lib/docker/volumes/old_volume/_data',
        },
      };

      // Connect running containers
      for (let i = 0; i < 3; i++) {
        edges.push({
          src: `running-${i}`,
          dst: `image-${i}`,
          kind: 'derived_from',
          source: nodes[`running-${i}`],
          target: nodes[`image-${i}`],
        });
        edges.push({
          src: `running-${i}`,
          dst: 'network-user',
          kind: 'connected_to',
          attributes: { ip: `172.25.0.${i + 2}` },
          source: nodes[`running-${i}`],
          target: nodes['network-user'],
        });
      }

      // Mount volume to first running container
      edges.push({
        src: 'running-0',
        dst: 'volume-active',
        kind: 'mounted_into',
        attributes: { target: '/data', rw: 'true' },
        source: nodes['running-0'],
        target: nodes['volume-active'],
      });

      // image-3 and image-4 are orphaned (no containers using them)
      // volume-orphaned is orphaned (no containers mounting it)

      return { nodes, edges };
    })(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive example demonstrating all filtering features. This graph includes:\n\n' +
          '- Running and stopped containers (try status filters)\n' +
          '- Orphaned images and volumes (try orphaned preset)\n' +
          '- System and user networks (try hide system resources)\n' +
          '- In-use and unused volumes (try in-use filter)\n' +
          '- Various node types (try toggling node types)\n' +
          '- Different edge types (try toggling edge types)\n\n' +
          'Open the filter panel (⚙️ icon) and experiment with all available filters!',
      },
    },
  },
};

// Layout Mode Stories

export const StructuredLayout: Story = {
  args: {
    data: fullGraphData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates structured layout mode. In the Legend panel (top-left), click "Structured" under the LAYOUT section to see nodes organized by type into columns:\n\n' +
          '- Containers column (left)\n' +
          '- Networks column\n' +
          '- Images column\n' +
          '- Volumes column (right)\n\n' +
          'Structured layout is ideal for understanding the overall architecture and seeing clear separation between resource types.',
      },
    },
  },
};

export const CompareLayouts: Story = {
  args: {
    data: enrichEdges({
      nodes: {
        'container-1': sampleGraphData.nodes['container-1'],
        'container-2': sampleGraphData.nodes['container-2'],
        'container-3': sampleGraphData.nodes['container-3'],
        'network-1': sampleGraphData.nodes['network-1'],
        'network-2': sampleGraphData.nodes['network-2'],
        'image-1': sampleGraphData.nodes['image-1'],
        'image-2': sampleGraphData.nodes['image-2'],
        'image-3': sampleGraphData.nodes['image-3'],
        'volume-1': sampleGraphData.nodes['volume-1'],
        'volume-2': sampleGraphData.nodes['volume-2'],
      },
      edges: [],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use this story to compare force vs structured layouts:\n\n' +
          '**Force Layout** (default):\n' +
          '- Physics-based simulation\n' +
          '- Nodes attract/repel dynamically\n' +
          '- Best for exploring relationships\n' +
          '- Drag nodes to rearrange\n\n' +
          '**Structured Layout**:\n' +
          '- Organized by node type in columns\n' +
          '- Fixed, predictable positions\n' +
          '- Best for understanding architecture\n' +
          '- Clean, systematic view\n\n' +
          'Toggle between layouts using the Legend panel in the top-left corner.',
      },
    },
  },
};

export const OrthogonalEdges: Story = {
  args: {
    data: enrichEdges({
      nodes: {
        'container-1': sampleGraphData.nodes['container-1'],
        'container-2': sampleGraphData.nodes['container-2'],
        'network-1': sampleGraphData.nodes['network-1'],
        'image-1': sampleGraphData.nodes['image-1'],
        'image-2': sampleGraphData.nodes['image-2'],
        'volume-1': sampleGraphData.nodes['volume-1'],
      },
      edges: [],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates orthogonal edge routing:\n\n' +
          '- In the Legend panel, find the "EDGE ROUTING" section\n' +
          '- Enable "Orthogonal edges" checkbox\n' +
          '- Edges will redraw with right-angle paths\n' +
          '- Works best with structured layout\n' +
          '- Collision avoidance prevents edge overlaps\n\n' +
          'Orthogonal routing creates cleaner, more readable diagrams especially for complex graphs.',
      },
    },
  },
};
