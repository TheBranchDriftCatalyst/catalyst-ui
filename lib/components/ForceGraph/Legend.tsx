import React from 'react';
import { NodeKind, EdgeKind } from './types';
import { useGraphState } from './hooks/useGraphState';

interface LegendProps {
  visibleNodes: Record<NodeKind, boolean>;
  setVisibleNodes: (setter: React.SetStateAction<Record<NodeKind, boolean>>) => void;
  visibleEdges: Record<EdgeKind, boolean>;
  setVisibleEdges: (setter: React.SetStateAction<Record<EdgeKind, boolean>>) => void;
}

const Legend: React.FC<LegendProps> = ({
  visibleNodes,
  setVisibleNodes,
  visibleEdges,
  setVisibleEdges,
}) => {
  const { layout, setLayout, orthogonalEdges, toggleOrthogonalEdges } = useGraphState();

  const nodeTypes: { kind: NodeKind; label: string; color: string; icon: string }[] = [
    { kind: 'container', label: 'Containers', color: 'var(--primary)', icon: '📦' },
    { kind: 'network', label: 'Networks', color: 'var(--neon-yellow)', icon: '🌐' },
    { kind: 'image', label: 'Images', color: 'var(--neon-red)', icon: '💿' },
    { kind: 'volume', label: 'Volumes', color: 'var(--neon-purple)', icon: '💾' },
  ];

  const edgeTypes: { kind: EdgeKind; label: string; color: string }[] = [
    { kind: 'derived_from', label: 'Derived From', color: 'var(--neon-red)' },
    { kind: 'connected_to', label: 'Connected To', color: 'var(--primary)' },
    { kind: 'mounted_into', label: 'Mounted Into', color: 'var(--neon-yellow)' },
  ];

  const toggleNode = (kind: NodeKind) => {
    setVisibleNodes((prev) => ({ ...prev, [kind]: !prev[kind] }));
  };

  const toggleEdge = (kind: EdgeKind) => {
    setVisibleEdges((prev) => ({ ...prev, [kind]: !prev[kind] }));
  };

  // Helper to resolve CSS variables
  const resolveCSSVariable = (value: string): string => {
    if (!value || !value.includes('var(')) {
      return value;
    }

    const htmlElement = document.documentElement;
    const varMatch = value.match(/var\((--[^,)]+)(?:,\s*([^)]+))?\)/);

    if (varMatch) {
      const varName = varMatch[1];
      const fallback = varMatch[2];
      const resolvedValue = getComputedStyle(htmlElement).getPropertyValue(varName).trim();

      if (resolvedValue) {
        return value.replace(varMatch[0], resolvedValue);
      } else if (fallback) {
        return value.replace(varMatch[0], fallback.trim());
      }
    }

    return value;
  };

  // Download function to export the graph as PNG
  const downloadGraphAsPng = async () => {
    try {
      // Find the SVG element - look for the large graph SVG, not icon SVGs
      // The graph SVG has a zoom-layer group and is much larger than icon SVGs
      const svgElement = Array.from(document.querySelectorAll('svg')).find(svg => {
        const zoomLayer = svg.querySelector('.zoom-layer');
        return zoomLayer !== null;
      }) as SVGElement;

      if (!svgElement) {
        console.error('Force graph SVG element not found');
        alert('Error: Could not find graph to export');
        return;
      }

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Get background color
      const htmlElement = document.documentElement;
      const isDark = htmlElement.classList.contains('dark');
      let backgroundColor = isDark ? '#0a0a0f' : '#f5f5f5';

      // Resolve CSS variables in background
      const bgVar = getComputedStyle(htmlElement).getPropertyValue('--background').trim();
      if (bgVar) {
        backgroundColor = bgVar;
      }

      console.log('Export - Background color:', backgroundColor);

      // Resolve ALL CSS variables in SVG attributes (including defs)
      const resolveElementAttributes = (element: Element) => {
        // Handle common SVG attributes that can have CSS variables (both camelCase and kebab-case)
        const attributes = ['fill', 'stroke', 'stop-color', 'stopColor', 'flood-color', 'floodColor', 'stopOpacity', 'stop-opacity', 'style'];

        attributes.forEach(attr => {
          const value = element.getAttribute(attr);
          if (value && value.includes('var(')) {
            const resolved = resolveCSSVariable(value);
            console.log(`Resolved ${attr}: ${value} -> ${resolved}`);
            element.setAttribute(attr, resolved);
          }
        });

        // Also resolve in style attribute
        const style = element.getAttribute('style');
        if (style && style.includes('var(')) {
          const resolvedStyle = style.replace(/var\([^)]+\)/g, (match) => resolveCSSVariable(match));
          element.setAttribute('style', resolvedStyle);
        }
      };

      // Process all elements including defs, gradients, filters
      const allElements = svgClone.querySelectorAll('*');
      console.log(`Processing ${allElements.length} SVG elements`);
      allElements.forEach(resolveElementAttributes);

      // Also resolve on the SVG root
      resolveElementAttributes(svgClone);

      // Inline computed styles for visual elements
      const visualElements = svgClone.querySelectorAll('.nodes *, .edges *');
      console.log(`Inlining styles for ${visualElements.length} visual elements`);

      visualElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element as Element);
        const importantStyles = ['opacity', 'transform', 'filter', 'fill', 'stroke', 'stroke-width'];

        let styleString = element.getAttribute('style') || '';

        importantStyles.forEach(prop => {
          let value = computedStyle.getPropertyValue(prop);
          if (value && value.includes('var(')) {
            value = resolveCSSVariable(value);
          }
          if (value && value !== 'none' && value !== 'auto') {
            // Remove existing property if present
            styleString = styleString.replace(new RegExp(`${prop}:[^;]+;?`, 'g'), '');
            styleString += `${prop}:${value};`;
          }
        });

        element.setAttribute('style', styleString);
      });

      // Create a canvas to render the SVG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        alert('Error: Canvas rendering not supported');
        return;
      }

      // Set canvas size to match SVG dimensions (2x for retina quality)
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width * 2;
      canvas.height = svgRect.height * 2;
      ctx.scale(2, 2);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      console.log('SVG Data (first 500 chars):', svgData.substring(0, 500));

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();

      img.onload = () => {
        try {
          // Fill background
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

          // Draw the SVG image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Clean up blob URL
          URL.revokeObjectURL(svgUrl);

          // Create download link
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `force-graph-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } else {
              console.error('Failed to create blob from canvas');
              alert('Error: Failed to generate PNG image');
            }
          }, 'image/png');
        } catch (err) {
          console.error('Error during canvas rendering:', err);
          alert('Error: Failed to render graph image');
          URL.revokeObjectURL(svgUrl);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading SVG image:', error);
        alert('Error: Failed to load graph for export');
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error('Error downloading graph:', error);
      alert(`Error exporting graph: ${error}`);
    }
  };

  return (
    <div className="absolute top-7 left-6 bg-background/95 border-2 border-primary rounded-xl p-4 backdrop-blur-md shadow-[0_8px_32px_rgba(var(--primary-rgb),0.3)]">
      <h3 className="text-sm font-bold text-primary mb-3" style={{ textShadow: '0 0 8px var(--primary)' }}>
        Legend
      </h3>
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2">
        {/* Nodes */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-foreground/60 mb-1">NODES</p>
          {nodeTypes.map(({ kind, label, color, icon }) => (
            <label
              key={kind}
              className="flex items-center gap-2 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-colors text-xs"
              onClick={() => toggleNode(kind)}
            >
              <input
                type="checkbox"
                checked={visibleNodes[kind]}
                onChange={() => toggleNode(kind)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-base">{icon}</span>
              <span className="flex-1 text-foreground" style={{ color }}>{label}</span>
            </label>
          ))}
        </div>

        {/* Edges */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-foreground/60 mb-1">EDGES</p>
          {edgeTypes.map(({ kind, label, color }) => (
            <label
              key={kind}
              className="flex items-center gap-2 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-colors text-xs"
              onClick={() => toggleEdge(kind)}
            >
              <input
                type="checkbox"
                checked={visibleEdges[kind]}
                onChange={() => toggleEdge(kind)}
                className="w-4 h-4 cursor-pointer"
              />
              <div className="w-6 h-0.5" style={{ backgroundColor: color }} />
              <span className="flex-1 text-foreground">{label}</span>
            </label>
          ))}
        </div>

        {/* Layout Controls */}
        <div className="mb-2 pt-2 border-t border-primary/20">
          <p className="text-xs font-semibold text-foreground/60 mb-2">LAYOUT</p>
          <div className="flex gap-1">
            <button
              onClick={() => setLayout('force')}
              className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-all ${
                layout === 'force'
                  ? 'bg-primary/15 border-primary/40 text-primary font-semibold'
                  : 'bg-background/50 border-border text-foreground/80 hover:bg-accent/10'
              }`}
            >
              Force
            </button>
            <button
              onClick={() => setLayout('structured')}
              className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-all ${
                layout === 'structured'
                  ? 'bg-primary/15 border-primary/40 text-primary font-semibold'
                  : 'bg-background/50 border-border text-foreground/80 hover:bg-accent/10'
              }`}
            >
              Structured
            </button>
          </div>
        </div>

        {/* Edge Routing */}
        <div className="mb-2 pt-2 border-t border-primary/20">
          <p className="text-xs font-semibold text-foreground/60 mb-2">EDGE ROUTING</p>
          <label
            className="flex items-center gap-2 cursor-pointer p-1.5 rounded-md hover:bg-accent/10 transition-colors text-xs"
            onClick={toggleOrthogonalEdges}
          >
            <input
              type="checkbox"
              checked={orthogonalEdges}
              onChange={toggleOrthogonalEdges}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="flex-1 text-foreground">Orthogonal edges</span>
          </label>
        </div>

        {/* Download Button */}
        <div className="pt-2 border-t border-primary/20">
          <button
            onClick={downloadGraphAsPng}
            className="w-full px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-md text-green-400 cursor-pointer text-xs font-semibold transition-all hover:bg-green-500/20 hover:-translate-y-0.5"
            title="Download graph as PNG image"
          >
            📥 Download PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Legend;
