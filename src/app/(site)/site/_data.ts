/* Conteúdo e configuração do site institucional — fonte única, sem invenções.
   Dados reais extraídos do material atual da Advance. */

export const WHATSAPP_PHONE = "5511982517784";
export const PHONE_DISPLAY = "+55 11 98251-7784";
export const EMAIL = "contato@advancetecnologia.com";
export const INTERNAL_URL = "https://interno.advancetecnologia.com/";
export const SITE_URL = "https://advancetecnologia.com";
export const LOCATION = "Embu das Artes — SP";

export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const CTA_ORCAMENTO = waLink(
  "Olá! Vim pelo site da Advance e gostaria de solicitar um orçamento de molde.",
);
export const CTA_EQUIPE = waLink(
  "Olá! Vim pelo site da Advance e gostaria de falar com a equipe.",
);

export const NAV_ITEMS = [
  { href: "#servicos", label: "Serviços", index: "01" },
  { href: "#engenharia", label: "Engenharia", index: "02" },
  { href: "#processo", label: "Processo", index: "03" },
  { href: "#projetos", label: "Projetos", index: "04" },
  { href: "#contato", label: "Contato", index: "05" },
] as const;

export type GalleryImage = {
  src: string;
  alt: string;
  span: "big" | "tall" | "wide" | "std";
};

/* Ordem/composição pensada para ritmo editorial (proporções variadas). */
export const GALLERY: GalleryImage[] = [
  { src: "/site/gallery/g01.jpeg", alt: "Molde de injeção multicavidades fabricado pela Advance", span: "big" },
  { src: "/site/gallery/g02.jpeg", alt: "Detalhe de cavidades e sistema de extração de molde", span: "std" },
  { src: "/site/gallery/g03.jpeg", alt: "Placa de molde usinada com precisão", span: "std" },
  { src: "/site/gallery/g11.jpeg", alt: "Componentes de molde em bancada de ferramentaria", span: "wide" },
  { src: "/site/gallery/g05.jpeg", alt: "Molde aberto — lados de injeção e extração", span: "tall" },
  { src: "/site/gallery/g06.jpeg", alt: "Cavidades espelhadas de molde de injeção plástica", span: "std" },
  { src: "/site/gallery/g07.jpeg", alt: "Ajuste e montagem de molde na ferramentaria", span: "std" },
  { src: "/site/molde-8-cavidades.png", alt: "Molde de 8 cavidades montado em injetora", span: "wide" },
  { src: "/site/gallery/g08.jpeg", alt: "Bloco de molde com furação de refrigeração", span: "std" },
  { src: "/site/gallery/g09.jpeg", alt: "Postiços e detalhes técnicos de molde", span: "std" },
  { src: "/site/gallery/g10.jpeg", alt: "Molde de injeção em processo de fabricação", span: "std" },
  { src: "/site/gallery/g12.jpeg", alt: "Molde finalizado pronto para validação", span: "std" },
];
