/**
 * chatStore data types — Chat, ChatTurn, tool-call records, sub-events.
 * Lives in its own file so anything that just wants the type shape
 * (panels, viewers, exporters) can import without pulling in the
 * Zustand create() call's transitive dependencies.
 */
import { nanoid } from "nanoid";
import type { ChatParams, StreamMeta, CatalystLLMClient } from "../../client/index.js";
import type { CatalystAgentClient } from "../../agent/index.js";

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

/**
 * One tool invocation captured during a streaming turn. We store the
 * call (so the assistant message has provenance), the parsed args, and
 * either the JSON result or an error string. ToolCallCard reads this
 * shape directly. Persisted with the chat so a refresh keeps the
 * tool-call history.
 */
/**
 * One sub-event that happened INSIDE a tool's execution — a council
 * member's token, a critic's structured-output line, a nested
 * tool_call_start/end, etc. The backend tags such events with
 * `owner_tool_id`; chatStore routes them here so the ToolCallCard
 * can render an expandable "reasoning" section per tool call
 * instead of leaking them into the parent assistant bubble.
 *
 * Discriminated by `kind` so the renderer can switch over shapes
 * without sniffing structure. Kept minimal — we only carry the
 * fields the UI actually displays.
 */
export type ToolSubEvent =
  | { kind: "token"; content: string }
  | { kind: "reasoning"; content: string }
  | { kind: "iteration"; n: number }
  | {
      kind: "tool_call_start";
      id: string;
      name: string;
      args: Record<string, unknown>;
    }
  | {
      kind: "tool_call_end";
      id: string;
      result?: unknown;
      error?: string;
      duration_ms: number;
    };

export interface ChatToolCallRecord {
  call: ToolCall;
  args: unknown;
  result?: unknown;
  error?: string;
  duration_ms: number;
  /** Iteration index within the streamChat tool-call loop (0-based). */
  iteration: number;
  /**
   * Wall-clock when the call was DISPATCHED (op-oayn). Populated at
   * tool_call_start by the operator bridge so ToolCallCard's live
   * elapsed atom can tick ``Date.now() - started_at`` while the tool
   * is running. Optional for back-compat with older records that
   * don't have it — those fall through to the static "…" placeholder
   * until they finish.
   */
  started_at?: number;
  /** Wall-clock when the call resolved (used for ordering + display). */
  finished_at: number;
  /**
   * Events emitted by inner LLMs / nested tools while THIS tool was
   * running. The ToolCallCard renders these in a collapsible
   * "reasoning" dropdown so the operator can drill into sub-agent
   * activity (council members, critic, fusion) without it
   * polluting the parent chat bubble. Empty / undefined when the
   * tool had no nested activity (e.g. plain `web_search` calls).
   */
  sub_events?: ToolSubEvent[];
  /**
   * Out-of-band binary attachment produced by the tool — at the moment
   * only used by image-gen tools to ship the b64 PNG so we can render
   * it inline without polluting the LLM's message-list context. Set
   * by the chat store when an ``image_generated`` event arrives while
   * this record is the most-recently-started one. ToolCallCard renders
   * the attachment via GeneratedImageCard regardless of what the
   * (much smaller) ``result`` field carries.
   *
   * @deprecated Use ``attachments`` (the generic side-channel pattern).
   *   Kept for back-compat with older operator builds.
   */
  imageAttachment?: {
    b64: string;
    prompt?: string;
    model?: string;
    size?: string;
    seed?: number | null;
    steps?: number | null;
  };
  /**
   * Generic side-channel attachments (op-meiw side-channel pattern).
   * Populated when the tool fires ``tool_attachment`` events keyed by
   * the same ``attachment_id`` that appears in its return value. The
   * chat bridge pairs them up at tool_call_end and stashes them here.
   * ToolCallCard dispatches on ``kind`` to render: images via
   * GeneratedImageCard, audio via <audio>, text via <pre>, files via
   * download link. When ``attachments`` is non-empty the raw JSON
   * output is HIDDEN — the rendered attachments replace it.
   */
  attachments?: ToolAttachment[];
}

/** Generic tool side-channel attachment. Carries the bytes (b64 / url /
 * text) plus a discriminator + free-form metadata. Renderers consume
 * via a kind dispatch map. */
export interface ToolAttachment {
  /** ULID minted by the tool — appears in BOTH this event and the tool's
   * return value so the bridge can pair them up. */
  attachment_id: string;
  /** Discriminator: ``image`` | ``audio`` | ``video`` | ``file`` | ``text``
   * | … . Renderers dispatch on this. Unknown kinds fall through to a
   * generic JSON dump so a new server-side attachment kind doesn't
   * crash older clients. */
  kind: string;
  /** MIME type hint when known (e.g. ``image/png``). */
  mime?: string;
  /** Base64-encoded payload. Exactly one of b64/url/text/sha256
   *  should be set. Renderer precedence: sha256 > url > b64 > text. */
  b64?: string;
  /** Hosted URL for non-binary surfaces. */
  url?: string;
  /** Raw text payload (e.g. very long markdown reports). */
  text?: string;
  /** Content-addressed reference into the operator's image-blob store.
   *  Renderers resolve to ``/api/inference/images/blobs/{sha}.png`` —
   *  the URL is immutable + browser-cacheable, so reopening a chat
   *  thread re-renders without a network round-trip. Preferred over
   *  b64 for image kinds.
   *  (op-iavo: renamed from blob_sha; matches canonical BlobRef on
   *  the server's swarm-bus payload contract.) */
  sha256?: string;
  /** Optional size hint surfaced alongside the payload (e.g. for
   *  rendering "1.2 MB" while the image streams in).
   *  (op-iavo: renamed from size_bytes; matches canonical BlobRef.) */
  size?: number;
  /** Tool-specific metadata to render alongside the payload. */
  meta?: Record<string, unknown>;
}

export interface ChatTurn {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: number;
  meta?: StreamMeta;
  /**
   * Tool calls invoked by the model on this assistant turn. May be
   * empty / undefined when the turn was a plain reply. Multiple calls
   * accumulate across the multi-iteration tool loop.
   */
  tool_calls?: ChatToolCallRecord[];
  /**
   * Error from the backend that aborted this assistant turn (the
   * SSE `error` event, or a fetch failure). Rendered inline inside
   * the assistant bubble so the failed turn carries its own context
   * instead of pointing at a separate banner. Mutually exclusive
   * with a successful `content` — though we keep both so partial
   * text that streamed before the error stays visible.
   */
  error?: string;
  /**
   * Accumulated reasoning content for this turn — distinct from the
   * `<think>...</think>` tag pattern that splitReasoning() extracts
   * from `content`. Backends that emit reasoning as a separate event
   * stream (e.g., catalyst-operator's `reasoning` SSE event delta)
   * land deltas here so the reasoning never pollutes the main
   * content. Rendered via ReasoningBlock above the content block by
   * ChatMessage when present.
   */
  reasoning?: string;
  /**
   * Per-turn tool-router selection (op-w76). When a backend pre-routes
   * a tool subset, the SDK stashes the picks here so ChatMessage can
   * render the "router picked X, Y, Z" chip above the answer. Hidden
   * when picks is empty — same suppression semantics as the operator.
   */
  routerPicks?: string[];
  /**
   * Full router-LLM call record (op-0rzm). Populated by backends that
   * emit ``router_started`` / ``router_finished`` events around their
   * auxiliary tool-picker LLM. Renders as a collapsible RouterCallCard
   * (chip when closed; tools considered + picked + timing when open).
   *
   * ``picks`` / ``duration_ms`` start undefined while the router is
   * still thinking and get filled in by router_finished. Hidden by
   * RouterCallCard when ``candidate_tools`` is empty.
   */
  routerCall?: {
    model: string;
    tool_count: number;
    candidate_tools: Array<{ name: string; description: string }>;
    started_at: number;
    finished_at?: number;
    /** Tool names the router picked on top of defaults. Empty array =
     *  router finished but chose nothing additional. */
    picks?: string[];
    defaults?: string[];
    tools?: string[];
    duration_ms?: number;
  };
  /**
   * Most recent phase emitted by the agent during this turn (op-qjky).
   * ChatMessage renders a PhaseIndicator pill while ``phase !== 'done'``,
   * giving the user feedback during the gap between "router picked" and
   * "first token arrives" on slow models.
   *
   *   routing         — auxiliary LLM is selecting tools
   *   thinking        — main LLM is streaming pre-tool tokens
   *   tool_running    — a tool is dispatched, awaiting its output
   *   reply_streaming — main LLM is streaming the post-tool reply
   *   done            — turn finished (FE sets this on message_done)
   */
  phase?: "routing" | "thinking" | "tool_running" | "reply_streaming" | "done";
  /**
   * Tool name carried alongside a ``tool_running`` phase so the pill can
   * read "calling generate_image" rather than just "running". Cleared
   * when phase transitions out of ``tool_running``.
   */
  phaseTool?: string;
  /**
   * Unix-ms when the current phase entered. Lets the PhaseIndicator
   * render an elapsed counter ("thinking 12s") without a separate ref.
   */
  phaseStartedAt?: number;
}

export interface Chat {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  params: ChatParams;
  messages: ChatTurn[];
  isStreaming: boolean;
  error?: string;
  /**
   * Names of tools (from the LLMProvider's ToolRegistry) the model is
   * allowed to invoke on this chat. `undefined` = no tools (default,
   * for backward compat with chats that pre-date tools). `[]` = also no
   * tools (explicit). A non-empty array opts each name in.
   */
  enabledTools?: string[];
  /** Wall-clock time the most-recent request was dispatched. */
  streamStartTime?: number;
  /** Wall-clock time the first token of the latest response arrived (TTFT base). */
  firstTokenTime?: number;
  /** Wall-clock time the latest stream finished (used for tok/s). */
  streamEndTime?: number;
  /**
   * Set when a stream was killed by a page refresh / unmount before it could
   * finish. The last assistant message holds whatever partial text arrived;
   * `resumeChat(id)` will discard it and re-issue from the prior user turn.
   */
  interrupted?: boolean;
  /**
   * Context-rot warnings emitted by the agent during this chat (e.g.
   * "tool X dumped 12000 chars into the LLM context"). The chat panel
   * surfaces these as a dismissable banner. Each entry is keyed by the
   * server's ``kind`` discriminator so future categories slot in
   * without UI changes. Cleared per-turn / per-chat by the bridge.
   */
  warnings?: ChatWarning[];
}

export interface ChatStore {
  client: CatalystLLMClient | null;
  /**
   * Agent backend (catalyst-langgraph). When set, sendMessage routes
   * through the Python LangGraph service instead of calling the
   * LiteLLM proxy directly. The TS-side tool loop is gone — the
   * agent loop runs server-side and emits typed AgentEvents.
   */
  agentClient: CatalystAgentClient | null;
  defaultModel: string;
  defaultParams: ChatParams;
  defaultSystemPrompt: string;

  chats: Chat[];
  activeChat: string;
  abortControllers: Map<string, AbortController>;

  // Setup (called by LLMProvider on mount)
  setClient: (client: CatalystLLMClient) => void;
  setAgentClient: (client: CatalystAgentClient | null) => void;
  setEnabledTools: (chatId: string, names: string[]) => void;
  setDefaults: (init: { model?: string; params?: ChatParams; systemPrompt?: string }) => void;

  // Chat management
  addChat: () => string;
  removeChat: (id: string) => void;
  setActiveChat: (id: string) => void;
  renameChat: (id: string, name: string) => void;
  clearChat: (id: string) => void;

  // Chat settings
  setModel: (chatId: string, model: string) => void;
  setSystemPrompt: (chatId: string, prompt: string) => void;
  setParams: (chatId: string, params: Partial<ChatParams>) => void;

  // Messages
  sendMessage: (chatId: string, content: string) => Promise<void>;
  /**
   * Re-issue the last user turn for a chat that was interrupted (e.g. by a
   * page refresh). Drops the partial assistant message that was killed
   * mid-stream, then re-runs sendMessage with the user's prior input. No-op
   * if the chat isn't actually interrupted or the prior turn wasn't a user
   * message.
   */
  resumeChat: (chatId: string) => Promise<void>;
  stopStreaming: (chatId: string) => void;
  appendToken: (chatId: string, token: string, meta?: StreamMeta) => void;
  setFirstTokenTime: (chatId: string) => void;
  setError: (chatId: string, error: string | undefined) => void;
  /**
   * Attach an error message to the last assistant turn in the chat
   * (the one the current stream is filling). Used by the SSE `error`
   * event so failures appear inline in the conversation instead of
   * only on a chat-level banner.
   */
  setTurnError: (chatId: string, error: string) => void;
  finishStreaming: (chatId: string, meta?: StreamMeta) => void;
}

export function createDefaultChat(
  defaults: { model: string; params: ChatParams; systemPrompt: string },
  id?: string
): Chat {
  return {
    id: id || nanoid(8),
    name: "New Chat",
    model: defaults.model,
    systemPrompt: defaults.systemPrompt,
    params: { ...defaults.params },
    messages: [],
    isStreaming: false,
  };
}

export const INITIAL_PARAMS: ChatParams = {
  temperature: 0.7,
  max_tokens: 2048,
  top_p: 1.0,
};

export const INITIAL_SYSTEM_PROMPT = "You are a helpful assistant.";

/** Context-rot warning emitted by the server when an agent did something
 * risky (e.g. a tool dumped large output into the LLM's message-list
 * context). Surfaced as a banner in the chat panel. */
export interface ChatWarning {
  /** Discriminator. Today: ``tool_output_oversized``. Future kinds
   * (``message_list_overflow``, ``tool_loop``, …) slot in without UI
   * changes — the renderer just keys on this for icon/colour. */
  kind: string;
  /** Human-readable explanation rendered into the banner. */
  message: string;
  /** Tool name when the warning is tool-scoped, undefined otherwise. */
  tool?: string;
  /** Size of the offending payload, when numeric. */
  size_chars?: number;
  /** Soft cap that was exceeded. */
  threshold_chars?: number;
  /** Wall-clock when the warning fired (set client-side on receipt). */
  ts: number;
}
