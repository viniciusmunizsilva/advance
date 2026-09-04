"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export function PrintBar({ id }: { id: string }) {
  return (
    <div
      className="pdf-toolbar"
      style={{
        maxWidth: 940,
        margin: "16px auto",
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        padding: "0 16px",
      }}
    >
      <Link href={`/orcamentos/${id}`} className="btn btn-secondary">
        <ArrowLeft aria-hidden /> <span>Voltar</span>
      </Link>
      <button className="btn btn-primary" onClick={() => window.print()}>
        <Printer aria-hidden /> <span>Imprimir / Salvar PDF</span>
      </button>
    </div>
  );
}
