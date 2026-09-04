import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getClientsData, getMoldsData, getCompanyDoc } from "@/lib/queries";
import { QuoteForm, type QuoteFormData } from "../../QuoteForm";

export default async function EditarOrcamentoPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: quote }, { data: items }, clients, molds, company] = await Promise.all([
    supabase.from("quotes").select("*").eq("id", id).single(),
    supabase.from("quote_items").select("description, quantity, unit_price").eq("quote_id", id).order("sort_order"),
    getClientsData(),
    getMoldsData(),
    getCompanyDoc(),
  ]);

  if (!quote) notFound();

  const formData: QuoteFormData = {
    id: quote.id,
    number: quote.number,
    createdAt: quote.created_at,
    client_id: quote.client_id,
    mold_id: quote.mold_id,
    service_type: quote.service_type,
    description: quote.description,
    discount: quote.discount,
    deadline: quote.deadline,
    validity_date: quote.validity_date,
    payment_terms: quote.payment_terms,
    freight: quote.freight,
    responsible: quote.responsible,
    notes: quote.notes,
    items: (items ?? []).map((it) => ({ description: it.description, quantity: it.quantity, unit_price: it.unit_price })),
  };

  return (
    <div className="page" style={{ maxWidth: "none" }}>
      <PageHeader
        title={`Editar orçamento #${quote.number}`}
        breadcrumb={[
          { label: "Orçamentos", href: "/orcamentos" },
          { label: `#${quote.number}`, href: `/orcamentos/${id}` },
          { label: "Editar" },
        ]}
      />
      <QuoteForm quote={formData} clients={clients} molds={molds} company={company} />
    </div>
  );
}
