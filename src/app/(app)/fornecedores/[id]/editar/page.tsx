import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { SupplierForm } from "../../SupplierForm";

export default async function EditarFornecedorPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: supplier } = await supabase.from("suppliers").select("*").eq("id", id).single();
  if (!supplier) notFound();

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Editar fornecedor"
        breadcrumb={[{ label: "Fornecedores", href: "/fornecedores" }, { label: supplier.company_name }]}
      />
      <SupplierForm supplier={supplier} />
    </div>
  );
}
