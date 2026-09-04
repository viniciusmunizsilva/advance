"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/toast";
import { fmtBRLc } from "@/lib/format";
import { SERVICE_TYPE } from "@/lib/domain";
import type { ClientOption, MoldOption } from "@/lib/queries";
import { createQuoteAction, updateQuoteAction } from "./actions";

type ItemRow = { key: string; description: string; quantity: string; unit_price: string };

export type QuoteFormData = {
  id: string;
  client_id: string;
  mold_id: string | null;
  service_type: string | null;
  description: string | null;
  discount: number;
  deadline: string | null;
  validity_date: string | null;
  payment_terms: string | null;
  notes: string | null;
  items: { description: string; quantity: number; unit_price: number }[];
};

let seq = 0;
const newRow = (): ItemRow => ({
  key: `r${seq++}`,
  description: "",
  quantity: "1",
  unit_price: "0",
});

function num(v: string): number {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function QuoteForm({
  quote,
  clients,
  molds,
  defaultClientId,
  defaultMoldId,
}: {
  quote?: QuoteFormData;
  clients: ClientOption[];
  molds: MoldOption[];
  defaultClientId?: string;
  defaultMoldId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const isEdit = !!quote;

  const [clientId, setClientId] = useState(quote?.client_id ?? defaultClientId ?? "");
  const [moldId, setMoldId] = useState(quote?.mold_id ?? defaultMoldId ?? "");
  const [serviceType, setServiceType] = useState(quote?.service_type ?? "");
  const [discount, setDiscount] = useState(String(quote?.discount ?? 0));
  const [items, setItems] = useState<ItemRow[]>(
    quote?.items.length
      ? quote.items.map((it) => ({
          key: `r${seq++}`,
          description: it.description,
          quantity: String(it.quantity),
          unit_price: String(it.unit_price),
        }))
      : [newRow()],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const moldsForClient = useMemo(
    () => molds.filter((m) => m.client_id === clientId),
    [molds, clientId],
  );

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + num(it.quantity) * num(it.unit_price), 0),
    [items],
  );
  const total = Math.max(0, subtotal - num(discount));

  function updateItem(key: string, patch: Partial<ItemRow>) {
    setItems((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const cleanItems = items
      .filter((it) => it.description.trim().length > 0)
      .map((it, i) => ({
        description: it.description.trim(),
        quantity: num(it.quantity),
        unit_price: num(it.unit_price),
        sort_order: i,
      }));

    if (!clientId) {
      setErrors({ client_id: "Selecione um cliente." });
      toast("Selecione um cliente.", "error");
      return;
    }
    if (cleanItems.length === 0) {
      toast("Adicione pelo menos um item.", "error");
      return;
    }

    const input = {
      client_id: clientId,
      mold_id: moldId || null,
      service_type: serviceType || null,
      description: (document.getElementById("description") as HTMLInputElement)?.value || null,
      discount: num(discount),
      deadline: (document.getElementById("deadline") as HTMLInputElement)?.value || null,
      validity_date: (document.getElementById("validity_date") as HTMLInputElement)?.value || null,
      payment_terms: (document.getElementById("payment_terms") as HTMLInputElement)?.value || null,
      notes: (document.getElementById("notes") as HTMLTextAreaElement)?.value || null,
      items: cleanItems,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateQuoteAction(quote!.id, input)
        : await createQuoteAction(input);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast(result.error, "error");
        return;
      }
      toast(isEdit ? "Orçamento atualizado." : "Orçamento criado.");
      router.push(`/orcamentos/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="detail-grid">
        <div className="stack">
          {/* Cliente / molde / tipo */}
          <div className="card">
            <div className="card-head"><h3>Cliente e molde</h3></div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <FormField label="Cliente" htmlFor="client_id" required error={errors.client_id}>
                  <select id="client_id" className="select" style={{ width: "100%" }} required
                    value={clientId}
                    onChange={(e) => { setClientId(e.target.value); setMoldId(""); }}>
                    <option value="" disabled>Selecione…</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </FormField>
                <FormField label="Molde" htmlFor="mold_id" error={errors.mold_id}
                  hint={clientId && moldsForClient.length === 0 ? "Este cliente não tem moldes cadastrados." : undefined}>
                  <select id="mold_id" className="select" style={{ width: "100%" }}
                    value={moldId} onChange={(e) => setMoldId(e.target.value)} disabled={!clientId}>
                    <option value="">— (opcional)</option>
                    {moldsForClient.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </FormField>
                <FormField label="Tipo de serviço" htmlFor="service_type">
                  <select id="service_type" className="select" style={{ width: "100%" }}
                    value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                    <option value="">—</option>
                    {(Object.keys(SERVICE_TYPE) as (keyof typeof SERVICE_TYPE)[]).map((k) =>
                      <option key={k} value={k}>{SERVICE_TYPE[k]}</option>)}
                  </select>
                </FormField>
                <div style={{ gridColumn: "1 / -1" }}>
                  <FormField label="Descrição / resumo" htmlFor="description">
                    <input id="description" className="input" defaultValue={quote?.description ?? ""} />
                  </FormField>
                </div>
              </div>
            </div>
          </div>

          {/* Itens */}
          <div className="card">
            <div className="card-head">
              <h3>Itens do orçamento</h3>
              <button type="button" className="btn btn-ghost btn-sm ch-link" style={{ marginLeft: "auto" }}
                onClick={() => setItems((r) => [...r, newRow()])}>
                <Plus aria-hidden /> Adicionar item
              </button>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: "48%" }}>Descrição</th>
                    <th style={{ width: 90 }}>Qtd</th>
                    <th style={{ width: 140 }}>Valor unit.</th>
                    <th className="right" style={{ width: 130 }}>Total</th>
                    <th style={{ width: 44 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.key}>
                      <td>
                        <input className="input" placeholder="Descrição do item" value={it.description}
                          onChange={(e) => updateItem(it.key, { description: e.target.value })} />
                      </td>
                      <td>
                        <input className="input" type="number" min={0} step="0.001" value={it.quantity}
                          onChange={(e) => updateItem(it.key, { quantity: e.target.value })} />
                      </td>
                      <td>
                        <input className="input" type="number" min={0} step="0.01" value={it.unit_price}
                          onChange={(e) => updateItem(it.key, { unit_price: e.target.value })} />
                      </td>
                      <td className="right val">{fmtBRLc(num(it.quantity) * num(it.unit_price))}</td>
                      <td>
                        <button type="button" className="btn btn-icon btn-sm" aria-label="Remover item"
                          onClick={() => setItems((r) => (r.length > 1 ? r.filter((x) => x.key !== it.key) : r))}>
                          <Trash2 aria-hidden />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-body" style={{ borderTop: "1px solid var(--border)" }}>
              <div style={{ maxWidth: 320, marginLeft: "auto" }}>
                <div className="sum-row"><span>Subtotal</span><span className="num">{fmtBRLc(subtotal)}</span></div>
                <div className="sum-row" style={{ alignItems: "center" }}>
                  <span>Desconto</span>
                  <input className="input" type="number" min={0} step="0.01" value={discount}
                    onChange={(e) => setDiscount(e.target.value)} style={{ width: 130, textAlign: "right" }} />
                </div>
                <div className="sum-row tot"><span>TOTAL</span><span className="num">{fmtBRLc(total)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Condições */}
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Condições</h3></div>
            <div className="card-body">
              <FormField label="Prazo de entrega" htmlFor="deadline">
                <input id="deadline" className="input" placeholder="Ex.: 12 dias úteis" defaultValue={quote?.deadline ?? ""} />
              </FormField>
              <FormField label="Validade da proposta" htmlFor="validity_date">
                <input id="validity_date" type="date" className="input" defaultValue={quote?.validity_date ?? ""} />
              </FormField>
              <FormField label="Condição de pagamento" htmlFor="payment_terms">
                <input id="payment_terms" className="input" placeholder="Ex.: 50% na aprovação · 50% na entrega" defaultValue={quote?.payment_terms ?? ""} />
              </FormField>
              <FormField label="Observações" htmlFor="notes">
                <textarea id="notes" className="input" rows={4} defaultValue={quote?.notes ?? ""} />
              </FormField>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
              <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={pending}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Salvando…" : isEdit ? "Salvar" : "Criar orçamento"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
