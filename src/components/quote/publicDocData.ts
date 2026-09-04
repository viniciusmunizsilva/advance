import type { QuoteDocData } from "./QuoteDocument";
import type { ServiceType, MoldType } from "@/lib/domain";

/** Formato retornado pela RPC get_public_quote. */
export type PublicQuoteJson = {
  number: string;
  status: string;
  created_at: string | null;
  validity_date: string | null;
  responsible: string | null;
  service_type: ServiceType | null;
  description: string | null;
  deadline: string | null;
  payment_terms: string | null;
  freight: string | null;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  client: {
    legal_name: string; trade_name: string | null; document: string | null;
    contact_name: string | null; phone: string | null; email: string | null; city: string | null;
  } | null;
  mold: { code: string; description: string | null; cavities: number | null; type: MoldType | null } | null;
  items: { description: string; quantity: number; unit_price: number; total: number }[];
  company: {
    legal_name: string; document: string | null; address: string | null;
    phone: string | null; email: string | null; website: string | null; logo_url: string | null;
  } | null;
};

/** Converte o JSON público em dados do documento, com logo em URL absoluta. */
export function publicJsonToDocData(j: PublicQuoteJson, origin: string): QuoteDocData {
  const co = j.company;
  let logoUrl = co?.logo_url || "/brand/logo-advance-blue.png";
  if (!logoUrl.startsWith("http")) logoUrl = `${origin}${logoUrl}`;

  return {
    number: j.number,
    createdAt: j.created_at,
    validityDate: j.validity_date,
    responsible: j.responsible,
    serviceType: j.service_type,
    description: j.description,
    deadline: j.deadline,
    paymentTerms: j.payment_terms,
    freight: j.freight,
    notes: j.notes,
    subtotal: j.subtotal,
    discount: j.discount,
    total: j.total,
    client: j.client
      ? {
          legalName: j.client.legal_name,
          tradeName: j.client.trade_name,
          document: j.client.document,
          contact: j.client.contact_name,
          phone: j.client.phone,
          email: j.client.email,
          city: j.client.city,
        }
      : null,
    mold: j.mold
      ? { code: j.mold.code, description: j.mold.description, cavities: j.mold.cavities, type: j.mold.type }
      : null,
    items: j.items ?? [],
    company: {
      legalName: co?.legal_name ?? "Advance Tecnologia em Moldes",
      document: co?.document ?? null,
      address: co?.address ?? null,
      phone: co?.phone ?? null,
      email: co?.email ?? null,
      website: co?.website ?? null,
      logoUrl,
    },
  };
}
