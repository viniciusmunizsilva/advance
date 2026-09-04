"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Minus, Maximize2, X, PanelLeft, Eye } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/toast";
import { fmtBRLc } from "@/lib/format";
import { SERVICE_TYPE } from "@/lib/domain";
import type { ClientData, MoldData, CompanyDoc } from "@/lib/queries";
import { QuoteDocument, QuoteDocStyle, type QuoteDocData } from "@/components/quote/QuoteDocument";
import { createQuoteAction, updateQuoteAction } from "./actions";

type ItemRow = { key: string; description: string; quantity: string; unit_price: string };

export type QuoteFormData = {
  id: string;
  number: string;
  createdAt: string | null;
  client_id: string;
  mold_id: string | null;
  service_type: string | null;
  description: string | null;
  discount: number;
  deadline: string | null;
  validity_date: string | null;
  payment_terms: string | null;
  freight: string | null;
  responsible: string | null;
  notes: string | null;
  items: { description: string; quantity: number; unit_price: number }[];
};

let seq = 0;
const newRow = (): ItemRow => ({ key: `r${seq++}`, description: "", quantity: "1", unit_price: "0" });
function num(v: string): number {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function QuoteForm({
  quote,
  clients,
  molds,
  company,
  defaultClientId,
  defaultMoldId,
}: {
  quote?: QuoteFormData;
  clients: ClientData[];
  molds: MoldData[];
  company: CompanyDoc;
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
  const [description, setDescription] = useState(quote?.description ?? "");
  const [discount, setDiscount] = useState(String(quote?.discount ?? 0));
  const [deadline, setDeadline] = useState(quote?.deadline ?? "");
  const [validity, setValidity] = useState(quote?.validity_date ?? "");
  const [payment, setPayment] = useState(quote?.payment_terms ?? "");
  const [freight, setFreight] = useState(quote?.freight ?? "");
  const [responsible, setResponsible] = useState(quote?.responsible ?? "");
  const [notes, setNotes] = useState(quote?.notes ?? "");
  const [items, setItems] = useState<ItemRow[]>(
    quote?.items.length
      ? quote.items.map((it) => ({ key: `r${seq++}`, description: it.description, quantity: String(it.quantity), unit_price: String(it.unit_price) }))
      : [newRow()],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [zoom, setZoom] = useState(0.62);
  const [fs, setFs] = useState(false);
  const [view, setView] = useState<"editor" | "preview">("editor");

  const moldsForClient = useMemo(() => molds.filter((m) => m.client_id === clientId), [molds, clientId]);
  const subtotal = useMemo(() => items.reduce((s, it) => s + num(it.quantity) * num(it.unit_price), 0), [items]);
  const total = Math.max(0, subtotal - num(discount));

  const docData: QuoteDocData = useMemo(() => {
    const c = clients.find((x) => x.id === clientId) ?? null;
    const m = molds.find((x) => x.id === moldId) ?? null;
    return {
      number: quote?.number ?? "—",
      createdAt: quote?.createdAt ?? new Date().toISOString(),
      validityDate: validity || null,
      responsible: responsible || null,
      serviceType: (serviceType || null) as QuoteDocData["serviceType"],
      description: description || null,
      deadline: deadline || null,
      paymentTerms: payment || null,
      freight: freight || null,
      notes: notes || null,
      subtotal,
      discount: num(discount),
      total,
      client: c ? { legalName: c.legal_name, tradeName: c.trade_name, document: c.document, contact: c.contact_name, phone: c.phone, email: c.email, city: c.city } : null,
      mold: m ? { code: m.code, description: m.description, cavities: m.cavities, type: m.type } : null,
      items: items.filter((it) => it.description.trim()).map((it) => ({
        description: it.description.trim(),
        quantity: num(it.quantity),
        unit_price: num(it.unit_price),
        total: Math.round(num(it.quantity) * num(it.unit_price) * 100) / 100,
      })),
      company,
    };
  }, [clients, molds, clientId, moldId, quote, validity, responsible, serviceType, description, deadline, payment, freight, notes, subtotal, discount, total, items, company]);

  function updateItem(key: string, patch: Partial<ItemRow>) {
    setItems((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const cleanItems = items
      .filter((it) => it.description.trim().length > 0)
      .map((it, i) => ({ description: it.description.trim(), quantity: num(it.quantity), unit_price: num(it.unit_price), sort_order: i }));

    if (!clientId) { setErrors({ client_id: "Selecione um cliente." }); toast("Selecione um cliente.", "error"); return; }
    if (cleanItems.length === 0) { toast("Adicione pelo menos um item.", "error"); return; }

    const input = {
      client_id: clientId,
      mold_id: moldId || null,
      service_type: serviceType || null,
      description: description || null,
      discount: num(discount),
      deadline: deadline || null,
      validity_date: validity || null,
      payment_terms: payment || null,
      freight: freight || null,
      responsible: responsible || null,
      notes: notes || null,
      items: cleanItems,
    };

    startTransition(async () => {
      const result = isEdit ? await updateQuoteAction(quote!.id, input) : await createQuoteAction(input);
      if (!result.ok) { setErrors(result.fieldErrors ?? {}); toast(result.error, "error"); return; }
      toast(isEdit ? "Orçamento atualizado." : "Orçamento criado.");
      router.push(`/orcamentos/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <QuoteDocStyle />

      {/* Toggle editor/preview (telas menores) */}
      <div className="seg qedit-viewtoggle" style={{ marginBottom: 16 }}>
        <button type="button" className={view === "editor" ? "active" : ""} onClick={() => setView("editor")}><PanelLeft aria-hidden /> Editor</button>
        <button type="button" className={view === "preview" ? "active" : ""} onClick={() => setView("preview")}><Eye aria-hidden /> Visualizar</button>
      </div>

      <div className="qedit" data-view={view}>
        {/* ---------- EDITOR ---------- */}
        <div className="qedit-editor">
          <div className="card">
            <div className="card-head"><h3>Cliente e molde</h3></div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <FormField label="Cliente" htmlFor="client_id" required error={errors.client_id}>
                  <select id="client_id" className="select" style={{ width: "100%" }} required value={clientId}
                    onChange={(e) => { setClientId(e.target.value); setMoldId(""); }}>
                    <option value="" disabled>Selecione…</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.trade_name || c.legal_name}</option>)}
                  </select>
                </FormField>
                <FormField label="Molde" htmlFor="mold_id"
                  hint={clientId && moldsForClient.length === 0 ? "Este cliente não tem moldes." : undefined}>
                  <select id="mold_id" className="select" style={{ width: "100%" }} value={moldId}
                    onChange={(e) => setMoldId(e.target.value)} disabled={!clientId}>
                    <option value="">— (opcional)</option>
                    {moldsForClient.map((m) => <option key={m.id} value={m.id}>{m.description ? `${m.code} — ${m.description}` : m.code}</option>)}
                  </select>
                </FormField>
                <FormField label="Tipo de serviço" htmlFor="service_type">
                  <select id="service_type" className="select" style={{ width: "100%" }} value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                    <option value="">—</option>
                    {(Object.keys(SERVICE_TYPE) as (keyof typeof SERVICE_TYPE)[]).map((k) => <option key={k} value={k}>{SERVICE_TYPE[k]}</option>)}
                  </select>
                </FormField>
                <FormField label="Responsável técnico" htmlFor="responsible">
                  <input id="responsible" className="input" value={responsible} onChange={(e) => setResponsible(e.target.value)} />
                </FormField>
                <div style={{ gridColumn: "1 / -1" }}>
                  <FormField label="Escopo / resumo" htmlFor="description">
                    <textarea id="description" className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                  </FormField>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Itens</h3>
              <button type="button" className="btn btn-ghost btn-sm ch-link" style={{ marginLeft: "auto" }} onClick={() => setItems((r) => [...r, newRow()])}>
                <Plus aria-hidden /> Adicionar item
              </button>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th style={{ width: "48%" }}>Descrição</th><th style={{ width: 90 }}>Qtd</th><th style={{ width: 140 }}>Valor unit.</th><th className="right" style={{ width: 120 }}>Total</th><th style={{ width: 44 }}></th></tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.key}>
                      <td><input className="input" placeholder="Descrição do item" value={it.description} onChange={(e) => updateItem(it.key, { description: e.target.value })} /></td>
                      <td><input className="input" type="number" min={0} step="0.001" value={it.quantity} onChange={(e) => updateItem(it.key, { quantity: e.target.value })} /></td>
                      <td><input className="input" type="number" min={0} step="0.01" value={it.unit_price} onChange={(e) => updateItem(it.key, { unit_price: e.target.value })} /></td>
                      <td className="right val">{fmtBRLc(num(it.quantity) * num(it.unit_price))}</td>
                      <td><button type="button" className="btn btn-icon btn-sm" aria-label="Remover" onClick={() => setItems((r) => (r.length > 1 ? r.filter((x) => x.key !== it.key) : r))}><Trash2 aria-hidden /></button></td>
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
                  <input className="input" type="number" min={0} step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} style={{ width: 130, textAlign: "right" }} />
                </div>
                <div className="sum-row tot"><span>TOTAL</span><span className="num">{fmtBRLc(total)}</span></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Condições comerciais</h3></div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <FormField label="Prazo de entrega" htmlFor="deadline">
                  <input id="deadline" className="input" placeholder="Ex.: 12 dias úteis" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </FormField>
                <FormField label="Validade da proposta" htmlFor="validity_date">
                  <input id="validity_date" type="date" className="input" value={validity} onChange={(e) => setValidity(e.target.value)} />
                </FormField>
                <FormField label="Forma de pagamento" htmlFor="payment_terms">
                  <input id="payment_terms" className="input" placeholder="Ex.: 50% na aprovação · 50% na entrega" value={payment} onChange={(e) => setPayment(e.target.value)} />
                </FormField>
                <FormField label="Frete" htmlFor="freight">
                  <input id="freight" className="input" placeholder="Ex.: CIF · por conta da Advance" value={freight} onChange={(e) => setFreight(e.target.value)} />
                </FormField>
                <div style={{ gridColumn: "1 / -1" }}>
                  <FormField label="Observações" htmlFor="notes">
                    <textarea id="notes" className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </FormField>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
              <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={pending}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Salvando…" : isEdit ? "Salvar" : "Criar orçamento"}</button>
            </div>
          </div>
        </div>

        {/* ---------- PREVIEW ---------- */}
        <div className="qedit-preview">
          <div className="qedit-preview-bar">
            <span className="hint">Espelho do documento</span>
            <button type="button" className="btn btn-icon btn-sm" aria-label="Reduzir zoom" onClick={() => setZoom((z) => Math.max(0.4, Math.round((z - 0.06) * 100) / 100))}><Minus aria-hidden /></button>
            <span className="hint mono" style={{ width: 40, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <button type="button" className="btn btn-icon btn-sm" aria-label="Aumentar zoom" onClick={() => setZoom((z) => Math.min(1, Math.round((z + 0.06) * 100) / 100))}><Plus aria-hidden /></button>
            <button type="button" className="btn btn-icon btn-sm" aria-label="Tela cheia" onClick={() => setFs(true)}><Maximize2 aria-hidden /></button>
          </div>
          <div className="qedit-stage">
            <div style={{ zoom }}>
              <QuoteDocument data={docData} />
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen */}
      {fs && (
        <div className="qedit-fs-overlay" onClick={() => setFs(false)}>
          <button type="button" className="btn btn-secondary qedit-fs-close" onClick={() => setFs(false)}><X aria-hidden /> Fechar</button>
          <div onClick={(e) => e.stopPropagation()}>
            <QuoteDocument data={docData} />
          </div>
        </div>
      )}
    </form>
  );
}
