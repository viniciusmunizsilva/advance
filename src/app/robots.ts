import type { MetadataRoute } from "next";

// Servido em advancetecnologia.com/robots.txt.
// (robots.txt só é reconhecido na raiz do app; o proxy o serve direto no host
// público, sem reescrever para /site.)
const SITE_URL = "https://advancetecnologia.com";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
