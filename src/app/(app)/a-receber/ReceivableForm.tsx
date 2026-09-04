"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { FormField } from "@/components/ui/FormField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { FINANCE_STATUS } from "@/lib/domain";
import type { ClientOption } from "@/lib/queries";
import { createReceivableAction, updateReceivableAction, deleteReceivableAction } from "./actions";

type Receivable = Tables<"accounts_receivable">;

export function ReceivableForm({
  receivable,
  clients,
  defaultClientId,
}: {
  receivable?: Receivable;
  clients: ClientOption[];
  defaultClientId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState(false);
  const isEdit = !!receivable;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const result = isEdit ? await updateReceivableAction(receivable!.id, formData) : await createReceivableAction(formData);
      if (!result.ok) { setErrors(result.fieldErrors ?? {}); toast(result.error, "error"); return; }
      toast(isEdit ? "Conta atualizada." : "Conta criada.");
      router.push("/a-receber");
      router.refresh();
    });
  }

  function onDelete() {
    startTransition(async () => {
      const r = await deleteReceivableAction(receivable!.id);
      if (!r.ok) { toast(r.error, "error"); setConfirming(false); return; }
      toast("Conta excluída.");
      router.push("/a-receber");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-body">
          <input type="hidden" name="quote_id" value={receivable?.quote_id ?? ""} />
          <FormField label="Cliente" htmlFor="client_id" required error={errors.client_id}>
            <select id="client_id" name="client_id" className="select" style={{ width: "100%" }} required defaultValue={receivable?.client_id ?? defaultClientId ?? ""}>
              <option value="" disabled>Selecione…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </FormField>
          <FormField label="Descrição" htmlFor="description" required error={errors.description}>
            <input id="description" name="description" className="input" required defaultValue={receivable?.description ?? ""} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormField label="Valor (R$)" htmlFor="amount" required error={errors.amount}>
              <input id="amount" name="amount" type="number" min={0} step="0.01" className="input" required defaultValue={receivable?.amount ?? ""} />
            </FormField>
            <FormField label="Status" htmlFor="status" required error={errors.status}>
              <select id="status" name="status" className="select" style={{ width: "100%" }} defaultValue={receivable?.status ?? "open"}>
                {(["open", "paid", "cancelled"] as const).map((k) => <option key={k} value={k}>{FINANCE_STATUS[k].label}</option>)}
              </select>
            </FormField>
            <FormField label="Vencimento" htmlFor="due_date" required error={errors.due_date}>
              <input id="due_date" name="due_date" type="date" className="input" required defaultValue={receivable?.due_date ?? ""} />
            </FormField>
            <FormField label="Data de pagamento" htmlFor="paid_date" error={errors.paid_date}>
              <input id="paid_date" name="paid_date" type="date" className="input" defaultValue={receivable?.paid_date ?? ""} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Observações" htmlFor="notes" error={errors.notes}>
                <textarea id="notes" name="notes" className="input" rows={3} defaultValue={receivable?.notes ?? ""} />
              </FormField>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          {isEdit && (
            <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)} disabled={pending}>
              <Trash2 aria-hidden /> <span>Excluir</span>
            </button>
          )}
          <span style={{ marginLeft: "auto" }} />
          <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={pending}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Salvando…" : isEdit ? "Salvar" : "Criar conta"}</button>
        </div>
      </div>
      <ConfirmDialog open={confirming} title="Excluir conta a receber" description="Esta ação não pode ser desfeita." confirmLabel="Excluir" danger pending={pending} onConfirm={onDelete} onCancel={() => setConfirming(false)} />
    </form>
  );
}
