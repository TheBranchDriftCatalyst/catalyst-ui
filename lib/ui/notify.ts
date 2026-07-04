/**
 * notify — ergonomic helpers on top of ``use-toast.ts``.
 *
 * The four helpers below (``notifySuccess`` / ``notifyError`` /
 * ``notifyWarning`` / ``notifyInfo``) provide symmetric feedback shapes
 * across every severity so consumers can wire success paths as easily
 * as they wire error paths.
 *
 * Wraps :func:`toast` from ``use-toast.ts``. The toast primitive already
 * handles Radix animation variants (``slide`` / ``fade`` / ``bounce`` /
 * ``scale``) + auto-dismiss + reduced-motion a11y — these helpers pick
 * sensible defaults for each severity and delegate the rest.
 *
 * Import from ``@thebranchdriftcatalyst/catalyst-ui/ui/notify`` — the
 * operator's ``lib/notify.ts`` retargets its existing exports to these
 * so the ~40 call sites don't change.
 */
import { toast, type ToastAnimation } from "./use-toast";

export interface NotifyOptions {
  /**
   * Toast lifespan in ms. Defaults per-severity: success 4s, info 5s,
   * warning 8s, error 12s. Set ``sticky: true`` on the call site instead
   * of a huge number.
   */
  duration?: number;
  /**
   * Never auto-dismiss — user must click the close button. Useful for
   * errors that carry actionable context (failed spawn, stack trace).
   */
  sticky?: boolean;
  /** Override the entrance animation. Default: ``slide``. */
  animation?: ToastAnimation;
}

const STICKY_DURATION = 24 * 60 * 60 * 1000; // one day — Radix' upper cap for practical purposes

interface FireOptions {
  title: string;
  description?: string;
  variant: "default" | "destructive" | "secondary";
  defaultDuration: number;
  animation: ToastAnimation;
  opts?: NotifyOptions;
}

function fire({ title, description, variant, defaultDuration, animation, opts }: FireOptions) {
  return toast({
    title,
    description,
    variant,
    animation: opts?.animation ?? animation,
    duration: opts?.sticky ? STICKY_DURATION : (opts?.duration ?? defaultDuration),
  });
}

/**
 * Positive confirmation of a mutation. Primary chrome (neon cyan).
 *
 * Fires when a save succeeds, an item is created, a service starts, etc.
 * Missing today across the operator — every mutation currently succeeds
 * silently, leaving the user to infer success by observing row state.
 */
export function notifySuccess(title: string, description?: string, opts?: NotifyOptions) {
  return fire({
    title,
    description,
    variant: "default",
    defaultDuration: 4000,
    animation: "slide",
    opts,
  });
}

/**
 * Failure of a user-triggered action. Destructive chrome (red).
 *
 * Always call BOTH ``notifyError`` (toast) AND log the raw error to
 * console for devtools — the toast is the user surface; the log is the
 * dev surface. Never swallow: ``.catch(() => {})`` is a bug.
 */
export function notifyError(title: string, description?: string, opts?: NotifyOptions) {
  return fire({
    title,
    description,
    variant: "destructive",
    defaultDuration: 12000,
    animation: "slide",
    opts,
  });
}

/**
 * Non-blocking warning. Secondary chrome (softer than destructive but
 * more attention-getting than default). Use for "action succeeded but
 * had caveats" — e.g., "created but no CI ran", "saved but not synced".
 */
export function notifyWarning(title: string, description?: string, opts?: NotifyOptions) {
  return fire({
    title,
    description,
    variant: "secondary",
    defaultDuration: 8000,
    animation: "slide",
    opts,
  });
}

/**
 * Passive information — a background event finished, a status changed,
 * a hint the user might want to know but doesn't require action.
 */
export function notifyInfo(title: string, description?: string, opts?: NotifyOptions) {
  return fire({
    title,
    description,
    variant: "default",
    defaultDuration: 5000,
    animation: "fade",
    opts,
  });
}
