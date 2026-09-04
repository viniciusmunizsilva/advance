"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, RefreshCw, Printer, Send, Wrench, Pencil, ChevronDown, FileText } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { QUOTE_STATUS, type QuoteStatus } from "@/lib/domain";
import { duplicateQuoteAction, changeQuoteStatusAction } from "../actions";

const STATUSES: QuoteStatus[] = ["draft", "sent", "approved", "rejected", "expired", "cancelled"];

export function QuoteActions({
  id,
  status,
  hasService,
}: {
  id: string;
  status: QuoteStatus;
  hasService: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function duplicate() {
    startTransition(async () => {
      const r = await duplicateQuoteAction(id);
      if (!r.ok) return toast(r.error, "error");
      toast("Orçamento duplicado.");
      router.push(`/orcamentos/${r.data.id}/editar`);
      router.refresh();
    });
  }

  function setStatus(s: QuoteStatus) {
    setMenuOpen(false);
    startTransition(async () => {
      const r = await changeQuoteStatusAction(id, s);
      if (!r.ok) return toast(r.error, "error");
      toast(`Status: ${QUOTE_STATUS[s].label}.`);
      router.refresh();
    });
  }

  return (
    <>
      <Link href={`/orcamentos/${id}/editar`} className="btn btn-secondary">
        <Pencil aria-hidden /> <span>Editar</span>
      </Link>
      <button className="btn btn-secondary" onClick={duplicate} disabled={pending}>
        <Copy aria-hidden /> <span>Duplicar</span>
      </button>

      <div ref={ref} style={{ position: "relative" }}>
        <button className="btn btn-secondary" onClick={() => setMenuOpen((v) => !v)} disabled={pending} aria-haspopup="menu" aria-expanded={menuOpen}>
          <RefreshCw aria-hidden /> <span>Alterar status</span> <ChevronDown aria-hidden />
        </button>
        {menuOpen && (
          <div role="menu" className="card" style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 200, zIndex: 40, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
            {STATUSES.map((s) => (
              <button key={s} role="menuitem" className="sb-item" style={{ borderRadius: 0, padding: "10px 14px" }} onClick={() => setStatus(s)} disabled={s === status}>
                <span className={`badge ${QUOTE_STATUS[s].cls}`}>{QUOTE_STATUS[s].label}</span>
                {s === status && <span className="hint" style={{ marginLeft: "auto" }}>atual</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <Link href={`/orcamentos/${id}/documento`} className="btn btn-secondary">
        <FileText aria-hidden /> <span>Ver documento</span>
      </Link>
      <Link href={`/orcamentos/${id}/pdf`} target="_blank" className="btn btn-secondary">
        <Printer aria-hidden /> <span>Gerar PDF</span>
      </Link>

      {status === "approved" ? (
        hasService ? (
          <span className="badge success" style={{ height: 38, padding: "0 12px" }}>
            <Wrench aria-hidden style={{ width: 15 }} /> Serviço criado
          </span>
        ) : (
          <Link href={`/servicos/novo?quote=${id}`} className="btn btn-primary">
            <Wrench aria-hidden /> <span>Criar serviço</span>
          </Link>
        )
      ) : (
        <button className="btn btn-primary" onClick={() => setStatus("sent")} disabled={pending || status === "sent"}>
          <Send aria-hidden /> <span>Enviar</span>
        </button>
      )}
    </>
  );
}
