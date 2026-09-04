"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { type ActionResult, GENERIC_ERROR, zodFieldErrors } from "@/lib/action-result";

const optionalText = z.string().trim().transform((v) => (v.length === 0 ? null : v)).nullable();

const companySchema = z.object({
  legal_name: z.string().trim().min(1, "Informe a razão social."),
  document: optionalText,
  address: optionalText,
  phone: optionalText,
  email: optionalText,
  website: optionalText,
  quote_default_validity_days: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? 15 : Number(v)))
    .refine((v) => Number.isInteger(v) && v > 0, "Valor inválido."),
  quote_default_payment_terms: optionalText,
});

export async function updateCompanyAction(formData: FormData): Promise<ActionResult> {
  const parsed = companySchema.safeParse({
    legal_name: formData.get("legal_name") ?? "",
    document: formData.get("document") ?? "",
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    website: formData.get("website") ?? "",
    quote_default_validity_days: formData.get("quote_default_validity_days") ?? "",
    quote_default_payment_terms: formData.get("quote_default_payment_terms") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: "Verifique os campos.", fieldErrors: zodFieldErrors(parsed.error.flatten().fieldErrors) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("company_settings").update(parsed.data).eq("id", 1);
  if (error) return { ok: false, error: GENERIC_ERROR };

  await logActivity({ entityType: "client", action: "updated", summary: "Configurações da empresa atualizadas" });
  revalidatePath("/configuracoes");
  return { ok: true, data: undefined };
}
