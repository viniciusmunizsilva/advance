import Link from "next/link";
import { Plus, Box } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { MOLD_TYPE } from "@/lib/domain";

const PAGE_SIZE = 20;

export default async function MoldesPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageStr } = await props.searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from("molds")
    .select("id, code, name, description, type, cavities, clients(legal_name, trade_name)", {
      count: "exact",
    });

  if (q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`code.ilike.${term},name.ilike.${term},description.ilike.${term}`);
  }

  const { data: molds, count } = await query
    .order("code", { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  const total = count ?? 0;
  const baseQuery = q ? `q=${encodeURIComponent(q)}` : "";

  return (
    <div className="page">
      <PageHeader
        title="Moldes"
        subtitle="Ativos operacionais — moldes por cliente"
        actions={
          <Link href="/moldes/novo" className="btn btn-primary">
            <Plus aria-hidden />
            <span>Novo molde</span>
          </Link>
        }
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput placeholder="Buscar por código ou descrição" />
          <span className="spacer" />
          <span className="result-count">{total} molde{total === 1 ? "" : "s"}</span>
        </div>

        {!molds || molds.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Box}
              title={q ? "Nenhum resultado" : "Nenhum molde cadastrado"}
              description={q ? "Ajuste os termos da busca." : "Cadastre o primeiro molde."}
              action={
                !q ? (
                  <Link href="/moldes/novo" className="btn btn-primary">
                    <Plus aria-hidden />
                    <span>Novo molde</span>
                  </Link>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th className="right">Cavidades</th>
                  </tr>
                </thead>
                <tbody>
                  {molds.map((m) => {
                    const client = m.clients as { legal_name: string; trade_name: string | null } | null;
                    return (
                      <tr key={m.id} className="clickable">
                        <td className="t-mono">
                          <Link href={`/moldes/${m.id}`} style={{ color: "inherit" }}>{m.code}</Link>
                        </td>
                        <td>{m.description || m.name || "—"}</td>
                        <td>{client ? client.trade_name || client.legal_name : "—"}</td>
                        <td>{m.type ? MOLD_TYPE[m.type] : "—"}</td>
                        <td className="right t-mono">{m.cavities ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} baseQuery={baseQuery} pathname="/moldes" />
          </>
        )}
      </div>
    </div>
  );
}
