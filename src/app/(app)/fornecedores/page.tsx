import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";

export default async function FornecedoresPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await props.searchParams;
  const supabase = await createClient();
  let query = supabase.from("suppliers").select("id, company_name, document, contact_name, phone, email");
  if (q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`company_name.ilike.${term},document.ilike.${term},contact_name.ilike.${term}`);
  }
  const { data: suppliers } = await query.order("company_name");

  return (
    <div className="page">
      <PageHeader
        title="Fornecedores"
        subtitle="Cadastro de fornecedores"
        actions={
          <Link href="/fornecedores/novo" className="btn btn-primary">
            <Plus aria-hidden /><span>Novo fornecedor</span>
          </Link>
        }
      />
      <div className="card">
        <div className="toolbar">
          <SearchInput placeholder="Buscar por nome, CNPJ ou contato" />
          <span className="spacer" />
          <span className="result-count">{suppliers?.length ?? 0} fornecedor{(suppliers?.length ?? 0) === 1 ? "" : "es"}</span>
        </div>
        {!suppliers || suppliers.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Building2}
              title={q ? "Nenhum resultado" : "Nenhum fornecedor"}
              description={q ? "Ajuste a busca." : "Cadastre o primeiro fornecedor."}
              action={!q ? <Link href="/fornecedores/novo" className="btn btn-primary"><Plus aria-hidden /><span>Novo fornecedor</span></Link> : undefined}
            />
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Fornecedor</th><th>CNPJ / CPF</th><th>Contato</th><th>Telefone</th><th>E-mail</th></tr></thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="clickable">
                    <td className="t-primary"><Link href={`/fornecedores/${s.id}/editar`} style={{ color: "inherit" }}>{s.company_name}</Link></td>
                    <td className="t-mono">{s.document || "—"}</td>
                    <td>{s.contact_name || "—"}</td>
                    <td className="t-mono">{s.phone || "—"}</td>
                    <td style={{ wordBreak: "break-all" }}>{s.email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
