import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/ui/HistoryTimeline";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { QUOTE_STATUS, SERVICE_TYPE } from "@/lib/domain";
import { QuoteActions } from "./QuoteActions";
import { ShareLink } from "./ShareLink";

export default async function OrcamentoDetalhePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(id, legal_name, trade_name, document, city, contact_name), molds(id, code, description, cavities)")
    .eq("id", id)
    .single();
  if (!quote) notFound();

  const [{ data: items }, { data: service }, { data: logs }] = await Promise.all([
    supabase.from("quote_items").select("*").eq("quote_id", id).order("sort_order"),
    supabase.from("services").select("id").eq("quote_id", id).maybeSingle(),
    supabase.from("activity_logs").select("id, summary, action, actor_name, created_at").eq("entity_type", "quote").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const shareUrl = `${proto}://${host}/proposta/${quote.share_token}`;

  const client = quote.clients as { id: string; legal_name: string; trade_name: string | null; document: string | null; city: string | null; contact_name: string | null } | null;
  const mold = quote.molds as { id: string; code: string; description: string | null; cavities: number | null } | null;
  const st = QUOTE_STATUS[quote.status];
  const hasService = !!service;

  // progresso
  const notDraft = quote.status !== "draft";
  const isApproved = quote.status === "approved";
  const nodes = [
    { label: "Criado", done: true, current: quote.status === "draft" },
    { label: "Enviado", done: notDraft, current: quote.status === "sent" },
    { label: "Aprovado", done: isApproved, current: isApproved && !hasService },
    { label: "Serviço criado", done: hasService, current: false },
  ];

  const subLabel = [
    client ? client.trade_name || client.legal_name : null,
    mold ? mold.code : null,
    quote.service_type ? SERVICE_TYPE[quote.service_type] : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="page">
      <PageHeader
        title={`Orçamento #${quote.number}`}
        breadcrumb={[{ label: "Orçamentos", href: "/orcamentos" }, { label: `#${quote.number}` }]}
        subtitle={subLabel || undefined}
        actions={<QuoteActions id={id} status={quote.status} hasService={hasService} archived={quote.archived} />}
      />
      <div style={{ marginTop: -14, marginBottom: 22 }}>
        <span className={`badge ${st.cls}`}>{st.label}</span>
      </div>

      <div className="detail-grid">
        <div className="stack">
          {/* Itens + resumo */}
          <div className="card">
            <div className="card-head"><h3>Itens do orçamento</h3></div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th className="right">Qtd</th>
                    <th className="right">Valor unit.</th>
                    <th className="right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(items ?? []).map((it) => (
                    <tr key={it.id}>
                      <td>{it.description}</td>
                      <td className="right t-mono">{it.quantity}</td>
                      <td className="right t-mono">{fmtBRLc(it.unit_price)}</td>
                      <td className="right val">{fmtBRLc(it.total)}</td>
                    </tr>
                  ))}
                  {(!items || items.length === 0) && (
                    <tr><td colSpan={4}><p className="hint" style={{ margin: 0 }}>Sem itens.</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-body" style={{ borderTop: "1px solid var(--border)" }}>
              <div style={{ maxWidth: 320, marginLeft: "auto" }}>
                <div className="sum-row"><span>Subtotal</span><span className="num">{fmtBRLc(quote.subtotal)}</span></div>
                <div className="sum-row"><span>Desconto</span><span className="num">− {fmtBRLc(quote.discount)}</span></div>
                <div className="sum-row tot"><span>TOTAL</span><span className="num">{fmtBRLc(quote.total)}</span></div>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div className="card">
              <div className="card-head"><h3>Observações</h3></div>
              <div className="card-body">
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{quote.notes}</p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head"><h3>Histórico</h3></div>
            <div className="card-body"><HistoryTimeline logs={logs ?? []} /></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="stack">
          <ShareLink url={shareUrl} number={quote.number} />

          <div className="card">
            <div className="card-head"><h3>Progresso</h3></div>
            <div className="card-body">
              <div className="timeline">
                {nodes.map((n, i) => (
                  <div key={i} className={`tl-item${n.done ? " done" : ""}${n.current ? " current" : ""}`}>
                    <div className="tl-title" style={{ color: n.done || n.current ? undefined : "var(--text-tertiary)" }}>{n.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Cliente</h3></div>
            <div className="card-body">
              <dl className="dl">
                <dt>Nome</dt>
                <dd>{client ? <Link href={`/clientes/${client.id}`}>{client.trade_name || client.legal_name}</Link> : "—"}</dd>
                <dt>CNPJ</dt><dd className="mono">{client?.document || "—"}</dd>
                <dt>Contato</dt><dd>{client?.contact_name || "—"}</dd>
                <dt>Cidade</dt><dd>{client?.city || "—"}</dd>
              </dl>
            </div>
          </div>

          {mold && (
            <div className="card">
              <div className="card-head"><h3>Molde</h3></div>
              <div className="card-body">
                <dl className="dl">
                  <dt>Código</dt><dd><Link href={`/moldes/${mold.id}`} className="mono">{mold.code}</Link></dd>
                  <dt>Descrição</dt><dd>{mold.description || "—"}</dd>
                  <dt>Cavidades</dt><dd className="mono">{mold.cavities ?? "—"}</dd>
                </dl>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head"><h3>Condições</h3></div>
            <div className="card-body">
              <dl className="dl">
                <dt>Prazo</dt><dd>{quote.deadline || "—"}</dd>
                <dt>Validade</dt><dd className="mono">{fmtDate(quote.validity_date)}</dd>
                <dt>Pagamento</dt><dd style={{ textAlign: "right" }}>{quote.payment_terms || "—"}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
