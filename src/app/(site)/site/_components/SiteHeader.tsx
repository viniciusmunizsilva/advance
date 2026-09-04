"use client";

import { useEffect, useState } from "react";
import { NAV_ITEMS, CTA_ORCAMENTO } from "../_data";
import { WhatsAppIcon } from "./icons";

export default function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Sticky com redução sutil de altura.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — destaca o link da seção em vista.
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`s-header${stuck ? " is-stuck" : ""}`}>
        <div className="s-header__row">
          <a href="#top" className="s-brand" aria-label="Advance Tecnologia — início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-advance-blue.png" alt="Advance Tecnologia" />
          </a>

          <nav className="s-nav" aria-label="Navegação principal">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`s-nav__link${active === n.href.slice(1) ? " is-active" : ""}`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="s-header__cta">
            <a href={CTA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--primary s-btn--sm">
              Solicitar orçamento
            </a>
            <button
              type="button"
              className={`s-burger${open ? " is-open" : ""}`}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div className={`s-mobile${open ? " is-open" : ""}`}>
        <nav aria-label="Navegação mobile">
          {NAV_ITEMS.map((n) => (
            <a key={n.href} href={n.href} className="m-link" onClick={() => setOpen(false)}>
              <span className="mi">{n.index}</span>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="s-mobile__cta">
          <a href={CTA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--primary" onClick={() => setOpen(false)}>
            <WhatsAppIcon /> Solicitar orçamento
          </a>
        </div>
      </div>
    </>
  );
}
