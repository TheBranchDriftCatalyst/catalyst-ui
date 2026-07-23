/**
 * Inline rendering of one model→tool→model invocation. Used inside
 * <ChatMessage> when a turn carries `tool_calls` records, and
 * standalone in any host that captures `onToolCall` events itself.
 *
 * Visual: a compact card showing the tool name, argument summary,
 * collapsed result, and a duration badge. The full args + result
 * stay one click away in a `<details>` so a chat doesn't drown in
 * 8KB of search-result JSON when the user is just trying to read
 * the assistant's reply.
 *
 * No assumption about specific tool shapes — for known tools (the
 * built-in `web_search` / `browse_page`) we add specialized
 * argument summaries and result previews via small helpers; unknown
 * tools fall back to a generic JSON dump.
 */
import { useEffect, useState } from "react";
import {
  Wrench,
  ChevronDown,
  ChevronRight,
  Globe,
  ExternalLink,
  AlertTriangle,
  Clock,
  Activity,
  Repeat,
} from "lucide-react";
import type { ChatToolCallRecord, ToolAttachment, ToolSubEvent } from "../../react/chat/index.js";
import { cn } from "../shared/utils.js";
import { GeneratedImageCard } from "../image-gen/GeneratedImageCard.js";

export interface ToolCallCardProps {
  record: ChatToolCallRecord;
  className?: string;
  /** Default open state (otherwise collapsed for compactness). */
  defaultOpen?: boolean;
  /** Terminal aesthetic. When true the row collapses to a single line:
   *  chevron · wrench · name · status word. Args + result render as
   *  mono pre blocks when expanded. Use inside ChatPanel dense mode. */
  dense?: boolean;
}

const TOOL_ICONS: Record<string, React.ComponentType<any>> = {
  web_search: Globe,
  browse_page: Globe,
};

export function ToolCallCard({
  record,
  className,
  defaultOpen = false,
  dense = false,
}: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  // Auto-open when an image attachment lands so the user actually sees
  // the rendered image without having to hunt for the chevron. The
  // attachment arrives via a side-channel custom event AFTER the card
  // first mounts (typically), so a useState initialiser alone isn't
  // enough — we need the useEffect to flip it on late arrival.
  useEffect(() => {
    if (record.imageAttachment) {
      setOpen(true);
    }
  }, [record.imageAttachment]);
  const Icon = TOOL_ICONS[record.call.function.name] ?? Wrench;
  const isError = !!record.error;
  const subEvents = record.sub_events ?? [];
  // Quick summary numbers for the collapsed row: how many internal
  // tool calls happened and how many iterations the inner loop went
  // through. Useful for "this research used the council N times"
  // glanceability without expanding.
  const subToolCount = subEvents.filter(e => e.kind === "tool_call_start").length;
  const subIterCount = subEvents.filter(e => e.kind === "iteration").length;
  const hasSubEvents = subEvents.length > 0;
  const done = record.finished_at > 0;

  if (dense) {
    // PRO5: structured single-line row. Glyph + chevron in the left
    // gutter; tool name in a min-width-12rem truncating column so
    // multiple tool calls stack vertically with the name column
    // perfectly aligned; duration atom (live spinner while running,
    // static duration when done) in tabular-nums; status word at the
    // far right. running → `…`, error → red `error`, done → `ok`.
    const statusLabel = isError ? "error" : done ? "ok" : "…";
    return (
      <div
        className={cn(
          "font-mono text-[10px]",
          // No bg, no border. Tool-call rows flow with the surrounding
          // chat text as plain monospace lines — they get visual weight
          // from the chevron + wrench icons, not chrome. Error state
          // keeps a subtle red accent so failures are noticeable.
          isError && "border border-destructive/40 rounded-sm",
          className
        )}
      >
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
          <Icon
            className={cn(
              "h-2.5 w-2.5 shrink-0",
              isError ? "text-destructive" : done ? "text-emerald-500" : "text-primary"
            )}
            aria-hidden="true"
          />
          <span className="min-w-[12rem] truncate text-foreground">
            {record.call.function.name}
          </span>
          {hasSubEvents && (
            <span
              className="inline-flex shrink-0 items-center gap-0.5 rounded-sm border border-primary/40 bg-primary/10 px-1 py-0.5 text-[8px] uppercase tracking-wider text-primary"
              title={`${subToolCount} nested · ${subIterCount} iters`}
            >
              <Activity className="h-2 w-2" aria-hidden="true" />
              {subToolCount > 0 && <span className="tabular-nums">{subToolCount}</span>}
            </span>
          )}
          <span className="ml-auto shrink-0 inline-flex items-center gap-1">
            <span className="text-muted-foreground/50">·</span>
            <ToolElapsedAtom
              startedAt={record.started_at}
              finishedAt={record.finished_at}
              durationMs={record.duration_ms}
            />
          </span>
          <span
            className={cn(
              "shrink-0 text-[8.5px] uppercase tracking-[0.18em]",
              isError ? "text-alert" : done ? "text-muted-foreground" : "text-primary"
            )}
          >
            · {statusLabel}
          </span>
        </button>
        {open && (
          <div className="border-t border-border/15 px-2 py-1.5 space-y-1.5">
            <div>
              <div className="text-[8.5px] uppercase tracking-[0.22em] text-muted-foreground mb-0.5">
                args
              </div>
              <pre className="text-[9.5px] text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(record.args ?? {}, null, 2)}
              </pre>
            </div>
            {record.error && (
              <div>
                <div className="text-[8.5px] uppercase tracking-[0.22em] text-destructive mb-0.5">
                  error
                </div>
                <pre className="text-[9.5px] text-destructive whitespace-pre-wrap break-all leading-relaxed">
                  {record.error}
                </pre>
              </div>
            )}
            {done && (record.result !== undefined || record.attachments?.length) && (
              <div>
                <div className="text-[8.5px] uppercase tracking-[0.22em] text-muted-foreground mb-0.5">
                  output
                </div>
                <DenseToolOutput
                  value={record.result}
                  attachments={record.attachments}
                  imageAttachment={record.imageAttachment}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-card/40 my-2 overflow-hidden",
        isError ? "border-destructive/40 bg-destructive/5" : "border-primary/30",
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
        <Icon
          className={cn("h-3.5 w-3.5 shrink-0", isError ? "text-destructive" : "text-primary")}
          aria-hidden="true"
        />
        <span className="font-mono font-bold">{record.call.function.name}</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          {summarizeArgs(record.call.function.name, record.args)}
        </span>
        {isError && (
          <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" aria-hidden="true" />
        )}
        {hasSubEvents && (
          <span
            className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-accent"
            title={`${subToolCount} nested tool calls, ${subIterCount} iterations`}
          >
            <Activity className="h-2.5 w-2.5" aria-hidden="true" />
            reasoning
            {subToolCount > 0 && (
              <span className="ml-0.5 font-mono tabular-nums normal-case tracking-normal">
                ×{subToolCount}
              </span>
            )}
          </span>
        )}
        <span className="ml-auto inline-flex shrink-0 items-center gap-0.5 text-[9px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" aria-hidden="true" />
          <ToolElapsedAtom
            startedAt={record.started_at}
            finishedAt={record.finished_at}
            durationMs={record.duration_ms}
          />
        </span>
      </button>

      {open && (
        <div className="border-t border-border/40 bg-card/20 p-2.5 text-[11px]">
          {/* Args */}
          <div className="mb-2">
            <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              args
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-sm bg-muted/40 p-2 font-mono text-[10px] leading-relaxed">
              {prettyJson(record.args)}
            </pre>
          </div>

          {/* Result OR error */}
          {record.error ? (
            <div>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-destructive">
                error
              </div>
              <pre
                role="alert"
                className="overflow-x-auto whitespace-pre-wrap break-words rounded-sm border border-destructive/30 bg-destructive/10 p-2 font-mono text-[10px] leading-relaxed text-destructive"
              >
                {record.error}
              </pre>
            </div>
          ) : (
            <ResultPane name={record.call.function.name} value={record.result} />
          )}

          {/* Sub-agent reasoning trail: events from inner LLMs that
              fired while THIS tool was executing (council members,
              critic, fusion). Collapsed by default — drill in for the
              actual chain of thought. */}
          {hasSubEvents && (
            <SubEventTrail
              subEvents={subEvents}
              subToolCount={subToolCount}
              subIterCount={subIterCount}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SubEventTrail({
  subEvents,
  subToolCount,
  subIterCount,
}: {
  subEvents: ToolSubEvent[];
  subToolCount: number;
  subIterCount: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 rounded-sm border border-accent/30 bg-accent/5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-1.5 px-2 py-1 text-left text-[10px] hover:bg-accent/10 transition-colors"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-3 w-3 text-accent" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-3 w-3 text-accent" aria-hidden="true" />
        )}
        <Activity className="h-3 w-3 text-accent" aria-hidden="true" />
        <span className="font-bold uppercase tracking-wider text-accent">reasoning</span>
        <span className="text-muted-foreground">
          {subEvents.length} events
          {subToolCount > 0 ? ` · ${subToolCount} tools` : ""}
          {subIterCount > 0 ? ` · ${subIterCount} iterations` : ""}
        </span>
      </button>
      {open && (
        <div className="border-t border-accent/20 p-2 space-y-1.5">
          {subEvents.map((e, i) => (
            <SubEventRow key={i} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubEventRow({ event }: { event: ToolSubEvent }) {
  switch (event.kind) {
    case "token":
      return (
        <div className="whitespace-pre-wrap break-words font-mono text-[10px] text-foreground/85">
          {event.content}
        </div>
      );
    case "reasoning":
      return (
        <div className="whitespace-pre-wrap break-words rounded-sm bg-muted/40 px-1.5 py-1 font-mono text-[10px] italic text-muted-foreground">
          <span className="mr-1 not-italic opacity-60">thinking:</span>
          {event.content}
        </div>
      );
    case "iteration":
      return (
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Repeat className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
          <span className="uppercase tracking-wider">iteration {event.n}</span>
        </div>
      );
    case "tool_call_start":
      return (
        <div className="flex items-center gap-1.5 rounded-sm border border-primary/20 bg-primary/5 px-1.5 py-1 text-[10px]">
          <Wrench className="h-2.5 w-2.5 text-primary" aria-hidden="true" />
          <span className="font-mono font-bold text-primary">{event.name}</span>
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            {summarizeArgs(event.name, event.args)}
          </span>
        </div>
      );
    case "tool_call_end":
      return (
        <div
          className={cn(
            "flex items-center gap-1.5 px-1.5 py-1 text-[10px] text-muted-foreground",
            event.error ? "text-destructive" : ""
          )}
        >
          <Clock className="h-2.5 w-2.5" aria-hidden="true" />
          <span>
            ↳ {event.error ? "errored" : "returned"} in {fmtDuration(event.duration_ms)}
          </span>
        </div>
      );
  }
}

// ─── Summary helpers ──────────────────────────────────────────────────

function summarizeArgs(toolName: string, args: unknown): string {
  if (toolName === "web_search" && args && typeof args === "object" && args !== null) {
    const a = args as { query?: string; n?: number };
    if (a.query) {
      const tail = a.n ? ` · n=${a.n}` : "";
      return `"${a.query}"${tail}`;
    }
  }
  if (toolName === "browse_page" && args && typeof args === "object" && args !== null) {
    const a = args as { url?: string };
    if (a.url) return a.url;
  }
  if (typeof args === "string") return args;
  if (args && typeof args === "object") {
    return JSON.stringify(args).slice(0, 80);
  }
  return "";
}

function prettyJson(v: unknown): string {
  if (v === null || v === undefined) return "(empty)";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Pure state resolver for the elapsed atom (op-oayn). Split out from
 * the React component so vitest can cover every branch without a
 * jsdom + Testing-Library harness. The component itself just decides
 * which JSX to emit based on this.
 *
 *   done    — call is finished; label = fmtDuration(durationMs)
 *   running — start time known but not yet finished; label = live
 *             fmtDuration(now - startedAt)
 *   unknown — no start time recorded (older records, or an event
 *             sequence that never emitted tool_call_start); label = "…"
 */
export type ToolAtomState = "done" | "running" | "unknown";
export interface ResolvedToolAtom {
  state: ToolAtomState;
  label: string;
  /** Non-null only when state === 'running'; the ms since start. */
  elapsedMs?: number;
}
export function resolveToolAtomState(
  startedAt: number | undefined,
  finishedAt: number,
  durationMs: number,
  now: number
): ResolvedToolAtom {
  if (finishedAt > 0) {
    return { state: "done", label: fmtDuration(durationMs) };
  }
  if (startedAt && startedAt > 0) {
    const elapsed = Math.max(0, now - startedAt);
    return {
      state: "running",
      label: fmtDuration(elapsed),
      elapsedMs: elapsed,
    };
  }
  return { state: "unknown", label: "…" };
}

/**
 * ToolElapsedAtom — the little duration cell on each tool-call row
 * (op-oayn). Three states:
 *   - RUNNING (finishedAt === 0 && startedAt > 0): a small rotating
 *     ring wraps live-ticking ``Date.now() - startedAt`` text. Ticks
 *     every ~500ms via a ``setInterval`` inside a useEffect. The ring
 *     uses Tailwind's ``animate-spin`` so the animation is GPU-cheap
 *     and pauses automatically when the tab isn't visible.
 *   - DONE (finishedAt > 0): static ``fmtDuration(durationMs)`` text,
 *     no ring — the row is settled and shouldn't demand attention.
 *   - UNKNOWN (no startedAt, no finishedAt): renders the legacy "…"
 *     placeholder so records that predate op-oayn (older stored chats)
 *     render sanely instead of ticking with a garbage number.
 *
 * Rendered inline in both the dense terminal row and the standard
 * two-tone card layout so the atom is consistent everywhere.
 */
interface ToolElapsedAtomProps {
  startedAt?: number;
  finishedAt: number;
  durationMs: number;
  /** Optional test hook — vitest injects a fake ``now()`` to avoid
   *  needing real setInterval scheduling. Prod path uses Date.now. */
  now?: () => number;
  className?: string;
}

export function ToolElapsedAtom({
  startedAt,
  finishedAt,
  durationMs,
  now,
  className,
}: ToolElapsedAtomProps) {
  const nowFn = now ?? Date.now;
  const running = !finishedAt && !!startedAt && startedAt > 0;
  // Force a re-render every 500ms while running so the elapsed text
  // stays live. Interval is skipped for done / unknown rows so a
  // chat with 200 tool cards doesn't burn 200 timers.
  const [, force] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force(n => n + 1), 500);
    return () => clearInterval(id);
  }, [running]);
  const resolved = resolveToolAtomState(startedAt, finishedAt, durationMs, nowFn());
  if (resolved.state === "running") {
    return (
      <span
        className={cn("inline-flex items-center gap-1", className)}
        data-testid="tool-elapsed-atom"
        data-state="running"
      >
        <span
          aria-hidden="true"
          className="inline-block h-2.5 w-2.5 rounded-full border border-primary/60 border-t-transparent animate-spin"
        />
        <span className="tabular-nums text-primary/80">{resolved.label}</span>
      </span>
    );
  }
  return (
    <span
      className={cn("tabular-nums text-muted-foreground/70", className)}
      data-testid="tool-elapsed-atom"
      data-state={resolved.state}
    >
      {resolved.label}
    </span>
  );
}

// ─── Result panes — specialized for built-in tools ────────────────────

function ResultPane({ name, value }: { name: string; value: unknown }) {
  // Auto-detect image payloads. Generic on shape (anything carrying
  // `b64_json`) rather than tool name so this works for `generate_image`,
  // future `image_edit`, etc. — the tool just has to emit OpenAI-style
  // /v1/images/generations output.
  const image = extractB64Image(value);
  if (image) {
    return <ImageResultPane image={image} fallback={value} />;
  }
  if (name === "web_search" && isWebSearchResponse(value)) {
    return <WebSearchResultPane value={value} />;
  }
  return (
    <div>
      <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        result
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-sm bg-muted/40 p-2 font-mono text-[10px] leading-relaxed">
        {prettyJson(value)}
      </pre>
    </div>
  );
}

interface ExtractedImage {
  b64: string;
  /** Free-form metadata captured alongside the payload (model id, seed, etc.). */
  meta: Record<string, unknown>;
}

/**
 * Best-effort extraction of a base64-encoded image from arbitrary tool output.
 *
 * Handles three shapes the agent layer commonly emits:
 *   1. `{ b64_json: "...", model, seed, ... }`            — our generate_image
 *   2. `{ data: [{ b64_json: "..." }, ...] }`             — OpenAI raw response
 *   3. JSON string of either of the above                  — LangGraph tool returns
 *      that the SSE layer hasn't parsed.
 *
 * Returns null when no image is found so the caller falls through to the
 * generic JSON dump.
 */
function extractB64Image(value: unknown): ExtractedImage | null {
  let obj: any = value;
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== "object") return null;
  // Shape 2: OpenAI envelope.
  if (Array.isArray(obj.data) && obj.data[0]?.b64_json) {
    return { b64: String(obj.data[0].b64_json), meta: stripImageKeys(obj.data[0]) };
  }
  // Shape 1: flat object with b64_json.
  if (typeof obj.b64_json === "string") {
    return { b64: obj.b64_json, meta: stripImageKeys(obj) };
  }
  return null;
}

function stripImageKeys(o: Record<string, unknown>): Record<string, unknown> {
  const { b64_json: _b, revised_prompt: _r, ...rest } = o;
  return rest;
}

/**
 * Renders a tool's output. Order of preference:
 *
 *  1. Generic ``attachments[]`` (the new side-channel pattern) — dispatch
 *     on ``kind`` to the matching renderer. JSON output is HIDDEN when
 *     attachments are present so the user sees the rendered payload
 *     instead of duplicating it with a JSON dump.
 *  2. Legacy ``imageAttachment`` field (deprecated; older operator
 *     builds without the generic pattern).
 *  3. Legacy in-result ``b64_json`` detection (external backends that
 *     embed bytes in the tool return value).
 *  4. Generic JSON pretty-printer fallback.
 *
 * Unknown attachment kinds (audio, video, file in the future) fall
 * through to a minimal "[kind] attachment" placeholder rather than
 * crashing, so server-side additions roll out gracefully.
 */
function DenseToolOutput({
  value,
  attachments,
  imageAttachment,
}: {
  value: unknown;
  attachments?: ToolAttachment[];
  imageAttachment?: ChatToolCallRecord["imageAttachment"];
}) {
  // 1. Preferred — new generic side-channel pattern.
  if (attachments && attachments.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {attachments.map(a => (
          <AttachmentRenderer key={a.attachment_id} a={a} />
        ))}
      </div>
    );
  }
  // 2. Legacy single-image attachment field.
  if (imageAttachment?.b64) {
    const metaParts: string[] = [];
    if (imageAttachment.model) metaParts.push(imageAttachment.model);
    if (imageAttachment.size) metaParts.push(imageAttachment.size);
    if (imageAttachment.seed !== undefined && imageAttachment.seed !== null) {
      metaParts.push(`seed ${imageAttachment.seed}`);
    }
    return (
      <GeneratedImageCard
        b64={imageAttachment.b64}
        metadata={metaParts.join(" · ") || undefined}
        downloadName={`tool-output-${Date.now()}.png`}
        className="max-w-[260px]"
      />
    );
  }
  // 3. Legacy in-result b64 detection.
  const image = extractB64Image(value);
  if (image) {
    return (
      <GeneratedImageCard
        b64={image.b64}
        metadata={formatImageMeta(image.meta) || undefined}
        downloadName={`tool-output-${Date.now()}.png`}
        className="max-w-[260px]"
      />
    );
  }
  // 4. Generic JSON dump.
  return (
    <pre className="text-[9.5px] text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">
      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}

/**
 * Per-attachment renderer dispatched on ``kind``. New kinds plug in
 * here — add a case, no other code changes needed. Unknown kinds get
 * a minimal placeholder so deploying a new server-side attachment
 * variant doesn't crash older client bundles.
 */
function AttachmentRenderer({ a }: { a: ToolAttachment }) {
  switch (a.kind) {
    case "image":
      // Prefer the content-addressed sha256 route — the URL is
      // immutable so the browser caches forever and reopening the chat
      // is a free re-render. Fall back to inline b64 for any kind that
      // doesn't ride the image store yet.
      // (op-iavo: server-side renamed blob_sha → sha256 to match canonical
      // BlobRef shape. GeneratedImageCard's `blobSha` prop kept as the
      // public component API; we just thread the new field into it.)
      if (!a.b64 && !a.sha256) break;
      return (
        <GeneratedImageCard
          blobSha={a.sha256}
          b64={a.b64}
          metadata={formatAttachmentMeta(a.meta)}
          downloadName={`attachment-${a.attachment_id}.png`}
          className="max-w-[260px]"
        />
      );
    case "text":
      if (!a.text) break;
      return (
        <pre className="text-[9.5px] text-muted-foreground whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-auto rounded-sm bg-muted/30 p-2">
          {a.text}
        </pre>
      );
    case "file":
      if (!a.url && !a.b64) break;
      return (
        <a
          href={a.url ?? `data:${a.mime ?? "application/octet-stream"};base64,${a.b64}`}
          download={`attachment-${a.attachment_id}`}
          className="text-[10px] underline text-primary hover:text-primary/80"
        >
          download {a.kind}
        </a>
      );
  }
  // Unknown / unrenderable — show a tiny placeholder so the user knows
  // something arrived. Helps debug when a new kind is rolled out
  // server-side ahead of FE renderer support.
  return (
    <div className="text-[9.5px] text-muted-foreground italic">
      [{a.kind} attachment — no renderer]
    </div>
  );
}

function formatAttachmentMeta(meta?: Record<string, unknown>): string | undefined {
  if (!meta) return undefined;
  const parts: string[] = [];
  if (typeof meta.model === "string") parts.push(meta.model);
  if (typeof meta.size === "string") parts.push(meta.size);
  if (typeof meta.seed === "number") parts.push(`seed ${meta.seed}`);
  if (typeof meta.steps === "number") parts.push(`${meta.steps} steps`);
  return parts.join(" · ") || undefined;
}

function ImageResultPane({ image, fallback }: { image: ExtractedImage; fallback: unknown }) {
  const [showJson, setShowJson] = useState(false);
  // Meta line: small, faint, only the fields the user cares about at a
  // glance (model / size / seed / steps when present).
  const metaLine = formatImageMeta(image.meta);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          generated image
        </div>
        <button
          type="button"
          onClick={() => setShowJson(v => !v)}
          className="text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          {showJson ? "hide json" : "show json"}
        </button>
      </div>
      <GeneratedImageCard
        b64={image.b64}
        metadata={metaLine}
        downloadName={`tool-output-${Date.now()}.png`}
        className="max-w-md"
      />
      {showJson && (
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-sm bg-muted/40 p-2 font-mono text-[10px] leading-relaxed">
          {prettyJson(fallback)}
        </pre>
      )}
    </div>
  );
}

function formatImageMeta(meta: Record<string, unknown>): string {
  const parts: string[] = [];
  if (typeof meta.model === "string") parts.push(meta.model);
  if (typeof meta.size === "string") parts.push(meta.size);
  if (typeof meta.seed === "number") parts.push(`seed ${meta.seed}`);
  if (typeof meta.steps === "number") parts.push(`${meta.steps} steps`);
  return parts.join(" · ");
}

interface WebSearchResultLike {
  query: string;
  results: Array<{
    title?: string;
    url?: string;
    snippet?: string;
    engine?: string;
  }>;
}

function isWebSearchResponse(v: unknown): v is WebSearchResultLike {
  return !!v && typeof v === "object" && "results" in v && Array.isArray((v as any).results);
}

function WebSearchResultPane({ value }: { value: WebSearchResultLike }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>results</span>
        <span className="opacity-60">({value.results.length})</span>
      </div>
      <ol className="space-y-1.5">
        {value.results.map((r, i) => (
          <li key={i} className="rounded-sm border border-border/40 bg-card/30 p-1.5">
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <span className="line-clamp-2">{r.title || r.url || "(untitled)"}</span>
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
            </a>
            {r.url && (
              <div className="truncate font-mono text-[9px] text-muted-foreground/80">{r.url}</div>
            )}
            {r.snippet && (
              <p className="mt-0.5 line-clamp-3 text-[10px] leading-snug text-muted-foreground">
                {r.snippet}
              </p>
            )}
            {r.engine && (
              <span className="mt-0.5 inline-block rounded-sm bg-primary/10 px-1 text-[8px] font-bold uppercase text-primary/80">
                {r.engine}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
