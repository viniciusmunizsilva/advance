/* Advance — app shell, router e telas */
const $=(s,r=document)=>r.querySelector(s);
const el=(h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild;};

/* ---------- Sidebar ---------- */
const NAV=[
  {group:null,items:[{id:'dashboard',label:'Visão geral',icon:'grid',route:'#/dashboard'}]},
  {group:'Comercial',items:[
    {id:'orcamentos',label:'Orçamentos',icon:'file',route:'#/orcamentos',count:ORCAMENTOS.length},
    {id:'clientes',label:'Clientes',icon:'users',route:'#/em-breve/Clientes'},
    {id:'moldes',label:'Moldes',icon:'box',route:'#/em-breve/Moldes'}]},
  {group:'Operação',items:[{id:'servicos',label:'Serviços',icon:'wrench',route:'#/em-breve/Serviços'}]},
  {group:'Financeiro',items:[
    {id:'receber',label:'A receber',icon:'inflow',route:'#/em-breve/A receber'},
    {id:'pagar',label:'A pagar',icon:'outflow',route:'#/em-breve/A pagar'},
    {id:'fornecedores',label:'Fornecedores',icon:'supplier',route:'#/em-breve/Fornecedores'}]},
  {group:null,items:[{id:'config',label:'Configurações',icon:'gear',route:'#/em-breve/Configurações'}]}
];
function renderSidebar(active){
  const nav=NAV.map(g=>`<div class="sb-group">${g.group?`<div class="sb-label">${g.group}</div>`:''}${g.items.map(it=>`<a class="sb-item${it.id===active?' active':''}" href="${it.route}">${svg(it.icon)}<span>${it.label}</span>${it.count!=null?`<span class="count">${it.count}</span>`:''}</a>`).join('')}</div>`).join('');
  return `<aside class="sidebar" id="sidebar"><div class="sb-brand"><img src="assets/logo-advance-blue.png" alt="Advance"></div><nav class="sb-nav">${nav}</nav><div class="sb-foot">Sistema interno · v1.0</div></aside>`;
}
function renderTopbar(){
  return `<header class="topbar"><button class="btn btn-icon menu-btn" id="menuBtn" aria-label="Menu">${svg('grid')}</button>
  <button class="search-trigger" id="searchTrigger">${svg('search')}<span>Buscar cliente, molde, orçamento…</span><span class="kbd">⌘K</span></button>
  <div class="topbar-right"><button class="btn btn-primary" id="novoOrc">${svg('plus')}Novo orçamento</button><div class="divider-v"></div><div class="avatar" title="Advance Tecnologia">AT</div></div></header>`;
}

/* ---------- App container ---------- */
function shell(active,content){
  return `<div class="app">${renderSidebar(active)}<div class="scrim" id="scrim"></div><div class="main">${renderTopbar()}<div class="page-scroll">${content}</div></div></div>`;
}
function statusBadge(s){const x=ORC_STATUS[s];return `<span class="badge ${x.cls}"><span class="dot"></span>${x.label}</span>`;}

/* ---------- Dashboard ---------- */
function pageDashboard(){
  const aReceber=ORCAMENTOS.filter(o=>o.status==='aprovado').reduce((s,o)=>s+orcTotal(o),0);
  const aPagar=48650, orcPeriodo=ORCAMENTOS.filter(o=>o.status!=='rascunho').length, svcAtivos=7;
  const aguardando=ORCAMENTOS.filter(o=>o.status==='enviado');
  const recentes=[...ORCAMENTOS].filter(o=>o.status!=='rascunho').sort((a,b)=>b.data.localeCompare(a.data)).slice(0,5);
  const kpi=(ico,cls,label,val,cur,meta)=>`<div class="kpi"><div class="kpi-top"><span class="ico ${cls}">${svg(ico)}</span>${label}</div><div class="kpi-val">${cur?`<span class="cur">R$</span>`:''}${val}</div><div class="kpi-meta">${meta}</div></div>`;

  const orcRow=(o)=>`<div class="lrow" onclick="location.hash='#/orcamento/${o.num}'"><div class="lr-main"><div class="lr-title"><span class="mini-code">#${o.num}</span>${CLIENTS[o.cliente].fantasia}</div><div class="lr-sub">${MOLDS[o.molde].cod} · ${SVC_TYPE[o.tipo]}</div></div><div class="lr-right"><div class="lr-val">${o.status==='rascunho'?'—':fmtBRLc(orcTotal(o))}</div><div class="lr-meta">${statusBadgeText(o.status)}</div></div></div>`;

  const svcData=[
    {molde:'M-0977',cli:'Moldtech',tipo:'Construção',resp:'Equipe A',prev:'2026-11-14',col:'Em execução',late:false},
    {molde:'M-1032',cli:'Plastimol',tipo:'Alteração',resp:'Equipe B',prev:'2026-09-11',col:'Em execução',late:false},
    {molde:'M-1090',cli:'Injeplast',tipo:'Usinagem',resp:'Carlos R.',prev:'2026-09-02',col:'Aguardando cliente',late:true},
    {molde:'M-1055',cli:'Politec',tipo:'Manutenção',resp:'Equipe A',prev:'2026-09-08',col:'Aguardando',late:false}
  ];
  const svcRow=(s)=>`<div class="lrow"><div class="lr-main"><div class="lr-title"><span class="mini-code">${s.molde}</span>${s.cli}</div><div class="lr-sub">${s.tipo} · ${s.resp}</div></div><div class="lr-right"><div class="lr-meta">${s.late?`<span class="badge late"><span class="dot"></span>Atrasado</span>`:`<span class="tag-svc">${s.col}</span>`}</div><div class="lr-meta" style="margin-top:5px">Entrega ${fmtDate(s.prev)}</div></div></div>`;

  const finData=[
    {cli:'Moldtech',desc:'Orç. #0141 · parcela 2/2',valor:2050,venc:'2026-09-05',st:'vencendo'},
    {cli:'Plastimol',desc:'Orç. #0146 · à vista',valor:15300,venc:'2026-09-12',st:'aberto'},
    {cli:'Injeplast',desc:'Orç. #0139 · parcela 1/2',valor:6375,venc:'2026-08-30',st:'atrasado'},
    {cli:'Politec',desc:'Orç. #0144 · parcela 2/2',valor:4800,venc:'2026-09-20',st:'aberto'}
  ];
  const finMap={vencendo:['warning','Vence em breve'],aberto:['info','Em aberto'],atrasado:['error','Atrasado']};
  const finRow=(f)=>`<div class="lrow"><div class="lr-main"><div class="lr-title">${f.cli}</div><div class="lr-sub">${f.desc}</div></div><div class="lr-right"><div class="lr-val">${fmtBRLc(f.valor)}</div><div class="lr-meta"><span class="badge ${finMap[f.st][0]}"><span class="dot"></span>${finMap[f.st][1]}</span></div></div></div>`;

  return shell('dashboard',`<div class="page">
   <div class="page-head"><div class="ph-text"><h1 class="page-title">Visão geral</h1><p class="page-sub">Quarta-feira, 3 de setembro de 2026 — o que está acontecendo na Advance agora.</p></div>
   <div class="ph-actions"><button class="btn btn-primary" onclick="newOrcToast()">${svg('plus')}Novo orçamento</button></div></div>

   <div class="kpi-grid">
     ${kpi('inflow','green','A receber',fmtBRL(aReceber),true,'<span class="delta up">3 contas</span> nos próximos 15 dias')}
     ${kpi('outflow','red','A pagar',fmtBRL(aPagar),true,'<span class="delta down">1 conta</span> atrasada')}
     ${kpi('file','blue','Orçamentos do período',orcPeriodo,false,'<span>2 aguardando resposta</span>')}
     ${kpi('wrench','amber','Serviços ativos',svcAtivos,false,'<span class="delta down">1 atrasado</span> · 2 entregas esta semana')}
   </div>

   <div class="dash-grid">
     <div class="stack">
       <div class="card"><div class="card-head"><h3>Orçamentos recentes</h3><a class="ch-link" href="#/orcamentos">Ver todos</a></div><div class="card-body flush list-rows">${recentes.map(orcRow).join('')}</div></div>
       <div class="card"><div class="card-head"><h3>Serviços</h3><a class="ch-link" href="#/em-breve/Serviços">Abrir Kanban</a></div><div class="card-body flush list-rows">${svcData.map(svcRow).join('')}</div></div>
     </div>
     <div class="stack">
       <div class="card"><div class="card-head"><h3>Aguardando resposta</h3><span class="ch-link" style="color:var(--text-tertiary);font-weight:600">${aguardando.length}</span></div><div class="card-body flush list-rows">${aguardando.map(orcRow).join('')}</div></div>
       <div class="card"><div class="card-head"><h3>Financeiro</h3><a class="ch-link" href="#/em-breve/A receber">Ver contas</a></div><div class="card-body flush list-rows">${finData.map(finRow).join('')}</div></div>
     </div>
   </div>
  </div>`);
}
function statusBadgeText(s){const x=ORC_STATUS[s];return `<span class="badge ${x.cls}"><span class="dot"></span>${x.label}</span>`;}

/* ---------- Orçamentos list ---------- */
const listState={q:'',status:'todos',cliente:'',sort:'data-desc'};
function pageOrcamentos(){
  const filters=['todos','rascunho','enviado','aprovado','recusado','expirado'];
  const counts=Object.fromEntries(filters.map(f=>[f,f==='todos'?ORCAMENTOS.length:ORCAMENTOS.filter(o=>o.status===f).length]));
  const seg=filters.map(f=>`<button data-status="${f}" class="${listState.status===f?'active':''}">${f==='todos'?'Todos':ORC_STATUS[f].label}<span class="n">${counts[f]}</span></button>`).join('');
  const cliOpts=['<option value="">Todos os clientes</option>'].concat(Object.values(CLIENTS).map(c=>`<option value="${c.id}">${c.fantasia}</option>`)).join('');
  const content=`<div class="page">
    <div class="page-head"><div class="ph-text"><h1 class="page-title">Orçamentos</h1><p class="page-sub">Todos os orçamentos da Advance, do rascunho ao fechamento.</p></div>
    <div class="ph-actions"><button class="btn btn-secondary" onclick="toast('Exportação gerada')">${svg('pdf')}Exportar</button><button class="btn btn-primary" onclick="newOrcToast()">${svg('plus')}Novo orçamento</button></div></div>
    <div class="card"><div class="toolbar">
      <div class="seg" id="segStatus">${seg}</div>
      <div class="spacer"></div>
      <div class="field field-search"><svg class="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON.search}</svg><input class="input with-icon" id="orcSearch" placeholder="Buscar nº, cliente ou molde…" value="${listState.q}"></div>
      <select class="select" id="orcCliente">${cliOpts}</select>
      <select class="select" id="orcSort"><option value="data-desc">Mais recentes</option><option value="data-asc">Mais antigos</option><option value="valor-desc">Maior valor</option><option value="valor-asc">Menor valor</option></select>
    </div><div id="orcTableSlot"></div></div>
  </div>`;
  return shell('orcamentos',content);
}
function orcFiltered(){
  let r=ORCAMENTOS.filter(o=>{
    if(listState.status!=='todos'&&o.status!==listState.status)return false;
    if(listState.cliente&&o.cliente!==listState.cliente)return false;
    if(listState.q){const q=listState.q.toLowerCase();const c=CLIENTS[o.cliente];const m=MOLDS[o.molde];if(!(`#${o.num} ${o.num} ${c.nome} ${c.fantasia} ${m.cod} ${m.desc} ${SVC_TYPE[o.tipo]}`.toLowerCase().includes(q)))return false;}
    return true;
  });
  const[k,dir]=listState.sort.split('-');
  r.sort((a,b)=>{let x,y;if(k==='valor'){x=orcTotal(a);y=orcTotal(b);}else{x=a.data;y=b.data;}return dir==='asc'?(x>y?1:-1):(x<y?1:-1);});
  return r;
}
function renderOrcTable(){
  const slot=$('#orcTableSlot');if(!slot)return;
  const rows=orcFiltered();
  const head=`<div class="toolbar" style="border-top:1px solid var(--border);padding-top:11px;padding-bottom:11px"><span class="result-count">${rows.length} ${rows.length===1?'orçamento':'orçamentos'}</span></div>`;
  if(rows.length===0){slot.innerHTML=`<div class="state"><div class="state-ico">${svg('search')}</div><h4>Nenhum orçamento encontrado</h4><p>Ajuste os filtros ou a busca para ver outros resultados.</p><button class="btn btn-secondary" onclick="clearOrcFilters()">Limpar filtros</button></div>`;return;}
  const body=rows.map(o=>{const c=CLIENTS[o.cliente],m=MOLDS[o.molde];const venc=o.status==='enviado';
    return `<tr class="clickable" onclick="location.hash='#/orcamento/${o.num}'"><td class="t-mono t-primary">#${o.num}</td><td><div class="t-primary">${c.fantasia}</div><div class="t-sub">${c.cidade}</div></td><td><div class="t-mono">${m.cod}</div><div class="t-sub">${m.desc}</div></td><td><span class="tag-svc">${SVC_TYPE[o.tipo]}</span></td><td class="right val">${o.status==='rascunho'?'—':fmtBRLc(orcTotal(o))}</td><td class="t-mono">${fmtDate(o.data)}</td><td class="t-mono"${venc?' style="color:var(--warning)"':''}>${fmtDate(o.validade)}</td><td>${statusBadge(o.status)}</td><td class="right"><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();location.hash='#/orcamento/${o.num}'">Abrir ${svg('chevR')}</button></td></tr>`;}).join('');
  slot.innerHTML=`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nº</th><th>Cliente</th><th>Molde</th><th>Serviço</th><th class="right">Valor</th><th>Data</th><th>Validade</th><th>Status</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`+head;
}
function bindOrcList(){
  const seg=$('#segStatus');if(seg)seg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;listState.status=b.dataset.status;seg.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderOrcTable();});
  const s=$('#orcSearch');if(s)s.addEventListener('input',()=>{listState.q=s.value;renderOrcTable();});
  const cl=$('#orcCliente');if(cl){cl.value=listState.cliente;cl.addEventListener('change',()=>{listState.cliente=cl.value;renderOrcTable();});}
  const so=$('#orcSort');if(so){so.value=listState.sort;so.addEventListener('change',()=>{listState.sort=so.value;renderOrcTable();});}
  renderOrcTable();
}
function clearOrcFilters(){listState.q='';listState.status='todos';listState.cliente='';listState.sort='data-desc';navigate();}

/* ---------- Orçamento detail ---------- */
function pageOrcamento(num){
  const o=ORCAMENTOS.find(x=>x.num===num);
  if(!o)return shell('orcamentos',`<div class="page"><div class="state"><div class="state-ico">${svg('alert')}</div><h4>Orçamento não encontrado</h4><p>O orçamento #${num} não existe ou foi removido.</p><a class="btn btn-secondary" href="#/orcamentos">Voltar para orçamentos</a></div></div>`);
  const c=CLIENTS[o.cliente],m=MOLDS[o.molde];
  const sub=orcSubtotal(o),tot=orcTotal(o);
  const itemsRows=o.itens.map(i=>`<tr><td>${i.d}</td><td class="right t-mono">${i.q}</td><td class="right t-mono">${fmtBRLc(i.vu)}</td><td class="right val">${fmtBRLc(i.q*i.vu)}</td></tr>`).join('');
  const steps=[
    {t:'Criado',d:fmtDate(o.data),state:'done'},
    {t:'Enviado ao cliente',d:o.status==='rascunho'?'Pendente':fmtDate(o.data),state:o.status==='rascunho'?'':(o.status==='enviado'?'current':'done')},
    {t:o.status==='recusado'?'Recusado':o.status==='cancelado'?'Cancelado':o.status==='expirado'?'Expirado':'Aprovado',d:['aprovado','recusado','cancelado','expirado'].includes(o.status)?fmtDate(o.validade):'Aguardando',state:['aprovado','recusado','cancelado','expirado'].includes(o.status)?'done':''},
    {t:'Serviço criado',d:o.status==='aprovado'?'Pronto para abrir':'—',state:o.status==='aprovado'?'current':''}
  ];
  const tl=steps.map(s=>`<div class="tl-item ${s.state}"><div class="tl-title">${s.t}</div><div class="tl-meta">${s.d}</div></div>`).join('');
  const hist=[
    {d:o.data,t:`Orçamento #${o.num} criado`},
    o.status!=='rascunho'?{d:o.data,t:'Orçamento enviado ao cliente'}:null,
    o.status==='aprovado'?{d:o.validade,t:'Orçamento aprovado pelo cliente'}:null,
    o.status==='recusado'?{d:o.validade,t:'Orçamento recusado'}:null
  ].filter(Boolean).map(h=>`<div class="tl-item done"><div class="tl-title">${h.t}</div><div class="tl-meta">${fmtDate(h.d)}</div></div>`).join('');

  const content=`<div class="page">
    <div class="page-head"><div class="ph-text">
      <div class="breadcrumb"><a href="#/orcamentos">Orçamentos</a>${svg('chevR')}<span>#${o.num}</span></div>
      <h1 class="page-title" style="display:flex;align-items:center;gap:14px">Orçamento #${o.num} ${statusBadge(o.status)}</h1>
      <p class="page-sub">${c.nome} · ${MOLDS[o.molde].cod} — ${m.desc} · ${SVC_TYPE[o.tipo]}</p></div>
      <div class="ph-actions">
        <button class="btn btn-secondary" onclick="dupOrc('${o.num}')">${svg('copy')}Duplicar</button>
        <button class="btn btn-secondary" onclick="toast('Status atualizado')">${svg('check')}Alterar status</button>
        <a class="btn btn-secondary" href="orcamento-pdf.html?num=${o.num}" target="_blank">${svg('pdf')}Gerar PDF</a>
        ${o.status==='aprovado'?`<button class="btn btn-primary" onclick="toast('Serviço criado a partir do orçamento')">${svg('wrench')}Criar serviço</button>`:`<button class="btn btn-primary" onclick="toast('Orçamento enviado ao cliente')">${svg('send')}Enviar</button>`}
      </div></div>

    <div class="detail-grid">
      <div class="stack">
        <div class="card"><div class="card-head"><h3>Itens do orçamento</h3><span class="ch-link" style="color:var(--text-tertiary);font-weight:600">${o.itens.length} ${o.itens.length===1?'item':'itens'}</span></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Descrição</th><th class="right">Qtd.</th><th class="right">Valor unit.</th><th class="right">Total</th></tr></thead><tbody>${itemsRows}</tbody></table></div>
          <div class="card-body" style="border-top:1px solid var(--border)"><div style="max-width:320px;margin-left:auto">
            <div class="sum-row"><span class="hint" style="font-size:14px">Subtotal</span><span class="num">${fmtBRLc(sub)}</span></div>
            <div class="sum-row"><span class="hint" style="font-size:14px">Desconto</span><span class="num" style="color:${o.desconto?'var(--error)':'var(--text-tertiary)'}">${o.desconto?'− '+fmtBRLc(o.desconto):fmtBRLc(0)}</span></div>
            <div class="sum-row tot"><span>TOTAL</span><span class="num">${fmtBRLc(tot)}</span></div>
          </div></div>
        </div>
        ${o.obs?`<div class="card"><div class="card-head"><h3>Observações</h3></div><div class="card-body" style="color:var(--text-secondary);line-height:1.6">${o.obs}</div></div>`:''}
        <div class="card"><div class="card-head"><h3>Histórico</h3></div><div class="card-body"><div class="timeline">${hist}</div></div></div>
      </div>

      <div class="stack">
        <div class="card"><div class="card-head"><h3>Progresso</h3></div><div class="card-body"><div class="timeline">${tl}</div></div></div>
        <div class="card"><div class="card-head"><h3>Cliente</h3><a class="ch-link" href="#/em-breve/Clientes">Abrir</a></div><div class="card-body"><dl class="dl"><dt>Empresa</dt><dd>${c.fantasia}</dd><dt>CNPJ</dt><dd class="mono">${c.cnpj}</dd><dt>Contato</dt><dd>${c.contato}</dd><dt>Telefone</dt><dd class="mono">${c.fone}</dd><dt>E-mail</dt><dd style="font-weight:500;word-break:break-all">${c.email}</dd></dl></div></div>
        <div class="card"><div class="card-head"><h3>Molde</h3><a class="ch-link" href="#/em-breve/Moldes">Abrir</a></div><div class="card-body"><dl class="dl"><dt>Código</dt><dd class="mono">${m.cod}</dd><dt>Descrição</dt><dd>${m.desc}</dd><dt>Cavidades</dt><dd class="mono">${m.cav}</dd><dt>Tipo</dt><dd>${m.tipo}</dd></dl></div></div>
        <div class="card"><div class="card-head"><h3>Condições</h3></div><div class="card-body"><dl class="dl"><dt>Prazo</dt><dd>${o.prazo||'—'}</dd><dt>Validade</dt><dd class="mono">${fmtDate(o.validade)}</dd><dt>Pagamento</dt><dd style="max-width:180px">${o.pagto||'—'}</dd></dl></div></div>
      </div>
    </div>
  </div>`;
  return shell('orcamentos',content);
}
function dupOrc(num){toast('Orçamento duplicado — pronto para editar');setTimeout(()=>{location.hash='#/orcamentos';},700);}

/* ---------- Em breve (placeholder for out-of-scope screens) ---------- */
function pageEmBreve(name){
  const map={'Clientes':'users','Moldes':'box','Serviços':'wrench','A receber':'inflow','A pagar':'outflow','Fornecedores':'supplier','Configurações':'gear'};
  const active={'Clientes':'clientes','Moldes':'moldes','Serviços':'servicos','A receber':'receber','A pagar':'pagar','Fornecedores':'fornecedores','Configurações':'config'}[name]||'';
  return shell(active,`<div class="page"><div class="page-head"><div class="ph-text"><h1 class="page-title">${name}</h1><p class="page-sub">Módulo previsto para a próxima etapa do sistema.</p></div></div>
   <div class="card"><div class="state"><div class="state-ico">${svg(map[name]||'inbox')}</div><h4>${name} — em construção</h4><p>Esta entrega priorizou Visão geral, Orçamentos, Detalhes do orçamento e o PDF do orçamento. O módulo <strong>${name}</strong> entra na sequência, mantendo os mesmos componentes e padrões.</p><a class="btn btn-secondary" href="#/dashboard">Voltar à visão geral</a></div></div></div>`);
}

/* ---------- Router ---------- */
function navigate(){
  const h=location.hash||'#/dashboard';const root=$('#root');
  const parts=h.replace(/^#\//,'').split('/');
  let html;
  if(parts[0]==='orcamentos')html=pageOrcamentos();
  else if(parts[0]==='orcamento')html=pageOrcamento(decodeURIComponent(parts[1]||''));
  else if(parts[0]==='em-breve')html=pageEmBreve(decodeURIComponent(parts.slice(1).join('/')||'Módulo'));
  else html=pageDashboard();
  root.innerHTML=html;
  window.scrollTo(0,0);
  const ps=$('.page-scroll');if(ps)ps.scrollTop=0;
  bindShell();
  if(parts[0]==='orcamentos')bindOrcList();
}
window.addEventListener('hashchange',navigate);

/* ---------- Shell bindings ---------- */
function bindShell(){
  const st=$('#searchTrigger');if(st)st.addEventListener('click',openCmdk);
  const no=$('#novoOrc');if(no)no.addEventListener('click',newOrcToast);
  const mb=$('#menuBtn'),sb=$('#sidebar'),sc=$('#scrim');
  if(mb)mb.addEventListener('click',()=>{sb.classList.add('open');sc.classList.add('open');});
  if(sc)sc.addEventListener('click',()=>{sb.classList.remove('open');sc.classList.remove('open');});
}
function newOrcToast(){toast('Abrindo criação de orçamento…');}

/* ---------- Toast ---------- */
let toastWrap;
function toast(msg){
  if(!toastWrap){toastWrap=el('<div class="toast-wrap"></div>');document.body.appendChild(toastWrap);}
  const t=el(`<div class="toast">${svg('checkCircle')}<span>${msg}</span></div>`);
  toastWrap.appendChild(t);
  setTimeout(()=>{t.style.transition='opacity .25s,transform .25s';t.style.opacity='0';t.style.transform='translateY(8px)';setTimeout(()=>t.remove(),260);},2600);
}

/* ---------- Command palette (busca global) ---------- */
let cmdkOverlay;
function buildCmdk(){
  cmdkOverlay=el(`<div class="overlay" id="cmdk"><div class="cmdk"><div class="cmdk-input">${svg('search')}<input id="cmdkInput" placeholder="Buscar clientes, moldes, orçamentos, serviços…" autocomplete="off"><span class="cmdk-foot" style="border:none;padding:0"><span class="kbd">esc</span></span></div><div class="cmdk-results" id="cmdkResults"></div><div class="cmdk-foot"><span><span class="kbd">↵</span> abrir</span><span><span class="kbd">↑</span><span class="kbd">↓</span> navegar</span><span style="margin-left:auto">Busca global da Advance</span></div></div></div>`);
  document.body.appendChild(cmdkOverlay);
  cmdkOverlay.addEventListener('click',e=>{if(e.target===cmdkOverlay)closeCmdk();});
  $('#cmdkInput').addEventListener('input',e=>renderCmdk(e.target.value));
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCmdk();}
    if(e.key==='Escape')closeCmdk();
    if(cmdkOverlay.classList.contains('open')&&(e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='Enter'))cmdkNav(e);
  });
}
function searchAll(q){
  q=q.trim().toLowerCase();const res={Orçamentos:[],Clientes:[],Moldes:[],Serviços:[]};
  if(!q)return res;
  ORCAMENTOS.forEach(o=>{const c=CLIENTS[o.cliente],m=MOLDS[o.molde];if(`${o.num} ${c.fantasia} ${c.nome} ${m.cod} ${SVC_TYPE[o.tipo]}`.toLowerCase().includes(q))res.Orçamentos.push({title:`#${o.num} — ${SVC_TYPE[o.tipo]}`,sub:`${c.fantasia} · ${m.cod}`,val:o.status==='rascunho'?'Rascunho':fmtBRLc(orcTotal(o)),icon:'file',go:`#/orcamento/${o.num}`});});
  Object.values(CLIENTS).forEach(c=>{if(`${c.nome} ${c.fantasia} ${c.cnpj} ${c.contato}`.toLowerCase().includes(q))res.Clientes.push({title:c.fantasia,sub:`${c.cnpj} · ${c.cidade}`,icon:'users',go:'#/em-breve/Clientes'});});
  Object.values(MOLDS).forEach(m=>{if(`${m.cod} ${m.desc}`.toLowerCase().includes(q))res.Moldes.push({title:`${m.cod} — ${m.desc}`,sub:`${CLIENTS[m.cliente].fantasia} · ${m.cav} cav · ${m.tipo}`,icon:'box',go:'#/em-breve/Moldes'});});
  const svcs=[{molde:'M-1090',cli:'Injeplast',st:'Em execução'},{molde:'M-0977',cli:'Moldtech',st:'Em execução'},{molde:'M-1048',cli:'ABC Plásticos',st:'Concluído'}];
  svcs.forEach(s=>{if(`${s.molde} ${s.cli} manutenção serviço`.toLowerCase().includes(q))res.Serviços.push({title:`Serviço ${s.molde}`,sub:`${s.cli} · ${s.st}`,icon:'wrench',go:'#/em-breve/Serviços'});});
  return res;
}
function renderCmdk(q){
  const box=$('#cmdkResults');const res=searchAll(q);
  const groups=Object.entries(res).filter(([,arr])=>arr.length);
  if(!q.trim()){box.innerHTML=`<div class="cmdk-group-label">Sugestões</div>`+[{title:'Ver todos os orçamentos',sub:'Comercial',icon:'file',go:'#/orcamentos'},{title:'Visão geral',sub:'Dashboard',icon:'grid',go:'#/dashboard'}].map(cmdkItem).join('');cmdkSel=0;markSel();return;}
  if(!groups.length){box.innerHTML=`<div class="state" style="padding:40px 24px"><div class="state-ico">${svg('search')}</div><h4>Sem resultados para “${q}”</h4><p>Tente um número de orçamento, nome de cliente ou código de molde.</p></div>`;return;}
  box.innerHTML=groups.map(([g,arr])=>`<div class="cmdk-group-label">${g}</div>`+arr.map(cmdkItem).join('')).join('');
  cmdkSel=0;markSel();
}
function cmdkItem(r){return `<div class="cmdk-item" data-go="${r.go}"><span class="ci-ico">${svg(r.icon)}</span><div><div class="ci-title">${r.title}</div><div class="ci-sub">${r.sub}</div></div>${r.val?`<span class="ci-val">${r.val}</span>`:''}</div>`;}
let cmdkSel=0;
function cmdkItems(){return [...document.querySelectorAll('.cmdk-item')];}
function markSel(){cmdkItems().forEach((it,i)=>it.classList.toggle('sel',i===cmdkSel));}
function cmdkNav(e){const items=cmdkItems();if(!items.length)return;if(e.key==='ArrowDown'){e.preventDefault();cmdkSel=(cmdkSel+1)%items.length;markSel();items[cmdkSel].scrollIntoView({block:'nearest'});}else if(e.key==='ArrowUp'){e.preventDefault();cmdkSel=(cmdkSel-1+items.length)%items.length;markSel();items[cmdkSel].scrollIntoView({block:'nearest'});}else if(e.key==='Enter'){e.preventDefault();const it=items[cmdkSel];if(it){location.hash=it.dataset.go;closeCmdk();}}}
function openCmdk(){if(!cmdkOverlay)buildCmdk();cmdkOverlay.classList.add('open');const i=$('#cmdkInput');i.value='';renderCmdk('');setTimeout(()=>i.focus(),30);
  cmdkOverlay.querySelector('#cmdkResults').addEventListener('click',e=>{const it=e.target.closest('.cmdk-item');if(it){location.hash=it.dataset.go;closeCmdk();}});
}
function closeCmdk(){if(cmdkOverlay)cmdkOverlay.classList.remove('open');}

navigate();
