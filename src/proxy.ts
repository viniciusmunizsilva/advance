import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Duas aplicações, um único deploy — separadas por hostname:
 *
 *   advancetecnologia.com          → site institucional (público)   → route group (site), servido em /site/*
 *   interno.advancetecnologia.com  → SaaS de gestão (autenticado)   → comportamento existente, intocado
 *
 * O site institucional NÃO é uma rota do SaaS: ele vive num base path
 * interno (/site) e o proxy reescreve as URLs públicas para lá, mantendo
 * URLs limpas (advancetecnologia.com/  →  /site). No host interno nada
 * muda: a proteção de rotas do Supabase continua exatamente igual.
 */

// Hosts que servem o site institucional público.
const PUBLIC_SITE_HOSTS = new Set([
  "advancetecnologia.com",
  "www.advancetecnologia.com",
  // permite apontar um host extra em preview/produção sem alterar código:
  ...(process.env.NEXT_PUBLIC_SITE_HOST
    ? [process.env.NEXT_PUBLIC_SITE_HOST.toLowerCase()]
    : []),
]);

function getHostname(request: NextRequest): string {
  const host =
    request.headers.get("host") ??
    request.nextUrl.host ??
    "";
  return host.split(":")[0].toLowerCase();
}

// Requests que nunca devem ser reescritas (assets internos do framework).
function isInfraPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

// Next.js 16 "proxy" convention (antigo middleware).
export async function proxy(request: NextRequest) {
  const hostname = getHostname(request);
  const { pathname } = request.nextUrl;
  const isSiteHost = PUBLIC_SITE_HOSTS.has(hostname);

  // ── Host público: serve o site institucional (route group /site) ──
  if (isSiteHost) {
    if (isInfraPath(pathname) || pathname.startsWith("/site")) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/site" : `/site${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Host interno / dev: o site é pré-visualizável em /site sem auth ──
  if (pathname === "/site" || pathname.startsWith("/site/")) {
    return NextResponse.next();
  }

  // ── SaaS: comportamento original, sem alterações ──
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
    "/((?!_next/static|_next/image|favicon.ico|brand|handoff-reference|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)",
  ],
};
