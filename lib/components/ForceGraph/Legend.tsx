import React from "react";
import { createPortal } from "react-dom";
import { NodeKind, EdgeKind } from "./types";
import { useGraphState } from "./hooks/useGraphState";
import { useGraphConfig } from "./context/GraphContext";
import { LayoutKind } from "./utils/layouts";
import { useFloatingPanel } from "./hooks/useFloatingPanel";
import { useNodePositions } from "./hooks/useNodePositions";

interface LegendProps {
  visibleNodes: Record<NodeKind, boolean>;
  setVisibleNodes: (setter: React.SetStateAction<Record<NodeKind, boolean>>) => void;
  visibleEdges: Record<EdgeKind, boolean>;
  setVisibleEdges: (setter: React.SetStateAction<Record<EdgeKind, boolean>>) => void;
  storageKey?: string;
}

const Legend: React.FC<LegendProps> = ({
  visibleNodes,
  setVisibleNodes,
  visibleEdges,
  setVisibleEdges,
  storageKey,
}) => {
  const config = useGraphConfig();
  const { layout, setLayout, orthogonalEdges, toggleOrthogonalEdges } = useGraphState();
  const { clearPositions } = useNodePositions(storageKey, layout);

  const { panelRef, dragHandleRef, isCollapsed, toggleCollapse, style } = useFloatingPanel({
    initialPosition: { x: 24, y: 80 },
    positionStorageKey: "catalyst-ui.forcegraph.legend.position",
    collapseStorageKey: "catalyst-ui.forcegraph.legend.collapsed",
    enableDragging: true,
    enableResizing: false,
    enableCollapse: true,
  });

  // Build node types from config
  const nodeTypes: { kind: NodeKind; label: string; color: string; icon: string }[] =
    Object.entries(config.nodeTypes).map(([kind, typeConfig]) => ({
      kind: kind as NodeKind,
      label: typeConfig.label,
      color: typeConfig.color,
      icon: typeConfig.icon,
    }));

  // Build edge types from config
  const edgeTypes: { kind: EdgeKind; label: string; color: string }[] = Object.entries(
    config.edgeTypes
  ).map(([kind, typeConfig]) => ({
    kind: kind as EdgeKind,
    label: typeConfig.label,
    color: typeConfig.color,
  }));

  const toggleNode = (kind: NodeKind) => {
    setVisibleNodes(prev => ({ ...prev, [kind]: !prev[kind] }));
  };

  const toggleEdge = (kind: EdgeKind) => {
    setVisibleEdges(prev => ({ ...prev, [kind]: !prev[kind] }));
  };

  // Helper to resolve CSS variables
  const resolveCSSVariable = (value: string): string => {
    if (!value || !value.includes("var(")) {
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
      const svgElement = Array.from(document.querySelectorAll("svg")).find(svg => {
        const zoomLayer = svg.querySelector(".zoom-layer");
        return zoomLayer !== null;
      }) as SVGElement;

      if (!svgElement) {
        console.error("Force graph SVG element not found");
        alert("Error: Could not find graph to export");
        return;
      }

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Get background color
      const htmlElement = document.documentElement;
      const isDark = htmlElement.classList.contains("dark");
      let backgroundColor = isDark ? "#0a0a0f" : "#f5f5f5";

      // Resolve CSS variables in background
      const bgVar = getComputedStyle(htmlElement).getPropertyValue("--background").trim();
      if (bgVar) {
        backgroundColor = bgVar;
      }

      // Resolve ALL CSS variables in SVG attributes (including defs)
      const resolveElementAttributes = (element: Element) => {
        // Handle common SVG attributes that can have CSS variables (both camelCase and kebab-case)
        const attributes = [
          "fill",
          "stroke",
          "stop-color",
          "stopColor",
          "flood-color",
          "floodColor",
          "stopOpacity",
          "stop-opacity",
          "style",
        ];

        attributes.forEach(attr => {
          const value = element.getAttribute(attr);
          if (value && value.includes("var(")) {
            const resolved = resolveCSSVariable(value);
            element.setAttribute(attr, resolved);
          }
        });

        // Also resolve in style attribute
        const style = element.getAttribute("style");
        if (style && style.includes("var(")) {
          const resolvedStyle = style.replace(/var\([^)]+\)/g, match => resolveCSSVariable(match));
          element.setAttribute("style", resolvedStyle);
        }
      };

      // Process all elements including defs, gradients, filters
      const allElements = svgClone.querySelectorAll("*");
      allElements.forEach(resolveElementAttributes);

      // Also resolve on the SVG root
      resolveElementAttributes(svgClone);

      // Inline computed styles for visual elements
      const visualElements = svgClone.querySelectorAll(".nodes *, .edges *");

      visualElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element as Element);
        const importantStyles = [
          "opacity",
          "transform",
          "filter",
          "fill",
          "stroke",
          "stroke-width",
        ];

        let styleString = element.getAttribute("style") || "";

        importantStyles.forEach(prop => {
          let value = computedStyle.getPropertyValue(prop);
          if (value && value.includes("var(")) {
            value = resolveCSSVariable(value);
          }
          if (value && value !== "none" && value !== "auto") {
            // Remove existing property if present
            styleString = styleString.replace(new RegExp(`${prop}:[^;]+;?`, "g"), "");
            styleString += `${prop}:${value};`;
          }
        });

        element.setAttribute("style", styleString);
      });

      // Create a canvas to render the SVG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Canvas context not available");
        alert("Error: Canvas rendering not supported");
        return;
      }

      // Set canvas size to match SVG dimensions (2x for retina quality)
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width * 2;
      canvas.height = svgRect.height * 2;
      ctx.scale(2, 2);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);

      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
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
          canvas.toBlob(blob => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `force-graph-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } else {
              console.error("Failed to create blob from canvas");
              alert("Error: Failed to generate PNG image");
            }
          }, "image/png");
        } catch (err) {
          console.error("Error during canvas rendering:", err);
          alert("Error: Failed to render graph image");
          URL.revokeObjectURL(svgUrl);
        }
      };

      img.onerror = error => {
        console.error("Error loading SVG image:", error);
        alert("Error: Failed to load graph for export");
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error("Error downloading graph:", error);
      alert(`Error exporting graph: ${error}`);
    }
  };

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      className="bg-background/95 border-2 border-primary rounded-xl p-3 backdrop-blur-md shadow-[0_8px_32px_rgba(var(--primary-rgb),0.3)] pointer-events-auto z-50"
    >
      {/* Drag Handle and Collapse */}
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-xs font-bold text-primary"
          style={{ textShadow: "0 0 8px var(--primary)" }}
        >
          Legend
        </h3>
        <div className="flex items-center gap-2">
          {/* Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="w-5 h-5 flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity text-primary"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              {isCollapsed ? <path d="M8 4l4 4H4l4-4z" /> : <path d="M4 6l4 4 4-4H4z" />}
            </svg>
          </button>
          {/* Drag Handle */}
          <div
            ref={dragHandleRef}
            className="w-4 h-4 cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80 transition-opacity"
            title="Drag to move"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="text-primary">
              <circle cx="4" cy="4" r="1.5" />
              <circle cx="12" cy="4" r="1.5" />
              <circle cx="4" cy="8" r="1.5" />
              <circle cx="12" cy="8" r="1.5" />
              <circle cx="4" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
            </svg>
          </div>
        </div>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
          {/* Nodes */}
          <div className="mb-1">
            <p className="text-[10px] font-semibold text-foreground/60 mb-0.5 uppercase tracking-wide">
              Nodes
            </p>
            {nodeTypes.map(({ kind, label, color, icon }) => (
              <button
                key={kind}
                onClick={() => toggleNode(kind)}
                className={`w-full flex items-center gap-1.5 cursor-pointer px-1.5 py-0.5 rounded transition-all text-[11px] ${
                  visibleNodes[kind] ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <span className="text-sm">{icon}</span>
                <span
                  className={`flex-1 text-left font-medium ${visibleNodes[kind] ? "border-b" : ""}`}
                  style={{
                    color: visibleNodes[kind] ? color : "var(--foreground)",
                    borderColor: visibleNodes[kind] ? color : "transparent",
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Edges */}
          <div className="mb-1">
            <p className="text-[10px] font-semibold text-foreground/60 mb-0.5 uppercase tracking-wide">
              Edges
            </p>
            {edgeTypes.map(({ kind, label, color }) => (
              <button
                key={kind}
                onClick={() => toggleEdge(kind)}
                className={`w-full flex items-center gap-1.5 cursor-pointer px-1.5 py-0.5 rounded transition-all text-[11px] ${
                  visibleEdges[kind] ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <div
                  className={`h-0.5 rounded-full transition-all ${visibleEdges[kind] ? "w-6" : "w-4"}`}
                  style={{
                    backgroundColor: color,
                    boxShadow: visibleEdges[kind] ? `0 0 4px ${color}` : "none",
                  }}
                />
                <span
                  className={`flex-1 text-left font-medium ${visibleEdges[kind] ? "border-b" : ""}`}
                  style={{
                    color: visibleEdges[kind] ? color : "var(--foreground)",
                    borderColor: visibleEdges[kind] ? color : "transparent",
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Layout Controls */}
          <div className="mb-1 pt-1 border-t border-primary/20">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wide">
                Layout
              </p>
              {storageKey && (
                <button
                  onClick={clearPositions}
                  className="p-0.5 hover:bg-primary/10 rounded transition-colors opacity-60 hover:opacity-100"
                  title="Reset saved node positions for this layout"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-primary">
                    <path d="M13.65 2.35a7.958 7.958 0 00-11.3 0A7.958 7.958 0 000 8c0 2.137.833 4.146 2.35 5.65l1.06-1.06A6.459 6.459 0 011.5 8c0-1.736.676-3.369 1.904-4.596a6.459 6.459 0 014.596-1.904c1.736 0 3.369.676 4.596 1.904A6.459 6.459 0 0114.5 8c0 1.736-.676 3.369-1.904 4.596l-1.06 1.06A7.958 7.958 0 0016 8c0-2.137-.833-4.146-2.35-5.65zM8 4v5l3.5 2-1 1.5L6 10V4h2z" />
                  </svg>
                </button>
              )}
            </div>
            <select
              value={layout}
              onChange={e => setLayout(e.target.value as LayoutKind)}
              className="w-full px-1.5 py-0.5 text-[11px] bg-background/50 border border-primary/30 rounded text-foreground cursor-pointer transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="force">Force-Directed</option>
              <option value="structured">Structured (Columns)</option>
              <option value="community">Community (Smart)</option>
              <option value="dagre">Dagre (Mermaid)</option>
              <option value="elk">ELK (Advanced)</option>
            </select>
          </div>

          {/* Edge Routing */}
          <div className="mb-1 pt-1 border-t border-primary/20">
            <p className="text-[10px] font-semibold text-foreground/60 mb-1 uppercase tracking-wide">
              Edge Routing
            </p>
            <button
              onClick={toggleOrthogonalEdges}
              className={`w-full px-1.5 py-0.5 text-[11px] rounded transition-all ${
                orthogonalEdges
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Orthogonal Edges
            </button>
          </div>

          {/* Download Button */}
          <div className="pt-1 border-t border-primary/20">
            <button
              onClick={downloadGraphAsPng}
              className="w-full px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 cursor-pointer text-[11px] font-semibold transition-all hover:bg-green-500/20"
              title="Download graph as PNG image"
            >
              📥 PNG
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default Legend;
