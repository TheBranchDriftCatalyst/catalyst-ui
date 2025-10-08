import { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * D4 Loader - Infolding Hypercube Animation
 *
 * Features:
 * - Nested cubes visualization (tesseract as cube within a cube)
 * - Pulsing/scaling animation (infold/unfold)
 * - 3D rotation with perspective
 * - Neon glow effects matching theme
 */
export interface D4LoaderProps {
  rotationSpeed?: number; // multiplier for rotation
  chromaIntensity?: number; // 0..1 intensity for chromatic aberration
  sparksEnabled?: boolean;
  chromaEnabled?: boolean;
  sparkFrequency?: number; // 0..1 probability per frame
}

export function D4Loader({
  rotationSpeed = 1,
  chromaIntensity = 0.6,
  sparksEnabled = true,
  chromaEnabled = true,
  sparkFrequency = 0.06,
}: D4LoaderProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Refs to hold latest prop values so the D3 animation reads live values
  const rotationSpeedRef = useRef<number>(rotationSpeed);
  const chromaIntensityRef = useRef<number>(chromaIntensity);
  const sparksEnabledRef = useRef<boolean>(sparksEnabled);
  const chromaEnabledRef = useRef<boolean>(chromaEnabled);
  const sparkFrequencyRef = useRef<number>(sparkFrequency);

  // Keep refs in sync with incoming props
  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
    chromaIntensityRef.current = chromaIntensity;
    sparksEnabledRef.current = sparksEnabled;
    chromaEnabledRef.current = chromaEnabled;
    sparkFrequencyRef.current = sparkFrequency;
  }, [rotationSpeed, chromaIntensity, sparksEnabled, chromaEnabled, sparkFrequency]);

  useEffect(() => {
    // Ensure svg ref exists
    if (!svgRef.current) {
      return;
    }

    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear any existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up SVG with glow filter
    svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);

    // Read CSS vars for colors (prefer design tokens)
    const computedStyle = getComputedStyle(document.documentElement);
    const colorPrimary = (
      computedStyle.getPropertyValue("--color-primary") ||
      computedStyle.getPropertyValue("--primary") ||
      computedStyle.getPropertyValue("--neon-blue")
    ).trim();
    const colorAccent = (
      computedStyle.getPropertyValue("--color-accent") ||
      computedStyle.getPropertyValue("--accent") ||
      computedStyle.getPropertyValue("--neon-pink")
    ).trim();
    // Prefer explicit cyan/purple neon tokens for chromatic effect
    const colorCyan = computedStyle.getPropertyValue("--neon-cyan").trim();
    const colorPurple = computedStyle.getPropertyValue("--neon-purple").trim();
    const colorPrimaryRgb = (
      computedStyle.getPropertyValue("--primary-rgb") ||
      computedStyle.getPropertyValue("--neon-blue-rgb")
    ).trim();
    const colorAccentRgb = (
      computedStyle.getPropertyValue("--accent-rgb") ||
      computedStyle.getPropertyValue("--neon-pink-rgb")
    ).trim();

    // Foreground/contrast color token for strokes
    const colorForeground = (
      computedStyle.getPropertyValue("--primary-foreground") ||
      computedStyle.getPropertyValue("--foreground") ||
      computedStyle.getPropertyValue("--on-primary")
    ).trim();

    // Define glow filter
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-100%")
      .attr("y", "-100%")
      .attr("width", "300%")
      .attr("height", "300%");

    filter.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Gradient that will flow between primary and accent colors
    const grad = defs
      .append("linearGradient")
      .attr("id", "flowGrad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Use cyan -> purple gradient to avoid dark/black artifact and match catalyst tokens
    grad.append("stop").attr("offset", "0%").attr("stop-color", colorCyan).attr("stop-opacity", 1);
    grad
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", colorPurple)
      .attr("stop-opacity", 1);
    grad
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorCyan)
      .attr("stop-opacity", 1);

    // Container group
    // Apply a subtle SVG drop-shadow using token RGB values when available
    const svgShadow = colorPrimaryRgb
      ? `drop-shadow(0 0 20px rgba(${colorPrimaryRgb},0.25)) drop-shadow(0 0 40px rgba(${colorAccentRgb || colorPrimaryRgb},0.12))`
      : undefined;
    if (svgShadow) {
      svg.style("filter", svgShadow);
    }

    const g = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

    // Define two cubes: outer and inner (tesseract = cube within cube)
    // Outer cube vertices
    const outerSize = 100;
    const outerCube = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1], // front face
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1], // back face
    ].map(([x, y, z]) => [x * outerSize, y * outerSize, z * outerSize]);

    // Inner cube (will be scaled dynamically)
    const innerCube = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    // Cube edges (12 edges for a cube)
    const cubeEdges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0], // front face
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4], // back face
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // connecting edges
    ];

    // Connecting edges between outer and inner cubes
    const connectingEdges = [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
    ];

    // (moved primaryColor and computedStyle above)

    // Create groups for outer cube, inner cube, connections, and sparks
    const outerGroup = g.append("g").attr("class", "outer-cube");
    const innerGroup = g.append("g").attr("class", "inner-cube");
    const connectGroup = g.append("g").attr("class", "connections");
    const sparksGroup = g.append("g").attr("class", "sparks");
    // Chromatic aberration groups: slight offsets colored strokes
    const chromaCyan = g.append("g").attr("class", "chroma-cyan");
    const chromaPurple = g.append("g").attr("class", "chroma-purple");

    // Sparks state for transient spark effects
    const sparks: Array<any> = [];
    let sparkId = 0;

    // (chromatic-aberration used instead of glitch)

    // Create outer cube edges (accent color initially)
    const outerEdges = outerGroup
      .selectAll("line")
      .data(cubeEdges)
      .enter()
      .append("line")
      .attr("stroke", colorAccent)
      .attr("stroke-width", 4)
      .attr("opacity", 0.9)
      .style("filter", "url(#glow)");

    // Create outer cube vertices (accent fill initially)
    const outerVertices = outerGroup
      .selectAll("circle")
      .data(outerCube)
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("fill", colorAccent)
      .attr("stroke", colorAccent)
      // .attr("stroke-width", 0)
      .style("filter", "url(#glow)");

    // Create inner cube edges (primary color initially)
    const innerEdges = innerGroup
      .selectAll("line")
      .data(cubeEdges)
      .enter()
      .append("line")
      .attr("stroke", colorPrimary)
      .attr("stroke-width", 3)
      .attr("opacity", 0.95)
      .style("filter", "url(#glow)");

    // Create inner cube vertices (primary fill initially)
    const innerVertices = innerGroup
      .selectAll("circle")
      .data(innerCube)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", colorPrimary)
      .attr("stroke", colorPrimary)
      // .attr("stroke-width", 2)
      .style("filter", "url(#glow)");

    // Create connecting lines
    const connections = connectGroup
      .selectAll("line")
      .data(connectingEdges)
      .enter()
      .append("line")
      .attr("stroke", `url(#flowGrad)`)
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)
      .attr("stroke-dasharray", "5,5")
      .style("filter", "url(#glow)");

    // Create chromatic edge layers (cyan & purple) for subtle separation
    chromaCyan
      .selectAll("line")
      .data(cubeEdges)
      .enter()
      .append("line")
      .attr("stroke", colorCyan)
      .attr("stroke-width", 2)
      .attr("opacity", 0.35)
      .style("mix-blend-mode", "screen");

    chromaPurple
      .selectAll("line")
      .data(cubeEdges)
      .enter()
      .append("line")
      .attr("stroke", colorPurple)
      .attr("stroke-width", 2)
      .attr("opacity", 0.35)
      .style("mix-blend-mode", "screen");

    // Animation state
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;
    let time = 0;
    // Cache for gradient stops to avoid repeated DOM queries
    let cachedStops: d3.Selection<any, any, any, any> | null | undefined = undefined;

    // Rotate and project 3D point to 2D with perspective
    const project3Dto2D = (point: number[], scale: number = 1): [number, number] => {
      let [x, y, z] = point;

      // Apply scale
      x *= scale;
      y *= scale;
      z *= scale;

      // Rotate around Y axis
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Rotate around Z axis
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;

      // Perspective projection
      const distance = 400;
      const scale2D = distance / (distance + z2);

      return [x3 * scale2D, y3 * scale2D];
    };

    // Animation loop
    // The animation smoothly swaps the roles of the two cubes:
    // - The outer cube collapses down while its stroke/vertices fade and shrink.
    // - The inner cube expands and takes the visual role of the outer cube.
    // This creates the illusion of the outer square collapsing onto the inner square,
    // which expands to become the new outer boundary.
    const animate = () => {
      time += 0.016;

      // Update rotation angles (scaled by rotationSpeed ref so changes apply live)
      const rs = rotationSpeedRef.current;
      angleX += 0.008 * rs;
      angleY += 0.012 * rs;
      angleZ += 0.006 * rs;

      // Time-based parameter [0..1] for smooth cycle
      const t = (Math.sin(time * 2) + 1) / 2; // 0 -> 1 -> 0 loop

      // Ranges for the swap animation
      const minInner = 0.2; // when inner is smallest
      const maxInner = 1.0; // when inner becomes the outer
      const minOuter = 0.2; // outer smallest when inner is largest
      const maxOuter = 1.0; // outer at full size when inner is smallest

      // Interpolated scales (inner expands while outer collapses)
      const innerScale = minInner + (maxInner - minInner) * t;
      const outerScale = maxOuter - (maxOuter - minOuter) * t;

      // Interpolate colors so inner becomes accent and outer becomes primary as they swap
      try {
        const interpInnerStroke = d3.interpolateRgb(colorPrimary, colorAccent)(t);
        const interpOuterStroke = d3.interpolateRgb(colorAccent, colorPrimary)(t);

        innerEdges.attr("stroke", interpInnerStroke);
        innerVertices.attr("fill", interpInnerStroke);

        outerEdges.attr("stroke", interpOuterStroke);
        outerVertices.attr("fill", interpOuterStroke);
      } catch (e) {
        // Defensive: if d3 interp fails, ignore and keep original colors
      }

      // Project outer cube vertices (apply outerScale)
      // Project outer cube vertices (no glitch jitter)
      const outerProjected = outerCube.map(p => project3Dto2D(p, outerScale));

      // Project inner cube vertices (innerCube points are unit - scale by outerSize * innerScale)
      const innerProjected = innerCube.map(p => project3Dto2D(p, innerScale * outerSize));

      // (no glitch to restore)

      // Animate gradient stops so the color appears to flow
      // Cache stop selection outside of the loop - select lazily once
      if (cachedStops === undefined) {
        try {
          cachedStops = svg.select("#flowGrad").selectAll("stop");
        } catch (e) {
          cachedStops = null;
        }
      }
      if (cachedStops) {
        const base = (time * 0.08) % 1;
        // use nodes() to avoid 'this' typing issues and reduce d3.select overhead
        const nodes = (cachedStops as any).nodes ? (cachedStops as any).nodes() : [];
        for (let i = 0; i < nodes.length; i++) {
          const off = ((base + i * 0.33) % 1) * 100;
          try {
            (nodes[i] as SVGStopElement).setAttribute("offset", `${off}%`);
          } catch (e) {
            // ignore
          }
        }
      }

      // Skip expensive frame work when the document is hidden
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      // Occasionally spawn sparks near vertices (cap total sparks to limit CPU)
      if (sparksEnabledRef.current && Math.random() < sparkFrequencyRef.current) {
        const idx = Math.floor(Math.random() * outerProjected.length);
        const ox = outerProjected[idx][0];
        const oy = outerProjected[idx][1];
        const ix = innerProjected[idx][0];
        const iy = innerProjected[idx][1];
        // spawn between inner and outer depending on t
        const sx = ox * (1 - t) + ix * t;
        const sy = oy * (1 - t) + iy * t;
        const vX = (Math.random() - 0.5) * 6;
        const vY = (Math.random() - 0.5) * 6;
        const color =
          Math.random() < 0.5
            ? colorPrimary || colorCyan || colorForeground
            : colorAccent || colorPurple || colorForeground;
        sparks.push({
          id: sparkId++,
          x: sx,
          y: sy,
          vx: vX,
          vy: vY,
          life: 30 + Math.random() * 30,
          r: 1 + Math.random() * 3,
          color,
        });
        // cap to 120 sparks to avoid runaway CPU/memory
        if (sparks.length > 120) {
          sparks.splice(0, sparks.length - 120);
        }
      }

      // Update sparks and bind to DOM
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.98;
        s.vy *= 0.98;
        s.life -= 1;
        s.r *= 0.98;
        if (s.life <= 0 || s.r < 0.2) {
          sparks.splice(i, 1);
        }
      }

      // Reuse selection references where possible to minimize work
      const sparkSel = sparksGroup.selectAll("circle").data(sparks, (d: any) => d.id as any);
      sparkSel
        .join(
          enter =>
            enter
              .append("circle")
              .attr("cx", (d: any) => d.x)
              .attr("cy", (d: any) => d.y)
              .attr("r", (d: any) => d.r)
              .attr("fill", (d: any) => d.color)
              .attr("opacity", 0.95)
              .style("filter", "url(#glow)"),
          update => update,
          exit => exit.remove()
        )
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)
        .attr("r", (d: any) => Math.max(0.2, d.r))
        .attr("opacity", (d: any) => Math.max(0, d.life / 60));

      // Stroke widths and vertex radii that follow scale to emphasize the swap
      const outerStroke = 1.5 + 3.5 * outerScale; // between ~1.5 and ~5
      const innerStroke = 1.5 + 3.5 * Math.min(innerScale, 1);
      const outerVertexR = 2 + 5 * outerScale;
      const innerVertexR = 2 + 5 * Math.min(innerScale, 1);

      // Update outer cube edges
      outerEdges
        .attr("x1", d => outerProjected[d[0]][0])
        .attr("y1", d => outerProjected[d[0]][1])
        .attr("x2", d => outerProjected[d[1]][0])
        .attr("y2", d => outerProjected[d[1]][1])
        .attr("stroke-width", outerStroke)
        .attr("opacity", 0.6 + outerScale * 0.4);

      // Update chroma layers with slight offsets for chromatic aberration
      const chromaOffset = (2 + 3 * (1 - outerScale)) * chromaIntensityRef.current; // offset varies with scale and intensity
      if (chromaEnabledRef.current) {
        chromaCyan
          .selectAll("line")
          .attr("x1", (d: any) => outerProjected[d[0]][0] - chromaOffset)
          .attr("y1", (d: any) => outerProjected[d[0]][1] - chromaOffset)
          .attr("x2", (d: any) => outerProjected[d[1]][0] - chromaOffset)
          .attr("y2", (d: any) => outerProjected[d[1]][1] - chromaOffset);

        chromaPurple
          .selectAll("line")
          .attr("x1", (d: any) => outerProjected[d[0]][0] + chromaOffset)
          .attr("y1", (d: any) => outerProjected[d[0]][1] + chromaOffset)
          .attr("x2", (d: any) => outerProjected[d[1]][0] + chromaOffset)
          .attr("y2", (d: any) => outerProjected[d[1]][1] + chromaOffset);
      } else {
        chromaCyan.selectAll("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 0);
        chromaPurple.selectAll("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 0);
      }

      // Update outer cube vertices
      outerVertices
        .attr("cx", (_, i) => outerProjected[i][0])
        .attr("cy", (_, i) => outerProjected[i][1])
        .attr("r", outerVertexR)
        .attr("opacity", 0.6 + outerScale * 0.4);

      // Update inner cube edges
      innerEdges
        .attr("x1", d => innerProjected[d[0]][0])
        .attr("y1", d => innerProjected[d[0]][1])
        .attr("x2", d => innerProjected[d[1]][0])
        .attr("y2", d => innerProjected[d[1]][1])
        .attr("stroke-width", innerStroke)
        .attr("opacity", 0.6 + innerScale * 0.4);

      // Update inner cube vertices
      innerVertices
        .attr("cx", (_, i) => innerProjected[i][0])
        .attr("cy", (_, i) => innerProjected[i][1])
        .attr("r", innerVertexR)
        .attr("opacity", 0.6 + innerScale * 0.4);

      // Update connecting lines
      connections
        .attr("x1", d => outerProjected[d[0]][0])
        .attr("y1", d => outerProjected[d[0]][1])
        .attr("x2", d => innerProjected[d[1]][0])
        .attr("y2", d => innerProjected[d[1]][1])
        .attr("opacity", 0.3 + innerScale * 0.3);
    };

    // Start animation
    const interval = d3.interval(animate, 16); // ~60fps

    // Cleanup
    return () => {
      interval.stop();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <svg ref={svgRef} className="drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" />
      <div className="text-sm text-muted-foreground animate-pulse">
        Loading dimensional matrix...
      </div>
    </div>
  );
}
