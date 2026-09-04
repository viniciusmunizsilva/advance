"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, RefreshCw, ChevronDown } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { SERVICE_STATUS, type ServiceStatus } from "@/lib/domain";
import { changeServiceStatusAction, deleteServiceAction } from "../actions";

const STATUSES = Object.keys(SERVICE_STATUS) as ServiceStatus[];

export function ServiceActions({
  id,
  title,
  status,
}: {
  id: string;
  title: string;
  status: ServiceStatus;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function setStatus(s: ServiceStatus) {
    setMenuOpen(false);
    startTransition(async () => {
      const r = await changeServiceStatusAction(id, s);
      if (!r.ok) return toast(r.error, "error");
      toast(`Status: ${SERVICE_STATUS[s].label}.`);
      router.refresh();
    });
  }

  function onDelete() {
    startTransition(async () => {
      const r = await deleteServiceAction(id);
      if (!r.ok) { toast(r.error, "error"); setConfirming(false); return; }
      toast("Serviço excluído.");
      router.push("/servicos");
      router.refresh();
    });
  }

  return (
    <>
      <Link href={`/servicos/${id}/editar`} className="btn btn-secondary">
        <Pencil aria-hidden /> <span>Editar</span>
      </Link>
      <div ref={ref} style={{ position: "relative" }}>
        <button className="btn btn-secondary" onClick={() => setMenuOpen((v) => !v)} disabled={pending} aria-haspopup="menu" aria-expanded={menuOpen}>
          <RefreshCw aria-hidden /> <span>Alterar status</span> <ChevronDown aria-hidden />
        </button>
        {menuOpen && (
          <div role="menu" className="card" style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 210, zIndex: 40, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
            {STATUSES.map((s) => (
              <button key={s} role="menuitem" className="sb-item" style={{ borderRadius: 0, padding: "10px 14px" }} onClick={() => setStatus(s)} disabled={s === status}>
                <span className={`badge ${SERVICE_STATUS[s].cls}`}>{SERVICE_STATUS[s].label}</span>
                {s === status && <span className="hint" style={{ marginLeft: "auto" }}>atual</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="btn btn-danger" onClick={() => setConfirming(true)} disabled={pending}>
        <Trash2 aria-hidden /> <span>Excluir</span>
      </button>
      <ConfirmDialog
        open={confirming}
        title="Excluir serviço"
        description={`Excluir "${title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        pending={pending}
        onConfirm={onDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
