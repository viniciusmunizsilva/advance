"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GALLERY } from "../_data";

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (dir: number) =>
      setIndex((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.classList.add("s-lb-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.classList.remove("s-lb-open");
    };
  }, [open, close, go]);

  const current = index !== null ? GALLERY[index] : null;

  return (
    <>
      <div className="s-gal__grid">
        {GALLERY.map((img, i) => (
          <button
            type="button"
            key={img.src}
            className={`s-gal__item ${img.span} reveal`}
            onClick={() => setIndex(i)}
            aria-label={`Ampliar imagem: ${img.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            <span className="s-gal__plus" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {open && current && typeof document !== "undefined" && createPortal(
        <div
        className={`s-lb${open ? " is-open" : ""}`}
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-label="Galeria de projetos"
      >
        {current && (
          <>
            <button type="button" className="s-lb__btn" aria-label="Fechar" onClick={close}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="s-lb__nav prev"
              aria-label="Anterior"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="s-lb__img"
              src={current.src}
              alt={current.alt}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="s-lb__nav next"
              aria-label="Próxima"
              onClick={(e) => { e.stopPropagation(); go(1); }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="s-lb__count">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
            </div>
          </>
        )}
        </div>,
        document.body,
      )}
    </>
  );
}
