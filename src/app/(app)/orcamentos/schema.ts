import { z } from "zod";

export const quoteItemSchema = z.object({
  description: z.string().trim().min(1, "Descreva o item."),
  quantity: z.number().positive("Quantidade deve ser maior que zero."),
  unit_price: z.number().min(0, "Valor unitário inválido."),
  sort_order: z.number().int(),
});

export const quoteSchema = z.object({
  client_id: z.string().uuid("Selecione um cliente."),
  mold_id: z.string().uuid().nullable().or(z.literal("").transform(() => null)),
  service_type: z
    .enum(["construction", "maintenance", "alteration", "machining", "other"])
    .nullable()
    .or(z.literal("").transform(() => null)),
  description: z.string().trim().nullable().or(z.literal("").transform(() => null)),
  discount: z.number().min(0, "Desconto inválido.").default(0),
  deadline: z.string().trim().nullable().or(z.literal("").transform(() => null)),
  validity_date: z.string().trim().nullable().or(z.literal("").transform(() => null)),
  payment_terms: z.string().trim().nullable().or(z.literal("").transform(() => null)),
  notes: z.string().trim().nullable().or(z.literal("").transform(() => null)),
  items: z.array(quoteItemSchema).min(1, "Adicione pelo menos um item."),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteItemInput = z.infer<typeof quoteItemSchema>;
