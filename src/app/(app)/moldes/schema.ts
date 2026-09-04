import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

export const moldSchema = z.object({
  client_id: z.string().uuid("Selecione um cliente."),
  code: z.string().trim().min(1, "Informe o código do molde."),
  name: optionalText,
  description: optionalText,
  cavities: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? null : Number(v)))
    .nullable()
    .refine(
      (v) => v === null || (Number.isInteger(v) && v > 0),
      "Número de cavidades inválido.",
    ),
  type: z
    .enum(["single_cavity", "multi_cavity"])
    .nullable()
    .or(z.literal("").transform(() => null)),
  application: optionalText,
  notes: optionalText,
});

export type MoldInput = z.infer<typeof moldSchema>;
