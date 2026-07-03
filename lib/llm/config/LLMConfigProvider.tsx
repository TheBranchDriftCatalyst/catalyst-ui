/**
 * LLMConfigProvider — fetches ``/api/llm/config`` on mount, exposes the
 * resolved config via context. Both the operator SPA and the standalone
 * catalyst-ui playground wrap their client trees in this provider before
 * mounting ``<LLMProvider>``.
 *
 * When the endpoint is unreachable (standalone playground with no
 * operator), falls back to baked defaults and flags ``source: 'defaults'``
 * so consumers can render a banner.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LLM_CONFIG, type LLMConfig } from "./defaults.js";

export type LLMConfigSource = "operator" | "defaults" | "loading";

interface LLMConfigContextValue {
  config: LLMConfig;
  source: LLMConfigSource;
  banner: string | null;
  reload: () => Promise<void>;
}

const LLMConfigContext = createContext<LLMConfigContextValue | null>(null);

interface LLMConfigProviderProps {
  /** Endpoint that returns ``LLMConfig`` JSON. Default ``/api/llm/config``. */
  endpoint?: string;
  /** Optional starting-config so SSR/tests can skip the fetch. */
  bootstrap?: LLMConfig;
  children: ReactNode;
}

export function LLMConfigProvider({
  endpoint = "/api/llm/config",
  bootstrap,
  children,
}: LLMConfigProviderProps) {
  const [config, setConfig] = useState<LLMConfig>(bootstrap ?? DEFAULT_LLM_CONFIG);
  const [source, setSource] = useState<LLMConfigSource>(bootstrap ? "operator" : "loading");
  const [banner, setBanner] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const resp = await fetch(endpoint, { headers: { accept: "application/json" } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const payload = (await resp.json()) as LLMConfig;
      setConfig(payload);
      setSource("operator");
      setBanner(null);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      setConfig(DEFAULT_LLM_CONFIG);
      setSource("defaults");
      setBanner(
        `no operator detected — using baked defaults (${reason}). ` +
          `start the operator, or override URLs via the settings row below.`
      );
    }
  }, [endpoint]);

  useEffect(() => {
    if (!bootstrap) void reload();
  }, [bootstrap, reload]);

  const value = useMemo<LLMConfigContextValue>(
    () => ({ config, source, banner, reload }),
    [config, source, banner, reload]
  );

  return <LLMConfigContext.Provider value={value}>{children}</LLMConfigContext.Provider>;
}

export function useLLMConfig(): LLMConfigContextValue {
  const ctx = useContext(LLMConfigContext);
  if (!ctx) {
    throw new Error("useLLMConfig() must be called inside an <LLMConfigProvider>");
  }
  return ctx;
}
