"use client";

import { useRef, useState, useEffect } from "react";

const PAGE_PX = 794; // 210mm @ ~96dpi

/** Escala o documento A4 para caber na largura disponível (mobile-first). */
export function FitToWidth({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setZoom(Math.min(1, w / PAGE_PX));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <div className="fit-doc" style={{ zoom, margin: "0 auto", width: PAGE_PX }}>
        {children}
      </div>
    </div>
  );
}
