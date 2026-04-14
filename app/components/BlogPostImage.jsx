"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

export function BlogPostImage({ src = "", alt = "", title = "" }) {
  const [open, setOpen] = useState(false);

  const openLightbox = useCallback(() => setOpen(true), []);
  const closeLightbox = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeLightbox]);

  const lightbox =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--lightbox-scrim)] p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-label={alt || "Image preview"}
        onClick={closeLightbox}
      >
        <button
          type="button"
          onClick={closeLightbox}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--lightbox-fg)] transition hover:bg-[var(--lightbox-close-hover-bg)] hover:text-[var(--lightbox-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lightbox-ring)]"
          aria-label="Close preview"
        >
          <MdClose className="h-6 w-6" aria-hidden />
        </button>
        <div
          className="relative mx-auto flex w-fit max-w-[min(96vw,1200px)] flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[min(85vh,860px)] w-auto max-w-full object-contain shadow-2xl"
            decoding="async"
          />
          {title ? (
            <p className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--lightbox-fg-muted)]">{title}</p>
          ) : null}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <figure className="my-8">
        <button
          type="button"
          onClick={openLightbox}
          className="group relative block w-full cursor-zoom-in overflow-hidden border border-[var(--border)] bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          aria-label={alt ? `Open larger view: ${alt}` : "Open larger image view"}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-cover transition duration-200 group-hover:opacity-[0.97]"
          />
        </button>
        {title ? (
          <figcaption className="mt-0">
            <button
              type="button"
              onClick={openLightbox}
              className="mt-3 w-full cursor-zoom-in border-t border-[var(--border)] bg-transparent pt-3 text-center text-[0.7rem] italic leading-relaxed !text-[var(--link)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link)] focus-visible:ring-offset-2"
            >
              {title}
            </button>
          </figcaption>
        ) : null}
      </figure>
      {lightbox}
    </>
  );
}
