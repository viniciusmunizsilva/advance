"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import {
  type ActionResult,
  GENERIC_ERROR,
  zodFieldErrors,
} from "@/lib/action-result";
import { clientSchema } from "./schema";

function parse(formData: FormData) {
  return clientSchema.safeParse({
    legal_name: formData.get("legal_name") ?? "",
    trade_name: formData.get("trade_name") ?? "",
    document: formData.get("document") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    city: formData.get("city") ?? "",
    address: formData.get("address") ?? "",
    contact_name: formData.get("contact_name") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

export async function createClientAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos destacados.",
      fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(parsed.data)
    .select("id, legal_name, trade_name")
    .single();

  if (error || !data) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "client",
    entityId: data.id,
    action: "created",
    summary: `Cliente criado: ${data.trade_name || data.legal_name}`,
  });

  revalidatePath("/clientes");
  return { ok: true, data: { id: data.id } };
}

export async function updateClientAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos destacados.",
      fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .update(parsed.data)
    .eq("id", id)
    .select("id, legal_name, trade_name")
    .single();

  if (error || !data) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "client",
    entityId: id,
    action: "updated",
    summary: `Cliente alterado: ${data.trade_name || data.legal_name}`,
  });

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  return { ok: true, data: { id } };
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Bloqueia exclusão quando há vínculos (preserva rastreabilidade).
  const [{ count: molds }, { count: quotes }] = await Promise.all([
    supabase.from("molds").select("id", { count: "exact", head: true }).eq("client_id", id),
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("client_id", id),
  ]);

  if ((molds ?? 0) > 0 || (quotes ?? 0) > 0) {
    return {
      ok: false,
      error:
        "Este cliente possui moldes ou orçamentos vinculados e não pode ser excluído.",
    };
  }

  const { data: existing } = await supabase
    .from("clients")
    .select("legal_name, trade_name")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "client",
    entityId: id,
    action: "deleted",
    summary: `Cliente excluído: ${existing?.trade_name || existing?.legal_name || id}`,
  });

  revalidatePath("/clientes");
  return { ok: true, data: undefined };
}
