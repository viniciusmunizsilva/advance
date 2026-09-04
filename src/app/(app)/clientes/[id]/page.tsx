import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/ui/HistoryTimeline";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { QUOTE_STATUS, FINANCE_STATUS, MOLD_TYPE } from "@/lib/domain";
import { ClientActions } from "./ClientActions";

export default async function ClienteDetalhePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const [{ data: molds }, { data: quotes }, { data: receivables }, { data: logs }] =
    await Promise.all([
      supabase.from("molds").select("id, code, description, type, cavities").eq("client_id", id).order("code"),
      supabase.from("quotes").select("id, number, total, status, created_at, service_type").eq("client_id", id).order("created_at", { ascending: false }).limit(10),
      supabase.from("v_accounts_receivable").select("id, description, amount, due_date, effective_status").eq("client_id", id).order("due_date").limit(10),
      supabase.from("activity_logs").select("id, summary, action, actor_name, created_at").eq("entity_type", "client").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
    ]);

  const name = client.trade_name || client.legal_name;

  return (
    <div className="page">
      <PageHeader
        title={name}
        breadcrumb={[{ label: "Clientes", href: "/clientes" }, { label: name }]}
        subtitle={client.trade_name ? client.legal_name : undefined}
        actions={<ClientActions id={id} name={name} />}
      />

      <div className="detail-grid">
        <div className="stack">
          {/* Moldes */}
          <div className="card">
            <div className="card-head">
              <h3>Moldes</h3>
              <Link href={`/moldes/novo?client=${id}`} className="ch-link">+ Novo molde</Link>
            </div>
            {molds && molds.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr><th>Código</th><th>Descrição</th><th>Tipo</th><th className="right">Cav.</th></tr>
                  </thead>
                  <tbody>
                    {molds.map((m) => (
                      <tr key={m.id} className="clickable">
                        <td className="t-mono">
                          <Link href={`/moldes/${m.id}`} style={{ color: "inherit" }}>{m.code}</Link>
                        </td>
                        <td>{m.description || "—"}</td>
                        <td>{m.type ? MOLD_TYPE[m.type] : "—"}</td>
                        <td className="right t-mono">{m.cavities ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum molde cadastrado.</p></div>
            )}
          </div>

          {/* Orçamentos */}
          <div className="card">
            <div className="card-head">
              <h3>Orçamentos</h3>
              <Link href={`/orcamentos/novo?client=${id}`} className="ch-link">+ Novo orçamento</Link>
            </div>
            {quotes && quotes.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr><th>Nº</th><th>Data</th><th className="right">Valor</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {quotes.map((q) => {
                      const st = QUOTE_STATUS[q.status];
                      return (
                        <tr key={q.id} className="clickable">
                          <td className="t-mono">
                            <Link href={`/orcamentos/${q.id}`} style={{ color: "inherit" }}>#{q.number}</Link>
                          </td>
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

          {/* Contas a receber */}
          <div className="card">
            <div className="card-head"><h3>Contas a receber</h3></div>
            {receivables && receivables.length > 0 ? (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr><th>Descrição</th><th>Vencimento</th><th className="right">Valor</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {receivables.map((r) => {
                      const st = r.effective_status ? FINANCE_STATUS[r.effective_status] : FINANCE_STATUS.open;
                      return (
                        <tr key={r.id}>
                          <td>{r.description}</td>
                          <td className="t-mono">{fmtDate(r.due_date)}</td>
                          <td className="right val">{fmtBRLc(r.amount ?? 0)}</td>
                          <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhuma conta a receber.</p></div>
            )}
          </div>

          {/* Histórico */}
          <div className="card">
            <div className="card-head"><h3>Histórico</h3></div>
            <div className="card-body">
              <HistoryTimeline logs={logs ?? []} />
            </div>
          </div>
        </div>

        {/* Sidebar: dados do cliente */}
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Dados do cliente</h3></div>
            <div className="card-body">
              <dl className="dl">
                <dt>Razão social</dt><dd>{client.legal_name}</dd>
                {client.trade_name && (<><dt>Nome fantasia</dt><dd>{client.trade_name}</dd></>)}
                <dt>CNPJ / CPF</dt><dd className="mono">{client.document || "—"}</dd>
                <dt>Contato</dt><dd>{client.contact_name || "—"}</dd>
                <dt>Telefone</dt><dd className="mono">{client.phone || "—"}</dd>
                <dt>E-mail</dt><dd style={{ wordBreak: "break-all" }}>{client.email || "—"}</dd>
                <dt>Cidade</dt><dd>{client.city || "—"}</dd>
                {client.address && (<><dt>Endereço</dt><dd>{client.address}</dd></>)}
              </dl>
              {client.notes && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <div className="form-label">Observações</div>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-secondary)" }}>{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
