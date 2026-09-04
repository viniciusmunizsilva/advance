"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Users, Box, Wrench, CornerDownLeft } from "lucide-react";
import type { SearchResult } from "@/app/api/search/route";

const GROUP_ICON = {
  Orçamentos: FileText,
  Clientes: Users,
  Moldes: Box,
  Serviços: Wrench,
} as const;

const GROUP_ORDER: SearchResult["group"][] = ["Orçamentos", "Clientes", "Moldes", "Serviços"];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    const t = setTimeout(() => el?.focus(), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const q = query.trim();
    const t = setTimeout(async () => {
      if (q.length < 1) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setResults(json.results ?? []);
        setActive(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const go = useCallback(
    (r: SearchResult) => {
      onClose();
      router.push(r.href);
    },
    [onClose, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (results[active]) go(results[active]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  }

  const grouped = GROUP_ORDER.map((g) => ({ group: g, items: results.filter((r) => r.group === g) })).filter((x) => x.items.length > 0);
  let flatIndex = -1;

  return (
    <div className="overlay open" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="cmdk-input">
          <Search aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar clientes, moldes, orçamentos, serviços…"
            aria-label="Busca global"
          />
        </div>
        <div className="cmdk-results">
          {query.trim().length === 0 ? (
            <div className="cmdk-group-label">Digite para buscar</div>
          ) : loading && results.length === 0 ? (
            <div className="cmdk-group-label">Buscando…</div>
          ) : results.length === 0 ? (
            <div className="cmdk-group-label">Nenhum resultado para “{query}”</div>
          ) : (
            grouped.map(({ group, items }) => {
              const Icon = GROUP_ICON[group];
              return (
                <div key={group}>
                  <div className="cmdk-group-label">{group}</div>
                  {items.map((r) => {
                    flatIndex++;
                    const idx = flatIndex;
                    return (
                      <div
                        key={r.id}
                        className={`cmdk-item${idx === active ? " sel" : ""}`}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(r)}
                      >
                        <span className="ci-ico"><Icon aria-hidden /></span>
                        <div style={{ minWidth: 0 }}>
                          <div className="ci-title">{r.title}</div>
                          {r.subtitle && <div className="ci-sub">{r.subtitle}</div>}
                        </div>
                        {idx === active && <CornerDownLeft aria-hidden style={{ marginLeft: "auto", width: 15, color: "var(--text-tertiary)" }} />}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
        <div className="cmdk-foot">
          <span><span className="kbd">↑↓</span> navegar</span>
          <span><span className="kbd">↵</span> abrir</span>
          <span><span className="kbd">esc</span> fechar</span>
        </div>
      </div>
    </div>
  );
}
