/**
 * PortfolioChart Component
 * D3 line chart showing portfolio value over time
 */

import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/catalyst-ui/ui/card";
import type { Transaction, Position, Portfolio } from "../types";

interface DataPoint {
  date: Date;
  value: number;
}

interface PortfolioChartProps {
  portfolio: Portfolio;
  transactions: Transaction[];
  positions: Position[];
  className?: string;
}

export function PortfolioChart({
  portfolio,
  transactions,
  positions,
  className,
}: PortfolioChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate portfolio value over time
  const data = useMemo<DataPoint[]>(() => {
    if (!transactions.length) {
      return [
        { date: portfolio.createdAt, value: portfolio.initialCash },
        { date: new Date(), value: portfolio.currentCash },
      ];
    }

    // Sort transactions by time
    const sorted = [...transactions].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const points: DataPoint[] = [];
    let cashBalance = portfolio.initialCash;
    const holdings = new Map<string, number>();

    // Add initial point
    points.push({ date: portfolio.createdAt, value: cashBalance });

    // Process each transaction
    sorted.forEach(tx => {
      if (tx.type === "BUY") {
        cashBalance -= tx.totalAmount;
        holdings.set(tx.symbol, (holdings.get(tx.symbol) || 0) + tx.shares);
      } else {
        cashBalance += tx.totalAmount;
        const currentHolding = holdings.get(tx.symbol) || 0;
        holdings.set(tx.symbol, Math.max(0, currentHolding - tx.shares));
      }

      // Calculate total portfolio value at this point
      // Use transaction price as proxy for position value at that time
      let positionsValue = 0;
      holdings.forEach((shares, symbol) => {
        if (shares > 0) {
          const position = positions.find(p => p.symbol === symbol);
          positionsValue += shares * (position?.avgPrice || tx.price);
        }
      });

      points.push({
        date: tx.timestamp,
        value: cashBalance + positionsValue,
      });
    });

    // Add current point with latest prices
    let currentPositionsValue = 0;
    positions.forEach(pos => {
      currentPositionsValue += pos.shares * pos.currentPrice;
    });

    points.push({
      date: new Date(),
      value: portfolio.currentCash + currentPositionsValue,
    });

    return points;
  }, [portfolio, transactions, positions]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

    // Clear previous render
    svg.selectAll("*").remove();

    // Dimensions
    const containerWidth = container.clientWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(d3.min(data, d => d.value) || 0, portfolio.initialCash * 0.95),
        Math.max(d3.max(data, d => d.value) || 0, portfolio.initialCash * 1.05),
      ])
      .nice()
      .range([height, 0]);

    // Create SVG group
    const g = svg
      .attr("width", containerWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    // Area under line
    const area = d3
      .area<DataPoint>()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "hsl(var(--primary))")
      .attr("fill-opacity", 0.1)
      .attr("d", area);

    // Line
    const line = d3
      .line<DataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Dots at each data point
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.value))
      .attr("r", 3)
      .attr("fill", "hsl(var(--primary))")
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 2);

    // Axes
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5));

    xAxis.selectAll("text").attr("fill", "hsl(var(--muted-foreground))");
    xAxis.selectAll("line, path").attr("stroke", "hsl(var(--border))");

    const yAxis = g.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `$${(d as number) / 1000}k`)
    );

    yAxis.selectAll("text").attr("fill", "hsl(var(--muted-foreground))");
    yAxis.selectAll("line, path").attr("stroke", "hsl(var(--border))");

    // Tooltip
    const tooltip = d3
      .select(container)
      .append("div")
      .attr(
        "class",
        "absolute hidden bg-popover border border-border rounded px-3 py-2 text-sm shadow-lg pointer-events-none"
      )
      .style("z-index", "100");

    g.selectAll("circle")
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("r", 5).attr("fill", "hsl(var(--primary))");

        const point = d as DataPoint;
        tooltip.style("display", "block").html(
          `<div class="font-semibold">${point.date.toLocaleDateString()}</div>` +
            `<div class="text-muted-foreground">${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(point.value)}</div>`
        );
      })
      .on("mousemove", function (event) {
        const [mouseX, mouseY] = d3.pointer(event, container);
        tooltip.style("left", `${mouseX + 10}px`).style("top", `${mouseY - 10}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("r", 3);
        tooltip.style("display", "none");
      });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data, portfolio]);

  const currentValue = data[data.length - 1]?.value || portfolio.currentCash;
  const initialValue = portfolio.initialCash;
  const totalGain = currentValue - initialValue;
  const totalGainPercent = ((totalGain / initialValue) * 100).toFixed(2);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Total value over time</CardDescription>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${totalGain >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {totalGain >= 0 ? "+" : ""}
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                totalGain
              )}
            </div>
            <div className={`text-sm ${totalGain >= 0 ? "text-green-500" : "text-red-500"}`}>
              {totalGain >= 0 ? "+" : ""}
              {totalGainPercent}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="relative w-full">
          <svg ref={svgRef}></svg>
        </div>
      </CardContent>
    </Card>
  );
}
