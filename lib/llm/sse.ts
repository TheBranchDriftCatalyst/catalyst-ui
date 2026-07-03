/**
 * Shared SSE message reader.
 *
 * Bytes → typed SSE messages is the *only* part of the two SSE
 * consumers in this package that's actually common — the agent
 * stream (typed AgentEvent union, from catalyst-langgraph) and the
 * raw chat-completion stream (OpenAI `data: {...}` with `[DONE]`
 * terminator, from LiteLLM) speak different protocols on top of the
 * same wire format. This helper owns the wire format; each consumer
 * owns its own decoding.
 *
 * Wire parsing is delegated to EventSourceParserStream — a WHATWG
 * TransformStream that handles every line terminator (`\n`, `\r`,
 * `\r\n`), multi-line `data:` fields, comments, and partial chunk
 * reassembly. We tried hand-rolling this once and got bitten by
 * sse-starlette's `\r\n\r\n` boundaries; never again.
 */

import { EventSourceParserStream, type EventSourceMessage } from "eventsource-parser/stream";

/**
 * Iterate SSE messages from a response body. Yields one
 * `EventSourceMessage` per complete server-sent event. Resolves cleanly
 * when the stream ends; surfaces fetch / abort errors via rejection.
 */
export async function* sseMessages(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<EventSourceMessage, void, unknown> {
  // TS lib.dom.d.ts widened Uint8Array to Uint8Array<ArrayBufferLike>
  // in a recent update; TextDecoderStream still types its input as
  // BufferSource which doesn't structurally match. Runtime is fine —
  // cast keeps the pipeline happy across TS versions.
  const stream = (body as unknown as ReadableStream<Uint8Array>)
    .pipeThrough(new TextDecoderStream() as any)
    .pipeThrough(new EventSourceParserStream());

  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export type { EventSourceMessage };
