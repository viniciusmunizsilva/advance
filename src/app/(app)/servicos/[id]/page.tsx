import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/ui/HistoryTimeline";
import { fmtDate } from "@/lib/format";
import { SERVICE_STATUS, SERVICE_TYPE } from "@/lib/domain";
import { ServiceActions } from "./ServiceActions";

export default async function ServicoDetalhePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*, clients(id, legal_name, trade_name), molds(id, code, description), quotes(id, number)")
    .eq("id", id)
    .single();
  if (!service) notFound();

  const { data: logs } = await supabase
    .from("activity_logs")
    .select("id, summary, action, actor_name, created_at")
    .eq("entity_type", "service").eq("entity_id", id)
    .order("created_at", { ascending: false }).limit(20);

  const client = service.clients as { id: string; legal_name: string; trade_name: string | null } | null;
  const mold = service.molds as { id: string; code: string; description: string | null } | null;
  const quote = service.quotes as { id: string; number: string } | null;
  const st = SERVICE_STATUS[service.status];

  const overdue =
    service.expected_delivery_date &&
    service.status !== "completed" && service.status !== "delivered" && service.status !== "cancelled" &&
    service.expected_delivery_date < new Date().toISOString().slice(0, 10);

  return (
    <div className="page">
      <PageHeader
        title={service.title}
        breadcrumb={[{ label: "Serviços", href: "/servicos" }, { label: service.title }]}
        subtitle={client ? client.trade_name || client.legal_name : undefined}
        actions={<ServiceActions id={id} title={service.title} status={service.status} />}
      />
      <div style={{ marginTop: -14, marginBottom: 22, display: "flex", gap: 8, alignItems: "center" }}>
        <span className={`badge ${st.cls}`}>{st.label}</span>
        {overdue && <span className="badge late">Em atraso</span>}
      </div>

      <div className="detail-grid">
        <div className="stack">
          {service.description && (
            <div className="card">
              <div className="card-head"><h3>Descrição</h3></div>
              <div className="card-body">
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{service.description}</p>
              </div>
            </div>
          )}
          <div className="card">
            <div className="card-head"><h3>Histórico</h3></div>
            <div className="card-body"><HistoryTimeline logs={logs ?? []} /></div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Detalhes</h3></div>
            <div className="card-body">
              <dl className="dl">
                <dt>Tipo</dt><dd>{SERVICE_TYPE[service.type]}</dd>
                <dt>Responsável</dt><dd>{service.responsible || "—"}</dd>
                <dt>Início</dt><dd className="mono">{fmtDate(service.start_date)}</dd>
                <dt>Entrega prevista</dt>
                <dd className="mono" style={overdue ? { color: "var(--error)" } : undefined}>{fmtDate(service.expected_delivery_date)}</dd>
                <dt>Cliente</dt>
                <dd>{client ? <Link href={`/clientes/${client.id}`}>{client.trade_name || client.legal_name}</Link> : "—"}</dd>
                <dt>Molde</dt>
                <dd>{mold ? <Link href={`/moldes/${mold.id}`} className="mono">{mold.code}</Link> : "—"}</dd>
                <dt>Orçamento</dt>
                <dd>{quote ? <Link href={`/orcamentos/${quote.id}`} className="mono">#{quote.number}</Link> : "—"}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
