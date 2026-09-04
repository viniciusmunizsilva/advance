import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { ORDER_STATUS, type OrderStatus } from "@/lib/domain";

const TABS = [
  { key: "all", label: "Todos" },
  { key: "open", label: "Em aberto" },
  { key: "completed", label: "Concluídos" },
  { key: "cancelled", label: "Cancelados" },
];

type Row = {
  id: string;
  number: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  clients: { legal_name: string; trade_name: string | null } | null;
  quotes: { number: string } | null;
};

export default async function PedidosPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await props.searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("id, number, total, status, created_at, clients(legal_name, trade_name), quotes(number)")
    .eq("archived", false);
  if (status !== "all") query = query.eq("status", status as OrderStatus);

  const { data } = await query.order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="page">
      <PageHeader title="Pedidos" subtitle="Pedidos originados de orçamentos aprovados" />

      <div className="card">
        <div className="toolbar">
          <div className="seg">
            {TABS.map((t) => (
              <Link key={t.key} href={`/pedidos${t.key === "all" ? "" : `?status=${t.key}`}`} style={{ textDecoration: "none" }}>
                <button type="button" className={status === t.key ? "active" : ""} tabIndex={-1}>{t.label}</button>
              </Link>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={ClipboardList}
              title="Nenhum pedido"
              description="Aprove um orçamento para gerar um pedido automaticamente."
            />
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>Nº</th><th>Cliente</th><th>Orçamento</th><th className="right">Valor</th><th>Data</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rows.map((o) => {
                  const st = ORDER_STATUS[o.status];
                  const client = o.clients;
                  return (
                    <tr key={o.id} className="clickable">
                      <td className="t-mono t-primary"><Link href={`/pedidos/${o.id}`} style={{ color: "inherit" }}>Nº {o.number}</Link></td>
                      <td>{client ? client.trade_name || client.legal_name : "—"}</td>
                      <td className="t-mono">{o.quotes ? `#${o.quotes.number}` : "—"}</td>
                      <td className="right val">{fmtBRLc(o.total)}</td>
                      <td className="t-mono">{fmtDate(o.created_at)}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
