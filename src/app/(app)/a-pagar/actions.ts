"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR, zodFieldErrors } from "@/lib/action-result";
import { payableSchema } from "./schema";

function parse(formData: FormData) {
  return payableSchema.safeParse({
    supplier_id: formData.get("supplier_id") ?? "",
    description: formData.get("description") ?? "",
    amount: formData.get("amount") ?? "",
    due_date: formData.get("due_date") ?? "",
    paid_date: formData.get("paid_date") ?? "",
    status: formData.get("status") ?? "open",
    notes: formData.get("notes") ?? "",
  });
}

export async function createPayableAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Verifique os campos.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts_payable").insert(parsed.data).select("id, description").single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "payable", entityId: data.id, action: "created", summary: `Conta a pagar criada: ${data.description}` });
  revalidatePath("/a-pagar");
  return { ok: true, data: { id: data.id } };
}

export async function updatePayableAction(id: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Verifique os campos.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts_payable").update(parsed.data).eq("id", id).select("id, description").single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "payable", entityId: id, action: "updated", summary: `Conta a pagar alterada: ${data.description}` });
  revalidatePath("/a-pagar");
  return { ok: true, data: { id } };
}

export async function markPayablePaidAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.from("accounts_payable").update({ status: "paid", paid_date: today }).eq("id", id).select("description").single();
  if (error) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "payable", entityId: id, action: "paid", summary: `Pagamento registrado: ${data?.description ?? ""}` });
  revalidatePath("/a-pagar");
  return { ok: true, data: undefined };
}

export async function deletePayableAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts_payable").delete().eq("id", id);
  if (error) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "payable", entityId: id, action: "deleted", summary: "Conta a pagar excluída" });
  revalidatePath("/a-pagar");
  return { ok: true, data: undefined };
}
