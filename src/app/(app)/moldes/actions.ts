"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import {
  type ActionResult,
  GENERIC_ERROR,
  zodFieldErrors,
} from "@/lib/action-result";
import { moldSchema } from "./schema";

function parse(formData: FormData) {
  return moldSchema.safeParse({
    client_id: formData.get("client_id") ?? "",
    code: formData.get("code") ?? "",
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? "",
    cavities: formData.get("cavities") ?? "",
    type: formData.get("type") ?? "",
    application: formData.get("application") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

const DUPLICATE_CODE = "Já existe um molde com este código.";

export async function createMoldAction(
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
    .from("molds")
    .insert(parsed.data)
    .select("id, code, description")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: DUPLICATE_CODE, fieldErrors: { code: DUPLICATE_CODE } };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  await logActivity({
    entityType: "mold",
    entityId: data.id,
    action: "created",
    summary: `Molde criado: ${data.code}${data.description ? ` — ${data.description}` : ""}`,
  });

  revalidatePath("/moldes");
  return { ok: true, data: { id: data.id } };
}

export async function updateMoldAction(
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
    .from("molds")
    .update(parsed.data)
    .eq("id", id)
    .select("id, code, description")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: DUPLICATE_CODE, fieldErrors: { code: DUPLICATE_CODE } };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  await logActivity({
    entityType: "mold",
    entityId: id,
    action: "updated",
    summary: `Molde alterado: ${data.code}`,
  });

  revalidatePath("/moldes");
  revalidatePath(`/moldes/${id}`);
  return { ok: true, data: { id } };
}

export async function deleteMoldAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const [{ count: quotes }, { count: services }] = await Promise.all([
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("mold_id", id),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("mold_id", id),
  ]);

  if ((quotes ?? 0) > 0 || (services ?? 0) > 0) {
    return {
      ok: false,
      error: "Este molde possui orçamentos ou serviços vinculados e não pode ser excluído.",
    };
  }

  const { data: existing } = await supabase.from("molds").select("code").eq("id", id).single();
  const { error } = await supabase.from("molds").delete().eq("id", id);
  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "mold",
    entityId: id,
    action: "deleted",
    summary: `Molde excluído: ${existing?.code || id}`,
  });

  revalidatePath("/moldes");
  return { ok: true, data: undefined };
}
