import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { StreamMeta } from "../../client/index.js";
import { useEngineStore } from "../engineStore.js";
import { collectPromptOverrides } from "./prompt-overrides.js";
import {
  createDefaultChat,
  INITIAL_PARAMS,
  INITIAL_SYSTEM_PROMPT,
  type Chat,
  type ChatStore,
  type ChatToolCallRecord,
  type ChatTurn,
  type ToolCall,
  type ToolSubEvent,
} from "./types.js";

export type {
  Chat,
  ChatStore,
  ChatToolCallRecord,
  ChatTurn,
  ToolCall,
  ToolSubEvent,
} from "./types.js";

/** Auto-derive a chat name from the first user message when the chat
 *  still has its default placeholder name. Keeps tabs readable without
 *  forcing the host to manage titles. No-op if the chat already has a
 *  user-set name or any prior user messages.
 *
 *  Default names recognized: "New Chat", "" (empty), or any falsy.
 */
function deriveChatName(
  currentName: string,
  existingMessages: ChatTurn[],
  newUserContent: string
): string {
  const isDefault = !currentName || currentName.trim() === "" || currentName === "New Chat";
  const hadPriorUser = existingMessages.some(m => m.role === "user");
  if (!isDefault || hadPriorUser) return currentName;
  const trimmed = newUserContent.trim().replace(/\s+/g, " ");
  if (!trimmed) return currentName;
  if (trimmed.length <= 32) return trimmed;
  return trimmed.slice(0, 32).trimEnd() + "…";
}

/** localStorage watermark eviction (op-w76). zustand's persist middleware
 *  doesn't cap by size — it just writes JSON until the browser quota
 *  errors. Wrap the storage so writes that exceed MAX_BYTES drop the
 *  oldest chats (by lastActiveAt / latest message timestamp) until we
 *  fit. Reads pass through. Quota errors caught and logged.
 *
 *  Default cap is 2MB matching catalyst-operator's chatStore policy.
 */
const MAX_BYTES = 2 * 1024 * 1024;

function evictingStorage(): Storage {
  const ls =
    typeof window !== "undefined" ? window.localStorage : (undefined as unknown as Storage);
  return {
    getItem: k => ls?.getItem(k) ?? null,
    setItem: (k, v) => {
      if (!ls) return;
      let value = v;
      while (value.length > MAX_BYTES) {
        try {
          const parsed = JSON.parse(value);
          const state = (parsed?.state as { chats?: Chat[] } | undefined) ?? parsed;
          const chats = state?.chats;
          if (!Array.isArray(chats) || chats.length <= 1) break;
          // Score each chat by its latest message timestamp; evict
          // lowest (oldest activity) first.
          const scored = chats.map(c => ({
            id: c.id,
            score: c.messages?.[c.messages.length - 1]?.timestamp ?? c.id.length,
          }));
          scored.sort((a, b) => a.score - b.score);
          const drop = scored[0]?.id;
          if (!drop) break;
          state.chats = chats.filter(c => c.id !== drop);
          value = JSON.stringify(parsed);
        } catch {
          break;
        }
      }
      try {
        ls.setItem(k, value);
      } catch {
        // Quota exceeded even after eviction — best-effort drop.
      }
    },
    removeItem: k => ls?.removeItem(k),
    clear: () => ls?.clear(),
    get length() {
      return ls?.length ?? 0;
    },
    key: i => ls?.key(i) ?? null,
  };
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      client: null,
      agentClient: null,
      defaultModel: "",
      defaultParams: INITIAL_PARAMS,
      defaultSystemPrompt: INITIAL_SYSTEM_PROMPT,

      chats: [
        createDefaultChat({
          model: "",
          params: INITIAL_PARAMS,
          systemPrompt: INITIAL_SYSTEM_PROMPT,
        }),
      ],
      activeChat: "",
      abortControllers: new Map(),

      setClient: client => set({ client }),

      setAgentClient: agentClient => set({ agentClient }),

      setEnabledTools: (chatId, names) =>
        set(state => ({
          chats: state.chats.map(c => (c.id === chatId ? { ...c, enabledTools: [...names] } : c)),
        })),

      setDefaults: ({ model, params, systemPrompt }) =>
        set(state => ({
          defaultModel: model ?? state.defaultModel,
          defaultParams: params ?? state.defaultParams,
          defaultSystemPrompt: systemPrompt ?? state.defaultSystemPrompt,
        })),

      addChat: () => {
        const state = get();
        const newChat = createDefaultChat({
          model: state.defaultModel,
          params: state.defaultParams,
          systemPrompt: state.defaultSystemPrompt,
        });
        set(s => ({
          chats: [...s.chats, newChat],
          activeChat: newChat.id,
        }));
        return newChat.id;
      },

      removeChat: id => {
        const state = get();
        if (state.chats.length <= 1) return;
        const index = state.chats.findIndex(c => c.id === id);
        const newChats = state.chats.filter(c => c.id !== id);
        let newActive = state.activeChat;
        if (state.activeChat === id) {
          newActive = newChats[Math.min(index, newChats.length - 1)]?.id || "";
        }
        set({ chats: newChats, activeChat: newActive });
      },

      setActiveChat: id => set({ activeChat: id }),

      renameChat: (id, name) =>
        set(state => ({
          chats: state.chats.map(c => (c.id === id ? { ...c, name } : c)),
        })),

      clearChat: id =>
        set(state => ({
          chats: state.chats.map(c => (c.id === id ? { ...c, messages: [], error: undefined } : c)),
        })),

      setModel: (chatId, model) =>
        set(state => ({
          chats: state.chats.map(c =>
            c.id === chatId ? { ...c, model, name: model || "New Chat" } : c
          ),
        })),

      setSystemPrompt: (chatId, prompt) =>
        set(state => ({
          chats: state.chats.map(c => (c.id === chatId ? { ...c, systemPrompt: prompt } : c)),
        })),

      setParams: (chatId, params) =>
        set(state => ({
          chats: state.chats.map(c =>
            c.id === chatId ? { ...c, params: { ...c.params, ...params } } : c
          ),
        })),

      sendMessage: async (chatId, content) => {
        const state = get();
        const chat = state.chats.find(c => c.id === chatId);
        if (!chat || !chat.model) return;
        const agentClient = state.agentClient;
        if (!agentClient) {
          get().setError(
            chatId,
            "No CatalystAgentClient configured — set VITE_AGENT_URL and pass agentClient to <LLMProvider>."
          );
          return;
        }

        const userMessage: ChatTurn = {
          id: nanoid(8),
          role: "user",
          content,
          timestamp: Date.now(),
        };
        const assistantMessage: ChatTurn = {
          id: nanoid(8),
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        set(s => ({
          chats: s.chats.map(c =>
            c.id === chatId
              ? {
                  ...c,
                  // Auto-derive name from first user message — only when
                  // the chat still has its default name. Keeps tabs
                  // readable without forcing the host to manage titles.
                  name: deriveChatName(c.name, c.messages, content),
                  messages: [...c.messages, userMessage, assistantMessage],
                  isStreaming: true,
                  error: undefined,
                  streamStartTime: Date.now(),
                  firstTokenTime: undefined,
                  streamEndTime: undefined,
                }
              : c
          ),
        }));

        // Build the request body in the shape catalyst-langgraph expects.
        // System prompt is sent separately so the backend can prepend it
        // idempotently on every tool-loop iteration; per-chat history is
        // forwarded verbatim so the agent has full context.
        const history = chat.messages
          .filter(m => m.role !== "system")
          .map(m => ({ role: m.role, content: m.content }));
        history.push({ role: "user", content });

        const ctrl = new AbortController();
        state.abortControllers.set(chatId, ctrl);

        // Tracks tool calls in flight by event.id so tool_call_end events
        // can patch their matching record (instead of double-appending).
        const recordIndex = new Map<string, number>();
        let iteration = 0;

        // ── Image side-channel correlation ──────────────────────────────
        // `image_generated` events arrive with a unique image_id minted by
        // the tool; the same id rides in the tool's return value. We buffer
        // payloads here keyed by image_id and pop the match either when
        // tool_call_end lands (we parse image_id out of result) or when
        // image_generated lands and a matching record already exists.
        //
        // toolCallToImageId maps tool_call_id → image_id once we've seen
        // the return value, which lets a late-arriving image_generated find
        // its host record without re-parsing. Both maps live for the
        // lifetime of this stream call.
        type PendingImage = {
          b64: string;
          prompt?: string;
          model?: string;
          size?: string;
          seed?: number | null;
          steps?: number | null;
        };
        const pendingImages = new Map<string, PendingImage>();
        const toolCallToImageId = new Map<string, string>();

        // Pulls an image out of pendingImages and attaches it to whichever
        // tool record currently owns that image_id. No-op when either the
        // image or the binding hasn't landed yet — the next call from the
        // other side of the rendezvous will succeed.
        const tryAttachImage = (imageId: string) => {
          const img = pendingImages.get(imageId);
          if (!img) return;
          let toolCallId: string | undefined;
          for (const [tcid, iid] of toolCallToImageId) {
            if (iid === imageId) {
              toolCallId = tcid;
              break;
            }
          }
          if (!toolCallId) return;
          const idx = recordIndex.get(toolCallId);
          if (idx === undefined) return;
          set(s => ({
            chats: s.chats.map(c => {
              if (c.id !== chatId) return c;
              const msgs = [...c.messages];
              const last = msgs[msgs.length - 1];
              if (last?.role !== "assistant" || !last.tool_calls) return c;
              const calls = [...last.tool_calls];
              if (idx >= calls.length) return c;
              calls[idx] = { ...calls[idx], imageAttachment: img };
              msgs[msgs.length - 1] = { ...last, tool_calls: calls };
              return { ...c, messages: msgs };
            }),
          }));
          pendingImages.delete(imageId);
        };

        // Pull the live Engine-tab config so any operator-edited Agent
        // tunables (researcher model, recursion limit, system prompts,
        // …) ride along with this request. The store returns undefined
        // when nothing has been edited, keeping the wire payload
        // byte-identical to today's traffic for users who never visit
        // the Engine tab.
        const agentConfig = useEngineStore.getState().asRequestPayload();

        // Resolve any `system_prompt_ref` bindings in agentConfig against
        // the operator's PromptStore. The backend treats the ref → content
        // map as the source of truth for resolved prompts (see
        // server/__init__.py:_resolve_prompt_ref). Nodes whose ref is not
        // resolvable fall through to the node's inline system_prompt or
        // schema default — we just don't include them in the override map.
        const promptOverrides = collectPromptOverrides(agentConfig);

        try {
          const stream = agentClient.streamAgent(
            {
              model: chat.model,
              messages: history,
              system_prompt: chat.systemPrompt || undefined,
              tools:
                chat.enabledTools && chat.enabledTools.length > 0 ? chat.enabledTools : undefined,
              params: chat.params as Record<string, unknown>,
              agent_config: agentConfig,
              prompt_overrides: promptOverrides,
            },
            { signal: ctrl.signal }
          );

          // Helper: append a sub-event to a tool's sub_events array.
          // Used when an incoming event carries `owner_tool_id` — those
          // events were produced INSIDE that tool's execution (council
          // members, critic, fusion, …) and shouldn't render in the
          // parent chat bubble. The ToolCallCard renders sub_events in
          // a collapsible "reasoning" section.
          const appendSubEvent = (ownerToolId: string, subEvent: ToolSubEvent) => {
            set(s => ({
              chats: s.chats.map(c => {
                if (c.id !== chatId) return c;
                const msgs = [...c.messages];
                const last = msgs[msgs.length - 1];
                if (last?.role !== "assistant") return c;
                const idx = recordIndex.get(ownerToolId);
                if (idx === undefined) return c;
                const calls = [...(last.tool_calls ?? [])];
                if (!calls[idx]) return c;
                const existingSubs = calls[idx].sub_events ?? [];
                // Coalesce consecutive `token`/`reasoning` chunks into a
                // single sub-event so the UI doesn't render thousands of
                // 2-char fragments. Other event kinds are atomic.
                if (
                  (subEvent.kind === "token" || subEvent.kind === "reasoning") &&
                  existingSubs.length > 0
                ) {
                  const tail = existingSubs[existingSubs.length - 1];
                  if (tail.kind === subEvent.kind) {
                    const merged = {
                      ...tail,
                      content: tail.content + subEvent.content,
                    } as ToolSubEvent;
                    calls[idx] = {
                      ...calls[idx],
                      sub_events: [...existingSubs.slice(0, -1), merged],
                    };
                    msgs[msgs.length - 1] = { ...last, tool_calls: calls };
                    return { ...c, messages: msgs };
                  }
                }
                calls[idx] = {
                  ...calls[idx],
                  sub_events: [...existingSubs, subEvent],
                };
                msgs[msgs.length - 1] = { ...last, tool_calls: calls };
                return { ...c, messages: msgs };
              }),
            }));
          };

          for await (const ev of stream) {
            // Route nested events (those produced inside a tool's
            // execution) into the matching tool's sub_events list. This
            // is what stops a research council's member chatter from
            // leaking into the parent's chat bubble.
            const ownerToolId = "owner_tool_id" in ev ? (ev.owner_tool_id ?? null) : null;
            if (ownerToolId) {
              switch (ev.type) {
                case "token":
                  appendSubEvent(ownerToolId, { kind: "token", content: ev.content });
                  continue;
                case "reasoning":
                  appendSubEvent(ownerToolId, {
                    kind: "reasoning",
                    content: ev.content,
                  });
                  continue;
                case "iteration":
                  appendSubEvent(ownerToolId, { kind: "iteration", n: ev.n });
                  continue;
                case "tool_call_start":
                  appendSubEvent(ownerToolId, {
                    kind: "tool_call_start",
                    id: ev.id,
                    name: ev.name,
                    args: ev.args,
                  });
                  continue;
                case "tool_call_end":
                  appendSubEvent(ownerToolId, {
                    kind: "tool_call_end",
                    id: ev.id,
                    result: ev.result,
                    error: ev.error,
                    duration_ms: ev.duration_ms,
                  });
                  continue;
                // run_started / message_done / error are top-level only —
                // fall through to the main switch.
              }
            }
            switch (ev.type) {
              case "run_started": {
                // Stash run_id on the assistant turn's meta for traceability.
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    msgs[msgs.length - 1] = {
                      ...last,
                      meta: { ...(last.meta ?? {}), id: ev.run_id, model: ev.model },
                    };
                    return { ...c, messages: msgs };
                  }),
                }));
                break;
              }
              case "iteration":
                iteration = ev.n;
                break;
              case "token": {
                if (!get().chats.find(c => c.id === chatId)?.firstTokenTime) {
                  get().setFirstTokenTime(chatId);
                }
                get().appendToken(chatId, ev.content);
                break;
              }
              case "reasoning": {
                // op-w76: reasoning deltas land in the assistant turn's
                // `reasoning` field, NOT in `content`. Distinct from the
                // <think>-tag splitter splitReasoning() runs on content —
                // some backends emit reasoning as its own event stream
                // and never mix it into the answer text. ChatMessage
                // renders both: the `reasoning` field above the answer,
                // and any <think> tags split from content inline.
                if (!get().chats.find(c => c.id === chatId)?.firstTokenTime) {
                  get().setFirstTokenTime(chatId);
                }
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    msgs[msgs.length - 1] = {
                      ...last,
                      reasoning: (last.reasoning ?? "") + ev.content,
                    };
                    return { ...c, messages: msgs };
                  }),
                }));
                break;
              }
              case "tool_router_selected": {
                // op-w76: stash router picks on the assistant turn so
                // ChatMessage renders the chip. We only persist `picks`
                // (the over-defaults delta) so the chip is suppressed
                // automatically when the router didn't add anything.
                const picks = ev.picks ?? [];
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    msgs[msgs.length - 1] = {
                      ...last,
                      routerPicks: picks,
                    };
                    return { ...c, messages: msgs };
                  }),
                }));
                break;
              }
              case "image_generated": {
                // Side-channel image payload from a tool (today: only the
                // catalyst-operator's generate_image). The tool's return
                // value stays tiny so the LLM's next-turn context never
                // carries b64 bytes; they flow through this custom event
                // instead.
                //
                // Correlation: the tool mints an `image_id` and ships it
                // in BOTH this event and the tool's return value. We stash
                // the payload in a pending-images map keyed by image_id;
                // when `tool_call_end` arrives we parse `image_id` out of
                // the return value and pair them up. That way parallel
                // sub-agents (council, swarm) can each generate images and
                // events can interleave on the wire without scrambling
                // attribution. The route additionally stamps `agent_id` on
                // the envelope so a future cross-stream demux has the
                // discriminator baked in (today one stream == one chat so
                // chatId alone is unambiguous).
                if (typeof ev.image_id === "string" && ev.image_id) {
                  pendingImages.set(ev.image_id, {
                    b64: ev.b64_json,
                    prompt: ev.prompt,
                    model: ev.model,
                    size: ev.size,
                    seed: ev.seed,
                    steps: ev.steps,
                  });
                  // Attempt an immediate attach in case tool_call_end has
                  // somehow already landed (rare — image_generated fires
                  // before on_tool_end in LangGraph — but cheap to try).
                  tryAttachImage(ev.image_id);
                }
                break;
              }
              case "phase": {
                // op-qjky: surface coarse agent state on the assistant turn.
                // ChatMessage reads `phase` (+ optional `phaseTool` for the
                // tool_running variant) to render a status pill that lives
                // in the gap between router-pick and first-token. Stamping
                // `phaseStartedAt` lets the pill show elapsed seconds without
                // a separate ref or interval per render.
                const now = Date.now();
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    msgs[msgs.length - 1] = {
                      ...last,
                      phase: ev.phase,
                      phaseTool: ev.phase === "tool_running" ? ev.tool : undefined,
                      phaseStartedAt: now,
                    };
                    return { ...c, messages: msgs };
                  }),
                }));
                break;
              }
              case "tool_call_start": {
                // Append a placeholder ChatToolCallRecord so ToolCallCard
                // can render an in-flight state immediately. We reconstruct
                // the OpenAI-shape `call` field so the existing UI keeps
                // working unchanged.
                const placeholder: ChatToolCallRecord = {
                  call: {
                    id: ev.id,
                    type: "function",
                    function: {
                      name: ev.name,
                      arguments: JSON.stringify(ev.args ?? {}),
                    },
                  } as unknown as ToolCall,
                  args: ev.args,
                  duration_ms: 0,
                  iteration,
                  finished_at: 0,
                };
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    const next = {
                      ...last,
                      tool_calls: [...(last.tool_calls ?? []), placeholder],
                    };
                    msgs[msgs.length - 1] = next;
                    recordIndex.set(ev.id, next.tool_calls!.length - 1);
                    return { ...c, messages: msgs };
                  }),
                }));
                break;
              }
              case "tool_call_end": {
                // Patch the placeholder created at tool_call_start. If we
                // somehow missed the start (race / reorder) we just append
                // a record with what we have — better than dropping it.
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    const idx = recordIndex.get(ev.id);
                    const calls = [...(last.tool_calls ?? [])];
                    if (idx !== undefined && calls[idx]) {
                      calls[idx] = {
                        ...calls[idx],
                        result: ev.result,
                        error: ev.error,
                        duration_ms: ev.duration_ms,
                        finished_at: Date.now(),
                      };
                    } else {
                      calls.push({
                        call: {
                          id: ev.id,
                          type: "function",
                          function: { name: "", arguments: "" },
                        } as unknown as ToolCall,
                        args: undefined,
                        result: ev.result,
                        error: ev.error,
                        duration_ms: ev.duration_ms,
                        iteration,
                        finished_at: Date.now(),
                      });
                    }
                    msgs[msgs.length - 1] = { ...last, tool_calls: calls };
                    return { ...c, messages: msgs };
                  }),
                }));
                // Side-channel image binding: parse the tool's return value
                // for an `image_id` and register the tool_call_id → image_id
                // mapping. Then try to attach — succeeds immediately when
                // image_generated already landed (the common ordering), and
                // is a no-op when it hasn't (image_generated will retry on
                // arrival and find this mapping waiting). Errors in parsing
                // are swallowed — non-image tools simply don't carry the key.
                const imageId = extractImageId(ev.result);
                if (imageId) {
                  toolCallToImageId.set(ev.id, imageId);
                  tryAttachImage(imageId);
                }
                break;
              }
              case "message_done": {
                const meta: StreamMeta = {};
                if (ev.finish_reason) meta.finish_reason = ev.finish_reason;
                if (ev.usage) meta.usage = ev.usage as StreamMeta["usage"];
                // op-qjky: stamp `phase: done` so the PhaseIndicator pill
                // unmounts on the same render as the spinner.
                set(s => ({
                  chats: s.chats.map(c => {
                    if (c.id !== chatId) return c;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role !== "assistant") return c;
                    msgs[msgs.length - 1] = { ...last, phase: "done" };
                    return { ...c, messages: msgs };
                  }),
                }));
                get().finishStreaming(chatId, meta);
                return;
              }
              case "error": {
                // Attach the error to the assistant turn so the failed
                // bubble carries its own context. The chat-level banner
                // was easy to miss — and missing the failure mode is
                // exactly what made the SSE bug feel like "empty replies".
                get().setTurnError(chatId, ev.message);
                get().finishStreaming(chatId, { finish_reason: "error" });
                return;
              }
              case "cancelled": {
                // The server cooperatively stopped after a STOP press.
                // Mark the turn finish_reason=abort so the bubble shows
                // the "stopped" badge, and keep any partial content that
                // already streamed before the abort. The list of
                // propagated_to tool ids lives on the meta for any
                // future "the council heard you" affordance.
                const meta: StreamMeta = {
                  finish_reason: "abort",
                  cancel_reason: ev.reason,
                  cancel_propagated_to: ev.propagated_to ?? undefined,
                };
                get().finishStreaming(chatId, meta);
                return;
              }
            }
          }
          // Stream ended without a message_done (rare — backend should always
          // emit it). Treat as a clean finish so UI doesn't get stuck.
          get().finishStreaming(chatId);
        } catch (error) {
          const err = error as Error;
          if (err.name === "AbortError") {
            get().finishStreaming(chatId, { finish_reason: "abort" });
          } else {
            // Network / fetch failure — no assistant turn body to attach
            // to. Fall back to the chat-level banner so it still surfaces.
            get().setError(chatId, err.message);
            get().finishStreaming(chatId);
          }
        } finally {
          state.abortControllers.delete(chatId);
        }
      },

      resumeChat: async chatId => {
        const chat = get().chats.find(c => c.id === chatId);
        if (!chat || !chat.interrupted) return;
        const messages = chat.messages;
        // The last message is the partial assistant turn. The one before it must
        // be the user input we're resuming. If the structure doesn't match, bail.
        const last = messages[messages.length - 1];
        const prior = messages[messages.length - 2];
        if (last?.role !== "assistant" || prior?.role !== "user") return;
        // Drop both — sendMessage will re-create them when it dispatches.
        set(state => ({
          chats: state.chats.map(c =>
            c.id === chatId
              ? {
                  ...c,
                  messages: messages.slice(0, -2),
                  interrupted: false,
                  error: undefined,
                }
              : c
          ),
        }));
        await get().sendMessage(chatId, prior.content);
      },

      stopStreaming: chatId => {
        const ctrl = get().abortControllers.get(chatId);
        if (ctrl) ctrl.abort();
      },

      appendToken: (chatId, token, meta) =>
        set(state => ({
          chats: state.chats.map(c => {
            if (c.id !== chatId) return c;
            const messages = [...c.messages];
            const last = messages[messages.length - 1];
            if (last?.role === "assistant") {
              messages[messages.length - 1] = {
                ...last,
                content: last.content + token,
                meta,
              };
            }
            return { ...c, messages };
          }),
        })),

      setFirstTokenTime: chatId =>
        set(state => ({
          chats: state.chats.map(c => (c.id === chatId ? { ...c, firstTokenTime: Date.now() } : c)),
        })),

      setError: (chatId, error) =>
        set(state => ({
          chats: state.chats.map(c => (c.id === chatId ? { ...c, error } : c)),
        })),

      setTurnError: (chatId, error) =>
        set(state => ({
          chats: state.chats.map(c => {
            if (c.id !== chatId) return c;
            const messages = [...c.messages];
            const last = messages[messages.length - 1];
            if (last?.role !== "assistant") return c;
            messages[messages.length - 1] = { ...last, error };
            return { ...c, messages };
          }),
        })),

      finishStreaming: (chatId, meta) =>
        set(state => ({
          chats: state.chats.map(c => {
            if (c.id !== chatId) return c;
            const messages = [...c.messages];
            const last = messages[messages.length - 1];
            if (last?.role === "assistant" && meta) {
              messages[messages.length - 1] = { ...last, meta };
            }
            return {
              ...c,
              messages,
              isStreaming: false,
              streamEndTime: Date.now(),
            };
          }),
        })),
    }),
    {
      name: "catalyst-llm-sdk:chat",
      // op-w76: evicting storage caps localStorage at 2MB; drops the
      // oldest chats first so a long-lived session set doesn't blow
      // the browser quota.
      storage: createJSONStorage(() => evictingStorage()),
      // Persist conversations + per-chat config; skip non-serializable
      // (client, abortControllers) and skip transient streaming flags. After
      // a page refresh any chat marked `isStreaming: true` had its fetch
      // killed with the page — flip it back so the UI lets the user resume.
      partialize: s => ({
        chats: s.chats,
        activeChat: s.activeChat,
        defaultModel: s.defaultModel,
        defaultParams: s.defaultParams,
        defaultSystemPrompt: s.defaultSystemPrompt,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ChatStore>;
        const chats = (p.chats ?? []).map(c =>
          c.isStreaming ? { ...c, isStreaming: false, interrupted: true } : c
        );
        return {
          ...current,
          ...p,
          chats: chats.length > 0 ? chats : current.chats,
          abortControllers: new Map(),
        };
      },
    }
  )
);

const initialState = useChatStore.getState();
if (!initialState.activeChat && initialState.chats.length > 0) {
  useChatStore.setState({ activeChat: initialState.chats[0].id });
}

/**
 * extractImageId — pull an `image_id` ULID out of a tool's return value.
 *
 * Tool returns are typically JSON strings; sometimes they're already
 * parsed objects (older shape). We handle both, plus the OpenAI-style
 * ``data: [{...}]`` envelope, then look for a top-level ``image_id``
 * field. Returns undefined when no id is present — non-image tools fall
 * through silently. Errors in JSON.parse are swallowed so an unparseable
 * blob just means "no image to attach", not a crash.
 */
function extractImageId(result: unknown): string | undefined {
  let obj: unknown = result;
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch {
      return undefined;
    }
  }
  if (!obj || typeof obj !== "object") return undefined;
  // OpenAI-style envelope: pull from the first data entry.
  const anyObj = obj as Record<string, unknown>;
  const data = anyObj.data;
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    const first = data[0] as Record<string, unknown>;
    if (typeof first.image_id === "string") return first.image_id;
  }
  if (typeof anyObj.image_id === "string") return anyObj.image_id;
  return undefined;
}
