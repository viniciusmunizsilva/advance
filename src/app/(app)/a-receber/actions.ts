"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR, zodFieldErrors } from "@/lib/action-result";
import { receivableSchema } from "./schema";

function parse(formData: FormData) {
  return receivableSchema.safeParse({
    client_id: formData.get("client_id") ?? "",
    quote_id: formData.get("quote_id") ?? "",
    description: formData.get("description") ?? "",
    amount: formData.get("amount") ?? "",
    due_date: formData.get("due_date") ?? "",
    paid_date: formData.get("paid_date") ?? "",
    status: formData.get("status") ?? "open",
    notes: formData.get("notes") ?? "",
  });
}

export async function createReceivableAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Verifique os campos.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts_receivable").insert(parsed.data).select("id, description").single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "receivable", entityId: data.id, action: "created", summary: `Conta a receber criada: ${data.description}` });
  revalidatePath("/a-receber");
  return { ok: true, data: { id: data.id } };
}

export async function updateReceivableAction(id: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: "Verifique os campos.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts_receivable").update(parsed.data).eq("id", id).select("id, description").single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "receivable", entityId: id, action: "updated", summary: `Conta a receber alterada: ${data.description}` });
  revalidatePath("/a-receber");
  return { ok: true, data: { id } };
}

export async function markReceivablePaidAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.from("accounts_receivable").update({ status: "paid", paid_date: today }).eq("id", id).select("description").single();
  if (error) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "receivable", entityId: id, action: "paid", summary: `Recebimento registrado: ${data?.description ?? ""}` });
  revalidatePath("/a-receber");
  return { ok: true, data: undefined };
}

export async function deleteReceivableAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts_receivable").delete().eq("id", id);
  if (error) return { ok: false, error: GENERIC_ERROR };
  await logActivity({ entityType: "receivable", entityId: id, action: "deleted", summary: "Conta a receber excluída" });
  revalidatePath("/a-receber");
  return { ok: true, data: undefined };
}
