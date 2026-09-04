import Link from "next/link";
import { Plus, ArrowUpFromLine } from "lucide-react";
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
  suppliers: { company_name: string } | null;
};

export default async function APagarPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await props.searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("v_accounts_payable")
    .select("id, description, amount, due_date, effective_status, suppliers(company_name)");
  if (status !== "all") query = query.eq("effective_status", status as FinanceStatus);

  const { data } = await query.order("due_date", { ascending: true });
  const rows = (data ?? []) as unknown as Row[];

  const { data: openData } = await supabase
    .from("v_accounts_payable")
    .select("amount, effective_status")
    .in("effective_status", ["open", "overdue"]);
  const totalOpen = (openData ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);
  const totalOverdue = (openData ?? []).filter((r) => r.effective_status === "overdue").reduce((s, r) => s + (r.amount ?? 0), 0);

  return (
    <div className="page">
      <PageHeader
        title="Contas a pagar"
        subtitle="Pagamentos a fornecedores"
        actions={<Link href="/a-pagar/novo" className="btn btn-primary"><Plus aria-hidden /><span>Nova conta</span></Link>}
      />

      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="kpi">
          <div className="kpi-top"><span className="ico amber"><ArrowUpFromLine aria-hidden /></span> Total a pagar</div>
          <div className="kpi-val"><span className="cur">R$</span>{fmtBRLc(totalOpen).replace("R$ ", "")}</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="ico red"><ArrowUpFromLine aria-hidden /></span> Vencido</div>
          <div className="kpi-val"><span className="cur">R$</span>{fmtBRLc(totalOverdue).replace("R$ ", "")}</div>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="seg">
            {TABS.map((t) => (
              <Link key={t.key} href={`/a-pagar${t.key === "all" ? "" : `?status=${t.key}`}`} style={{ textDecoration: "none" }}>
                <button type="button" className={status === t.key ? "active" : ""} tabIndex={-1}>{t.label}</button>
              </Link>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState icon={ArrowUpFromLine} title="Nenhuma conta" description="Registre uma conta a pagar." action={<Link href="/a-pagar/novo" className="btn btn-primary"><Plus aria-hidden /><span>Nova conta</span></Link>} />
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Descrição</th><th>Fornecedor</th><th>Vencimento</th><th className="right">Valor</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const st = FINANCE_STATUS[r.effective_status];
                  return (
                    <tr key={r.id} className="clickable">
                      <td className="t-primary"><Link href={`/a-pagar/${r.id}/editar`} style={{ color: "inherit" }}>{r.description}</Link></td>
                      <td>{r.suppliers?.company_name ?? "—"}</td>
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
