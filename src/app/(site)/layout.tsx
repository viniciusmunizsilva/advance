import "./site.css";

/**
 * Layout do site institucional público (advancetecnologia.com).
 * É uma aplicação separada do SaaS: compartilha o Design System (tokens),
 * mas tem experiência e responsabilidade próprias. Todo o CSS é escopado
 * sob #site para não interferir na camada de componentes do sistema interno.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div id="site">{children}</div>;
}
