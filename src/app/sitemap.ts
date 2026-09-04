import type { MetadataRoute } from "next";

// Servido em advancetecnologia.com/sitemap.xml (site institucional público).
const SITE_URL = "https://advancetecnologia.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
