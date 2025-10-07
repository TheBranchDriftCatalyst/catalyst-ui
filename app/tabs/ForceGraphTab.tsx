import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Label } from "@/catalyst-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/catalyst-ui/ui/select";
import { Typography } from "@/catalyst-ui/ui/typography";
import { ForceGraph } from "@/catalyst-ui/components/ForceGraph";
import type { GraphData } from "@/catalyst-ui/components/ForceGraph";
import { MermaidFlowChartGraph } from "@/catalyst-ui/components/MermaidForceGraph";
import { ScrollSnapItem } from "@/catalyst-ui/components/effects";

export function ForceGraphTab() {
  const [selectedGraphExample, setSelectedGraphExample] = useState("docker");

  return (
    <div className="space-y-4 mt-0">
      {/* Documentation Card */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>📊 ForceGraph Component</CardTitle>
            <CardDescription>
              Enterprise-grade D3.js wrapper with advanced layout algorithms and filtering capabilities
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Typography variant="p" className="text-muted-foreground">
              The ForceGraph component is a production-ready abstraction layer over D3.js with a comprehensive 5-phase
              architecture refactor. It provides multiple layout algorithms, intelligent edge routing, position persistence,
              and performance optimizations for handling 100+ node graphs.
            </Typography>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Typography variant="h4" className="font-semibold text-sm">🎯 Layout Algorithms</Typography>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Force-Directed:</strong> Physics-based simulation for organic layouts</li>
                  <li>• <strong>Dagre:</strong> Hierarchical directed graph layout</li>
                  <li>• <strong>ELK:</strong> Eclipse Layout Kernel for complex hierarchies</li>
                  <li>• <strong>Community Detection:</strong> Automatic cluster identification</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Typography variant="h4" className="font-semibold text-sm">🎨 Edge Routing</Typography>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Orthogonal Routing:</strong> Smart 90° angle paths</li>
                  <li>• <strong>Collision Detection:</strong> Automatic path optimization</li>
                  <li>• <strong>Bundled Edges:</strong> Reduce visual clutter for dense graphs</li>
                  <li>• <strong>Custom Styling:</strong> Per-edge type styling support</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Typography variant="h4" className="font-semibold text-sm">💾 Persistence</Typography>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Position Memory:</strong> Remember node positions per layout type</li>
                  <li>• <strong>LocalStorage:</strong> Automatic save/restore on reload</li>
                  <li>• <strong>Panel State:</strong> Filter panel positions and collapse state</li>
                  <li>• <strong>Storage Keys:</strong> Unique keys per graph instance</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Typography variant="h4" className="font-semibold text-sm">⚡ Performance</Typography>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Memoized Enrichment:</strong> Cache computed graph properties</li>
                  <li>• <strong>O(1) Filters:</strong> Set-based lookups for instant filtering</li>
                  <li>• <strong>Cached Paths:</strong> Pre-computed orthogonal edge routes</li>
                  <li>• <strong>Optimized Re-renders:</strong> React.memo and useMemo throughout</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Typography variant="h4" className="font-semibold text-sm">🎭 Floating Panels</Typography>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Unified Hook System:</strong> useFloatingPanel for all panels</li>
                  <li>• <strong>Draggable:</strong> Move panels anywhere on canvas</li>
                  <li>• <strong>Resizable:</strong> Adjust panel dimensions (future)</li>
                  <li>• <strong>Collapsible:</strong> Minimize to save screen space</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Typography variant="h4" className="font-semibold text-sm">🔍 Advanced Filtering</Typography>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Pure Functions:</strong> Stateless filter predicates</li>
                  <li>• <strong>Quick Presets:</strong> One-click filter combinations</li>
                  <li>• <strong>Search:</strong> Real-time node/edge searching</li>
                  <li>• <strong>Type Toggles:</strong> Show/hide specific node/edge types</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-accent/10 border border-primary/20 rounded">
              <Typography variant="small" className="text-xs text-muted-foreground">
                <strong>Import:</strong> <code className="text-primary">import {'{ ForceGraph }'} from '@/catalyst-ui/components/ForceGraph';</code>
              </Typography>
            </div>
          </div>
        </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Interactive Demo */}
      <ScrollSnapItem align="start">
        <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            Try different examples below • Docker resource visualization • Mermaid flowchart converter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Select Example:</Label>
            <Select value={selectedGraphExample} onValueChange={setSelectedGraphExample}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="docker">Docker Resources (Advanced Filtering)</SelectItem>
                <SelectItem value="mermaid-solar">Mermaid: Solar Power System</SelectItem>
                <SelectItem value="mermaid-basic">Mermaid: Basic Flowchart</SelectItem>
                <SelectItem value="mermaid-network">Mermaid: Network Topology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[800px] w-full relative border-2 border-primary/20 rounded-lg overflow-hidden">
            {selectedGraphExample === "docker" && (
            <ForceGraph
              storageKey={`catalyst-ui.forcegraph.${selectedGraphExample}`}
              data={(() => {
              // Comprehensive dataset demonstrating all filtering features
              const nodes: GraphData['nodes'] = {};
              const edges: any[] = [];

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
            })()} />
            )}

            {selectedGraphExample === "mermaid-solar" && (
              <MermaidFlowChartGraph
                filename="/mermaid/solar-system.mmd"
                configuratorOptions={{
                  title: "SOLAR POWER SYSTEM",
                  colorStrategy: 'subgraph',
                }}
                forceGraphProps={{
                  storageKey: `catalyst-ui.forcegraph.${selectedGraphExample}`
                }}
              />
            )}

            {selectedGraphExample === "mermaid-basic" && (
              <MermaidFlowChartGraph
                mermaidText={`flowchart TB
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Fix it]
    D --> B
    C --> E[End]`}
                configuratorOptions={{
                  title: "BASIC FLOWCHART",
                }}
                forceGraphProps={{
                  storageKey: `catalyst-ui.forcegraph.${selectedGraphExample}`
                }}
              />
            )}

            {selectedGraphExample === "mermaid-network" && (
              <MermaidFlowChartGraph
                mermaidText={`flowchart TB
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

    Internet[Internet] --> LB
    LB --> Web1
    LB --> Web2
    Web1 --> App1
    Web2 --> App2
    App1 --> DB
    App2 --> DB
    App1 --> Cache
    App2 --> Cache`}
                configuratorOptions={{
                  title: "NETWORK TOPOLOGY",
                  colorStrategy: 'subgraph',
                }}
                forceGraphProps={{
                  storageKey: `catalyst-ui.forcegraph.${selectedGraphExample}`
                }}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
          {selectedGraphExample === "docker" && (
            <>
              <Typography variant="h4" className="text-sm font-semibold">Docker Resources Features:</Typography>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Filter Panel</strong> - Click ⚙️ to open advanced filtering options</li>
                <li><strong>Quick Presets</strong> - Try "🔍 Orphaned", "▶️ Running", or "🎯 Minimal" filters</li>
                <li><strong>Search</strong> - Search nodes by name or ID in the filter panel</li>
                <li><strong>Node Types</strong> - Toggle visibility of containers, images, networks, volumes</li>
                <li><strong>Edge Types</strong> - Show/hide derived_from, connected_to, mounted_into relationships</li>
                <li><strong>Status Filters</strong> - Filter containers by running/stopped status</li>
                <li><strong>Advanced Filters</strong> - Hide system resources, show in-use only, etc.</li>
                <li><strong>Interactions</strong> - Drag nodes, zoom/pan, click for details, right-click to exclude</li>
              </ul>
            </>
          )}
          {selectedGraphExample.startsWith("mermaid") && (
            <>
              <Typography variant="h4" className="text-sm font-semibold">Mermaid Converter Features:</Typography>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Auto-Detection</strong> - Node types detected from Mermaid shapes (rectangles, diamonds, circles, etc.)</li>
                <li><strong>Subgraph Grouping</strong> - Subgraphs become node categories with coordinated colors</li>
                <li><strong>Edge Types</strong> - Solid ({'-->'}{')'} and dotted ({'.->'}{')'} arrows mapped to different edge styles</li>
                <li><strong>Fully Interactive</strong> - Drag nodes, zoom/pan, filter, and explore just like regular ForceGraph</li>
                <li><strong>Custom Styling</strong> - Override colors, icons, and labels via configuratorOptions prop</li>
                <li><strong>File Support</strong> - Load from .mmd files or provide inline mermaidText</li>
              </ul>
            </>
          )}
        </CardFooter>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
