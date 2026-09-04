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
