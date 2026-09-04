import { createClient } from "@/lib/supabase/server";

export type ClientOption = { id: string; label: string };
export type MoldOption = { id: string; client_id: string; label: string };

/** Clientes para selects (ordenados por nome de exibição). */
export async function getClientOptions(): Promise<ClientOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, legal_name, trade_name")
    .order("legal_name", { ascending: true });
  return (data ?? []).map((c) => ({
    id: c.id,
    label: c.trade_name || c.legal_name,
  }));
}

export type ClientData = {
  id: string;
  legal_name: string;
  trade_name: string | null;
  document: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
};
export type MoldData = {
  id: string;
  client_id: string;
  code: string;
  description: string | null;
  cavities: number | null;
  type: "single_cavity" | "multi_cavity" | null;
};
export type CompanyDoc = {
  legalName: string;
  document: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoUrl: string;
};

/** Clientes completos (para preview do documento e selects). */
export async function getClientsData(): Promise<ClientData[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, legal_name, trade_name, document, contact_name, phone, email, city")
    .order("legal_name", { ascending: true });
  return (data ?? []) as ClientData[];
}

/** Moldes completos (para preview do documento e selects). */
export async function getMoldsData(): Promise<MoldData[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("molds")
    .select("id, client_id, code, description, cavities, type")
    .order("code", { ascending: true });
  return (data ?? []) as MoldData[];
}

/** Dados da empresa para o documento. */
export async function getCompanyDoc(): Promise<CompanyDoc> {
  const supabase = await createClient();
  const { data } = await supabase.from("company_settings").select("*").eq("id", 1).single();
  return {
    legalName: data?.legal_name ?? "Advance Tecnologia em Moldes",
    document: data?.document ?? null,
    address: data?.address ?? null,
    phone: data?.phone ?? null,
    email: data?.email ?? null,
    website: data?.website ?? null,
    logoUrl: data?.logo_url || "/brand/logo-advance-blue.png",
  };
}

export type SupplierOption = { id: string; label: string };

/** Fornecedores para selects. */
export async function getSupplierOptions(): Promise<SupplierOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("suppliers")
    .select("id, company_name")
    .order("company_name", { ascending: true });
  return (data ?? []).map((s) => ({ id: s.id, label: s.company_name }));
}

/** Moldes para selects (com client_id para filtrar por cliente no front). */
export async function getMoldOptions(): Promise<MoldOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("molds")
    .select("id, client_id, code, description")
    .order("code", { ascending: true });
  return (data ?? []).map((m) => ({
    id: m.id,
    client_id: m.client_id,
    label: m.description ? `${m.code} — ${m.description}` : m.code,
  }));
}
