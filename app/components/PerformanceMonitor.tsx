import { useState } from "react";
import { useWebVitals } from "@/catalyst-ui/hooks/useWebVitals";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Button } from "@/catalyst-ui/ui/button";
import { Activity } from "lucide-react";

/**
 * PerformanceMonitor - Status light and dropdown for performance monitoring
 *
 * Features:
 * - Color-coded status light based on Core Web Vitals aggregate rating
 * - Dropdown showing detailed metrics with emoji indicators
 * - react-scan toggle button
 * - Development-only component
 */
export function PerformanceMonitor() {
  const { metrics, aggregateRating } = useWebVitals({
    enableConsoleLog: false, // Disable console to avoid noise
  });

  const [reactScanEnabled, setReactScanEnabled] = useState(true);

  // Don't render in production
  if (!import.meta.env.DEV) return null;

  // Status light color based on aggregate rating
  const statusColor =
    aggregateRating === 'good'
      ? 'bg-green-500'
      : aggregateRating === 'needs-improvement'
      ? 'bg-yellow-500'
      : 'bg-red-500';

  const toggleReactScan = async () => {
    const { scan } = await import('react-scan');
    const newState = !reactScanEnabled;
    scan({ enabled: newState });
    setReactScanEnabled(newState);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          title={`Performance: ${aggregateRating}`}
        >
          <Activity className="h-4 w-4" />
          {/* Status light indicator */}
          <span
            className={`absolute top-1 right-1 h-2 w-2 rounded-full ${statusColor} ring-2 ring-background`}
            aria-label={`Status: ${aggregateRating}`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Performance Monitor</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Web Vitals Section */}
        <div className="px-2 py-2 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Core Web Vitals</p>
          {['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].map((name) => {
            const metric = metrics.get(name);
            if (!metric) {
              return (
                <div key={name} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{name}:</span>
                  <span className="text-muted-foreground">—</span>
                </div>
              );
            }

            const emoji =
              metric.rating === 'good'
                ? '✅'
                : metric.rating === 'needs-improvement'
                ? '⚠️'
                : '❌';

            return (
              <div key={name} className="flex justify-between items-center text-xs">
                <span>
                  {emoji} {name}:
                </span>
                <span className="font-mono">
                  {name === 'CLS' ? metric.value.toFixed(3) : `${metric.value.toFixed(0)}ms`}
                </span>
              </div>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* react-scan Toggle */}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <button
            onClick={toggleReactScan}
            className="w-full text-left text-sm flex items-center justify-between"
          >
            <span>React Scan</span>
            <span className={`text-xs ${reactScanEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
              {reactScanEnabled ? '🟢 ON' : '⚪ OFF'}
            </span>
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Help text */}
        <div className="px-2 py-2">
          <p className="text-xs text-muted-foreground">
            React Scan highlights re-rendering components. Toggle to show/hide overlays.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
