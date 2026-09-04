import Link from "next/link";
import { Plus, ArrowDownToLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { FINANCE_STATUS, type FinanceStatus } from "@/lib/domain";
import { PaidButton } from "./PaidButton";

const TABS = [
  { key: "all", label: "Todas" },
  { key: "open", label: "Em aberto" },
  { key: "overdue", label: "Vencidas" },
  { key: "paid", label: "Pagas" },
];

type Row = {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  effective_status: FinanceStatus;
  clients: { legal_name: string; trade_name: string | null } | null;
};

export default async function AReceberPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await props.searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("v_accounts_receivable")
    .select("id, description, amount, due_date, effective_status, clients(legal_name, trade_name)");
  if (status !== "all") query = query.eq("effective_status", status as FinanceStatus);

  const { data } = await query.order("due_date", { ascending: true });
  const rows = (data ?? []) as unknown as Row[];

  // KPIs a partir das contas não pagas/canceladas
  const { data: openData } = await supabase
    .from("v_accounts_receivable")
    .select("amount, effective_status")
    .in("effective_status", ["open", "overdue"]);
  const totalOpen = (openData ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);
  const totalOverdue = (openData ?? []).filter((r) => r.effective_status === "overdue").reduce((s, r) => s + (r.amount ?? 0), 0);

  return (
    <div className="page">
      <PageHeader
        title="Contas a receber"
        subtitle="Recebimentos de clientes"
        actions={<Link href="/a-receber/novo" className="btn btn-primary"><Plus aria-hidden /><span>Nova conta</span></Link>}
      />

      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="kpi">
          <div className="kpi-top"><span className="ico green"><ArrowDownToLine aria-hidden /></span> Total a receber</div>
          <div className="kpi-val"><span className="cur">R$</span>{fmtBRLc(totalOpen).replace("R$ ", "")}</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="ico red"><ArrowDownToLine aria-hidden /></span> Vencido</div>
          <div className="kpi-val"><span className="cur">R$</span>{fmtBRLc(totalOverdue).replace("R$ ", "")}</div>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="seg">
            {TABS.map((t) => (
              <Link key={t.key} href={`/a-receber${t.key === "all" ? "" : `?status=${t.key}`}`} style={{ textDecoration: "none" }}>
                <button type="button" className={status === t.key ? "active" : ""} tabIndex={-1}>{t.label}</button>
              </Link>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState icon={ArrowDownToLine} title="Nenhuma conta" description="Registre uma conta a receber." action={<Link href="/a-receber/novo" className="btn btn-primary"><Plus aria-hidden /><span>Nova conta</span></Link>} />
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Descrição</th><th>Cliente</th><th>Vencimento</th><th className="right">Valor</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const st = FINANCE_STATUS[r.effective_status];
                  const client = r.clients;
                  return (
                    <tr key={r.id} className="clickable">
                      <td className="t-primary"><Link href={`/a-receber/${r.id}/editar`} style={{ color: "inherit" }}>{r.description}</Link></td>
                      <td>{client ? client.trade_name || client.legal_name : "—"}</td>
                      <td className="t-mono">{fmtDate(r.due_date)}</td>
                      <td className="right val">{fmtBRLc(r.amount)}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td className="right">{r.effective_status !== "paid" && r.effective_status !== "cancelled" && <PaidButton id={r.id} />}</td>
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
