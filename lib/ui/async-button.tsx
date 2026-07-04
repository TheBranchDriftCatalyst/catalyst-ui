/**
 * AsyncButton — a batteries-included button for async actions.
 *
 * Wraps ``<Button>`` with an owned state machine
 * (``idle → loading → (success|error) → idle``) that:
 *
 *   - disables + swaps label to ``loadingLabel`` while the op is running
 *   - shows a thin progress bar along the bottom edge during the load
 *   - flashes ``successLabel`` (with a ``<MotionScale variant="pop">``
 *     scale bump if reduced-motion is off) on resolution, then returns
 *     to idle after ``successMs``
 *   - either routes errors to a toast (``errorPolicy="toast"``, default)
 *     or bubbles them to the caller via ``onError`` for inline surfaces
 *
 * The state machine lives in the shared ``useAsyncOp`` hook, so custom
 * triggers (keyboard shortcuts, hover flows) can consume the same
 * contract without reaching for ``<AsyncButton>``.
 *
 * Reduced motion is respected via ``usePrefersReducedMotion`` — the
 * scale pop collapses to a duration-0 opacity swap so users who opted
 * out don't see the bounce.
 */
import * as React from "react";
import { Check, X, Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/catalyst-ui/ui/button";
import { Progress } from "@/catalyst-ui/ui/progress";
import { MotionScale } from "@/catalyst-ui/effects/MotionScale";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
import { useAsyncOp } from "@/catalyst-ui/hooks/useAsyncOp";
import { notifyError as notifyErrorToast } from "@/catalyst-ui/ui/notify";
import { cn } from "@/catalyst-ui/utils";

export type AsyncButtonErrorPolicy = "toast" | "inline" | "none";

export interface AsyncButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /**
   * The async action. Return value is discarded — use ``useAsyncOp``
   * directly if you need the resolved value in the caller.
   */
  onClick: () => Promise<unknown>;
  /** Idle label. Text or arbitrary node (e.g. icon + label). */
  children: React.ReactNode;
  /** Label shown while the op runs. Default: keep the idle label. */
  loadingLabel?: React.ReactNode;
  /**
   * Label flashed on success before returning to idle. Set to
   * ``null`` to skip the success flash entirely (and just return to
   * idle immediately). Default: ``"done"``.
   */
  successLabel?: React.ReactNode | null;
  /**
   * Ms to hold the success flash before returning to idle. Default 1200.
   */
  successMs?: number;
  /**
   * How to surface errors:
   *   - ``"toast"`` (default): fire ``notifyError`` with ``errorTitle``
   *   - ``"inline"``: bubble the error via ``onError`` so the parent
   *     can render its own inline banner
   *   - ``"none"``: swallow silently (use only when the caller has other
   *     error-surfacing paths, e.g. a form validation state)
   */
  errorPolicy?: AsyncButtonErrorPolicy;
  /**
   * Title used with the ``toast`` error policy. Default: ``"action failed"``.
   * Consider setting this to the action name — e.g. ``"delete failed"``.
   */
  errorTitle?: string;
  /**
   * Called after error, regardless of policy. Wire ``inline`` policy
   * to this so the parent can setState + render.
   */
  onError?: (error: unknown) => void;
  /** Called after success. Wire ``notifySuccess`` here if desired. */
  onSuccess?: () => void;
  /** Show the loading progress bar. Default true. Set false for tiny buttons. */
  showProgressBar?: boolean;
}

type ViewState = "idle" | "loading" | "success" | "error";

export function AsyncButton({
  onClick,
  children,
  loadingLabel,
  successLabel = "done",
  successMs = 1200,
  errorPolicy = "toast",
  errorTitle = "action failed",
  onError,
  onSuccess,
  showProgressBar = true,
  disabled,
  className,
  variant,
  ...buttonProps
}: AsyncButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [view, setView] = React.useState<ViewState>("idle");
  const successTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const asyncOp = useAsyncOp(onClick, {
    onSuccess: () => {
      onSuccess?.();
      if (successLabel === null) {
        setView("idle");
      } else {
        setView("success");
        successTimerRef.current = setTimeout(() => setView("idle"), successMs);
      }
    },
    onError: e => {
      onError?.(e);
      if (errorPolicy === "toast") {
        notifyErrorToast(errorTitle, e instanceof Error ? e.message : String(e));
      }
      setView("error");
      // Errors don't auto-clear — user needs to see the state.
      // Next click will reset to loading.
    },
  });

  const handleClick = React.useCallback(async () => {
    setView("loading");
    await asyncOp.run();
  }, [asyncOp]);

  const label = React.useMemo(() => {
    switch (view) {
      case "loading":
        return loadingLabel ?? children;
      case "success":
        return (
          <span className="flex items-center gap-1.5">
            <Check size={14} aria-hidden />
            {successLabel}
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5">
            <X size={14} aria-hidden />
            {children}
          </span>
        );
      default:
        return children;
    }
  }, [view, children, loadingLabel, successLabel]);

  const resolvedVariant = view === "error" ? "destructive" : (variant ?? "default");

  const button = (
    <Button
      {...buttonProps}
      variant={resolvedVariant}
      disabled={disabled || view === "loading"}
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
      data-state={view}
      aria-busy={view === "loading"}
    >
      <span className="flex items-center gap-1.5">
        {view === "loading" && <Loader2 size={14} className="animate-spin" aria-hidden />}
        {label}
      </span>
      {showProgressBar && view === "loading" && (
        <span className="absolute inset-x-0 bottom-0 h-0.5">
          <Progress value={undefined} className="h-0.5 rounded-none bg-transparent" />
        </span>
      )}
    </Button>
  );

  // Wrap the success frame in a scale pop for micro-feedback. Skips the
  // pop when reduced motion is on so users who opted out don't get the
  // bounce; the label change alone still conveys the state.
  if (view === "success" && !reducedMotion) {
    return (
      <MotionScale variant="pop" duration={0.35}>
        {button}
      </MotionScale>
    );
  }
  return button;
}
