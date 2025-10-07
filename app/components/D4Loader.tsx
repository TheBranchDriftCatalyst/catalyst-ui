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
export function D4Loader() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear any existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up SVG with glow filter
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Define glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-100%")
      .attr("y", "-100%")
      .attr("width", "300%")
      .attr("height", "300%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "8")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Container group
    const g = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Define two cubes: outer and inner (tesseract = cube within cube)
    // Outer cube vertices
    const outerSize = 100;
    const outerCube = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],  // front face
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],   // back face
    ].map(([x, y, z]) => [x * outerSize, y * outerSize, z * outerSize]);

    // Inner cube (will be scaled dynamically)
    const innerCube = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
    ];

    // Cube edges (12 edges for a cube)
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],  // front face
      [4, 5], [5, 6], [6, 7], [7, 4],  // back face
      [0, 4], [1, 5], [2, 6], [3, 7],  // connecting edges
    ];

    // Connecting edges between outer and inner cubes
    const connectingEdges = [
      [0, 0], [1, 1], [2, 2], [3, 3],
      [4, 4], [5, 5], [6, 6], [7, 7],
    ];

    // Get computed primary color from CSS variable
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary').trim();

    // Create groups for outer cube, inner cube, and connections
    const outerGroup = g.append("g").attr("class", "outer-cube");
    const innerGroup = g.append("g").attr("class", "inner-cube");
    const connectGroup = g.append("g").attr("class", "connections");

    // Create outer cube edges
    const outerEdges = outerGroup
      .selectAll("line")
      .data(cubeEdges)
      .enter()
      .append("line")
      .attr("stroke", primaryColor || "#00fcd6")
      .attr("stroke-width", 4)
      .attr("opacity", 0.9)
      .style("filter", "url(#glow)");

    // Create outer cube vertices
    const outerVertices = outerGroup
      .selectAll("circle")
      .data(outerCube)
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("fill", primaryColor || "#00fcd6")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("filter", "url(#glow)");

    // Create inner cube edges
    const innerEdges = innerGroup
      .selectAll("line")
      .data(cubeEdges)
      .enter()
      .append("line")
      .attr("stroke", primaryColor || "#00fcd6")
      .attr("stroke-width", 3)
      .attr("opacity", 0.95)
      .style("filter", "url(#glow)");

    // Create inner cube vertices
    const innerVertices = innerGroup
      .selectAll("circle")
      .data(innerCube)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", primaryColor || "#00fcd6")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("filter", "url(#glow)");

    // Create connecting lines
    const connections = connectGroup
      .selectAll("line")
      .data(connectingEdges)
      .enter()
      .append("line")
      .attr("stroke", primaryColor || "#00fcd6")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)
      .attr("stroke-dasharray", "5,5")
      .style("filter", "url(#glow)");

    // Animation state
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;
    let time = 0;

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
    const animate = () => {
      time += 0.016;

      // Update rotation angles
      angleX += 0.008;
      angleY += 0.012;
      angleZ += 0.006;

      // Pulsing scale for inner cube (infold/unfold effect)
      const innerScale = 0.3 + Math.sin(time * 2) * 0.15;  // Pulses between 0.15 and 0.45

      // Project outer cube vertices
      const outerProjected = outerCube.map(p => project3Dto2D(p, 1));

      // Project inner cube vertices with pulsing scale
      const innerProjected = innerCube.map(p => {
        const scaled = [p[0] * outerSize * innerScale, p[1] * outerSize * innerScale, p[2] * outerSize * innerScale];
        return project3Dto2D(scaled, 1);
      });

      // Update outer cube edges
      outerEdges
        .attr("x1", d => outerProjected[d[0]][0])
        .attr("y1", d => outerProjected[d[0]][1])
        .attr("x2", d => outerProjected[d[1]][0])
        .attr("y2", d => outerProjected[d[1]][1]);

      // Update outer cube vertices
      outerVertices
        .attr("cx", (_, i) => outerProjected[i][0])
        .attr("cy", (_, i) => outerProjected[i][1]);

      // Update inner cube edges
      innerEdges
        .attr("x1", d => innerProjected[d[0]][0])
        .attr("y1", d => innerProjected[d[0]][1])
        .attr("x2", d => innerProjected[d[1]][0])
        .attr("y2", d => innerProjected[d[1]][1]);

      // Update inner cube vertices
      innerVertices
        .attr("cx", (_, i) => innerProjected[i][0])
        .attr("cy", (_, i) => innerProjected[i][1]);

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
      <svg
        ref={svgRef}
        className="drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
      />
      <div className="text-sm text-muted-foreground animate-pulse">
        Loading dimensional matrix...
      </div>
    </div>
  );
}
