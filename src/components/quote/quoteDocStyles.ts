/**
 * Estilos do documento comercial de orçamento (evolução editorial premium).
 * Fonte única de verdade — usado no preview ao vivo, na visualização e no PDF.
 * Namespaced sob `.qdoc` para não colidir com o restante da UI.
 * Usa os tokens do Design System (cores, tipografia, radius).
 */
export const QUOTE_DOC_CSS = `
.qdoc{--doc-ink:#171b21;--doc-mut:#6b7480;--doc-line:#e1e5ea;--doc-blue:#23509f;--doc-blue-700:#1d4184;
  font-family:var(--font-sans,"IBM Plex Sans",sans-serif);color:var(--doc-ink);}
.qdoc-page{background:#fff;width:210mm;min-height:297mm;padding:18mm 16mm;margin:0 auto;
  font-size:12px;line-height:1.55;position:relative;}
.qdoc *{box-sizing:border-box;}
.qdoc .mono{font-family:var(--font-mono,"IBM Plex Mono",monospace);font-variant-numeric:tabular-nums;}

/* Header */
.qdoc-head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;}
.qdoc-brand img{height:30px;display:block;margin-bottom:10px;}
.qdoc-brand .tag{font-size:10.5px;color:var(--doc-mut);letter-spacing:.02em;max-width:240px;line-height:1.5;}
.qdoc-id{text-align:right;flex-shrink:0;}
.qdoc-id .eyebrow{font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--doc-blue);}
.qdoc-id .num{font-family:var(--font-serif,"Playfair Display",serif);font-size:32px;font-weight:700;letter-spacing:-.01em;line-height:1;margin:6px 0 0;}
.qdoc-id .num small{font-family:var(--font-sans,sans-serif);font-size:15px;font-weight:600;color:var(--doc-mut);letter-spacing:0;}
.qdoc-rule{height:2px;background:var(--doc-blue);margin:16px 0 0;}

/* Meta strip */
.qdoc-meta{display:flex;gap:34px;flex-wrap:wrap;margin-top:14px;}
.qdoc-meta .m .l{font-size:9.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--doc-mut);}
.qdoc-meta .m .v{font-size:12.5px;font-weight:600;margin-top:2px;}
.qdoc-meta .m .v.mono{font-weight:500;}

/* Two-column parties */
.qdoc-parties{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;margin-top:30px;}
.qdoc-sec-label{font-size:9.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--doc-blue);margin-bottom:9px;}
.qdoc-party .name{font-size:17px;font-weight:600;letter-spacing:-.01em;line-height:1.25;}
.qdoc-party .sub{font-size:11.5px;color:var(--doc-mut);margin-top:5px;line-height:1.6;}
.qdoc-party .sub .mono{color:var(--doc-ink);}

/* Scope + items */
.qdoc-scope{margin-top:34px;}
.qdoc-scope .intro{font-size:12.5px;color:var(--doc-mut);margin:0 0 14px;max-width:60ch;}
.qdoc-items{width:100%;border-collapse:collapse;font-size:12px;}
.qdoc-items thead th{text-align:left;font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  color:var(--doc-mut);padding:0 0 9px;border-bottom:1px solid var(--doc-line);}
.qdoc-items thead th.r{text-align:right;}
.qdoc-items tbody td{padding:12px 0;border-bottom:1px solid var(--doc-line);vertical-align:top;}
.qdoc-items tbody td.desc{padding-right:20px;}
.qdoc-items tbody td.desc .d{font-weight:500;line-height:1.5;}
.qdoc-items tbody td.desc .u{font-size:10.5px;color:var(--doc-mut);margin-top:2px;}
.qdoc-items tbody td.r{text-align:right;font-family:var(--font-mono,monospace);font-variant-numeric:tabular-nums;white-space:nowrap;}
.qdoc-items tbody td.qty{text-align:right;font-family:var(--font-mono,monospace);color:var(--doc-mut);white-space:nowrap;padding-right:20px;}
.qdoc-items .val-col{width:130px;}
.qdoc-items .qty-col{width:80px;}

/* Totals */
.qdoc-totals{display:flex;justify-content:flex-end;margin-top:20px;break-inside:avoid;}
.qdoc-totals .box{width:300px;}
.qdoc-totals .row{display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;color:var(--doc-mut);}
.qdoc-totals .row .mono{color:var(--doc-ink);font-family:var(--font-mono,monospace);}
.qdoc-totals .grand{display:flex;justify-content:space-between;align-items:baseline;margin-top:12px;padding-top:14px;border-top:2px solid var(--doc-blue);}
.qdoc-totals .grand .lbl{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--doc-ink);}
.qdoc-totals .grand .amt{font-family:var(--font-mono,monospace);font-variant-numeric:tabular-nums;font-size:26px;font-weight:600;color:var(--doc-blue-700);letter-spacing:-.01em;}

/* Commercial conditions */
.qdoc-cond{margin-top:36px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px 34px;break-inside:avoid;}
.qdoc-cond .item .l{font-size:9.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--doc-mut);margin-bottom:4px;}
.qdoc-cond .item .v{font-size:12.5px;font-weight:500;line-height:1.5;}

/* Observations */
.qdoc-obs{margin-top:32px;break-inside:avoid;}
.qdoc-obs .l{font-size:9.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--doc-mut);margin-bottom:6px;}
.qdoc-obs .t{font-size:12px;color:var(--doc-mut);line-height:1.7;white-space:pre-wrap;max-width:70ch;}

/* Acceptance */
.qdoc-accept{margin-top:44px;padding-top:22px;border-top:1px solid var(--doc-line);break-inside:avoid;}
.qdoc-accept .l{font-size:9.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--doc-blue);margin-bottom:20px;}
.qdoc-sign{display:grid;grid-template-columns:1fr 1fr;gap:56px;}
.qdoc-sign .col .line{border-top:1px solid #9aa3af;margin-top:34px;padding-top:8px;}
.qdoc-sign .col .who{font-size:12px;font-weight:600;}
.qdoc-sign .col .fields{font-size:10.5px;color:var(--doc-mut);margin-top:8px;line-height:2;}

/* Footer */
.qdoc-foot{margin-top:38px;padding-top:12px;border-top:1px solid var(--doc-line);display:flex;
  justify-content:space-between;gap:16px;font-size:10px;color:var(--doc-mut);flex-wrap:wrap;}
.qdoc-foot .mono{font-family:var(--font-mono,monospace);}

@media print{
  .qdoc-page{width:auto;min-height:auto;padding:0;margin:0;box-shadow:none;}
}
`;
