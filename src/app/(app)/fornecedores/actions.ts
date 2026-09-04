"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR, zodFieldErrors } from "@/lib/action-result";
import { supplierSchema } from "./schema";

function parse(formData: FormData) {
  return supplierSchema.safeParse({
    company_name: formData.get("company_name") ?? "",
    document: formData.get("document") ?? "",
    contact_name: formData.get("contact_name") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

export async function createSupplierAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: "Verifique os campos destacados.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("suppliers").insert(parsed.data).select("id, company_name").single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "supplier", entityId: data.id, action: "created", summary: `Fornecedor criado: ${data.company_name}` });
  revalidatePath("/fornecedores");
  return { ok: true, data: { id: data.id } };
}

export async function updateSupplierAction(id: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: "Verifique os campos destacados.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("suppliers").update(parsed.data).eq("id", id).select("id, company_name").single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "supplier", entityId: id, action: "updated", summary: `Fornecedor alterado: ${data.company_name}` });
  revalidatePath("/fornecedores");
  return { ok: true, data: { id } };
}

export async function deleteSupplierAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { count } = await supabase.from("accounts_payable").select("id", { count: "exact", head: true }).eq("supplier_id", id);
  if ((count ?? 0) > 0) {
    return { ok: false, error: "Este fornecedor possui contas a pagar vinculadas e não pode ser excluído." };
  }
  const { data: existing } = await supabase.from("suppliers").select("company_name").eq("id", id).single();
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "supplier", entityId: id, action: "deleted", summary: `Fornecedor excluído: ${existing?.company_name ?? id}` });
  revalidatePath("/fornecedores");
  return { ok: true, data: undefined };
}
