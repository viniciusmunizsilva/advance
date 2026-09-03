import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advance — Sistema de Gestão",
  description:
    "Sistema interno de gestão da Advance Tecnologia — clientes, moldes, orçamentos, serviços e financeiro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
