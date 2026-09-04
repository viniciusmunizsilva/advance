"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { changeQuoteStatusAction } from "../../actions";

export function DocActions({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      const r = await changeQuoteStatusAction(id, "approved");
      if (!r.ok) return toast(r.error, "error");
      toast("Proposta aprovada.");
      router.refresh();
    });
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <Link href={`/orcamentos/${id}`} className="btn btn-secondary"><ArrowLeft aria-hidden /> <span>Voltar</span></Link>
      <span style={{ marginLeft: "auto" }} />
      <Link href={`/orcamentos/${id}/pdf`} target="_blank" className="btn btn-secondary"><Printer aria-hidden /> <span>Gerar PDF</span></Link>
      {approved ? (
        <span className="badge success" style={{ height: 38, padding: "0 14px" }}><CheckCircle2 aria-hidden style={{ width: 15 }} /> Proposta aprovada</span>
      ) : (
        <button className="btn btn-primary" onClick={approve} disabled={pending}>
          <CheckCircle2 aria-hidden /> <span>{pending ? "Aprovando…" : "Aprovar proposta"}</span>
        </button>
      )}
    </div>
  );
}
