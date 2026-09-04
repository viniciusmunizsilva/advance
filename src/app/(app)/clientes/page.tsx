import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function ClientesPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageStr } = await props.searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from("clients")
    .select("id, legal_name, trade_name, document, city, contact_name, phone", {
      count: "exact",
    });

  if (q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(
      `legal_name.ilike.${term},trade_name.ilike.${term},document.ilike.${term},city.ilike.${term}`,
    );
  }

  const { data: clients, count } = await query
    .order("legal_name", { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  const total = count ?? 0;
  const baseQuery = q ? `q=${encodeURIComponent(q)}` : "";

  return (
    <div className="page">
      <PageHeader
        title="Clientes"
        subtitle="Indústrias atendidas pela Advance"
        actions={
          <Link href="/clientes/novo" className="btn btn-primary">
            <Plus aria-hidden />
            <span>Novo cliente</span>
          </Link>
        }
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput placeholder="Buscar por nome, CNPJ ou cidade" />
          <span className="spacer" />
          <span className="result-count">
            {total} cliente{total === 1 ? "" : "s"}
          </span>
        </div>

        {!clients || clients.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Users}
              title={q ? "Nenhum resultado" : "Nenhum cliente cadastrado"}
              description={
                q
                  ? "Ajuste os termos da busca."
                  : "Cadastre o primeiro cliente para começar."
              }
              action={
                !q ? (
                  <Link href="/clientes/novo" className="btn btn-primary">
                    <Plus aria-hidden />
                    <span>Novo cliente</span>
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
                    <th>Cliente</th>
                    <th>CNPJ / CPF</th>
                    <th>Cidade</th>
                    <th>Contato</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="clickable">
                      <td>
                        <Link href={`/clientes/${c.id}`} style={{ color: "inherit", display: "block" }}>
                          <div className="t-primary">{c.trade_name || c.legal_name}</div>
                          {c.trade_name && <div className="t-sub">{c.legal_name}</div>}
                        </Link>
                      </td>
                      <td className="t-mono">{c.document || "—"}</td>
                      <td>{c.city || "—"}</td>
                      <td>{c.contact_name || "—"}</td>
                      <td className="t-mono">{c.phone || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              baseQuery={baseQuery}
              pathname="/clientes"
            />
          </>
        )}
      </div>
    </div>
  );
}
