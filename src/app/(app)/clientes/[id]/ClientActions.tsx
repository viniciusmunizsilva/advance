"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { deleteClientAction } from "../actions";

export function ClientActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteClientAction(id);
      if (!result.ok) {
        toast(result.error, "error");
        setConfirming(false);
        return;
      }
      toast("Cliente excluído.");
      router.push("/clientes");
      router.refresh();
    });
  }

  return (
    <>
      <Link href={`/clientes/${id}/editar`} className="btn btn-secondary">
        <Pencil aria-hidden />
        <span>Editar</span>
      </Link>
      <button className="btn btn-danger" onClick={() => setConfirming(true)}>
        <Trash2 aria-hidden />
        <span>Excluir</span>
      </button>
      <ConfirmDialog
        open={confirming}
        title="Excluir cliente"
        description={`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        pending={pending}
        onConfirm={onDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
