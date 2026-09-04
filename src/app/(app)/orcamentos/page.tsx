import Link from "next/link";
import { Plus, FileText, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { QUOTE_STATUS, SERVICE_TYPE, type QuoteStatus } from "@/lib/domain";
import { QuoteFilters } from "./QuoteFilters";
import { getClientOptions } from "@/lib/queries";

const PAGE_SIZE = 20;

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "draft", label: "Rascunho" },
  { key: "sent", label: "Enviado" },
  { key: "approved", label: "Aprovado" },
  { key: "rejected", label: "Recusado" },
  { key: "expired", label: "Expirado" },
];

const SORTS: Record<string, { col: string; asc: boolean }> = {
  recent: { col: "created_at", asc: false },
  old: { col: "created_at", asc: true },
  high: { col: "total", asc: false },
  low: { col: "total", asc: true },
};

type QuoteRow = {
  id: string;
  number: string;
  total: number;
  status: QuoteStatus;
  created_at: string;
  validity_date: string | null;
  service_type: keyof typeof SERVICE_TYPE | null;
  clients: { trade_name: string | null; legal_name: string; city: string | null } | null;
  molds: { code: string; description: string | null } | null;
};

export default async function OrcamentosPage(props: {
  searchParams: Promise<{ q?: string; status?: string; client?: string; sort?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const q = sp.q ?? "";
  const status = sp.status ?? "all";
  const clientFilter = sp.client ?? "";
  const sort = sp.sort ?? "recent";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const sortCfg = SORTS[sort] ?? SORTS.recent;

  const supabase = await createClient();

  // resolve termos de busca → ids de clientes/moldes correspondentes
  let clientIds: string[] = [];
  let moldIds: string[] = [];
  if (q.trim()) {
    const term = `%${q.trim()}%`;
    const [{ data: cs }, { data: ms }] = await Promise.all([
      supabase.from("clients").select("id").or(`legal_name.ilike.${term},trade_name.ilike.${term}`),
      supabase.from("molds").select("id").or(`code.ilike.${term},description.ilike.${term}`),
    ]);
    clientIds = (cs ?? []).map((c) => c.id);
    moldIds = (ms ?? []).map((m) => m.id);
  }

  const term = q.trim() ? `%${q.trim()}%` : "";
  const orExpr = (() => {
    if (!term) return "";
    const ors = [`number.ilike.${term}`];
    if (clientIds.length) ors.push(`client_id.in.(${clientIds.join(",")})`);
    if (moldIds.length) ors.push(`mold_id.in.(${moldIds.join(",")})`);
    return ors.join(",");
  })();

  // contagens por status (respeitando busca + cliente)
  const countPromises = TABS.map(async (t) => {
    let b = supabase.from("quotes").select("id", { count: "exact", head: true }).eq("archived", false);
    if (clientFilter) b = b.eq("client_id", clientFilter);
    if (orExpr) b = b.or(orExpr);
    if (t.key !== "all") b = b.eq("status", t.key as QuoteStatus);
    const { count } = await b;
    return [t.key, count ?? 0] as const;
  });
  const counts = Object.fromEntries(await Promise.all(countPromises));

  // linhas da página
  let listQuery = supabase
    .from("quotes")
    .select(
      "id, number, total, status, created_at, validity_date, service_type, clients(trade_name, legal_name, city), molds(code, description)",
      { count: "exact" },
    )
    .eq("archived", false);
  if (clientFilter) listQuery = listQuery.eq("client_id", clientFilter);
  if (orExpr) listQuery = listQuery.or(orExpr);
  if (status !== "all") listQuery = listQuery.eq("status", status as QuoteStatus);

  const { data, count } = await listQuery
    .order(sortCfg.col, { ascending: sortCfg.asc })
    .range(from, from + PAGE_SIZE - 1);

  const quotes = (data ?? []) as unknown as QuoteRow[];
  const total = count ?? 0;

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (clientFilter) qs.set("client", clientFilter);
  if (sort !== "recent") qs.set("sort", sort);
  const baseQuery = (extra: Record<string, string>) => {
    const p = new URLSearchParams(qs.toString());
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v); else p.delete(k);
    return p.toString();
  };

  const clients = await getClientOptions();

  return (
    <div className="page">
      <PageHeader
        title="Orçamentos"
        subtitle="Propostas comerciais"
        actions={
          <Link href="/orcamentos/novo" className="btn btn-primary">
            <Plus aria-hidden />
            <span>Novo orçamento</span>
          </Link>
        }
      />

      <div className="card">
        <div className="toolbar">
          <div className="seg">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={`/orcamentos?${baseQuery({ status: t.key === "all" ? "" : t.key })}`}
                className={status === t.key ? "active" : ""}
                style={{ textDecoration: "none" }}
              >
                <button type="button" className={status === t.key ? "active" : ""} tabIndex={-1}>
                  {t.label} <span className="n">{counts[t.key]}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div className="toolbar" style={{ borderTop: "none", paddingTop: 0 }}>
          <SearchInput placeholder="Buscar por nº, cliente ou molde" />
          <QuoteFilters clients={clients} />
          <span className="spacer" />
          <span className="result-count">{total} resultado{total === 1 ? "" : "s"}</span>
        </div>

        {quotes.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={FileText}
              title="Nenhum orçamento encontrado"
              description={q || clientFilter || status !== "all" ? "Ajuste os filtros da busca." : "Crie o primeiro orçamento."}
              action={
                <Link href="/orcamentos/novo" className="btn btn-primary">
                  <Plus aria-hidden />
                  <span>Novo orçamento</span>
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Cliente</th>
                    <th>Molde</th>
                    <th>Serviço</th>
                    <th className="right">Valor</th>
                    <th>Data</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((qt) => {
                    const st = QUOTE_STATUS[qt.status];
                    const client = qt.clients;
                    const mold = qt.molds;
                    const validityAmber = qt.status === "sent";
                    return (
                      <tr key={qt.id} className="clickable">
                        <td className="t-mono t-primary">
                          <Link href={`/orcamentos/${qt.id}`} style={{ color: "inherit" }}>#{qt.number}</Link>
                        </td>
                        <td>
                          <div className="t-primary">{client ? client.trade_name || client.legal_name : "—"}</div>
                          {client?.city && <div className="t-sub">{client.city}</div>}
                        </td>
                        <td>
                          {mold ? (
                            <>
                              <div className="t-mono">{mold.code}</div>
                              {mold.description && <div className="t-sub">{mold.description}</div>}
                            </>
                          ) : "—"}
                        </td>
                        <td>{qt.service_type ? <span className="tag-svc">{SERVICE_TYPE[qt.service_type]}</span> : "—"}</td>
                        <td className="right val">{qt.status === "draft" ? "—" : fmtBRLc(qt.total)}</td>
                        <td className="t-mono">{fmtDate(qt.created_at)}</td>
                        <td className="t-mono" style={validityAmber ? { color: "var(--warning)" } : undefined}>
                          {fmtDate(qt.validity_date)}
                        </td>
                        <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        <td className="right">
                          <Link href={`/orcamentos/${qt.id}`} className="btn btn-ghost btn-sm">
                            Abrir <ChevronRight aria-hidden />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} baseQuery={baseQuery({ status: status === "all" ? "" : status })} pathname="/orcamentos" />
          </>
        )}
      </div>
    </div>
  );
}
