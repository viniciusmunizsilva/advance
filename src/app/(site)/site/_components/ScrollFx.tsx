"use client";

import { useEffect } from "react";

/** Reveal on scroll — anima elementos .reveal ao entrarem na viewport. */
export default function ScrollFx() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("#site .reveal"));
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
