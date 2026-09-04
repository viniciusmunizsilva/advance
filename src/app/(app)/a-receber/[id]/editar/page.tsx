import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getClientOptions } from "@/lib/queries";
import { ReceivableForm } from "../../ReceivableForm";

export default async function EditarContaReceberPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data: receivable }, clients] = await Promise.all([
    supabase.from("accounts_receivable").select("*").eq("id", id).single(),
    getClientOptions(),
  ]);
  if (!receivable) notFound();

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHeader title="Editar conta a receber" breadcrumb={[{ label: "A receber", href: "/a-receber" }, { label: receivable.description }]} />
      <ReceivableForm receivable={receivable} clients={clients} />
    </div>
  );
}
