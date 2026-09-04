"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR, zodFieldErrors } from "@/lib/action-result";
import { quoteSchema, type QuoteInput } from "./schema";
import type { Database } from "@/lib/supabase/database.types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];

function payloadFrom(input: QuoteInput, status?: QuoteStatus) {
  return {
    client_id: input.client_id,
    mold_id: input.mold_id ?? "",
    service_type: input.service_type ?? "",
    description: input.description ?? "",
    discount: String(input.discount ?? 0),
    deadline: input.deadline ?? "",
    validity_date: input.validity_date ?? "",
    payment_terms: input.payment_terms ?? "",
    notes: input.notes ?? "",
    ...(status ? { status } : {}),
  };
}

function itemsFrom(input: QuoteInput) {
  return input.items.map((it, i) => ({
    description: it.description,
    quantity: it.quantity,
    unit_price: it.unit_price,
    sort_order: it.sort_order ?? i,
  }));
}

export async function createQuoteAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos do orçamento.",
      fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_quote", {
    p: payloadFrom(parsed.data) as never,
    items: itemsFrom(parsed.data) as never,
  });

  if (error || !data) {
    if (error?.message?.includes("não pertence ao cliente")) {
      return { ok: false, error: "O molde selecionado não pertence ao cliente." };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  const id = data as string;
  const { data: q } = await supabase.from("quotes").select("number").eq("id", id).single();
  await logActivity({
    entityType: "quote",
    entityId: id,
    action: "created",
    summary: `Orçamento #${q?.number ?? ""} criado`,
  });

  revalidatePath("/orcamentos");
  return { ok: true, data: { id } };
}

export async function updateQuoteAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos do orçamento.",
      fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_quote", {
    p_id: id,
    p: payloadFrom(parsed.data) as never,
    items: itemsFrom(parsed.data) as never,
  });

  if (error) {
    if (error.message?.includes("não pertence ao cliente")) {
      return { ok: false, error: "O molde selecionado não pertence ao cliente." };
    }
    return { ok: false, error: GENERIC_ERROR };
  }

  const { data: q } = await supabase.from("quotes").select("number").eq("id", id).single();
  await logActivity({
    entityType: "quote",
    entityId: id,
    action: "updated",
    summary: `Orçamento #${q?.number ?? ""} alterado`,
  });

  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
  return { ok: true, data: { id } };
}

export async function duplicateQuoteAction(
  sourceId: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("duplicate_quote", { p_source: sourceId });
  if (error || !data) return { ok: false, error: GENERIC_ERROR };

  const id = data as string;
  const { data: q } = await supabase.from("quotes").select("number").eq("id", id).single();
  const { data: src } = await supabase.from("quotes").select("number").eq("id", sourceId).single();
  await logActivity({
    entityType: "quote",
    entityId: id,
    action: "duplicated",
    summary: `Orçamento #${q?.number ?? ""} criado a partir do #${src?.number ?? ""}`,
  });

  revalidatePath("/orcamentos");
  return { ok: true, data: { id } };
}

const STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: "rascunho",
  sent: "enviado",
  approved: "aprovado",
  rejected: "recusado",
  expired: "expirado",
  cancelled: "cancelado",
};

export async function changeQuoteStatusAction(
  id: string,
  status: QuoteStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", id)
    .select("number")
    .single();

  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "quote",
    entityId: id,
    action: `status_${status}`,
    summary: `Orçamento #${data?.number ?? ""} marcado como ${STATUS_LABEL[status]}`,
  });

  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
  return { ok: true, data: undefined };
}
