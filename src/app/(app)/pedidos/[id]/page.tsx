import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/ui/HistoryTimeline";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { ORDER_STATUS, FINANCE_STATUS } from "@/lib/domain";
import { OrderActions } from "./OrderActions";

const TODAY = () => new Date().toISOString().slice(0, 10);

export default async function PedidoDetalhePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, clients(id, legal_name, trade_name), molds(id, code, description), quotes(id, number)")
    .eq("id", id)
    .single();
  if (!order) notFound();

  const [{ data: receivablesRaw }, { data: logs }] = await Promise.all([
    supabase.from("accounts_receivable").select("id, description, amount, due_date, status").eq("order_id", id).order("due_date"),
    supabase.from("activity_logs").select("id, summary, action, actor_name, created_at").eq("entity_type", "order").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
  ]);
  const today = TODAY();
  const receivables = (receivablesRaw ?? []).map((r) => ({
    ...r,
    effective_status:
      r.status === "open" && r.due_date < today ? ("overdue" as const) : r.status,
  }));

  const client = order.clients as { id: string; legal_name: string; trade_name: string | null } | null;
  const mold = order.molds as { id: string; code: string; description: string | null } | null;
  const quote = order.quotes as { id: string; number: string } | null;
  const st = ORDER_STATUS[order.status];

  return (
    <div className="page">
      <PageHeader
        title={`Pedido Nº ${order.number}`}
        breadcrumb={[{ label: "Pedidos", href: "/pedidos" }, { label: `Nº ${order.number}` }]}
        subtitle={client ? client.trade_name || client.legal_name : undefined}
        actions={<OrderActions id={id} number={order.number} status={order.status} archived={order.archived} />}
      />
      <div style={{ marginTop: -14, marginBottom: 22, display: "flex", gap: 8, alignItems: "center" }}>
        <span className={`badge ${st.cls}`}>{st.label}</span>
        {order.archived && <span className="badge neutral">Arquivado</span>}
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Financeiro do pedido</h3><Link href="/a-receber" className="ch-link">A receber</Link></div>
            {receivables && receivables.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Descrição</th><th>Vencimento</th><th className="right">Valor</th><th>Status</th></tr></thead>
                  <tbody>
                    {receivables.map((r) => {
                      const fst = FINANCE_STATUS[r.effective_status];
                      return (
                        <tr key={r.id} className="clickable">
                          <td><Link href={`/a-receber/${r.id}/editar`} style={{ color: "inherit" }}>{r.description}</Link></td>
                          <td className="t-mono">{fmtDate(r.due_date)}</td>
                          <td className="right val">{fmtBRLc(r.amount ?? 0)}</td>
                          <td><span className={`badge ${fst.cls}`}>{fst.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Sem contas vinculadas.</p></div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h3>Histórico</h3></div>
            <div className="card-body"><HistoryTimeline logs={logs ?? []} /></div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Dados do pedido</h3></div>
            <div className="card-body">
              <dl className="dl">
                <dt>Número</dt><dd className="mono">Nº {order.number}</dd>
                <dt>Cliente</dt>
                <dd>{client ? <Link href={`/clientes/${client.id}`}>{client.trade_name || client.legal_name}</Link> : "—"}</dd>
                <dt>Molde</dt>
                <dd>{mold ? <Link href={`/moldes/${mold.id}`} className="mono">{mold.code}</Link> : "—"}</dd>
                <dt>Orçamento</dt>
                <dd>{quote ? <Link href={`/orcamentos/${quote.id}`} className="mono">#{quote.number}</Link> : "—"}</dd>
                <dt>Valor</dt><dd className="mono">{fmtBRLc(order.total)}</dd>
                <dt>Criado</dt><dd className="mono">{fmtDate(order.created_at)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
