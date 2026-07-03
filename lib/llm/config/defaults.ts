/**
 * Baked defaults used when the FE cannot reach the operator's
 * ``GET /api/llm/config`` endpoint — i.e. catalyst-ui standalone
 * playground with no operator running.
 *
 * Values here mirror the Python-side ``LLMConfig`` field defaults so
 * both apps have the same fallback story. Keep in sync with
 * ``packages/operator-ui/src/server/src/catalyst_operator/contracts/llm_config.py``.
 */

export interface LLMLitellmBackend {
  url: string;
  key: string;
}

export interface LLMAgentBackend {
  url: string;
}

export interface LLMBackendsConfig {
  litellm: LLMLitellmBackend;
  agent: LLMAgentBackend;
}

export interface LLMModelsConfig {
  default_chat: string;
  default_swarm: string;
  default_embedding: string;
}

export interface LLMConfig {
  version: number;
  backends: LLMBackendsConfig;
  models: LLMModelsConfig;
  personas?: Record<string, unknown> | null;
  mcp?: Record<string, unknown> | null;
  permissions?: Record<string, unknown> | null;
}

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  version: 1,
  backends: {
    litellm: {
      url: "http://localhost:11434",
      key: "ollama",
    },
    agent: {
      // Standalone playground: same-origin has no agent server, so this
      // will 404 until the operator settings row points it somewhere.
      url: typeof window !== "undefined" ? window.location.origin : "http://localhost:9090",
    },
  },
  models: {
    default_chat: "qwen3-coder-opus:Q8_0",
    default_swarm: "qwen3-coder-opus:Q8_0",
    default_embedding: "nomic-embed-text",
  },
  personas: null,
  mcp: null,
  permissions: null,
};
