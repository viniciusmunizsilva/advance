"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/lib/supabase/database.types";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/toast";
import { SERVICE_TYPE, SERVICE_STATUS } from "@/lib/domain";
import type { ClientOption, MoldOption } from "@/lib/queries";
import { createServiceAction, updateServiceAction } from "./actions";

type Service = Tables<"services">;

export type ServiceDefaults = {
  client_id?: string;
  mold_id?: string;
  quote_id?: string;
  type?: string;
  title?: string;
};

export function ServiceForm({
  service,
  clients,
  molds,
  defaults,
}: {
  service?: Service;
  clients: ClientOption[];
  molds: MoldOption[];
  defaults?: ServiceDefaults;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!service;

  const [clientId, setClientId] = useState(service?.client_id ?? defaults?.client_id ?? "");
  const [moldId, setMoldId] = useState(service?.mold_id ?? defaults?.mold_id ?? "");
  const quoteId = service?.quote_id ?? defaults?.quote_id ?? "";

  const moldsForClient = useMemo(
    () => molds.filter((m) => m.client_id === clientId),
    [molds, clientId],
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const result = isEdit
        ? await updateServiceAction(service!.id, formData)
        : await createServiceAction(formData);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast(result.error, "error");
        return;
      }
      toast(isEdit ? "Serviço atualizado." : "Serviço criado.");
      router.push(`/servicos/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-body">
          <input type="hidden" name="quote_id" value={quoteId} />
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="mold_id" value={moldId} />

          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Título do serviço" htmlFor="title" required error={errors.title}>
              <input id="title" name="title" className="input" required defaultValue={service?.title ?? defaults?.title ?? ""} />
            </FormField>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormField label="Cliente" htmlFor="client_sel" required error={errors.client_id}>
              <select id="client_sel" className="select" style={{ width: "100%" }} required
                value={clientId} onChange={(e) => { setClientId(e.target.value); setMoldId(""); }}>
                <option value="" disabled>Selecione…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </FormField>
            <FormField label="Molde" htmlFor="mold_sel" error={errors.mold_id}>
              <select id="mold_sel" className="select" style={{ width: "100%" }}
                value={moldId} onChange={(e) => setMoldId(e.target.value)} disabled={!clientId}>
                <option value="">— (opcional)</option>
                {moldsForClient.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </FormField>
            <FormField label="Tipo" htmlFor="type" required error={errors.type}>
              <select id="type" name="type" className="select" style={{ width: "100%" }} defaultValue={service?.type ?? defaults?.type ?? "other"}>
                {(Object.keys(SERVICE_TYPE) as (keyof typeof SERVICE_TYPE)[]).map((k) =>
                  <option key={k} value={k}>{SERVICE_TYPE[k]}</option>)}
              </select>
            </FormField>
            <FormField label="Status" htmlFor="status" required error={errors.status}>
              <select id="status" name="status" className="select" style={{ width: "100%" }} defaultValue={service?.status ?? "waiting"}>
                {(Object.keys(SERVICE_STATUS) as (keyof typeof SERVICE_STATUS)[]).map((k) =>
                  <option key={k} value={k}>{SERVICE_STATUS[k].label}</option>)}
              </select>
            </FormField>
            <FormField label="Responsável" htmlFor="responsible" error={errors.responsible}>
              <input id="responsible" name="responsible" className="input" defaultValue={service?.responsible ?? ""} />
            </FormField>
            <FormField label="Início" htmlFor="start_date" error={errors.start_date}>
              <input id="start_date" name="start_date" type="date" className="input" defaultValue={service?.start_date ?? ""} />
            </FormField>
            <FormField label="Entrega prevista" htmlFor="expected_delivery_date" error={errors.expected_delivery_date}>
              <input id="expected_delivery_date" name="expected_delivery_date" type="date" className="input" defaultValue={service?.expected_delivery_date ?? ""} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Descrição" htmlFor="description" error={errors.description}>
                <textarea id="description" name="description" className="input" rows={3} defaultValue={service?.description ?? ""} />
              </FormField>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={pending}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar serviço"}
          </button>
        </div>
      </div>
    </form>
  );
}
