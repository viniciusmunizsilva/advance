import Link from "next/link";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getClientsData, getMoldsData, getCompanyDoc } from "@/lib/queries";
import { QuoteForm } from "../QuoteForm";

export default async function NovoOrcamentoPage(props: {
  searchParams: Promise<{ client?: string; mold?: string }>;
}) {
  const { client, mold } = await props.searchParams;
  const [clients, molds, company] = await Promise.all([getClientsData(), getMoldsData(), getCompanyDoc()]);

  return (
    <div className="page" style={{ maxWidth: "none" }}>
      <PageHeader
        title="Novo orçamento"
        breadcrumb={[{ label: "Orçamentos", href: "/orcamentos" }, { label: "Novo" }]}
      />
      {clients.length === 0 ? (
        <div className="card">
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Users}
              title="Cadastre um cliente primeiro"
              description="Um orçamento precisa estar vinculado a um cliente."
              action={<Link href="/clientes/novo" className="btn btn-primary">Cadastrar cliente</Link>}
            />
          </div>
        </div>
      ) : (
        <QuoteForm clients={clients} molds={molds} company={company} defaultClientId={client} defaultMoldId={mold} />
      )}
    </div>
  );
}
