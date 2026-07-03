/**
 * Inline rendering of the per-turn router-LLM call (op-0rzm).
 *
 * The router LLM is an auxiliary picker that runs BEFORE the main turn
 * to select a tool subset; debugging why it chose the wrong tool (or
 * took ages) requires the catalogue it saw + the picks + timing.
 * Today's tiny "ROUTER PICKED" chip carries only the picks — useful at
 * a glance, but useless when something looks off.
 *
 * Visual: compact card matching ToolCallCard's language — collapsed
 * chevron row with model + picks + duration; expanded view shows the
 * full candidate catalogue with picks highlighted, plus the duration
 * breakdown. Hidden entirely when there's no router record at all (the
 * router didn't run because use_tool_router was false).
 *
 * Distinct from the routerPicks chip in ChatMessage: the chip is the
 * tight glanceable "what got bound", this card is the "why + how long".
 * The chip stays as the always-visible summary; the card unlocks
 * detail via the chevron.
 */
import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, Cpu, Wand2 } from "lucide-react";
import { cn } from "../shared/utils.js";

/**
 * One tool from the router LLM's candidate catalogue. Shape mirrors
 * the server's `router_started` event (agent/graph.py builds the list
 * via `_docstring_first_line`). Kept narrow so other backends can
 * supply the same shape without dragging in a full ToolMeta dep.
 */
export interface RouterToolMeta {
  name: string;
  description: string;
}

/**
 * Render-shape for the router LLM call. Built up over two events:
 *   - router_started: model + tool_count + candidate_tools (entry)
 *   - router_finished: picks + duration_ms (exit)
 * The card renders even when only `started` has landed — picks +
 * duration just show as "…" placeholders so the user knows the
 * router is still thinking.
 */
export interface RouterCallProps {
  model: string;
  tool_count: number;
  candidate_tools: RouterToolMeta[];
  /** Tool names the router actually picked on top of the default set.
   *  Undefined while still running; empty when the picker explicitly
   *  selected nothing extra. */
  picks?: string[];
  /** The always-bound safety-floor subset, surfaced as a separate
   *  collapsed group so users can see what's "free" vs what the
   *  router added. */
  defaults?: string[];
  /** Wall-clock milliseconds the routing pass took. Undefined while
   *  still running. */
  duration_ms?: number;
  className?: string;
  /** Default open state — usually false so the card stays a one-row
   *  chip until the user wants the detail. */
  defaultOpen?: boolean;
  /** Tight monospace layout for dense rails. Same prop ToolCallCard
   *  accepts so the two cards coexist visually in dense mode. */
  dense?: boolean;
}

export function RouterCallCard({
  model,
  tool_count,
  candidate_tools,
  picks,
  defaults,
  duration_ms,
  className,
  defaultOpen = false,
  dense = false,
}: RouterCallProps) {
  const [open, setOpen] = useState(defaultOpen);
  const done = typeof duration_ms === "number" && duration_ms >= 0;
  const pickSet = new Set(picks ?? []);
  const defaultSet = new Set(defaults ?? []);
  const durationLabel = done ? fmtDuration(duration_ms!) : "…";

  if (dense) {
    return (
      <div data-testid="router-call-card" className={cn("font-mono text-[10px]", className)}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex w-full items-center gap-1.5 px-2 py-1 text-left hover:text-primary transition-colors cursor-pointer"
          aria-expanded={open}
        >
          {open ? (
            <ChevronDown
              className="h-2.5 w-2.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <ChevronRight
              className="h-2.5 w-2.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <Wand2 className="h-2.5 w-2.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-[8rem] truncate text-foreground">router · {model}</span>
          <span className="shrink-0 text-muted-foreground tabular-nums">
            {pickSet.size}/{tool_count}
          </span>
          <span className="ml-auto shrink-0 tabular-nums text-muted-foreground/70">
            · {durationLabel}
          </span>
        </button>
        {open && (
          <RouterCallDetail
            candidate_tools={candidate_tools}
            pickSet={pickSet}
            defaultSet={defaultSet}
            duration_ms={duration_ms}
            dense
          />
        )}
      </div>
    );
  }

  return (
    <div
      data-testid="router-call-card"
      className={cn(
        "rounded-md border bg-card/40 my-2 overflow-hidden border-primary/30",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px]",
          "hover:bg-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
        <Wand2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <span className="font-mono font-bold">router</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          <Cpu className="inline h-3 w-3 mr-1" aria-hidden="true" />
          {model} · {pickSet.size > 0 ? `picked ${[...pickSet].join(", ")}` : "no picks"}
        </span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-0.5 text-[9px] text-muted-foreground tabular-nums">
          <Clock className="h-2.5 w-2.5" aria-hidden="true" />
          {durationLabel}
        </span>
      </button>

      {open && (
        <RouterCallDetail
          candidate_tools={candidate_tools}
          pickSet={pickSet}
          defaultSet={defaultSet}
          duration_ms={duration_ms}
        />
      )}
    </div>
  );
}

interface RouterCallDetailProps {
  candidate_tools: RouterToolMeta[];
  pickSet: Set<string>;
  defaultSet: Set<string>;
  duration_ms?: number;
  dense?: boolean;
}

function RouterCallDetail({
  candidate_tools,
  pickSet,
  defaultSet,
  duration_ms,
  dense = false,
}: RouterCallDetailProps) {
  const done = typeof duration_ms === "number" && duration_ms >= 0;
  return (
    <div
      className={cn(
        "border-t border-border/40 bg-card/20 p-2.5 text-[11px] space-y-2",
        dense && "text-[10px] p-2 space-y-1.5"
      )}
    >
      <div>
        <div
          className={cn(
            "mb-1 font-bold uppercase tracking-wider text-muted-foreground",
            dense ? "text-[8.5px]" : "text-[9px]"
          )}
        >
          tools considered ({candidate_tools.length})
        </div>
        <ul className="space-y-0.5">
          {candidate_tools.map(t => {
            const picked = pickSet.has(t.name);
            const isDefault = defaultSet.has(t.name);
            return (
              <li
                key={t.name}
                data-testid={picked ? "router-tool-picked" : "router-tool-considered"}
                className={cn(
                  "flex items-baseline gap-2 px-1.5 py-0.5 rounded-sm",
                  picked ? "bg-primary/15 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="font-mono">{picked ? "✓" : "·"}</span>
                <span className="font-mono truncate">{t.name}</span>
                {isDefault && (
                  <span className="inline-block shrink-0 rounded-sm border border-border/40 bg-muted/40 px-1 text-[8.5px] uppercase tracking-wider text-muted-foreground">
                    default
                  </span>
                )}
                {t.description && (
                  <span className="text-muted-foreground/70 truncate">— {t.description}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {done && (
        <div
          className={cn(
            "flex items-center gap-1 tabular-nums text-muted-foreground",
            dense ? "text-[9.5px]" : "text-[10px]"
          )}
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          routing took {fmtDuration(duration_ms!)}
          {" · "}
          {pickSet.size} picked · {defaultSet.size} default
        </div>
      )}
    </div>
  );
}

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
