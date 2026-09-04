import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClientForm } from "../../ClientForm";

export default async function EditarClientePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const name = client.trade_name || client.legal_name;
  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Editar cliente"
        breadcrumb={[
          { label: "Clientes", href: "/clientes" },
          { label: name, href: `/clientes/${id}` },
          { label: "Editar" },
        ]}
      />
      <ClientForm client={client} />
    </div>
  );
}
