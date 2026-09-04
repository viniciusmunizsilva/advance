import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import { getClientOptions } from "@/lib/queries";
import { MoldForm } from "../MoldForm";

export default async function NovoMoldePage(props: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await props.searchParams;
  const clients = await getClientOptions();

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Novo molde"
        breadcrumb={[{ label: "Moldes", href: "/moldes" }, { label: "Novo" }]}
      />
      {clients.length === 0 ? (
        <div className="card">
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Users}
              title="Cadastre um cliente primeiro"
              description="Um molde precisa estar vinculado a um cliente."
              action={
                <Link href="/clientes/novo" className="btn btn-primary">
                  Cadastrar cliente
                </Link>
              }
            />
          </div>
        </div>
      ) : (
        <MoldForm clients={clients} defaultClientId={client} />
      )}
    </div>
  );
}
