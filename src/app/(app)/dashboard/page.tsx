import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, FileText, Wrench, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { fmtBRLc, fmtDate, fmtDateLong } from "@/lib/format";
import { QUOTE_STATUS, SERVICE_STATUS, FINANCE_STATUS, type QuoteStatus, type ServiceStatus, type FinanceStatus } from "@/lib/domain";

const ACTIVE_SERVICE: ServiceStatus[] = ["waiting", "analysis", "in_progress", "waiting_client"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);

  const [
    { data: recv },
    { data: pay },
    { count: orcPeriodo },
    { count: servicosAtivos },
    { data: recentQuotes },
    { data: activeServices },
    { data: awaiting },
    { data: upcomingReceivables },
  ] = await Promise.all([
    supabase.from("v_accounts_receivable").select("amount, effective_status").in("effective_status", ["open", "overdue"]),
    supabase.from("v_accounts_payable").select("amount, effective_status").in("effective_status", ["open", "overdue"]),
    supabase.from("quotes").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("services").select("id", { count: "exact", head: true }).in("status", ACTIVE_SERVICE),
    supabase.from("quotes").select("id, number, total, status, created_at, clients(legal_name, trade_name)").order("created_at", { ascending: false }).limit(6),
    supabase.from("services").select("id, title, status, expected_delivery_date, clients(legal_name, trade_name)").in("status", ACTIVE_SERVICE).order("expected_delivery_date", { ascending: true, nullsFirst: false }).limit(6),
    supabase.from("quotes").select("id, number, total, created_at, clients(legal_name, trade_name)").eq("status", "sent").order("created_at", { ascending: false }).limit(6),
    supabase.from("v_accounts_receivable").select("id, description, amount, due_date, effective_status, clients(legal_name, trade_name)").in("effective_status", ["open", "overdue"]).order("due_date", { ascending: true }).limit(6),
  ]);

  const totalReceber = (recv ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);
  const totalPagar = (pay ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);

  const sub = fmtDateLong(today);
  const subCap = sub.charAt(0).toUpperCase() + sub.slice(1);

  const clientName = (c: { legal_name: string; trade_name: string | null } | null) =>
    c ? c.trade_name || c.legal_name : "—";

  return (
    <div className="page">
      <PageHeader
        title="Visão geral"
        subtitle={subCap}
        actions={<Link href="/orcamentos/novo" className="btn btn-primary"><Plus aria-hidden /><span>Novo orçamento</span></Link>}
      />

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-top"><span className="ico green"><ArrowDownToLine aria-hidden /></span> A receber</div>
          <div className="kpi-val"><span className="cur">R$</span>{fmtBRLc(totalReceber).replace("R$ ", "")}</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="ico red"><ArrowUpFromLine aria-hidden /></span> A pagar</div>
          <div className="kpi-val"><span className="cur">R$</span>{fmtBRLc(totalPagar).replace("R$ ", "")}</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="ico blue"><FileText aria-hidden /></span> Orçamentos no mês</div>
          <div className="kpi-val">{orcPeriodo ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="ico amber"><Wrench aria-hidden /></span> Serviços ativos</div>
          <div className="kpi-val">{servicosAtivos ?? 0}</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Orçamentos recentes</h3><Link href="/orcamentos" className="ch-link">Ver todos</Link></div>
            <div className="list-rows">
              {(recentQuotes ?? []).length === 0 && <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum orçamento.</p></div>}
              {(recentQuotes ?? []).map((q) => {
                const st = QUOTE_STATUS[q.status as QuoteStatus];
                return (
                  <Link key={q.id} href={`/orcamentos/${q.id}`} className="lrow">
                    <div className="lr-main">
                      <div className="lr-title"><span className="mini-code">#{q.number}</span> {clientName(q.clients as never)}</div>
                      <div className="lr-sub">{fmtDate(q.created_at)}</div>
                    </div>
                    <div className="lr-right">
                      <div className="lr-val">{q.status === "draft" ? "—" : fmtBRLc(q.total)}</div>
                      <div className="lr-meta"><span className={`badge ${st.cls}`}>{st.label}</span></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Serviços</h3><Link href="/servicos" className="ch-link">Ver todos</Link></div>
            <div className="list-rows">
              {(activeServices ?? []).length === 0 && <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nenhum serviço ativo.</p></div>}
              {(activeServices ?? []).map((s) => {
                const st = SERVICE_STATUS[s.status as ServiceStatus];
                return (
                  <Link key={s.id} href={`/servicos/${s.id}`} className="lrow">
                    <div className="lr-main">
                      <div className="lr-title">{s.title}</div>
                      <div className="lr-sub">{clientName(s.clients as never)}</div>
                    </div>
                    <div className="lr-right">
                      <div className="lr-val">{fmtDate(s.expected_delivery_date)}</div>
                      <div className="lr-meta"><span className={`badge ${st.cls}`}>{st.label}</span></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Aguardando resposta</h3></div>
            <div className="list-rows">
              {(awaiting ?? []).length === 0 && <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nada pendente.</p></div>}
              {(awaiting ?? []).map((q) => (
                <Link key={q.id} href={`/orcamentos/${q.id}`} className="lrow">
                  <div className="lr-main">
                    <div className="lr-title"><span className="mini-code">#{q.number}</span> {clientName(q.clients as never)}</div>
                    <div className="lr-sub">Enviado em {fmtDate(q.created_at)}</div>
                  </div>
                  <div className="lr-right"><div className="lr-val">{fmtBRLc(q.total)}</div></div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Financeiro — próximos vencimentos</h3><Link href="/a-receber" className="ch-link">Ver</Link></div>
            <div className="list-rows">
              {(upcomingReceivables ?? []).length === 0 && <div className="card-body"><p className="hint" style={{ margin: 0 }}>Nada a receber.</p></div>}
              {(upcomingReceivables ?? []).map((r) => {
                const st = FINANCE_STATUS[r.effective_status as FinanceStatus];
                return (
                  <Link key={r.id} href={`/a-receber/${r.id}/editar`} className="lrow">
                    <div className="lr-main">
                      <div className="lr-title">{r.description}</div>
                      <div className="lr-sub">{clientName(r.clients as never)} · vence {fmtDate(r.due_date)}</div>
                    </div>
                    <div className="lr-right">
                      <div className="lr-val">{fmtBRLc(r.amount ?? 0)}</div>
                      <div className="lr-meta"><span className={`badge ${st.cls}`}>{st.label}</span></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
