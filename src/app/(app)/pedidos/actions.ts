"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR } from "@/lib/action-result";
import type { Database } from "@/lib/supabase/database.types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const STATUS_LABEL: Record<OrderStatus, string> = {
  open: "em aberto",
  completed: "concluído",
  cancelled: "cancelado",
};

export async function setOrderStatusAction(
  id: string,
  status: OrderStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders").update({ status }).eq("id", id).select("number").single();
  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({
    entityType: "order", entityId: id, action: `status_${status}`,
    summary: `Pedido Nº ${data?.number ?? ""} → ${STATUS_LABEL[status]}`,
  });

  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${id}`);
  return { ok: true, data: undefined };
}

/**
 * Arquiva/desarquiva um pedido. Ao arquivar, as contas a receber vinculadas em
 * aberto são canceladas (saem do financeiro); ao desarquivar, voltam a abrir.
 */
export async function archiveOrderAction(
  id: string,
  archived: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders").update({ archived }).eq("id", id).select("number").single();
  if (error) return { ok: false, error: GENERIC_ERROR };

  if (archived) {
    // Remove do financeiro: cancela contas a receber em aberto do pedido.
    await supabase
      .from("accounts_receivable")
      .update({ status: "cancelled" })
      .eq("order_id", id)
      .eq("status", "open");
  } else {
    // Reabre as que estavam canceladas por causa do arquivamento (não pagas).
    await supabase
      .from("accounts_receivable")
      .update({ status: "open" })
      .eq("order_id", id)
      .eq("status", "cancelled");
  }

  await logActivity({
    entityType: "order", entityId: id, action: archived ? "archived" : "unarchived",
    summary: `Pedido Nº ${data?.number ?? ""} ${archived ? "arquivado" : "desarquivado"}`,
  });

  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${id}`);
  revalidatePath("/arquivados");
  revalidatePath("/a-receber");
  return { ok: true, data: undefined };
}
