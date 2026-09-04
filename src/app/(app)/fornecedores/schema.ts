import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

export const supplierSchema = z.object({
  company_name: z.string().trim().min(1, "Informe o nome do fornecedor."),
  document: optionalText,
  contact_name: optionalText,
  phone: optionalText,
  email: optionalText,
  notes: optionalText,
});

export type SupplierInput = z.infer<typeof supplierSchema>;
