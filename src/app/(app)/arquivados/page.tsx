import Link from "next/link";
import { Archive } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { QUOTE_STATUS, ORDER_STATUS, type QuoteStatus, type OrderStatus } from "@/lib/domain";

export default async function ArquivadosPage() {
  const supabase = await createClient();

  const [{ data: quotes }, { data: orders }] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, number, total, status, created_at, clients(legal_name, trade_name)")
      .eq("archived", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, number, total, status, created_at, clients(legal_name, trade_name)")
      .eq("archived", true)
      .order("created_at", { ascending: false }),
  ]);

  const q = (quotes ?? []) as unknown as {
    id: string; number: string; total: number; status: QuoteStatus; created_at: string;
    clients: { legal_name: string; trade_name: string | null } | null;
  }[];
  const o = (orders ?? []) as unknown as {
    id: string; number: string; total: number; status: OrderStatus; created_at: string;
    clients: { legal_name: string; trade_name: string | null } | null;
  }[];

  const cname = (c: { legal_name: string; trade_name: string | null } | null) =>
    c ? c.trade_name || c.legal_name : "—";

  return (
    <div className="page">
      <PageHeader
        title="Arquivados"
        subtitle="Orçamentos e pedidos arquivados — preservados, fora das telas principais e do financeiro"
      />

      {q.length === 0 && o.length === 0 ? (
        <div className="card"><div style={{ padding: 20 }}>
          <EmptyState icon={Archive} title="Nada arquivado" description="Itens que você arquivar aparecem aqui." />
        </div></div>
      ) : (
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Orçamentos arquivados</h3></div>
            {q.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Nº</th><th>Cliente</th><th className="right">Valor</th><th>Data</th><th>Status</th></tr></thead>
                  <tbody>
                    {q.map((row) => {
                      const st = QUOTE_STATUS[row.status];
                      return (
                        <tr key={row.id} className="clickable">
                          <td className="t-mono"><Link href={`/orcamentos/${row.id}`} style={{ color: "inherit" }}>#{row.number}</Link></td>
                          <td>{cname(row.clients)}</td>
                          <td className="right val">{fmtBRLc(row.total)}</td>
                          <td className="t-mono">{fmtDate(row.created_at)}</td>
                          <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum orçamento arquivado.</p></div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h3>Pedidos arquivados</h3></div>
            {o.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Nº</th><th>Cliente</th><th className="right">Valor</th><th>Data</th><th>Status</th></tr></thead>
                  <tbody>
                    {o.map((row) => {
                      const st = ORDER_STATUS[row.status];
                      return (
                        <tr key={row.id} className="clickable">
                          <td className="t-mono"><Link href={`/pedidos/${row.id}`} style={{ color: "inherit" }}>Nº {row.number}</Link></td>
                          <td>{cname(row.clients)}</td>
                          <td className="right val">{fmtBRLc(row.total)}</td>
                          <td className="t-mono">{fmtDate(row.created_at)}</td>
                          <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum pedido arquivado.</p></div>
            )}
          </div>

          <p className="hint">Abra um item e use “Desarquivar” para trazê-lo de volta.</p>
        </div>
      )}
    </div>
  );
}
