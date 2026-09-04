/** Resultado padronizado de Server Actions usadas por formulários. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Mensagem genérica para erros inesperados (não vazar detalhes técnicos). */
export const GENERIC_ERROR =
  "Não foi possível concluir a operação. Tente novamente.";

/** Converte erros de campo do Zod (flatten) em um mapa simples campo→mensagem. */
export function zodFieldErrors(
  flattened: Record<string, string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, msgs] of Object.entries(flattened)) {
    if (msgs && msgs.length > 0) out[key] = msgs[0];
  }
  return out;
}
