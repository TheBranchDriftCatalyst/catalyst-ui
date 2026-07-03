/**
 * GeneratedImageCard — a single generated image with metadata + click-to-zoom.
 *
 * Source resolution (in priority order):
 *   1. ``blobSha`` — content-addressed reference into the operator's
 *      image store. We render ``<img src="/api/inference/images/blobs/
 *      {sha}.png">``. The endpoint returns Cache-Control: immutable so
 *      the browser caches forever and re-rendering the same chat thread
 *      costs no network round-trips. Preferred whenever available.
 *   2. ``b64`` — inline base64-encoded PNG bytes. Used for back-compat
 *      with chat history rows persisted before the blob_sha rail
 *      existed, and as a fallback when the image-store persist failed.
 *
 * Exactly one of ``blobSha`` / ``b64`` should be set per render. Both
 * is treated as "blobSha wins"; neither renders an empty placeholder.
 *
 * Clicking the image opens it full-size in a backdropped modal; the
 * modal is portal-rendered into document.body so it escapes any
 * overflow:hidden parent. Esc and backdrop-click close it.
 *
 * Designed for SDK consumers (operator's /images page, chat inline
 * attachment view). Metadata fields are all optional so the card
 * degrades gracefully when only the bytes are known.
 */
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Download, Maximize2, X } from "lucide-react";
import { cn } from "../shared/utils.js";

export interface GeneratedImageCardProps {
  /**
   * Base64-encoded PNG bytes (no `data:` prefix). Use when there's no
   * persisted blob to reference. ``blobSha`` is preferred when both
   * are available.
   */
  b64?: string;
  /**
   * Content-addressed reference into the operator's image-blob store.
   * Resolved to ``/api/inference/images/blobs/{sha}.png``. Whenever
   * possible callers should pass this instead of ``b64`` — the URL is
   * immutable + browser-cacheable, so reloading the chat or revisiting
   * a past thread is a free re-render.
   */
  blobSha?: string;
  /** Title rendered above the image (model id, prompt id, etc.). */
  title?: ReactNode;
  /** Free-form metadata rendered as a faint right-aligned line. */
  metadata?: ReactNode;
  /** Optional prompt text rendered below the image, line-clamped. */
  prompt?: string;
  /** Filename to suggest when the user clicks the download button. */
  downloadName?: string;
  /** Click handler for the card body (overrides default zoom-modal). */
  onClick?: () => void;
  /** Extra class names on the outer card. */
  className?: string;
}

/** Base path for the operator's content-addressed blob endpoint.
 *  Hoisted so it's testable + overridable if the SDK ever ends up on a
 *  different mount point. */
const BLOB_URL_BASE = "/api/inference/images/blobs";

function resolveSrc(blobSha?: string, b64?: string): string | null {
  if (blobSha) return `${BLOB_URL_BASE}/${blobSha}.png`;
  if (b64) return `data:image/png;base64,${b64}`;
  return null;
}

export function GeneratedImageCard({
  b64,
  blobSha,
  title,
  metadata,
  prompt,
  downloadName,
  onClick,
  className,
}: GeneratedImageCardProps) {
  const [zoomed, setZoomed] = useState(false);
  const dataUrl = resolveSrc(blobSha, b64);

  const handleClick = () => {
    if (!dataUrl) return;
    if (onClick) onClick();
    else setZoomed(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = downloadName || (blobSha ? `${blobSha}.png` : "generated.png");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!dataUrl) {
    // Neither blob_sha nor b64 — nothing to render.
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border border-border bg-card aspect-square text-xs text-muted-foreground italic",
          className
        )}
      >
        no image source
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col rounded-md border border-border bg-card overflow-hidden group",
          "transition-shadow hover:shadow-lg",
          className
        )}
      >
        <button
          type="button"
          onClick={handleClick}
          className="relative block w-full aspect-square bg-black/40 cursor-zoom-in"
        >
          <img
            src={dataUrl}
            alt={typeof title === "string" ? title : "generated image"}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              onClick={handleDownload}
              role="button"
              tabIndex={0}
              aria-label="download"
              className="p-1 rounded bg-black/50 hover:bg-black/70 text-white"
            >
              <Download size={12} />
            </span>
            <span
              className="p-1 rounded bg-black/50 hover:bg-black/70 text-white"
              aria-label="zoom"
            >
              <Maximize2 size={12} />
            </span>
          </div>
        </button>
        {(title || metadata) && (
          <div className="flex items-baseline justify-between gap-2 px-2.5 py-1.5 text-xs">
            {title && <span className="font-medium text-foreground truncate">{title}</span>}
            {metadata && (
              <span className="text-muted-foreground tabular-nums shrink-0">{metadata}</span>
            )}
          </div>
        )}
        {prompt && (
          <div className="px-2.5 pb-2 text-[11px] text-muted-foreground line-clamp-2 leading-snug">
            {prompt}
          </div>
        )}
      </div>

      {zoomed && dataUrl && <ZoomModal dataUrl={dataUrl} onClose={() => setZoomed(false)} />}
    </>
  );
}

function ZoomModal({ dataUrl, onClose }: { dataUrl: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 p-2 rounded bg-black/40 hover:bg-black/70 text-white"
        aria-label="close"
        onClick={onClose}
      >
        <X size={16} />
      </button>
      <img
        src={dataUrl}
        alt="zoomed"
        className="max-w-full max-h-full object-contain"
        onClick={e => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}
