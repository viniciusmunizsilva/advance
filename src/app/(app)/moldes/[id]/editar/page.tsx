import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getClientOptions } from "@/lib/queries";
import { MoldForm } from "../../MoldForm";

export default async function EditarMoldePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data: mold }, clients] = await Promise.all([
    supabase.from("molds").select("*").eq("id", id).single(),
    getClientOptions(),
  ]);

  if (!mold) notFound();

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Editar molde"
        breadcrumb={[
          { label: "Moldes", href: "/moldes" },
          { label: mold.code, href: `/moldes/${id}` },
          { label: "Editar" },
        ]}
      />
      <MoldForm mold={mold} clients={clients} />
    </div>
  );
}
