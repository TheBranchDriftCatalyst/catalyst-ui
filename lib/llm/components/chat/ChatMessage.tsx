import { useEffect, useState } from "react";
import { AlertTriangle, OctagonX, User, Bot } from "lucide-react";
import type { Chat, ChatTurn, ToolAttachment } from "../../react/chat/index.js";
import { useModels } from "../../react/hooks.js";
import { RenderedContent } from "../shared/RenderedContent.js";
import { ReasoningBlock, splitReasoning } from "./ReasoningBlock.js";
import { ToolCallCard } from "./ToolCallCard.js";
import { RouterCallCard } from "./RouterCallCard.js";
import { GeneratedImageCard } from "../image-gen/GeneratedImageCard.js";
import { cn } from "../shared/utils.js";

export interface ChatMessageProps {
  message: ChatTurn;
  isStreaming?: boolean;
  /** Terminal / command-center aesthetic. When true, the message uses
   *  a tight monospace layout: tracking-wide YOU/AGENT label, bordered
   *  accent box for user content, plain mono text for assistant
   *  responses, hairline separators throughout, no avatars. Designed
   *  for narrow rail surfaces (~380px). Defaults to false, which keeps
   *  the legacy two-column avatar layout for standalone full-page use. */
  dense?: boolean;
  /** Optional full chat context. When provided in dense mode, the
   *  assistant role-row gets a TTFT sparkline (PRO1) and each assistant
   *  turn gets a per-turn + cumulative cost micro-row (PRO2). */
  chat?: Chat;
  /** Index of this message inside `chat.messages`. Used to compute the
   *  cumulative cost up-to-and-including this turn. */
  messageIndex?: number;
}

export function ChatMessage({
  message,
  isStreaming,
  dense = false,
  chat,
  messageIndex,
}: ChatMessageProps) {
  if (dense)
    return (
      <DenseChatMessage
        message={message}
        isStreaming={isStreaming}
        chat={chat}
        messageIndex={messageIndex}
      />
    );

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <article
      className={cn(
        "flex",
        dense ? "gap-2 p-2" : "gap-4 p-4",
        isUser ? "bg-muted/30" : "bg-background"
      )}
      aria-label={isUser ? "Your message" : "Assistant response"}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          dense ? "h-5 w-5" : "h-8 w-8",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? (
          <User className={dense ? "h-2.5 w-2.5" : "h-4 w-4"} />
        ) : (
          <Bot className={dense ? "h-2.5 w-2.5" : "h-4 w-4"} />
        )}
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{isUser ? "You" : "Assistant"}</span>
          {/* Cooperative-stop indicator. When finish_reason="abort"
              the server caught a STOP press and propagated cancel to
              sub-agents (see Cancelled event in events.py). The badge
              tells the user the stop was structured — not the
              connection just dropping — and how many sub-agents
              heard it. */}
          {isAssistant && message.meta?.finish_reason === "abort" && (
            <span
              className="inline-flex items-center gap-1 rounded-md border border-muted-foreground/30 bg-muted/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
              title={
                message.meta.cancel_propagated_to?.length
                  ? `stop propagated to ${message.meta.cancel_propagated_to.length} sub-agent${message.meta.cancel_propagated_to.length === 1 ? "" : "s"}`
                  : "stopped"
              }
            >
              <OctagonX className="h-2.5 w-2.5" aria-hidden="true" />
              stopped
              {message.meta.cancel_propagated_to &&
                message.meta.cancel_propagated_to.length > 0 && (
                  <span className="ml-0.5 font-mono normal-case tracking-normal tabular-nums">
                    ×{message.meta.cancel_propagated_to.length}
                  </span>
                )}
            </span>
          )}
        </div>
        <div
          // Stream tokens are announced politely as they land. `aria-busy`
          // tells SRs the region is still updating so they don't fire on
          // every chunk.
          aria-live={isAssistant && isStreaming ? "polite" : undefined}
          aria-busy={isAssistant && isStreaming ? true : undefined}
        >
          {isAssistant ? (
            <>
              {/* op-0rzm: collapsible RouterCallCard — full router
                  call surface (catalogue + picks + timing). Distinct
                  from the routerPicks chip below: the chip is the
                  always-visible glanceable summary, the card unlocks
                  the "why did the router pick this" detail behind a
                  chevron. Hidden when there's no routerCall record at
                  all (the router didn't run). */}
              {message.routerCall && message.routerCall.candidate_tools.length > 0 && (
                <RouterCallCard
                  model={message.routerCall.model}
                  tool_count={message.routerCall.tool_count}
                  candidate_tools={message.routerCall.candidate_tools}
                  picks={message.routerCall.picks}
                  defaults={message.routerCall.defaults}
                  duration_ms={message.routerCall.duration_ms}
                />
              )}
              {/* Router-picked chip (op-w76). Hidden when picks is
                  empty or undefined — i.e., the router either wasn't
                  used or fell back to defaults and didn't actually
                  add anything. Same suppression semantics as the
                  operator's chip so we never show a chip "for show". */}
              {message.routerPicks && message.routerPicks.length > 0 && (
                <div
                  data-testid="router-selected-chip"
                  className="mb-2 flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  <span className="text-primary">⌥ router picked</span>
                  {message.routerPicks.map(t => (
                    <span
                      key={t}
                      className="rounded-sm border border-border/40 bg-muted/30 px-1.5 py-0.5 text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {/* Phase indicator (op-qjky). Lives in the gap between
                  router-pick and first-token so the user knows the
                  agent is alive on slow models. Auto-hides when the
                  phase is 'done' or unset. */}
              {message.phase && message.phase !== "done" && (
                <PhaseIndicator
                  phase={message.phase}
                  phaseTool={message.phaseTool}
                  startedAt={message.phaseStartedAt}
                />
              )}
              {/* Reasoning event accumulator (op-w76). Distinct from
                  the <think>-tag splitter below: this slot is for
                  backends that emit reasoning deltas as their own
                  event stream, never mixed into content. Rendered
                  above the answer so the user can read it before the
                  conclusion. */}
              {message.reasoning && (
                <ReasoningBlock
                  content={message.reasoning}
                  isStreaming={!!isStreaming && !message.content && !message.error}
                />
              )}
              {/* Tool invocations land before / between content chunks
                  in the multi-iteration loop; render them inline so
                  the user sees the "model searched, then read this
                  page, then answered" trail. */}
              {message.tool_calls?.map((rec, i) => (
                <ToolCallCard key={`${rec.call.id}-${i}`} record={rec} />
              ))}
              {/* Inline tool-side-channel attachments — see dense-mode
                  comment for rationale. Visible without expanding the
                  tool card. */}
              {(() => {
                const all = (message.tool_calls ?? []).flatMap(rec => rec.attachments ?? []);
                if (all.length === 0) return null;
                return (
                  <div data-testid="inline-tool-attachments" className="flex flex-wrap gap-3 my-2">
                    {all.map(a => (
                      <InlineAttachment key={a.attachment_id} a={a} />
                    ))}
                  </div>
                );
              })()}
              {isStreaming && !message.content && !message.tool_calls?.length && !message.error ? (
                <span className="text-muted-foreground">Thinking...</span>
              ) : !isStreaming &&
                !message.content &&
                !message.tool_calls?.length &&
                !message.error ? (
                // Fallback when a completed assistant message ended with
                // no content (a model that only produced a <think>
                // block, or an SSE stream that stopped short). Without
                // this the message renders as an empty AGENT header
                // and looks like the panel is broken.
                <span className="italic text-muted-foreground text-[11px]">
                  (no reply — the model returned no content; try again or check the model config)
                </span>
              ) : (
                /*
                  Split <think>...</think> reasoning traces out of the
                  content stream and render them in collapsible blocks
                  alongside the actual answer. Reasoning distills
                  (deepseek-r1, qwen3-coder-opus, qwen3 thinking
                  variants) emit these inline; without splitting they
                  drown the real answer in chain-of-thought prose.
                */
                splitReasoning(message.content).map((seg, i) =>
                  seg.kind === "thinking" ? (
                    <ReasoningBlock
                      key={`r-${i}`}
                      content={seg.content}
                      isStreaming={!!seg.partial}
                    />
                  ) : (
                    <RenderedContent
                      key={`t-${i}`}
                      content={seg.content}
                      isStreaming={isStreaming}
                    />
                  )
                )
              )}
              {/* Per-turn error from the SSE `error` event (e.g. the
                  upstream model rejected the request). Rendered after
                  any partial text so the user sees what survived
                  before the failure plus the reason it stopped. */}
              {message.error && (
                <div
                  role="alert"
                  className="mt-2 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-pre-wrap break-words">{message.error}</span>
                </div>
              )}
            </>
          ) : (
            <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Dense (terminal command-center) variant ─────────────────────────
//
// Tight monospace layout for narrow rail surfaces. No avatars. Micro
// tracking-wide YOU/AGENT label, bordered accent box for user content,
// plain mono text for assistant responses. Reuses ReasoningBlock,
// ToolCallCard, and RenderedContent — all of which honor a ``dense``
// prop themselves — so the entire message tree is rail-friendly.

interface DenseChatMessageProps {
  message: ChatTurn;
  isStreaming?: boolean;
  chat?: Chat;
  messageIndex?: number;
}

function DenseChatMessage({ message, isStreaming, chat, messageIndex }: DenseChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // PRO1: TTFT sparkline — derive a series of per-turn ttft_ms values
  // from the chat history. Only assistant turns with `meta.ttft_ms`
  // contribute; we draw a flat polyline when the series is empty so
  // the slot is reserved (helps avoid layout jitter on first answer).
  const ttftSeries: number[] = isAssistant && chat ? collectTtftSeries(chat) : [];

  // PRO2: per-turn cost + cumulative. We walk the chat up to and
  // including this message index, summing assistant-turn usage
  // multiplied by the per-turn model price (turn.meta.model overrides
  // chat.model when present — matches useChatCost's logic).
  const { models } = useModels();
  const turnCost =
    isAssistant && chat && typeof messageIndex === "number"
      ? perTurnCost(chat, messageIndex, models)
      : null;
  const cumulativeCost =
    isAssistant && chat && typeof messageIndex === "number"
      ? cumulativeUpTo(chat, messageIndex, models)
      : null;

  return (
    <li className="flex flex-col gap-1 px-2 py-1.5">
      <div
        className={cn(
          "text-[8.5px] uppercase tracking-[0.22em] flex items-center gap-1.5 whitespace-nowrap",
          isUser ? "text-primary" : "text-muted-foreground"
        )}
        data-testid={isUser ? "chat-role-user" : "chat-role-agent"}
      >
        <span className="shrink-0">{isUser ? "you" : "agent"}</span>
        {!isUser && isStreaming && <span className="animate-pulse text-primary shrink-0">◇</span>}
        {isAssistant && <IterationCounter message={message} />}
        {isAssistant && chat && <TtftSparkline series={ttftSeries} />}
      </div>

      {/* op-0rzm: dense-mode RouterCallCard — single-line collapsible
          row matching the dense ToolCallCard layout. */}
      {!isUser && message.routerCall && message.routerCall.candidate_tools.length > 0 && (
        <RouterCallCard
          model={message.routerCall.model}
          tool_count={message.routerCall.tool_count}
          candidate_tools={message.routerCall.candidate_tools}
          picks={message.routerCall.picks}
          defaults={message.routerCall.defaults}
          duration_ms={message.routerCall.duration_ms}
          dense
        />
      )}
      {/* Router-picked chip (op-w76). Hidden when picks is empty. */}
      {!isUser && message.routerPicks && message.routerPicks.length > 0 && (
        <div
          data-testid="router-selected-chip"
          className="flex flex-wrap items-center gap-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <span className="text-primary">⌥ router picked</span>
          {message.routerPicks.map(t => (
            <span
              key={t}
              className="rounded-sm border border-border/60 bg-muted/30 px-1.5 py-0.5 text-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Phase indicator (op-qjky) — dense variant. Same component, the
          pill itself is small enough to fit the rail layout without
          adjustments. */}
      {!isUser && message.phase && message.phase !== "done" && (
        <PhaseIndicator
          phase={message.phase}
          phaseTool={message.phaseTool}
          startedAt={message.phaseStartedAt}
        />
      )}

      {/* Reasoning field (event-stream deltas) — separate from
          <think>-tag splitter below. */}
      {!isUser && message.reasoning && (
        <ReasoningBlock
          content={message.reasoning}
          isStreaming={!!isStreaming && !message.content && !message.error}
          dense
        />
      )}

      {/* Tool calls (op-w76 + sub_events). Single-line collapsibles
          in dense mode — chevron + wrench + name + status word. */}
      {!isUser &&
        message.tool_calls?.map((rec, i) => (
          <ToolCallCard key={`${rec.call.id}-${i}`} record={rec} dense />
        ))}

      {/* Inline tool-side-channel attachments. The image (or audio,
          file, etc.) shipped via tool_attachment lives on the
          ToolCallCard's expanded view AND here at the message level
          so it's always visible — the operator wanted the image
          inline, not buried behind a chevron click. We rely on the
          ToolCallCard for the technical "did this call succeed"
          UX and this strip for the "look at the thing it produced"
          UX. Iterates every attachment across every tool call so a
          multi-image turn renders them all in a row. */}
      {!isUser &&
        (() => {
          const all = (message.tool_calls ?? []).flatMap(rec => rec.attachments ?? []);
          if (all.length === 0) return null;
          return (
            <div data-testid="inline-tool-attachments" className="flex flex-wrap gap-2 my-1">
              {all.map(a => (
                <InlineAttachment key={a.attachment_id} a={a} />
              ))}
            </div>
          );
        })()}

      {/* Message content. User: a marked-up quote — barely-there primary
          tint + a 2px primary-accent left rail. Reads as "this is what
          you asked", not as a button. Agent: floating mono text, no
          chrome — relies on the role label + divide-y between turns
          for rhythm. */}
      {isUser ? (
        <div className="rounded-sm bg-primary/[0.04] border-l-2 border-primary/40 px-2 py-1 font-mono text-[10.5px] leading-relaxed text-foreground whitespace-pre-wrap break-words">
          {message.content}
        </div>
      ) : isStreaming && !message.content && !message.tool_calls?.length && !message.error ? (
        <span className="px-1 font-mono text-[10.5px] italic text-muted-foreground animate-pulse">
          ...
        </span>
      ) : message.content ? (
        <div className="px-1 font-mono text-[10.5px] leading-relaxed text-foreground">
          {splitReasoning(message.content).map((seg, i) =>
            seg.kind === "thinking" ? (
              <ReasoningBlock
                key={`r-${i}`}
                content={seg.content}
                isStreaming={!!seg.partial}
                dense
              />
            ) : (
              <RenderedContent key={`t-${i}`} content={seg.content} isStreaming={isStreaming} />
            )
          )}
        </div>
      ) : null}

      {/* Per-turn error. */}
      {message.error && (
        <div
          role="alert"
          className="flex items-start gap-1.5 rounded-sm border border-destructive/40 bg-destructive/[0.08] px-2 py-1 font-mono text-[10.5px] text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-2.5 w-2.5 shrink-0" aria-hidden="true" />
          <span className="whitespace-pre-wrap break-words">{message.error}</span>
        </div>
      )}

      {/* PRO2: per-turn cost delta + cumulative. Hidden when the
          cumulative is exactly zero (local model / no usage logged). */}
      {isAssistant && turnCost !== null && cumulativeCost !== null && cumulativeCost > 0 && (
        <div
          data-testid="chat-turn-cost"
          className={cn(
            "text-[8.5px] uppercase tracking-[0.22em] px-1 whitespace-nowrap tabular-nums",
            costColorClass(turnCost)
          )}
        >
          · {formatTinyUsd(turnCost)} · Σ {formatTinyUsd(cumulativeCost)}
        </div>
      )}

      {/* Cooperative-stop badge — kept in dense so the user sees the
          STOP was structured, not a connection drop. */}
      {message.role === "assistant" && message.meta?.finish_reason === "abort" && (
        <span
          className="inline-flex items-center gap-1 rounded-sm border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground"
          title={
            message.meta.cancel_propagated_to?.length
              ? `stop propagated to ${message.meta.cancel_propagated_to.length} sub-agent${message.meta.cancel_propagated_to.length === 1 ? "" : "s"}`
              : "stopped"
          }
        >
          <OctagonX className="h-2 w-2" aria-hidden="true" />
          stopped
          {message.meta.cancel_propagated_to && message.meta.cancel_propagated_to.length > 0 && (
            <span className="ml-0.5 font-mono normal-case tracking-normal tabular-nums">
              ×{message.meta.cancel_propagated_to.length}
            </span>
          )}
        </span>
      )}
    </li>
  );
}

// ── PRO7: iteration counter ──────────────────────────────────────────
//
// LangGraph multi-iteration loops set `iteration` on each tool_call
// record (0-based). When the assistant turn went through >=1 iterations
// we expose a compact `↻ N` glyph in the AGENT label row so the operator
// can tell at a glance "this answer was 3 tool-loop turns deep".
//
// Hidden when the message has no tool_calls or the max iteration is 0
// (the common single-shot case) — otherwise every plain reply would
// carry a meaningless `↻ 1` and clutter the row.

function IterationCounter({ message }: { message: ChatTurn }) {
  const calls = message.tool_calls;
  if (!calls || calls.length === 0) return null;
  const last = calls[calls.length - 1];
  const iter = typeof last?.iteration === "number" ? last.iteration : 0;
  if (iter < 1) return null;
  return (
    <span
      data-testid="chat-iteration-counter"
      className="shrink-0 tabular-nums text-muted-foreground normal-case tracking-normal"
      title={`assistant turn ran ${iter} LangGraph iteration${iter === 1 ? "" : "s"}`}
    >
      ↻ {iter}
    </span>
  );
}

// ── PRO1: TTFT sparkline ──────────────────────────────────────────────
//
// Inline 32×8 svg next to the AGENT label. Walks chat history,
// pulls each assistant turn's `meta.ttft_ms` (when present), and
// plots a polyline normalized to the local min/max. With <2 data
// points we draw a flat midline so the slot is still visually
// reserved and the test target is always mountable.

const SPARK_W = 32;
const SPARK_H = 8;

function collectTtftSeries(chat: Chat): number[] {
  const out: number[] = [];
  for (const turn of chat.messages) {
    if (turn.role !== "assistant") continue;
    const m = turn.meta as (typeof turn.meta & { ttft_ms?: number }) | undefined;
    const ttft = typeof m?.ttft_ms === "number" ? m.ttft_ms : null;
    if (ttft !== null && ttft >= 0) out.push(ttft);
  }
  return out;
}

function TtftSparkline({ series }: { series: number[] }) {
  // Take last 12 samples max so the chart doesn't squish to noise.
  const samples = series.slice(-12);
  let points: string;
  if (samples.length < 2) {
    // Flat midline reserves the slot even when we have no data yet.
    const y = SPARK_H / 2;
    points = `0,${y} ${SPARK_W},${y}`;
  } else {
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const span = max - min || 1;
    const stride = SPARK_W / (samples.length - 1);
    points = samples
      .map((v, i) => {
        const x = i * stride;
        // Invert Y so larger TTFT = lower on screen (faster = higher).
        const y = SPARK_H - ((v - min) / span) * SPARK_H;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }
  return (
    <svg
      data-testid="chat-ttft-spark"
      width={SPARK_W}
      height={SPARK_H}
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      className="shrink-0 opacity-40"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── PRO2: per-turn cost helpers ───────────────────────────────────────

function priceForTurn(
  turn: ChatTurn,
  chatModel: string,
  models: ReturnType<typeof useModels>["models"]
): { input: number; output: number } {
  const wanted = turn.meta?.model ?? chatModel;
  const m = models.find(mm => mm.id === wanted);
  return {
    input: m?.metadata?.input_cost_per_token ?? 0,
    output: m?.metadata?.output_cost_per_token ?? 0,
  };
}

function perTurnCost(
  chat: Chat,
  idx: number,
  models: ReturnType<typeof useModels>["models"]
): number | null {
  const turn = chat.messages[idx];
  if (!turn || turn.role !== "assistant") return null;
  const usage = turn.meta?.usage;
  if (!usage) return null;
  const price = priceForTurn(turn, chat.model, models);
  return price.input * (usage.prompt_tokens ?? 0) + price.output * (usage.completion_tokens ?? 0);
}

function cumulativeUpTo(
  chat: Chat,
  idx: number,
  models: ReturnType<typeof useModels>["models"]
): number {
  let sum = 0;
  for (let i = 0; i <= idx && i < chat.messages.length; i++) {
    const t = chat.messages[i];
    if (t.role !== "assistant") continue;
    const usage = t.meta?.usage;
    if (!usage) continue;
    const price = priceForTurn(t, chat.model, models);
    sum += price.input * (usage.prompt_tokens ?? 0) + price.output * (usage.completion_tokens ?? 0);
  }
  return sum;
}

function costColorClass(cost: number): string {
  if (cost < 0.01) return "text-ok";
  if (cost < 0.05) return "text-warn";
  return "text-alert";
}

function formatTinyUsd(n: number): string {
  if (n === 0) return "$0.0000";
  // Always show 4 decimals — the micro-row is the place where deltas
  // smaller than a cent matter. Larger costs still read cleanly because
  // the value column is mono and right-aligned by the surrounding flow.
  return `$${n.toFixed(4)}`;
}

/**
 * InlineAttachment — message-level renderer for tool side-channel
 * payloads. Mirrors the dispatch logic in ToolCallCard's
 * AttachmentRenderer but tuned for the message-bubble layout
 * (full-width images, no tool-card chrome).
 *
 * The same payload also renders inside the ToolCallCard's expanded
 * output pane. We accept the duplication on purpose — the inline
 * surface is the user-facing artifact ("look at the image I made"),
 * the tool-card surface is the debug trail ("how did the tool call
 * resolve"). Different audience, same payload.
 *
 * Unknown kinds get a tiny placeholder so adding a new server-side
 * attachment type doesn't crash older clients.
 */
function InlineAttachment({ a }: { a: ToolAttachment }) {
  // op-iavo: ToolAttachment renamed blob_sha → sha256 / size_bytes → size
  // to match the canonical BlobRef contract on the server's swarm-bus.
  if (a.kind === "image" && (a.sha256 || a.b64)) {
    const metaParts: string[] = [];
    const meta = a.meta ?? {};
    if (typeof meta.model === "string") metaParts.push(meta.model);
    if (typeof meta.size === "string") metaParts.push(meta.size);
    if (typeof meta.seed === "number") metaParts.push(`seed ${meta.seed}`);
    if (typeof meta.steps === "number") metaParts.push(`${meta.steps} steps`);
    return (
      <GeneratedImageCard
        blobSha={a.sha256}
        b64={a.b64}
        metadata={metaParts.join(" · ") || undefined}
        downloadName={`attachment-${a.attachment_id}.png`}
        className="max-w-full"
      />
    );
  }
  if (a.kind === "text" && a.text) {
    return (
      <pre className="text-[10.5px] text-muted-foreground whitespace-pre-wrap break-words leading-relaxed max-h-72 overflow-auto rounded-sm bg-muted/30 p-2 w-full">
        {a.text}
      </pre>
    );
  }
  if (a.kind === "file" && (a.url || a.b64)) {
    return (
      <a
        href={a.url ?? `data:${a.mime ?? "application/octet-stream"};base64,${a.b64}`}
        download={`attachment-${a.attachment_id}`}
        className="text-[10.5px] underline text-primary hover:text-primary/80"
      >
        download {a.kind}
      </a>
    );
  }
  return (
    <div className="text-[10.5px] text-muted-foreground italic">
      [{a.kind} attachment — no renderer]
    </div>
  );
}

/**
 * PhaseIndicator (op-qjky) — small status pill rendered on the in-progress
 * assistant turn so the user can see what the agent is doing during the
 * stretches when no tokens flow yet. Updates a live elapsed counter
 * every second; unmounts immediately when message_done flips the phase
 * to "done".
 */
type PhaseValue = "routing" | "thinking" | "tool_running" | "reply_streaming";

function PhaseIndicator({
  phase,
  phaseTool,
  startedAt,
}: {
  phase: PhaseValue;
  phaseTool?: string;
  startedAt?: number;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedS = startedAt ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0;

  const labels: Record<PhaseValue, string> = {
    routing: "routing",
    thinking: "thinking",
    tool_running: phaseTool ? `calling ${phaseTool}` : "running tool",
    reply_streaming: "replying",
  };

  return (
    <div
      data-testid="agent-phase-pill"
      className="mb-2 inline-flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span>{labels[phase]}</span>
      {elapsedS > 0 && (
        <span className="font-mono text-muted-foreground tabular-nums">{elapsedS}s</span>
      )}
    </div>
  );
}
