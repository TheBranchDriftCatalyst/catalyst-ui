"use client";
import * as React from "react";
import { Button } from "@/catalyst-ui/ui/button";
import { cn } from "@/catalyst-ui/utils";

/**
 * The structural shape a `LogViewer` renders. Consumer log producers
 * (server-log streams, import runs, CLI shells) map their per-entry
 * shape onto this. `id` is any stable-per-line unique value (int or
 * uuid); `ts` is any string the caller wants prepended (ISO, ms epoch,
 * pre-formatted); `attrs` are optional structured k=v pairs rendered
 * dim after the message.
 */
export interface LogViewerLine {
  id: React.Key;
  ts: string;
  level: string;
  message: string;
  attrs?: Record<string, string> | null;
}

export interface LogViewerProps {
  logs: LogViewerLine[];
  /** Tailwind height class for the scroll area. Default: "h-80". */
  height?: string;
  /** Shown when `logs` is empty. Default: "Waiting for logs...". */
  emptyText?: string;
  /** Override the level→color mapping (e.g. add trace/notice). Merged over
   *  the default palette. */
  levelColors?: Record<string, string>;
  /** Override the ts formatter (default: `new Date(ts).toLocaleTimeString()`,
   *  falling back to the raw string on parse failure). */
  formatTs?: (ts: string) => string;
  /** Copy button on the "Jump to latest" affordance. Default: "Jump to latest". */
  jumpLabel?: string;
  className?: string;
}

const DEFAULT_LEVEL_COLORS: Record<string, string> = {
  error: "text-red-400",
  fatal: "text-red-400",
  warn: "text-amber-400",
  warning: "text-amber-400",
  debug: "text-slate-500",
  info: "text-sky-400",
};

function defaultFormatTs(ts: string): string {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleTimeString();
}

function formatAttrs(attrs?: Record<string, string> | null): string {
  if (!attrs) return "";
  return Object.entries(attrs)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
}

/**
 * LogViewer — monospace terminal-style log line renderer. Auto-scrolls to
 * the bottom on new entries; when the user scrolls up, autoscroll pauses
 * and a floating "Jump to latest" button appears to resume. Distinct from
 * `LoggerControl` (which is a config panel for setting logger levels — no
 * viewer surface at all).
 *
 * **When to reach for it:**
 * - CLI-style import/backfill/build progress streams
 * - Server-log tail views
 * - Any live-appending log stream where the user needs to skim + drill
 *
 * **Semantics:**
 * - Auto-scroll is on by default and resumes automatically when the user
 *   scrolls back within 40px of the bottom (pinned state).
 * - Line palette is level-based and overrideable via `levelColors`.
 * - Timestamps default to locale time; override via `formatTs` when the
 *   entries carry a non-standard shape (e.g. ns epoch or already-formatted).
 *
 * @example
 * ```tsx
 * <LogViewer
 *   logs={importRun.lines}
 *   height="h-96"
 *   emptyText="Import not started"
 * />
 * ```
 */
export function LogViewer({
  logs,
  height = "h-80",
  emptyText = "Waiting for logs...",
  levelColors,
  formatTs = defaultFormatTs,
  jumpLabel = "Jump to latest",
  className,
}: LogViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = React.useState(true);

  const palette = React.useMemo(
    () => ({ ...DEFAULT_LEVEL_COLORS, ...(levelColors ?? {}) }),
    [levelColors]
  );

  function onScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setPinned(distance < 40);
  }

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (el && pinned) el.scrollTop = el.scrollHeight;
  }, [logs, pinned]);

  function levelColor(level: string): string {
    return palette[level.toLowerCase()] ?? "text-slate-300";
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className={cn(
          "overflow-y-auto rounded-md border bg-slate-950 p-3 font-mono text-xs leading-relaxed",
          height,
          className
        )}
        role="log"
        aria-live="polite"
      >
        {logs.length === 0 ? (
          <p className="text-slate-500">{emptyText}</p>
        ) : (
          logs.map(line => {
            const attrs = formatAttrs(line.attrs);
            return (
              <div key={line.id} className="whitespace-pre-wrap break-words">
                <span className="text-slate-600">{formatTs(line.ts)} </span>
                <span className={cn("font-semibold uppercase", levelColor(line.level))}>
                  [{line.level}]
                </span>{" "}
                <span className="text-slate-200">{line.message}</span>
                {attrs && <span className="text-slate-500"> {attrs}</span>}
              </div>
            );
          })
        )}
      </div>
      {!pinned && (
        <div className="absolute bottom-3 right-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPinned(true)}
            title="Resume auto-scroll"
          >
            {jumpLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
