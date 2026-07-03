// LLM Playground tab — Phase 0 relocation of catalyst-llm-sdk's playground
// app. The SDK source moved to `lib/llm/`; the playground shell moved to
// `app/tabs/llm-playground/`. Backend URLs still come from Vite env
// (VITE_LITELLM_URL, VITE_AGENT_URL) — figure that out in Phase 1.
import "./llm-playground/playground.css";
import PlaygroundApp from "./llm-playground/PlaygroundApp";

export const TAB_ORDER = 95;
export const TAB_LABEL = "LLM Playground";
export const TAB_SECTION = "projects";

export function LLMPlaygroundTab() {
  return (
    <div className="min-h-[720px] h-[calc(100vh-140px)]">
      <PlaygroundApp />
    </div>
  );
}
