"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/lib/supabase/database.types";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/toast";
import { updateCompanyAction } from "./actions";

export function CompanyForm({ company }: { company: Tables<"company_settings"> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const r = await updateCompanyAction(formData);
      if (!r.ok) { setErrors(r.fieldErrors ?? {}); toast(r.error, "error"); return; }
      toast("Configurações salvas.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-head"><h3>Dados da empresa</h3></div>
        <div className="card-body">
          <FormField label="Razão social" htmlFor="legal_name" required error={errors.legal_name}>
            <input id="legal_name" name="legal_name" className="input" required defaultValue={company.legal_name} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormField label="CNPJ" htmlFor="document" error={errors.document}>
              <input id="document" name="document" className="input" defaultValue={company.document ?? ""} />
            </FormField>
            <FormField label="Telefone" htmlFor="phone" error={errors.phone}>
              <input id="phone" name="phone" className="input" defaultValue={company.phone ?? ""} />
            </FormField>
            <FormField label="E-mail" htmlFor="email" error={errors.email}>
              <input id="email" name="email" className="input" defaultValue={company.email ?? ""} />
            </FormField>
            <FormField label="Site" htmlFor="website" error={errors.website}>
              <input id="website" name="website" className="input" defaultValue={company.website ?? ""} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Endereço" htmlFor="address" error={errors.address}>
                <input id="address" name="address" className="input" defaultValue={company.address ?? ""} />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head"><h3>Padrões de orçamento</h3></div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormField label="Validade padrão (dias)" htmlFor="quote_default_validity_days" error={errors.quote_default_validity_days}>
              <input id="quote_default_validity_days" name="quote_default_validity_days" type="number" min={1} className="input" defaultValue={company.quote_default_validity_days} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Condição de pagamento padrão" htmlFor="quote_default_payment_terms" error={errors.quote_default_payment_terms}>
                <input id="quote_default_payment_terms" name="quote_default_payment_terms" className="input" defaultValue={company.quote_default_payment_terms ?? ""} />
              </FormField>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Salvando…" : "Salvar configurações"}</button>
        </div>
      </div>
    </form>
  );
}
