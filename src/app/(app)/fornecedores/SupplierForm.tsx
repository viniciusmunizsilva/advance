"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { FormField } from "@/components/ui/FormField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { createSupplierAction, updateSupplierAction, deleteSupplierAction } from "./actions";

type Supplier = Tables<"suppliers">;

export function SupplierForm({ supplier }: { supplier?: Supplier }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState(false);
  const isEdit = !!supplier;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const result = isEdit ? await updateSupplierAction(supplier!.id, formData) : await createSupplierAction(formData);
      if (!result.ok) { setErrors(result.fieldErrors ?? {}); toast(result.error, "error"); return; }
      toast(isEdit ? "Fornecedor atualizado." : "Fornecedor criado.");
      router.push("/fornecedores");
      router.refresh();
    });
  }

  function onDelete() {
    startTransition(async () => {
      const r = await deleteSupplierAction(supplier!.id);
      if (!r.ok) { toast(r.error, "error"); setConfirming(false); return; }
      toast("Fornecedor excluído.");
      router.push("/fornecedores");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-body">
          <FormField label="Nome / razão social" htmlFor="company_name" required error={errors.company_name}>
            <input id="company_name" name="company_name" className="input" required defaultValue={supplier?.company_name ?? ""} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormField label="CNPJ / CPF" htmlFor="document" error={errors.document}>
              <input id="document" name="document" className="input" defaultValue={supplier?.document ?? ""} />
            </FormField>
            <FormField label="Contato" htmlFor="contact_name" error={errors.contact_name}>
              <input id="contact_name" name="contact_name" className="input" defaultValue={supplier?.contact_name ?? ""} />
            </FormField>
            <FormField label="Telefone" htmlFor="phone" error={errors.phone}>
              <input id="phone" name="phone" className="input" defaultValue={supplier?.phone ?? ""} />
            </FormField>
            <FormField label="E-mail" htmlFor="email" error={errors.email}>
              <input id="email" name="email" type="email" className="input" defaultValue={supplier?.email ?? ""} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Observações" htmlFor="notes" error={errors.notes}>
                <textarea id="notes" name="notes" className="input" rows={3} defaultValue={supplier?.notes ?? ""} />
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
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Salvando…" : isEdit ? "Salvar" : "Criar fornecedor"}
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Excluir fornecedor"
        description={`Excluir "${supplier?.company_name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        pending={pending}
        onConfirm={onDelete}
        onCancel={() => setConfirming(false)}
      />
    </form>
  );
}
