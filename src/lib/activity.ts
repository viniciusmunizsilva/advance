import { createClient } from "@/lib/supabase/server";

export type EntityType =
  | "client"
  | "mold"
  | "quote"
  | "service"
  | "receivable"
  | "payable"
  | "supplier";

type LogInput = {
  entityType: EntityType;
  entityId?: string | null;
  action: string;
  summary: string;
  metadata?: Record<string, unknown>;
};

/**
 * Registra um evento no histórico (activity_logs), com o autor da sessão atual.
 * Best-effort: falha de log não deve derrubar a operação de negócio.
 */
export async function logActivity(input: LogInput): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let actorName: string | null = null;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();
      actorName = profile?.name ?? user.email ?? null;
    }

    await supabase.from("activity_logs").insert({
      actor_id: user?.id ?? null,
      actor_name: actorName,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      action: input.action,
      summary: input.summary,
      metadata: (input.metadata ?? {}) as never,
    });
  } catch {
    // silencioso — histórico é secundário à operação
  }
}
