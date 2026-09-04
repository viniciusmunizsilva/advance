"use server";

import { createClient } from "@/lib/supabase/server";

/** Aprovação da proposta pelo cliente via link público (token-gated). */
export async function approveProposalAction(token: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("approve_public_quote", { p_token: token });
  if (error) return { ok: false };
  return { ok: data === true };
}
