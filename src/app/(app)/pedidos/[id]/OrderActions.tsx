"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ChevronDown, Archive, ArchiveRestore } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { ORDER_STATUS, type OrderStatus } from "@/lib/domain";
import { setOrderStatusAction, archiveOrderAction } from "../actions";

const STATUSES = Object.keys(ORDER_STATUS) as OrderStatus[];

export function OrderActions({
  id,
  number,
  status,
  archived,
}: {
  id: string;
  number: string;
  status: OrderStatus;
  archived: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function setStatus(s: OrderStatus) {
    setMenuOpen(false);
    startTransition(async () => {
      const r = await setOrderStatusAction(id, s);
      if (!r.ok) return toast(r.error, "error");
      toast(`Status: ${ORDER_STATUS[s].label}.`);
      router.refresh();
    });
  }

  function toggleArchive() {
    startTransition(async () => {
      const r = await archiveOrderAction(id, !archived);
      if (!r.ok) { toast(r.error, "error"); setConfirming(false); return; }
      toast(archived ? "Pedido desarquivado." : "Pedido arquivado.");
      if (!archived) router.push("/pedidos");
      router.refresh();
    });
  }

  return (
    <>
      <div ref={ref} style={{ position: "relative" }}>
        <button className="btn btn-secondary" onClick={() => setMenuOpen((v) => !v)} disabled={pending} aria-haspopup="menu" aria-expanded={menuOpen}>
          <RefreshCw aria-hidden /> <span>Alterar status</span> <ChevronDown aria-hidden />
        </button>
        {menuOpen && (
          <div role="menu" className="card" style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 210, zIndex: 40, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
            {STATUSES.map((s) => (
              <button key={s} role="menuitem" className="sb-item" style={{ borderRadius: 0, padding: "10px 14px" }} onClick={() => setStatus(s)} disabled={s === status}>
                <span className={`badge ${ORDER_STATUS[s].cls}`}>{ORDER_STATUS[s].label}</span>
                {s === status && <span className="hint" style={{ marginLeft: "auto" }}>atual</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-secondary" onClick={() => (archived ? toggleArchive() : setConfirming(true))} disabled={pending}>
        {archived ? <ArchiveRestore aria-hidden /> : <Archive aria-hidden />}
        <span>{archived ? "Desarquivar" : "Arquivar"}</span>
      </button>

      <ConfirmDialog
        open={confirming}
        title="Arquivar pedido"
        description={`Arquivar o Pedido Nº ${number}? Ele sai das telas principais e do financeiro, mas não é excluído — fica em Arquivados.`}
        confirmLabel="Arquivar"
        pending={pending}
        onConfirm={toggleArchive}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
