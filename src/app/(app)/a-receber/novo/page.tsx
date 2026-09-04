import Link from "next/link";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getClientOptions } from "@/lib/queries";
import { ReceivableForm } from "../ReceivableForm";

export default async function NovaContaReceberPage(props: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await props.searchParams;
  const clients = await getClientOptions();

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHeader title="Nova conta a receber" breadcrumb={[{ label: "A receber", href: "/a-receber" }, { label: "Nova" }]} />
      {clients.length === 0 ? (
        <div className="card"><div style={{ padding: 20 }}>
          <EmptyState icon={Users} title="Cadastre um cliente primeiro" description="A conta precisa de um cliente." action={<Link href="/clientes/novo" className="btn btn-primary">Cadastrar cliente</Link>} />
        </div></div>
      ) : (
        <ReceivableForm clients={clients} defaultClientId={client} />
      )}
    </div>
  );
}
