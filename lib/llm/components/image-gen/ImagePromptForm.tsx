/**
 * ImagePromptForm — controlled form for /v1/images/generations requests.
 *
 * Owns the local state for prompt + size + seed but lifts the model
 * selection up to the consumer so the consumer can manage the model
 * list (fetched from /v1/models, possibly cached). The form fires
 * `onSubmit` with a clean shape; the consumer wires the actual POST.
 *
 * Designed to be drop-in for any OpenAI-compat image backend: every
 * field is optional in the payload except `prompt` and `model`, so the
 * form lets the operator leave size/steps/seed unset and the backend
 * picks its defaults.
 *
 * Loading state is also controlled — the consumer sets `submitting`
 * while the request is in flight; the form disables inputs + flips
 * the button label.
 */
import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { DenseSelect, type DenseSelectOption } from "../shared/DenseSelect.js";
import { cn } from "../shared/utils.js";

export interface ImageGenSubmit {
  model: string;
  prompt: string;
  size: string;
  seed?: number;
  steps?: number;
}

export interface ImagePromptFormProps {
  /** List of available models, fed to the DenseSelect. */
  models: Array<{ id: string; description?: string }>;
  /** Currently selected model id (controlled by consumer). */
  selectedModel: string | null;
  /** Called when the model picker changes. */
  onModelChange: (id: string) => void;
  /** Called on submit with all populated fields. */
  onSubmit: (payload: ImageGenSubmit) => void;
  /** True while a request is in flight — disables inputs + flips button. */
  submitting?: boolean;
  /** Optional preset prompt (e.g. for re-rolling from a gallery card). */
  initialPrompt?: string;
  /** Default canvas size shown in the dropdown. */
  initialSize?: string;
  /** Common sizes to surface in the size dropdown. */
  sizeOptions?: string[];
  /** Extra class names on the outer form. */
  className?: string;
}

const DEFAULT_SIZES = ["512x512", "768x768", "1024x1024", "1024x1536", "1536x1024"];

export function ImagePromptForm({
  models,
  selectedModel,
  onModelChange,
  onSubmit,
  submitting = false,
  initialPrompt = "",
  initialSize = "1024x1024",
  sizeOptions = DEFAULT_SIZES,
  className,
}: ImagePromptFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [size, setSize] = useState(initialSize);
  // Seed + steps stay as strings so the user can type, clear, and
  // re-type freely; we coerce on submit.
  const [seed, setSeed] = useState("");
  const [steps, setSteps] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedModel) return;
    if (!prompt.trim()) return;
    const seedNum = seed.trim() ? parseInt(seed.trim(), 10) : undefined;
    const stepsNum = steps.trim() ? parseInt(steps.trim(), 10) : undefined;
    onSubmit({
      model: selectedModel,
      prompt: prompt.trim(),
      size,
      seed: Number.isFinite(seedNum) ? seedNum : undefined,
      steps: Number.isFinite(stepsNum) ? stepsNum : undefined,
    });
  };

  const modelOptions: DenseSelectOption[] = models.map(m => ({
    value: m.id,
    label: m.id,
    description: m.description,
  }));

  const sizeOpts: DenseSelectOption[] = sizeOptions.map(s => ({ value: s, label: s }));

  const canSubmit = !submitting && !!selectedModel && !!prompt.trim();

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-3", className)}>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe the image — be specific about subject, style, lighting, composition…"
        rows={4}
        disabled={submitting}
        className={cn(
          "w-full resize-y rounded-md border border-border bg-background px-3 py-2",
          "text-sm font-mono text-foreground placeholder:text-muted-foreground/60",
          "focus:outline-none focus:ring-1 focus:ring-accent",
          "disabled:opacity-60"
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Field label="model">
          <DenseSelect
            value={selectedModel ?? ""}
            onChange={onModelChange}
            options={modelOptions}
            placeholder="pick a model"
            disabled={submitting}
          />
        </Field>
        <Field label="size">
          <DenseSelect value={size} onChange={setSize} options={sizeOpts} disabled={submitting} />
        </Field>
        <Field label="seed / steps">
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="text"
              inputMode="numeric"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              placeholder="seed"
              disabled={submitting}
              className="rounded border border-border bg-background px-2 py-1.5 text-xs font-mono disabled:opacity-60"
            />
            <input
              type="text"
              inputMode="numeric"
              value={steps}
              onChange={e => setSteps(e.target.value)}
              placeholder="steps"
              disabled={submitting}
              className="rounded border border-border bg-background px-2 py-1.5 text-xs font-mono disabled:opacity-60"
            />
          </div>
        </Field>
      </div>
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded text-xs uppercase tracking-wider font-medium",
            "border transition-colors",
            canSubmit
              ? "border-accent text-accent hover:bg-accent/10"
              : "border-border text-muted-foreground cursor-not-allowed"
          )}
        >
          <Sparkles size={12} />
          {submitting ? "generating…" : "generate"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
