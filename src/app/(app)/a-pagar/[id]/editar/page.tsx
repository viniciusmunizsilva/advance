import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSupplierOptions } from "@/lib/queries";
import { PayableForm } from "../../PayableForm";

export default async function EditarContaPagarPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data: payable }, suppliers] = await Promise.all([
    supabase.from("accounts_payable").select("*").eq("id", id).single(),
    getSupplierOptions(),
  ]);
  if (!payable) notFound();

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHeader title="Editar conta a pagar" breadcrumb={[{ label: "A pagar", href: "/a-pagar" }, { label: payable.description }]} />
      <PayableForm payable={payable} suppliers={suppliers} />
    </div>
  );
}
