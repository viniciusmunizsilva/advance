import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 "proxy" convention (antigo middleware).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas as rotas exceto:
     * - _next/static, _next/image
     * - favicon e arquivos estáticos de imagem
     * - brand/ e handoff-reference/ (assets públicos)
     */
    "/((?!_next/static|_next/image|favicon.ico|brand|handoff-reference|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
