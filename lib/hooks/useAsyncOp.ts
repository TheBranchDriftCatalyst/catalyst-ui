/**
 * useAsyncOp — one hook, one contract for every async user action.
 *
 * Standardizes the try/finally state machine so callers get uniform
 * loading + error + result state without inventing their own local
 * ``useState``s and try/catch scaffolds. Zero animation, zero rendering
 * — that's ``<AsyncButton>``'s job. This is the pure logic layer.
 *
 * State machine:
 *   idle → loading → (success[result] | error) → (idle via reset OR
 *                                                 loading via re-run)
 *
 * Usage:
 * ```tsx
 * const { run, loading, error, result, reset } = useAsyncOp(
 *   async (id: string) => api.tickets.close(id),
 *   {
 *     onSuccess: () => notifySuccess('Ticket closed'),
 *     onError: (e) => notifyError('Close failed', String(e)),
 *   }
 * );
 * return <button disabled={loading} onClick={() => run(ticketId)}>close</button>;
 * ```
 *
 * The hook OWNS the try/catch — callers should never wrap ``run()`` in
 * their own try. Exceptions raised inside ``fn`` land in ``error`` and
 * fire ``onError``. ``run()`` itself returns the resolved value (or
 * ``undefined`` when ``fn`` threw) so consumers can chain when needed.
 */
import { useCallback, useRef, useState } from "react";

export interface UseAsyncOpOptions<TResult> {
  /**
   * Called on successful resolution. Wire ``notifySuccess`` here in the
   * common case; wire an inline state update for surfaces that own their
   * own success rendering.
   */
  onSuccess?: (result: TResult) => void;
  /**
   * Called on rejection. Wire ``notifyError`` here in the common case;
   * wire an inline state update for surfaces that render inline error
   * banners.
   *
   * The raw error object is passed so callers can surface the message,
   * status code, etc. Uncaught by design — ``useAsyncOp`` catches and
   * routes here so consumers never need their own try/catch.
   */
  onError?: (error: unknown) => void;
}

export interface UseAsyncOpReturn<TArgs extends unknown[], TResult> {
  /**
   * Fire the op. Returns the resolved value on success, ``undefined`` on
   * error. Concurrent calls are safe — the hook drops stale results
   * from earlier invocations so out-of-order responses don't clobber a
   * later state.
   */
  run: (...args: TArgs) => Promise<TResult | undefined>;
  loading: boolean;
  error: unknown | null;
  /** Last successful result. Cleared on ``reset()`` and on next ``run()``. */
  result: TResult | null;
  /** Force back to idle — clears loading/error/result. */
  reset: () => void;
}

export function useAsyncOp<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: UseAsyncOpOptions<TResult> = {}
): UseAsyncOpReturn<TArgs, TResult> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [result, setResult] = useState<TResult | null>(null);
  // Increment on every call; only the LATEST call's resolution updates state.
  // Prevents stale success flashes from a slow earlier request when a
  // second, faster request has already resolved.
  const seqRef = useRef(0);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      const mySeq = ++seqRef.current;
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const value = await fn(...args);
        if (mySeq === seqRef.current) {
          setResult(value);
          setLoading(false);
          options.onSuccess?.(value);
        }
        return value;
      } catch (e) {
        if (mySeq === seqRef.current) {
          setError(e);
          setLoading(false);
          options.onError?.(e);
        }
        return undefined;
      }
    },
    [fn, options]
  );

  const reset = useCallback(() => {
    seqRef.current++;
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { run, loading, error, result, reset };
}
