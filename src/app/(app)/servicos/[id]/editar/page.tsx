import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getClientOptions, getMoldOptions } from "@/lib/queries";
import { ServiceForm } from "../../ServiceForm";

export default async function EditarServicoPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data: service }, clients, molds] = await Promise.all([
    supabase.from("services").select("*").eq("id", id).single(),
    getClientOptions(),
    getMoldOptions(),
  ]);

  if (!service) notFound();

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Editar serviço"
        breadcrumb={[
          { label: "Serviços", href: "/servicos" },
          { label: service.title, href: `/servicos/${id}` },
          { label: "Editar" },
        ]}
      />
      <ServiceForm service={service} clients={clients} molds={molds} />
    </div>
  );
}
