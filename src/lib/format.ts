/** Formatação pt-BR / BRL / datas de negócio (America/Sao_Paulo). */

/** Número → "7.700,00" (sem símbolo). */
export function fmtBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Número → "R$ 7.700,00". */
export function fmtBRLc(n: number): string {
  return "R$ " + fmtBRL(n);
}

/**
 * Data de negócio (string "YYYY-MM-DD" vinda do Postgres `date`) → "03/09/2026".
 * Trata como data pura, sem conversão de timezone, evitando o deslize de fuso.
 */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return "—";
  return `${d}/${m}/${y}`;
}

/** Data por extenso em pt-BR: "quarta-feira, 3 de setembro de 2026". */
export function fmtDateLong(date: Date = new Date()): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

/** Timestamp ISO → "03/09/2026 14:32" (America/Sao_Paulo). */
export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

/** Iniciais para avatar (ex.: "Advance Tecnologia" → "AT"). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
