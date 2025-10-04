import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import yaml from 'js-yaml';

export const parseDockerCompose = (dockerComposeYaml: string) => {
  const parsedYaml = yaml.load(dockerComposeYaml) as any;

  const services = Object.keys(parsedYaml.services || {});
  const volumes = Object.keys(parsedYaml.volumes || {});
  const networks = Object.keys(parsedYaml.networks || {});
  const links: { source: string; target: any; }[] = [];

  services.forEach(service => {
    const serviceDetails = parsedYaml.services[service];
    
    // Handle depends_on
    const dependsOn = serviceDetails.depends_on || [];
    dependsOn.forEach((dependency: any) => {
      links.push({ source: service, target: dependency });
    });

    // Handle volumes (including NFS-mounted volumes)
    const serviceVolumes = serviceDetails.volumes || [];
    serviceVolumes.forEach((volume: string) => {
      const volumeName = volume.split(':')[0];
      if (volumes.includes(volumeName)) {
        links.push({ source: service, target: volumeName });
      } else if (volume.startsWith('/')) {
        // Local paths
        links.push({ source: service, target: 'Local Volume' });
      } else if (volume.startsWith('ssh://')) {
        // SSH-mounted volumes
        links.push({ source: service, target: 'SSH Host' });
      } else if (volume.includes('nfs')) {
        // NFS-mounted volumes
        links.push({ source: service, target: 'NFS Mount' });
      }
    });

    // Handle networks
    const serviceNetworks = serviceDetails.networks || [];
    serviceNetworks.forEach((network: string) => {
      if (networks.includes(network)) {
        links.push({ source: service, target: network });
      }
    });

    // Handle deploy labels
    // const deployLabels = serviceDetails.deploy?.labels || [];
    // deployLabels.forEach(label => {
    //   if (label.includes('traefik.http.routers')) {
    //     const [key, value] = label.split('=');
    //     const routeName = key.split('.')[2];
    //     links.push({ source: service, target: `Router: ${routeName}` });
    //   }
    // });
  });

  return { services, volumes, networks, links };
};


export const ServiceNode = ({ id, x, y }: { id: string; x: number; y: number }) => {
  return (
    <g transform={`translate(${x - 50},${y - 25})`}>
      <rect width={100} height={50} rx={10} ry={10} fill="lightblue" />
      <text dx={50} dy={25} textAnchor="middle" dominantBaseline="middle">{id}</text>
    </g>
  );
};



export const VolumeNode = ({ id, x, y }: { id: string; x: number; y: number }) => {
  return (
    <g transform={`translate(${x - 50},${y - 25})`}>
      <ellipse cx={50} cy={25} rx={50} ry={25} fill="lightgreen" />
      <text dx={50} dy={30} textAnchor="middle" dominantBaseline="middle">{id}</text>
    </g>
  );
};


export const NetworkNode = ({ id, x, y }: { id: string; x: number; y: number }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={25} fill="orange" />
      <text dx={0} dy={5} textAnchor="middle" dominantBaseline="middle">{id}</text>
    </g>
  );
};


export const SpecialNode = ({ id, x, y, type }: { id: string; x: number; y: number; type: 'ssh' | 'nfs' | 'local' }) => {
  const colorMap = {
    ssh: 'red',
    nfs: 'yellow',
    local: 'gray'
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points="-50,-25 50,-25 0,50" fill={colorMap[type]} />
      <text dx={0} dy={10} textAnchor="middle" dominantBaseline="middle">{id}</text>
    </g>
  );
};

const shapeMapping = {
  service: { shape: 'rect', width: 100, height: 50, rx: 10, ry: 10 },
  volume: { shape: 'ellipse', rx: 50, ry: 25 },
  network: { shape: 'circle', r: 25 },
  ssh: { shape: 'polygon', points: '-50,-25 50,-25 0,50' },
  nfs: { shape: 'polygon', points: '-50,-25 50,-25 0,50' },
  local: { shape: 'polygon', points: '-50,-25 50,-25 0,50' },
};

interface ForceGraphProps {
  services: string[];
  volumes: string[];
  networks: string[];
  links: Array<{ source: string; target: string }>;
  width: number;
  height: number;
  children?: React.ReactNode;
}

interface NodeType {
  id: string;
  type: 'service' | 'volume' | 'network' | 'ssh' | 'nfs' | 'local';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

const ForceGraph = ({ services, volumes, networks, links, width, height, children }: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const nodes: NodeType[] = [
      ...services.map((service) => ({ id: service, type: 'service' as const })),
      ...volumes.map((volume) => ({ id: volume, type: 'volume' as const })),
      ...networks.map((network) => ({ id: network, type: 'network' as const })),
      { id: 'SSH Host', type: 'ssh' as const },
      { id: 'NFS Mount', type: 'nfs' as const },
      { id: 'Local Volume', type: 'local' as const },
    ];

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current);

    const linkElements = svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke-width', 2)
      .attr('stroke', '#999');

    const nodeElements = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    // Use D3 to append elements based on shape mapping
    nodeElements.each(function (d: any) {
      const shapeConfig = shapeMapping[d.type as keyof typeof shapeMapping];
      if (!shapeConfig) return;

      const element = d3.select(this).append(shapeConfig.shape);

      Object.keys(shapeConfig).forEach(attr => {
        if (attr !== 'shape') {
          element.attr(attr, (shapeConfig as any)[attr]);
        }
      });

      element.attr('fill', () => {
        if (d.type === 'service') {
          return 'lightblue';
        }
        if (d.type === 'volume') {
          return 'lightgreen';
        }
        if (d.type === 'network') {
          return 'orange';
        }
        if (d.type === 'ssh') {
          return 'red';
        }
        if (d.type === 'nfs') {
          return 'yellow';
        }
        if (d.type === 'local') {
          return 'gray';
        }
        return 'black'; // Add a default value here
      });
    });

    nodeElements.append('text')
      .attr('dx', (d: any) => d.type === 'service' ? 50 : 0)
      .attr('dy', (d: any) => d.type === 'service' ? 25 : 35)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text((d: any) => d.id);

    nodeElements.call(d3.drag<SVGGElement, any>()
      .on('start', (event, d: any) => {
        if (!event.active) {
          simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d: any) => {
        if (!event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }));

    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeElements
        .attr('transform', (d: any) => `translate(${d.x - 50},${d.y - 25})`);
    });

  }, [services, volumes, networks, links, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      {children}
    </svg>
  );
};

export default ForceGraph;

