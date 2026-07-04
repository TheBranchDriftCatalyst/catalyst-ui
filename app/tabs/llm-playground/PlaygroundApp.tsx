import { useMemo, useState } from "react";
import { Settings2, TriangleAlert } from "lucide-react";
import { CatalystAgentClient, CatalystLLMClient, LLMProvider } from "@/catalyst-ui/llm";
import { notifyError, notifySuccess } from "@/catalyst-ui/ui/notify";
import { LLMConfigProvider, useLLMConfig, type LLMConfig } from "@/catalyst-ui/llm/config";
import { Header } from "./nav/Header.js";
import { useRoute } from "./nav/useRoute.js";
import { pageById } from "./pages/index.js";
import { MetricsRecorder } from "./metrics/MetricsRecorder.js";

// Runtime URL priority (later wins):
//   1. Baked defaults (@catalyst/llm/config)
//   2. Server config (fetched via LLMConfigProvider from /api/llm/config)
//   3. localStorage overrides (from the SettingsRow below) — user's per-browser
//      pin so a standalone playground can still point at a real service without
//      touching env or the yaml file.
const LS_LITELLM_URL = "catalyst-ui.playground.litellm.url";
const LS_LITELLM_KEY = "catalyst-ui.playground.litellm.key";
const LS_AGENT_URL = "catalyst-ui.playground.agent.url";

function readOverride(key: string): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function overlayLocalStorage(cfg: LLMConfig): LLMConfig {
  const url = readOverride(LS_LITELLM_URL);
  const key = readOverride(LS_LITELLM_KEY);
  const agentUrl = readOverride(LS_AGENT_URL);
  if (!url && !key && !agentUrl) return cfg;
  return {
    ...cfg,
    backends: {
      ...cfg.backends,
      litellm: {
        url: url ?? cfg.backends.litellm.url,
        key: key ?? cfg.backends.litellm.key,
      },
      agent: {
        url: agentUrl ?? cfg.backends.agent.url,
      },
    },
  };
}

function SourceBanner() {
  const { source, banner } = useLLMConfig();
  if (source !== "defaults" || !banner) return null;
  return (
    <div className="flex items-start gap-2 border-b border-hairline bg-yellow-950/30 px-3 py-1.5 text-[11px] font-mono text-yellow-200">
      <TriangleAlert size={12} className="mt-0.5 shrink-0" />
      <div>{banner}</div>
    </div>
  );
}

function SettingsRow() {
  const { config, reload } = useLLMConfig();
  const effective = overlayLocalStorage(config);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({
    litellmUrl: effective.backends.litellm.url,
    litellmKey: effective.backends.litellm.key,
    agentUrl: effective.backends.agent.url,
  }));
  return (
    <div className="border-b border-hairline bg-bg-elev/40 px-3 py-1.5">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-faint hover:text-text"
        >
          <Settings2 size={12} />
          backend
          <span className="text-text/70">·</span>
          <span className="normal-case tracking-normal">
            litellm={safeHost(effective.backends.litellm.url)} · agent=
            {safeHost(effective.backends.agent.url)}
          </span>
        </button>
      ) : (
        <div className="flex flex-wrap items-end gap-3 text-[11px] font-mono">
          <label className="flex flex-col gap-1">
            <span className="text-faint uppercase tracking-[0.14em]">litellm url</span>
            <input
              value={draft.litellmUrl}
              onChange={e => setDraft({ ...draft, litellmUrl: e.target.value })}
              className="w-72 rounded border border-hairline bg-bg-elev px-2 py-1 text-text"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-faint uppercase tracking-[0.14em]">litellm key</span>
            <input
              type="password"
              value={draft.litellmKey}
              onChange={e => setDraft({ ...draft, litellmKey: e.target.value })}
              className="w-40 rounded border border-hairline bg-bg-elev px-2 py-1 text-text"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-faint uppercase tracking-[0.14em]">agent url</span>
            <input
              value={draft.agentUrl}
              onChange={e => setDraft({ ...draft, agentUrl: e.target.value })}
              className="w-72 rounded border border-hairline bg-bg-elev px-2 py-1 text-text"
            />
          </label>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(LS_LITELLM_URL, draft.litellmUrl);
                  localStorage.setItem(LS_LITELLM_KEY, draft.litellmKey);
                  localStorage.setItem(LS_AGENT_URL, draft.agentUrl);
                  notifySuccess(
                    "backend saved",
                    `litellm=${safeHost(draft.litellmUrl)} · agent=${safeHost(draft.agentUrl)}`
                  );
                } catch (err) {
                  notifyError(
                    "localStorage write failed",
                    err instanceof Error ? err.message : String(err)
                  );
                }
                setOpen(false);
                void reload();
              }}
              className="rounded bg-primary px-3 py-1 text-primary-foreground uppercase tracking-[0.14em]"
            >
              save · reload
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border border-hairline px-3 py-1 uppercase tracking-[0.14em]"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function safeHost(u: string): string {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
}

function PlaygroundInner() {
  const { config, source } = useLLMConfig();
  const effective = useMemo(() => overlayLocalStorage(config), [config]);
  const clients = useMemo(
    () => ({
      client: new CatalystLLMClient({
        baseUrl: effective.backends.litellm.url,
        apiKey: effective.backends.litellm.key,
      }),
      agentClient: new CatalystAgentClient({ baseUrl: effective.backends.agent.url }),
    }),
    [effective.backends.litellm.url, effective.backends.litellm.key, effective.backends.agent.url]
  );
  const [page, setPage] = useRoute();
  const meta = pageById(page);
  const PageComponent = meta?.component;
  return (
    <LLMProvider client={clients.client} agentClient={clients.agentClient}>
      <div className="h-full flex flex-col bg-background text-foreground">
        {/* Skip-to-main affordance — visually hidden but reachable by tab. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <SourceBanner />
        <SettingsRow />
        <Header page={page} setPage={setPage} baseUrl={effective.backends.litellm.url} />
        {PageComponent && <PageComponent onNavigate={setPage} />}
        {/* Background recorder — silently writes one row per completed
            chat / compare turn into the in-browser DuckDB. Dev-only.
            Guarded on ``source === 'operator'`` so a standalone playground
            without a backend doesn't spam empty metrics. */}
        {import.meta.env.DEV && source === "operator" && <MetricsRecorder />}
      </div>
    </LLMProvider>
  );
}

function App() {
  return (
    <LLMConfigProvider>
      <PlaygroundInner />
    </LLMConfigProvider>
  );
}

export default App;
