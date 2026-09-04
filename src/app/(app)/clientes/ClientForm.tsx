"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/lib/supabase/database.types";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/toast";
import { createClientAction, updateClientAction } from "./actions";

type Client = Tables<"clients">;

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!client;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const result = isEdit
        ? await updateClientAction(client!.id, formData)
        : await createClientAction(formData);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast(result.error, "error");
        return;
      }
      toast(isEdit ? "Cliente atualizado." : "Cliente criado.");
      router.push(`/clientes/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Razão social" htmlFor="legal_name" required error={errors.legal_name}>
                <input id="legal_name" name="legal_name" className="input" required
                  defaultValue={client?.legal_name ?? ""} />
              </FormField>
            </div>
            <FormField label="Nome fantasia" htmlFor="trade_name" error={errors.trade_name}>
              <input id="trade_name" name="trade_name" className="input" defaultValue={client?.trade_name ?? ""} />
            </FormField>
            <FormField label="CNPJ / CPF" htmlFor="document" error={errors.document}>
              <input id="document" name="document" className="input" defaultValue={client?.document ?? ""} />
            </FormField>
            <FormField label="Telefone" htmlFor="phone" error={errors.phone}>
              <input id="phone" name="phone" className="input" defaultValue={client?.phone ?? ""} />
            </FormField>
            <FormField label="E-mail" htmlFor="email" error={errors.email}>
              <input id="email" name="email" type="email" className="input" defaultValue={client?.email ?? ""} />
            </FormField>
            <FormField label="Contato" htmlFor="contact_name" error={errors.contact_name}>
              <input id="contact_name" name="contact_name" className="input" defaultValue={client?.contact_name ?? ""} />
            </FormField>
            <FormField label="Cidade / UF" htmlFor="city" error={errors.city}>
              <input id="city" name="city" className="input" placeholder="Ex.: Diadema · SP" defaultValue={client?.city ?? ""} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Endereço" htmlFor="address" error={errors.address}>
                <input id="address" name="address" className="input" defaultValue={client?.address ?? ""} />
              </FormField>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Observações" htmlFor="notes" error={errors.notes}>
                <textarea id="notes" name="notes" className="input" rows={3} defaultValue={client?.notes ?? ""} />
              </FormField>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={pending}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar cliente"}
          </button>
        </div>
      </div>
    </form>
  );
}
