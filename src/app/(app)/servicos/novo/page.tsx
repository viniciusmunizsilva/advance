import Link from "next/link";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { getClientOptions, getMoldOptions } from "@/lib/queries";
import { ServiceForm, type ServiceDefaults } from "../ServiceForm";

export default async function NovoServicoPage(props: {
  searchParams: Promise<{ quote?: string; client?: string; mold?: string }>;
}) {
  const { quote, client, mold } = await props.searchParams;
  const supabase = await createClient();
  const [clients, molds] = await Promise.all([getClientOptions(), getMoldOptions()]);

  let defaults: ServiceDefaults = { client_id: client, mold_id: mold };

  if (quote) {
    const { data: q } = await supabase
      .from("quotes")
      .select("id, number, client_id, mold_id, service_type")
      .eq("id", quote)
      .single();
    if (q) {
      defaults = {
        client_id: q.client_id,
        mold_id: q.mold_id ?? undefined,
        quote_id: q.id,
        type: q.service_type ?? "other",
        title: `Serviço — Orçamento #${q.number}`,
      };
    }
  }

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Novo serviço"
        breadcrumb={[{ label: "Serviços", href: "/servicos" }, { label: "Novo" }]}
      />
      {clients.length === 0 ? (
        <div className="card">
          <div style={{ padding: 20 }}>
            <EmptyState
              icon={Users}
              title="Cadastre um cliente primeiro"
              description="Um serviço precisa estar vinculado a um cliente."
              action={<Link href="/clientes/novo" className="btn btn-primary">Cadastrar cliente</Link>}
            />
          </div>
        </div>
      ) : (
        <ServiceForm clients={clients} molds={molds} defaults={defaults} />
      )}
    </div>
  );
}
