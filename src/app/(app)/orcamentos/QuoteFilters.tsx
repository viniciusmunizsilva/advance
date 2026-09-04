"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ClientOption } from "@/lib/queries";

export function QuoteFilters({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <select
        className="select"
        value={searchParams.get("client") ?? ""}
        onChange={(e) => setParam("client", e.target.value)}
        aria-label="Filtrar por cliente"
      >
        <option value="">Todos os clientes</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      <select
        className="select"
        value={searchParams.get("sort") ?? "recent"}
        onChange={(e) => setParam("sort", e.target.value)}
        aria-label="Ordenar"
      >
        <option value="recent">Mais recentes</option>
        <option value="old">Mais antigos</option>
        <option value="high">Maior valor</option>
        <option value="low">Menor valor</option>
      </select>
    </>
  );
}
