"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR, zodFieldErrors } from "@/lib/action-result";
import { serviceSchema } from "./schema";
import type { Database } from "@/lib/supabase/database.types";

type ServiceStatus = Database["public"]["Enums"]["service_status"];

function parse(formData: FormData) {
  return serviceSchema.safeParse({
    client_id: formData.get("client_id") ?? "",
    mold_id: formData.get("mold_id") ?? "",
    quote_id: formData.get("quote_id") ?? "",
    type: formData.get("type") ?? "other",
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    responsible: formData.get("responsible") ?? "",
    start_date: formData.get("start_date") ?? "",
    expected_delivery_date: formData.get("expected_delivery_date") ?? "",
    status: formData.get("status") ?? "waiting",
  });
}

export async function createServiceAction(
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
    .from("services")
    .insert(parsed.data)
    .select("id, title")
    .single();

  if (error) {
    if (error.message?.includes("não pertence ao cliente")) {
      return { ok: false, error: "O molde selecionado não pertence ao cliente." };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  await logActivity({
    entityType: "service",
    entityId: data.id,
    action: "created",
    summary: `Serviço criado: ${data.title}`,
  });

  revalidatePath("/servicos");
  return { ok: true, data: { id: data.id } };
}

export async function updateServiceAction(
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
    .from("services")
    .update(parsed.data)
    .eq("id", id)
    .select("id, title")
    .single();

  if (error) {
    if (error.message?.includes("não pertence ao cliente")) {
      return { ok: false, error: "O molde selecionado não pertence ao cliente." };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  await logActivity({
    entityType: "service",
    entityId: id,
    action: "updated",
    summary: `Serviço alterado: ${data.title}`,
  });

  revalidatePath("/servicos");
  revalidatePath(`/servicos/${id}`);
  return { ok: true, data: { id } };
}

const STATUS_LABEL: Record<ServiceStatus, string> = {
  waiting: "aguardando",
  analysis: "em análise",
  in_progress: "em execução",
  waiting_client: "aguardando cliente",
  completed: "concluído",
  delivered: "entregue",
  cancelled: "cancelado",
};

export async function changeServiceStatusAction(
  id: string,
  status: ServiceStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .update({ status })
    .eq("id", id)
    .select("title")
    .single();

  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "service",
    entityId: id,
    action: `status_${status}`,
    summary: `Serviço "${data?.title ?? ""}" → ${STATUS_LABEL[status]}`,
  });

  revalidatePath("/servicos");
  revalidatePath(`/servicos/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("services").select("title").eq("id", id).single();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "service",
    entityId: id,
    action: "deleted",
    summary: `Serviço excluído: ${existing?.title ?? id}`,
  });

  revalidatePath("/servicos");
  return { ok: true, data: undefined };
}
