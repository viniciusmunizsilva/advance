import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/ui/HistoryTimeline";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { QUOTE_STATUS, SERVICE_STATUS, MOLD_TYPE } from "@/lib/domain";
import { MoldActions } from "./MoldActions";

export default async function MoldeDetalhePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: mold } = await supabase
    .from("molds")
    .select("*, clients(id, legal_name, trade_name)")
    .eq("id", id)
    .single();
  if (!mold) notFound();

  const client = mold.clients as { id: string; legal_name: string; trade_name: string | null } | null;

  const [{ data: quotes }, { data: services }, { data: logs }] = await Promise.all([
    supabase.from("quotes").select("id, number, total, status, created_at").eq("mold_id", id).order("created_at", { ascending: false }).limit(10),
    supabase.from("services").select("id, title, status, expected_delivery_date").eq("mold_id", id).order("created_at", { ascending: false }).limit(10),
    supabase.from("activity_logs").select("id, summary, action, actor_name, created_at").eq("entity_type", "mold").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  const title = mold.description ? `${mold.code} · ${mold.description}` : mold.code;

  return (
    <div className="page">
      <PageHeader
        title={title}
        breadcrumb={[{ label: "Moldes", href: "/moldes" }, { label: mold.code }]}
        subtitle={client ? client.trade_name || client.legal_name : undefined}
        actions={<MoldActions id={id} code={mold.code} />}
      />

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <div className="card-head">
              <h3>Orçamentos</h3>
              <Link href={`/orcamentos/novo?client=${client?.id ?? ""}&mold=${id}`} className="ch-link">+ Novo orçamento</Link>
            </div>
            {quotes && quotes.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Nº</th><th>Data</th><th className="right">Valor</th><th>Status</th></tr></thead>
                  <tbody>
                    {quotes.map((q) => {
                      const st = QUOTE_STATUS[q.status];
                      return (
                        <tr key={q.id} className="clickable">
                          <td className="t-mono"><Link href={`/orcamentos/${q.id}`} style={{ color: "inherit" }}>#{q.number}</Link></td>
                          <td className="t-mono">{fmtDate(q.created_at)}</td>
                          <td className="right val">{q.status === "draft" ? "—" : fmtBRLc(q.total)}</td>
                          <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum orçamento.</p></div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h3>Serviços</h3></div>
            {services && services.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Serviço</th><th>Entrega prevista</th><th>Status</th></tr></thead>
                  <tbody>
                    {services.map((s) => {
                      const st = SERVICE_STATUS[s.status];
                      return (
                        <tr key={s.id} className="clickable">
                          <td><Link href={`/servicos/${s.id}`} style={{ color: "inherit" }}>{s.title}</Link></td>
                          <td className="t-mono">{fmtDate(s.expected_delivery_date)}</td>
                          <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum serviço.</p></div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h3>Histórico</h3></div>
            <div className="card-body"><HistoryTimeline logs={logs ?? []} /></div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Dados do molde</h3></div>
            <div className="card-body">
              <dl className="dl">
                <dt>Código</dt><dd className="mono">{mold.code}</dd>
                <dt>Descrição</dt><dd>{mold.description || "—"}</dd>
                {mold.name && (<><dt>Nome</dt><dd>{mold.name}</dd></>)}
                <dt>Cliente</dt>
                <dd>{client ? <Link href={`/clientes/${client.id}`}>{client.trade_name || client.legal_name}</Link> : "—"}</dd>
                <dt>Tipo</dt><dd>{mold.type ? MOLD_TYPE[mold.type] : "—"}</dd>
                <dt>Cavidades</dt><dd className="mono">{mold.cavities ?? "—"}</dd>
                <dt>Aplicação</dt><dd>{mold.application || "—"}</dd>
              </dl>
              {mold.notes && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <div className="form-label">Observações</div>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-secondary)" }}>{mold.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
