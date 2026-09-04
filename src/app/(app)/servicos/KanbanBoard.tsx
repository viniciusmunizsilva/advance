"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { fmtDate } from "@/lib/format";
import { SERVICE_STATUS, SERVICE_KANBAN_ORDER, type ServiceStatus } from "@/lib/domain";
import { changeServiceStatusAction } from "./actions";

export type KanbanCard = {
  id: string;
  title: string;
  status: ServiceStatus;
  clientLabel: string;
  moldCode: string | null;
  expected_delivery_date: string | null;
};

function isOverdue(card: KanbanCard) {
  if (!card.expected_delivery_date) return false;
  if (card.status === "completed" || card.status === "delivered" || card.status === "cancelled") return false;
  return card.expected_delivery_date < new Date().toISOString().slice(0, 10);
}

export function KanbanBoard({ initial }: { initial: KanbanCard[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [cards, setCards] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<ServiceStatus | null>(null);

  function onDrop(status: ServiceStatus) {
    setOverCol(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.status === status) return;

    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    changeServiceStatusAction(id, status).then((r) => {
      if (!r.ok) {
        toast(r.error, "error");
        setCards((cs) => cs.map((c) => (c.id === id ? { ...c, status: card.status } : c)));
        return;
      }
      toast(`Movido para ${SERVICE_STATUS[status].label}.`);
      router.refresh();
    });
  }

  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "flex-start" }}>
      {SERVICE_KANBAN_ORDER.map((status) => {
        const colCards = cards.filter((c) => c.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => { e.preventDefault(); setOverCol(status); }}
            onDragLeave={() => setOverCol((s) => (s === status ? null : s))}
            onDrop={() => onDrop(status)}
            style={{
              flex: "0 0 264px",
              width: 264,
              background: overCol === status ? "var(--primary-50)" : "var(--neutral-100)",
              borderRadius: "var(--radius-lg)",
              padding: 10,
              transition: "background .12s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 10px" }}>
              <span className={`badge ${SERVICE_STATUS[status].cls}`}>{SERVICE_STATUS[status].label}</span>
              <span className="hint" style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>{colCards.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 40 }}>
              {colCards.map((card) => {
                const overdue = isOverdue(card);
                return (
                  <Link
                    key={card.id}
                    href={`/servicos/${card.id}`}
                    draggable
                    onDragStart={() => setDragId(card.id)}
                    onDragEnd={() => setDragId(null)}
                    className="card"
                    style={{ display: "block", padding: 12, cursor: "grab", boxShadow: "var(--shadow-xs)", color: "inherit" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{card.title}</div>
                    <div className="hint" style={{ marginBottom: card.moldCode || card.expected_delivery_date ? 6 : 0 }}>
                      {card.clientLabel}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {card.moldCode && <span className="mini-code">{card.moldCode}</span>}
                      {card.expected_delivery_date && (
                        <span className="hint" style={{ marginLeft: "auto", color: overdue ? "var(--error)" : undefined, fontFamily: "var(--font-mono)" }}>
                          {fmtDate(card.expected_delivery_date)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
