import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

export const serviceSchema = z.object({
  client_id: z.string().uuid("Selecione um cliente."),
  mold_id: z.string().uuid().nullable().or(z.literal("").transform(() => null)),
  quote_id: z.string().uuid().nullable().or(z.literal("").transform(() => null)),
  type: z.enum(["construction", "maintenance", "alteration", "machining", "other"]),
  title: z.string().trim().min(1, "Informe um título para o serviço."),
  description: optionalText,
  responsible: optionalText,
  start_date: optionalDate,
  expected_delivery_date: optionalDate,
  status: z.enum([
    "waiting",
    "analysis",
    "in_progress",
    "waiting_client",
    "completed",
    "delivered",
    "cancelled",
  ]),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
