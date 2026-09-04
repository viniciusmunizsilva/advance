"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { markReceivablePaidAction } from "./actions";

export function PaidButton({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="btn btn-ghost btn-sm"
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const r = await markReceivablePaidAction(id);
          if (!r.ok) return toast(r.error, "error");
          toast("Recebimento registrado.");
          router.refresh();
        });
      }}
    >
      <Check aria-hidden /> <span>Receber</span>
    </button>
  );
}
