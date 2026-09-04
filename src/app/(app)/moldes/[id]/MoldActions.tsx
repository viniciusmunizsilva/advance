"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { deleteMoldAction } from "../actions";

export function MoldActions({ id, code }: { id: string; code: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteMoldAction(id);
      if (!result.ok) {
        toast(result.error, "error");
        setConfirming(false);
        return;
      }
      toast("Molde excluído.");
      router.push("/moldes");
      router.refresh();
    });
  }

  return (
    <>
      <Link href={`/moldes/${id}/editar`} className="btn btn-secondary">
        <Pencil aria-hidden />
        <span>Editar</span>
      </Link>
      <button className="btn btn-danger" onClick={() => setConfirming(true)}>
        <Trash2 aria-hidden />
        <span>Excluir</span>
      </button>
      <ConfirmDialog
        open={confirming}
        title="Excluir molde"
        description={`Tem certeza que deseja excluir o molde "${code}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        pending={pending}
        onConfirm={onDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
