import { z } from "zod";

/** Normaliza string vazia/espacos em null (campos opcionais). */
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

export const clientSchema = z.object({
  legal_name: z
    .string()
    .trim()
    .min(1, "Informe a razão social."),
  trade_name: optionalText,
  document: optionalText,
  phone: optionalText,
  email: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : v))
    .nullable()
    .refine(
      (v) => v === null || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
      "E-mail inválido.",
    ),
  city: optionalText,
  address: optionalText,
  contact_name: optionalText,
  notes: optionalText,
});

export type ClientInput = z.infer<typeof clientSchema>;
