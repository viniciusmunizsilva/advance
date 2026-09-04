import type { QuoteDocData } from "./QuoteDocument";
import type { CompanyDoc } from "@/lib/queries";
import type { Tables } from "@/lib/supabase/database.types";

type QuoteRow = Tables<"quotes"> & {
  clients: Tables<"clients"> | null;
  molds: Tables<"molds"> | null;
};
type ItemRow = Pick<Tables<"quote_items">, "description" | "quantity" | "unit_price" | "total">;

/** Constrói os dados do documento a partir das linhas do banco (server-side). */
export function quoteToDocData(
  quote: QuoteRow,
  items: ItemRow[],
  company: CompanyDoc,
): QuoteDocData {
  const c = quote.clients;
  const m = quote.molds;
  return {
    number: quote.number,
    createdAt: quote.created_at,
    validityDate: quote.validity_date,
    responsible: quote.responsible,
    serviceType: quote.service_type,
    description: quote.description,
    deadline: quote.deadline,
    paymentTerms: quote.payment_terms,
    freight: quote.freight,
    notes: quote.notes,
    subtotal: quote.subtotal,
    discount: quote.discount,
    total: quote.total,
    client: c
      ? {
          legalName: c.legal_name,
          tradeName: c.trade_name,
          document: c.document,
          contact: c.contact_name,
          phone: c.phone,
          email: c.email,
          city: c.city,
        }
      : null,
    mold: m ? { code: m.code, description: m.description, cavities: m.cavities, type: m.type } : null,
    items: items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.total,
    })),
    company,
  };
}
