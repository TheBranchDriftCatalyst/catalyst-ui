/**
 * useConfirmAction — imperative confirm dialog for destructive actions.
 *
 * Returns a hook shape ``{ ConfirmModal, confirm }`` where:
 *   - ``<ConfirmModal />`` is a component the caller renders ONCE
 *     alongside their JSX. It stays hidden until ``confirm()`` opens it.
 *   - ``confirm({ title, body, danger })`` returns a
 *     ``Promise<boolean>`` — resolves ``true`` when the user confirms,
 *     ``false`` when they cancel / Esc / click-outside.
 *
 * Usage:
 * ```tsx
 * const { ConfirmModal, confirm } = useConfirmAction();
 *
 * const onDelete = async () => {
 *   const ok = await confirm({
 *     title: 'Delete ticket?',
 *     body: 'This action cannot be undone.',
 *     danger: true,
 *   });
 *   if (ok) await api.tickets.delete(id);
 * };
 *
 * return <>
 *   <button onClick={onDelete}>delete</button>
 *   <ConfirmModal />
 * </>;
 * ```
 *
 * Reuses ``<Dialog>`` from catalyst-ui with the ``animation="zoom"``
 * entrance variant it already ships. Radix handles focus trap, Esc,
 * click-outside dismiss uniformly. No parallel animation system.
 */
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/catalyst-ui/ui/dialog";
import { Button } from "@/catalyst-ui/ui/button";

export interface ConfirmActionArgs {
  title: string;
  /** Optional body text — describe what's about to happen. */
  body?: string;
  /**
   * When true, the confirm button uses the ``destructive`` variant
   * (red) and defaults its label to ``"delete"``. Off by default —
   * non-destructive confirms use the primary ``"confirm"`` button.
   */
  danger?: boolean;
  /** Override the confirm-button label. Default: ``"confirm"`` or ``"delete"`` when danger. */
  confirmLabel?: string;
  /** Override the cancel-button label. Default: ``"cancel"``. */
  cancelLabel?: string;
}

interface PendingConfirm extends ConfirmActionArgs {
  resolve: (ok: boolean) => void;
}

export interface UseConfirmActionReturn {
  ConfirmModal: React.FC;
  confirm: (args: ConfirmActionArgs) => Promise<boolean>;
}

export function useConfirmAction(): UseConfirmActionReturn {
  const [pending, setPending] = React.useState<PendingConfirm | null>(null);

  const confirm = React.useCallback(
    (args: ConfirmActionArgs) =>
      new Promise<boolean>(resolve => {
        setPending({ ...args, resolve });
      }),
    []
  );

  const finalize = React.useCallback((ok: boolean) => {
    setPending(current => {
      current?.resolve(ok);
      return null;
    });
  }, []);

  const open = pending !== null;

  const ConfirmModal: React.FC = React.useCallback(() => {
    if (!pending) return null;
    const {
      title,
      body,
      danger,
      confirmLabel = danger ? "delete" : "confirm",
      cancelLabel = "cancel",
    } = pending;
    return (
      <Dialog
        open={open}
        onOpenChange={next => {
          if (!next) finalize(false);
        }}
      >
        <DialogContent animation="zoom" className="max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {body && <DialogDescription>{body}</DialogDescription>}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => finalize(false)}>
              {cancelLabel}
            </Button>
            <Button
              variant={danger ? "destructive" : "default"}
              onClick={() => finalize(true)}
              autoFocus
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [pending, open, finalize]);

  return { ConfirmModal, confirm };
}
