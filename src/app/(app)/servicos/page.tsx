import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { fmtDate } from "@/lib/format";
import { SERVICE_STATUS, SERVICE_TYPE, type ServiceStatus } from "@/lib/domain";
import { KanbanBoard, type KanbanCard } from "./KanbanBoard";

type Row = {
  id: string;
  title: string;
  status: ServiceStatus;
  type: keyof typeof SERVICE_TYPE;
  expected_delivery_date: string | null;
  responsible: string | null;
  clients: { legal_name: string; trade_name: string | null } | null;
  molds: { code: string } | null;
};

export default async function ServicosPage(props: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view = "kanban" } = await props.searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("id, title, status, type, expected_delivery_date, responsible, clients(legal_name, trade_name), molds(code)")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];
  const clientLabel = (r: Row) => (r.clients ? r.clients.trade_name || r.clients.legal_name : "—");

  const header = (
    <PageHeader
      title="Serviços"
      subtitle="Acompanhamento operacional"
      actions={
        <>
          <div className="seg">
            <Link href="/servicos?view=kanban" style={{ textDecoration: "none" }}>
              <button type="button" className={view !== "list" ? "active" : ""} tabIndex={-1}>Kanban</button>
            </Link>
            <Link href="/servicos?view=list" style={{ textDecoration: "none" }}>
              <button type="button" className={view === "list" ? "active" : ""} tabIndex={-1}>Lista</button>
            </Link>
          </div>
          <Link href="/servicos/novo" className="btn btn-primary">
            <Plus aria-hidden />
            <span>Novo serviço</span>
          </Link>
        </>
      }
    />
  );

  if (rows.length === 0) {
    return (
      <div className="page">
        {header}
        <div className="card">
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Wrench}
              title="Nenhum serviço"
              description="Crie um serviço ou gere um a partir de um orçamento aprovado."
              action={<Link href="/servicos/novo" className="btn btn-primary"><Plus aria-hidden /><span>Novo serviço</span></Link>}
            />
          </div>
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="page">
        {header}
        <div className="card">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>Serviço</th><th>Cliente</th><th>Molde</th><th>Tipo</th><th>Responsável</th><th>Entrega</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const st = SERVICE_STATUS[r.status];
                  return (
                    <tr key={r.id} className="clickable">
                      <td><Link href={`/servicos/${r.id}`} style={{ color: "inherit" }} className="t-primary">{r.title}</Link></td>
                      <td>{clientLabel(r)}</td>
                      <td className="t-mono">{r.molds?.code ?? "—"}</td>
                      <td>{SERVICE_TYPE[r.type]}</td>
                      <td>{r.responsible ?? "—"}</td>
                      <td className="t-mono">{fmtDate(r.expected_delivery_date)}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const cards: KanbanCard[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    clientLabel: clientLabel(r),
    moldCode: r.molds?.code ?? null,
    expected_delivery_date: r.expected_delivery_date,
  }));

  return (
    <div className="page" style={{ maxWidth: "none" }}>
      {header}
      <KanbanBoard initial={cards} />
    </div>
  );
}
