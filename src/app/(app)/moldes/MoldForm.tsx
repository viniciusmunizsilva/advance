"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/lib/supabase/database.types";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/toast";
import { MOLD_TYPE } from "@/lib/domain";
import { createMoldAction, updateMoldAction } from "./actions";

type Mold = Tables<"molds">;
type ClientOption = { id: string; label: string };

export function MoldForm({
  mold,
  clients,
  defaultClientId,
}: {
  mold?: Mold;
  clients: ClientOption[];
  defaultClientId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!mold;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const result = isEdit
        ? await updateMoldAction(mold!.id, formData)
        : await createMoldAction(formData);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast(result.error, "error");
        return;
      }
      toast(isEdit ? "Molde atualizado." : "Molde criado.");
      router.push(`/moldes/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-body">
          <FormField label="Cliente" htmlFor="client_id" required error={errors.client_id}>
            <select
              id="client_id"
              name="client_id"
              className="select"
              style={{ width: "100%" }}
              required
              defaultValue={mold?.client_id ?? defaultClientId ?? ""}
              disabled={isEdit}
            >
              <option value="" disabled>Selecione um cliente…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {isEdit && (
              <input type="hidden" name="client_id" value={mold!.client_id} />
            )}
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormField label="Código" htmlFor="code" required error={errors.code}>
              <input id="code" name="code" className="input" placeholder="Ex.: M-1048" required defaultValue={mold?.code ?? ""} />
            </FormField>
            <FormField label="Descrição" htmlFor="description" error={errors.description}>
              <input id="description" name="description" className="input" placeholder="Ex.: Tampa XZ 250ml" defaultValue={mold?.description ?? ""} />
            </FormField>
            <FormField label="Tipo" htmlFor="type" error={errors.type}>
              <select id="type" name="type" className="select" style={{ width: "100%" }} defaultValue={mold?.type ?? ""}>
                <option value="">—</option>
                {(Object.keys(MOLD_TYPE) as (keyof typeof MOLD_TYPE)[]).map((k) => (
                  <option key={k} value={k}>{MOLD_TYPE[k]}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Cavidades" htmlFor="cavities" error={errors.cavities}>
              <input id="cavities" name="cavities" type="number" min={1} className="input" defaultValue={mold?.cavities ?? ""} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Aplicação" htmlFor="application" error={errors.application}>
                <input id="application" name="application" className="input" defaultValue={mold?.application ?? ""} />
              </FormField>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Observações" htmlFor="notes" error={errors.notes}>
                <textarea id="notes" name="notes" className="input" rows={3} defaultValue={mold?.notes ?? ""} />
              </FormField>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={pending}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar molde"}
          </button>
        </div>
      </div>
    </form>
  );
}
