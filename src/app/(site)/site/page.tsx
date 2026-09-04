import type { Metadata } from "next";
import SiteHeader from "./_components/SiteHeader";
import ScrollFx from "./_components/ScrollFx";
import Gallery from "./_components/Gallery";
import { WhatsAppIcon, ArrowIcon } from "./_components/icons";
import {
  CTA_ORCAMENTO,
  CTA_EQUIPE,
  EMAIL,
  PHONE_DISPLAY,
  LOCATION,
  SITE_URL,
  NAV_ITEMS,
} from "./_data";

// Origem para URLs absolutas (OG/canonical). Em produção usa o domínio real;
// no preview da Vercel usa a URL de produção do projeto (ex.: advance-plum.vercel.app),
// para a thumb do WhatsApp já funcionar antes do DNS apontar. Pode ser fixado
// via NEXT_PUBLIC_SITE_ORIGIN.
const OG_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(OG_ORIGIN),
  title: {
    default: "Advance Tecnologia — Moldes de Injeção Plástica | Ferramentaria",
    template: "%s · Advance Tecnologia",
  },
  description:
    "Ferramentaria de engenharia especializada em moldes de injeção plástica: projeto em CAD/CAM, simulação de injeção, usinagem de precisão, controle dimensional e manutenção de moldes. Embu das Artes — SP.",
  keywords: [
    "moldes de injeção plástica",
    "fabricação de moldes",
    "ferramentaria",
    "projeto de moldes",
    "engenharia de moldes",
    "manutenção de moldes",
    "moldes multicavidades",
    "usinagem CNC",
    "Advance Tecnologia",
  ],
  applicationName: "Advance Tecnologia",
  authors: [{ name: "Advance Tecnologia" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Advance Tecnologia",
    title: "Advance Tecnologia — Moldes de Injeção Plástica",
    description:
      "Moldes de injeção plástica com precisão em cada detalhe. Projeto em CAD/CAM, simulação de injeção, fabricação e manutenção de moldes.",
    images: [
      {
        url: "/site/og.jpg",
        width: 1200,
        height: 630,
        alt: "Advance Tecnologia — moldes de injeção plástica com precisão em cada detalhe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advance Tecnologia — Moldes de Injeção Plástica",
    description:
      "Moldes de injeção plástica com precisão em cada detalhe — projeto, fabricação e manutenção.",
    images: ["/site/og.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MechanicalEngineeringBusiness",
  name: "Advance Tecnologia",
  alternateName: "Advance Moldes de Injeção Plástica",
  url: SITE_URL,
  image: `${SITE_URL}/site/gallery/g01.jpeg`,
  logo: `${SITE_URL}/brand/logo-advance-blue.png`,
  email: EMAIL,
  telephone: "+5511982517784",
  description:
    "Ferramentaria especializada em projeto, fabricação e manutenção de moldes de injeção plástica.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Embu das Artes",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: "BR",
  knowsAbout: [
    "Moldes de injeção plástica",
    "Projeto de moldes CAD/CAM",
    "Simulação de injeção",
    "Usinagem CNC e EDM",
    "Controle dimensional",
    "Manutenção de moldes",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fabricação de moldes de injeção plástica" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Projetos e engenharia de moldes" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manutenção de moldes" } },
  ],
};

const SERVICES = [
  {
    k: "01",
    tag: "Fabricação",
    title: "Moldes de Injeção Plástica",
    desc: "Fabricamos moldes mono e multicavidades para peças técnicas e de consumo, com alta precisão dimensional e acabamento controlado — prontos para produzir em série.",
    tags: ["Monocavidade", "Multicavidades", "Peças técnicas", "Aços ferramenta"],
    img: "/site/molde-8-cavidades.png",
    alt: "Molde de injeção de 8 cavidades montado em injetora",
    contain: false,
  },
  {
    k: "02",
    tag: "Engenharia",
    title: "Projetos e Engenharia",
    desc: "Desenvolvemos o projeto completo do molde em CAD/CAM, com simulação de injeção e análise de viabilidade antes de cortar o primeiro bloco — reduzindo risco e retrabalho.",
    tags: ["CAD / CAM", "Simulação de injeção", "Análise de viabilidade", "Detalhamento técnico"],
    img: "/site/conjunto-anderson.png",
    alt: "Desenho técnico de conjunto de molde projetado pela Advance",
    contain: true,
  },
  {
    k: "03",
    tag: "Manutenção",
    title: "Manutenção de Moldes",
    desc: "Manutenção preventiva e corretiva de moldes de qualquer fabricante, prolongando a vida útil da ferramenta e mantendo a estabilidade e a repetibilidade do processo.",
    tags: ["Preventiva", "Corretiva", "Qualquer fabricante", "Maior vida útil"],
    img: "/site/gallery/g07.jpeg",
    alt: "Ajuste e manutenção de molde na ferramentaria da Advance",
    contain: false,
  },
];

const CAPS = [
  { k: "CAD / CAM", t: "Projeto e programação", d: "Modelagem 3D do molde e geração de percursos de usinagem a partir da peça do cliente." },
  { k: "Simulação", t: "Simulação de injeção", d: "Análise de preenchimento e comportamento do plástico para antecipar problemas em projeto." },
  { k: "Viabilidade", t: "Análise de viabilidade", d: "Estudo técnico da peça e do molde antes da fabricação, definindo estratégia e cavidades." },
  { k: "Usinagem", t: "Usinagem CNC & EDM", d: "Fabricação de precisão em usinagem CNC e eletroerosão para geometrias complexas." },
  { k: "Metrologia", t: "Controle dimensional", d: "Inspeção dimensional em todas as etapas, garantindo aderência ao projeto." },
  { k: "Validação", t: "Testes e validação", d: "Testes de injeção e aprovação da peça antes da entrega do molde." },
];

const PROCESS = [
  { k: "01", t: "Briefing", d: "Análise das necessidades e das especificações da peça a ser produzida." },
  { k: "02", t: "Projeto", d: "Desenvolvimento em CAD/CAM com simulação de injeção e definição de cavidades." },
  { k: "03", t: "Fabricação", d: "Usinagem CNC e EDM com controle dimensional em cada etapa." },
  { k: "04", t: "Validação", d: "Testes de injeção e aprovação da peça conforme o projeto." },
  { k: "05", t: "Entrega", d: "Molde entregue com documentação técnica e suporte pós-entrega." },
];

const DIFFERENTIALS = [
  { n: "01", t: "Equipe especializada", d: "Projetistas e ferramenteiros com vasta experiência no setor de moldes." },
  { n: "02", t: "Controle total de qualidade", d: "Inspeção dimensional em todas as etapas de produção." },
  { n: "03", t: "Prazos cumpridos", d: "Planejamento rigoroso para entregas no tempo acordado." },
  { n: "04", t: "Projeto e fabricação integrados", d: "Do desenho à validação, tudo sob o mesmo controle técnico." },
];

export default function SitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <span id="top" />
      <SiteHeader />
      <ScrollFx />

      <main>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="s-hero" aria-label="Apresentação">
          <div className="s-hero__grid">
            <div className="s-hero__copy">
              <span className="s-hero__tag reveal">
                <i /> Advance Tecnologia · Ferramentaria
              </span>
              <h1 className="s-hero__title reveal d1">
                Moldes de injeção plástica
                <br />
                <em>com precisão em cada detalhe</em>
                <span className="thin">
                  Projeto, fabricação e manutenção de moldes — do briefing à
                  validação, sob um único controle técnico.
                </span>
              </h1>
              <div className="s-hero__btns reveal d2">
                <a href={CTA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--primary">
                  <WhatsAppIcon /> Solicitar orçamento
                </a>
                <a href="#processo" className="s-btn s-btn--ghost">
                  Conhecer nosso processo <ArrowIcon />
                </a>
              </div>
              <div className="s-hero__meta reveal d3">
                <div>
                  <span className="n">+10</span>
                  <span className="l">Anos de ferramentaria</span>
                </div>
                <div>
                  <span className="n mono">±0,001<span style={{ fontSize: "0.5em" }}> mm</span></span>
                  <span className="l">Precisão dimensional</span>
                </div>
                <div>
                  <span className="n">Mono · Multi</span>
                  <span className="l">Cavidades</span>
                </div>
              </div>
            </div>

            <div className="s-hero__visual reveal d2">
              <div className="s-hero__frame">
                <video
                  src="/site/hero-loop.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/site/gallery/g01.jpeg"
                  aria-label="Processo de injeção plástica em operação"
                />
                <span className="s-hero__dim" aria-hidden="true">
                  <span>PRODUÇÃO</span>
                  <span className="bar" />
                  <span>EM OPERAÇÃO</span>
                </span>
                <span className="s-hero__spec" aria-hidden="true">
                  Aço ferramenta · Multicavidades
                </span>
                <span className="s-tick tl" aria-hidden="true" />
                <span className="s-tick tr" aria-hidden="true" />
                <span className="s-tick bl" aria-hidden="true" />
                <span className="s-tick br" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── POSICIONAMENTO ─────────────────── */}
        <section className="s-section s-position" aria-label="Posicionamento">
          <div className="s-wrap">
            <div className="s-position__grid">
              <div className="reveal">
                <span className="s-eyebrow">Posicionamento</span>
                <p className="s-position__statement" style={{ marginTop: "22px" }}>
                  Uma ferramentaria de <b>engenharia</b> que entrega moldes
                  prontos para produzir — com projeto próprio, fabricação de
                  precisão e responsabilidade em cada prazo.
                </p>
              </div>
              <div className="s-stats reveal d2">
                <div className="s-stat">
                  <div className="n">Mono e multicavidades</div>
                  <div className="l">Peças técnicas e de consumo</div>
                </div>
                <div className="s-stat">
                  <div className="n">CAD / CAM</div>
                  <div className="l">Projeto e simulação de injeção</div>
                </div>
                <div className="s-stat">
                  <div className="n">CNC · EDM</div>
                  <div className="l">Usinagem de precisão</div>
                </div>
                <div className="s-stat">
                  <div className="n">Metrologia</div>
                  <div className="l">Controle dimensional e validação</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── SERVIÇOS ───────────────────── */}
        <section className="s-section s-svc-section" id="servicos" aria-label="Serviços">
          <div className="s-wrap">
            <div className="s-head reveal">
              <span className="s-eyebrow">Serviços · O que fazemos</span>
              <h2 className="s-head__title">
                Soluções completas em ferramentaria
              </h2>
              <p className="s-head__sub s-lead">
                Da concepção ao molde validado, acompanhamos cada etapa com rigor
                técnico e transparência.
              </p>
            </div>

            <div className="s-svc">
              {SERVICES.map((s) => (
                <article className="s-svc__row" key={s.k}>
                  <div className={`s-svc__media reveal-media reveal${s.contain ? " s-svc__media--contain" : ""}`}>
                    <span className="s-svc__badge">{s.k} / {s.tag}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img} alt={s.alt} loading="lazy" decoding="async" />
                  </div>
                  <div className="s-svc__body reveal d1">
                    <span className="s-svc__k">{s.k} — {s.tag}</span>
                    <h3 className="s-svc__title">{s.title}</h3>
                    <p className="s-svc__desc s-lead">{s.desc}</p>
                    <ul className="s-svc__list">
                      {s.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────── ENGENHARIA ─────────────────── */}
        <section className="s-section s-eng" id="engenharia" aria-label="Engenharia e tecnologia">
          <div className="s-wrap s-eng__wrap">
            <div className="s-head reveal">
              <span className="s-eyebrow">Engenharia &amp; Tecnologia</span>
              <h2 className="s-head__title s-eng__title">
                Precisão que começa no <em>projeto</em>
              </h2>
              <p className="s-head__sub s-lead s-eng__lead">
                Antes da fabricação, cada molde passa por engenharia detalhada. Da
                análise de viabilidade à validação, tecnologia aplicada para
                reduzir risco e garantir repetibilidade.
              </p>
            </div>

            <div className="s-eng__grid">
              <div className="s-eng__caps reveal">
                {CAPS.map((c) => (
                  <div className="s-cap" key={c.k}>
                    <div className="s-cap__k">{c.k}</div>
                    <div className="s-cap__t">{c.t}</div>
                    <div className="s-cap__d">{c.d}</div>
                  </div>
                ))}
              </div>
              <div className="s-eng__media s-eng__media--blueprint reveal d2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/site/conjunto-anderson.png" alt="Desenho técnico de conjunto de molde — projeto de engenharia da Advance" loading="lazy" decoding="async" />
                <span className="s-eng__cap">Conjunto de molde · desenho técnico</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── DIFERENCIAIS ─────────────────── */}
        <section className="s-section s-diff" id="diferenciais" aria-label="Diferenciais">
          <div className="s-wrap">
            <div className="s-diff__grid">
              <div className="reveal">
                <span className="s-eyebrow">Por que a Advance</span>
                <h2 className="s-head__title">
                  Motivos para confiar seu molde à Advance
                </h2>
                <div className="s-diff__items">
                  {DIFFERENTIALS.map((d) => (
                    <div className="s-diff__item" key={d.n}>
                      <span className="s-diff__num">{d.n}</span>
                      <div>
                        <div className="s-diff__t">{d.t}</div>
                        <div className="s-diff__d">{d.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="s-diff__tiles reveal d2">
                <div className="s-diff__tile">
                  <div className="n">+10</div>
                  <div className="l">Anos no mercado</div>
                </div>
                <div className="s-diff__tile">
                  <div className="n mono">±0,001<sup>mm</sup></div>
                  <div className="l">Precisão dimensional</div>
                </div>
                <div className="s-diff__tile s-diff__tile--wide">
                  <div className="n">Embu das Artes · SP</div>
                  <div className="l">Ferramentaria própria — projeto e fabricação no mesmo lugar</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── PROCESSO ───────────────────── */}
        <section className="s-section s-proc" id="processo" aria-label="Processo">
          <div className="s-wrap">
            <div className="s-head reveal">
              <span className="s-eyebrow">Processo · Como trabalhamos</span>
              <h2 className="s-head__title">Do briefing à entrega</h2>
              <p className="s-head__sub s-lead">
                Um fluxo de trabalho claro e rastreável, com validação técnica em
                cada passo.
              </p>
            </div>
            <div className="s-proc__track">
              {PROCESS.map((p, i) => (
                <div className={`s-step reveal d${i + 1}`} key={p.k}>
                  <div className="s-step__node">{p.k}</div>
                  <div>
                    <div className="s-step__k">ETAPA {p.k}</div>
                    <div className="s-step__t">{p.t}</div>
                    <div className="s-step__d">{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── PROJETOS ───────────────────── */}
        <section className="s-section s-gal" id="projetos" aria-label="Projetos e portfólio">
          <div className="s-wrap">
            <div className="s-gal__head reveal">
              <div className="s-head">
                <span className="s-eyebrow">Projetos · Nosso trabalho</span>
                <h2 className="s-head__title">Moldes, peças e processos</h2>
              </div>
              <a href={CTA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--ghost s-btn--sm">
                Solicitar orçamento <ArrowIcon />
              </a>
            </div>
            <Gallery />
          </div>
        </section>

        {/* ──────────────────── CTA FINAL ──────────────────── */}
        <section className="s-section s-cta" id="contato" aria-label="Contato">
          <div className="s-wrap">
            <div className="s-cta__inner">
              <span className="s-eyebrow reveal">Vamos conversar</span>
              <h2 className="s-cta__title reveal d1">
                Pronto para tirar seu molde do papel?
              </h2>
              <p className="s-cta__sub reveal d2">
                Fale com nossa equipe técnica. Atendimento direto, análise da sua
                peça e orçamento sem compromisso.
              </p>
              <div className="s-cta__btns reveal d3">
                <a href={CTA_ORCAMENTO} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--onblue">
                  <WhatsAppIcon /> Solicitar orçamento
                </a>
                <a href={CTA_EQUIPE} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--onblue-ghost">
                  Falar com nossa equipe
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────────────── FOOTER ───────────────────── */}
      <footer className="s-foot">
        <div className="s-wrap">
          <div className="s-foot__top">
            <div className="s-foot__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-advance-blue.png" alt="Advance Tecnologia" />
              <p>
                Ferramentaria de engenharia especializada em moldes de injeção
                plástica — projeto, fabricação e manutenção.
              </p>
            </div>
            <div className="s-foot__col">
              <div className="s-foot__ct">Navegação</div>
              {NAV_ITEMS.map((n) => (
                <a key={n.href} href={n.href}>{n.label}</a>
              ))}
            </div>
            <div className="s-foot__col">
              <div className="s-foot__ct">Contato</div>
              <a href={CTA_ORCAMENTO} target="_blank" rel="noopener noreferrer">WhatsApp · {PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <p>{LOCATION}</p>
            </div>
          </div>
          <div className="s-foot__bottom">
            <span>© {new Date().getFullYear()} Advance Tecnologia · Moldes de Injeção Plástica · {LOCATION}</span>
          </div>
        </div>
      </footer>

      <a
        href={CTA_ORCAMENTO}
        target="_blank"
        rel="noopener noreferrer"
        className="s-wa-float"
        aria-label="Falar no WhatsApp"
        title="Falar no WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
