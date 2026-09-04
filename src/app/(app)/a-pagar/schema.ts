import { z } from "zod";

const optionalText = z.string().trim().transform((v) => (v.length === 0 ? null : v)).nullable();
const optionalDate = z.string().trim().transform((v) => (v.length === 0 ? null : v)).nullable();

export const payableSchema = z.object({
  supplier_id: z.string().uuid().nullable().or(z.literal("").transform(() => null)),
  description: z.string().trim().min(1, "Informe uma descrição."),
  amount: z
    .string()
    .trim()
    .transform((v) => Number(v.replace(",", ".")))
    .refine((v) => Number.isFinite(v) && v >= 0, "Valor inválido."),
  due_date: z.string().trim().min(1, "Informe o vencimento."),
  paid_date: optionalDate,
  status: z.enum(["open", "paid", "overdue", "cancelled"]),
  notes: optionalText,
});

export type PayableInput = z.infer<typeof payableSchema>;
