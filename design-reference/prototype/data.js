/* Advance — dados de exemplo e ícones (linha, estilo Lucide) */
const ICON = {
  grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  box:'<path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  inflow:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  outflow:'<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  supplier:'<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>',
  gear:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus:'<path d="M5 12h14M12 5v14"/>',
  chevR:'<path d="m9 18 6-6-6-6"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkCircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  pdf:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 18h4"/>',
  print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
  arrowRight:'<path d="M5 12h14M12 5l7 7-7 7"/>',
  dot:'<circle cx="12" cy="12" r="4"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
  building:'<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
  filter:'<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  hourglass:'<path d="M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>',
  trend:'<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>'
};
function svg(name,cls){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${cls?' class="'+cls+'"':''}>${ICON[name]||''}</svg>`;}

/* status → badge class + label */
const ORC_STATUS = {
  rascunho:{label:'Rascunho',cls:'neutral'},
  enviado:{label:'Enviado',cls:'info'},
  aprovado:{label:'Aprovado',cls:'success'},
  recusado:{label:'Recusado',cls:'error'},
  expirado:{label:'Expirado',cls:'warning'},
  cancelado:{label:'Cancelado',cls:'neutral'}
};
const SVC_TYPE = {construcao:'Construção de molde',manutencao:'Manutenção',alteracao:'Alteração',usinagem:'Usinagem',outro:'Outro'};

const CLIENTS = {
  c1:{id:'c1',nome:'ABC Indústria de Plásticos',fantasia:'ABC Plásticos',cnpj:'12.345.678/0001-90',contato:'Ricardo Alves',fone:'(11) 4478-2100',email:'compras@abcplasticos.com.br',cidade:'Diadema · SP'},
  c2:{id:'c2',nome:'Plastimol Componentes Ltda',fantasia:'Plastimol',cnpj:'09.887.221/0001-45',contato:'Fernanda Lima',fone:'(11) 4066-8890',email:'fernanda@plastimol.com.br',cidade:'São Bernardo · SP'},
  c3:{id:'c3',nome:'Injeplast Indústria Ltda',fantasia:'Injeplast',cnpj:'27.554.310/0001-08',contato:'Marcos Tadeu',fone:'(11) 2871-4400',email:'engenharia@injeplast.ind.br',cidade:'Guarulhos · SP'},
  c4:{id:'c4',nome:'Moldtech do Brasil S.A.',fantasia:'Moldtech',cnpj:'44.201.776/0001-62',contato:'Juliana Prado',fone:'(19) 3521-9000',email:'juliana.prado@moldtech.com',cidade:'Campinas · SP'},
  c5:{id:'c5',nome:'Politec Embalagens Ltda',fantasia:'Politec',cnpj:'31.998.045/0001-17',contato:'André Nunes',fone:'(11) 4990-7321',email:'suprimentos@politec.com.br',cidade:'Mauá · SP'}
};
const MOLDS = {
  'M-1048':{cod:'M-1048',desc:'Tampa XZ 250ml',cliente:'c1',cav:4,tipo:'Multicavidade'},
  'M-1032':{cod:'M-1032',desc:'Carcaça frontal',cliente:'c2',cav:2,tipo:'Multicavidade'},
  'M-1090':{cod:'M-1090',desc:'Gabinete medidor',cliente:'c3',cav:1,tipo:'Monocavidade'},
  'M-0977':{cod:'M-0977',desc:'Suporte lateral',cliente:'c4',cav:8,tipo:'Multicavidade'},
  'M-1055':{cod:'M-1055',desc:'Pote 500ml',cliente:'c5',cav:6,tipo:'Multicavidade'},
  'M-1061':{cod:'M-1061',desc:'Conector elétrico',cliente:'c2',cav:16,tipo:'Multicavidade'}
};
/* orçamentos */
const ORCAMENTOS = [
  {num:'0148',cliente:'c1',molde:'M-1048',tipo:'manutencao',valor:7700,data:'2026-09-03',validade:'2026-09-18',status:'enviado',
   itens:[{d:'Diagnóstico e desmontagem do molde',q:1,vu:1200},{d:'Recuperação de bucha de câmara quente',q:2,vu:1650},{d:'Polimento de cavidades',q:4,vu:420},{d:'Montagem, teste e ajuste',q:1,vu:1400}],
   desconto:0,prazo:'12 dias úteis',pagto:'50% na aprovação · 50% na entrega',obs:'Coleta e devolução do molde por conta da Advance. Teste de injeção acompanhado.'},
  {num:'0147',cliente:'c4',molde:'M-0977',tipo:'construcao',valor:184500,data:'2026-09-01',validade:'2026-10-01',status:'enviado',
   itens:[{d:'Projeto e engenharia CAD/CAM',q:1,vu:22000},{d:'Aço para molde P20 + insertos',q:1,vu:38500},{d:'Usinagem CNC de cavidades e machos',q:1,vu:76000},{d:'Eletroerosão (EDM)',q:1,vu:24000},{d:'Montagem, ajuste e try-out',q:1,vu:24000}],
   desconto:4500,prazo:'55 dias úteis',pagto:'30% pedido · 40% usinagem · 30% aprovação',obs:'Molde 8 cavidades, aço P20. Inclui try-out com 3 amostras aprovadas dimensionalmente.'},
  {num:'0146',cliente:'c2',molde:'M-1032',tipo:'alteracao',valor:15300,data:'2026-08-28',validade:'2026-09-12',status:'aprovado',
   itens:[{d:'Alteração de gravação na cavidade',q:2,vu:2800},{d:'Novo postiço de saída de gás',q:2,vu:1950},{d:'Ajuste e teste',q:1,vu:3050}],
   desconto:0,prazo:'9 dias úteis',pagto:'À vista na entrega',obs:'Alteração aprovada por Fernanda Lima em 30/08.'},
  {num:'0145',cliente:'c3',molde:'M-1090',tipo:'manutencao',valor:5450,data:'2026-08-26',validade:'2026-09-05',status:'expirado',
   itens:[{d:'Manutenção corretiva do sistema de refrigeração',q:1,vu:3200},{d:'Troca de pinos extratores',q:6,vu:180},{d:'Limpeza e proteção',q:1,vu:1170}],
   desconto:0,prazo:'6 dias úteis',pagto:'À vista',obs:''},
  {num:'0144',cliente:'c5',molde:'M-1055',tipo:'usinagem',valor:9800,data:'2026-08-22',validade:'2026-09-06',status:'aprovado',
   itens:[{d:'Usinagem de novo postiço',q:2,vu:2400},{d:'Retífica de superfície',q:1,vu:3200},{d:'Ajuste',q:1,vu:1800}],
   desconto:200,prazo:'8 dias úteis',pagto:'50% / 50%',obs:''},
  {num:'0143',cliente:'c1',molde:'M-1048',tipo:'alteracao',valor:6200,data:'2026-08-19',validade:'2026-09-03',status:'recusado',
   itens:[{d:'Alteração de volume da tampa',q:1,vu:4200},{d:'Ajuste e teste',q:1,vu:2000}],
   desconto:0,prazo:'7 dias úteis',pagto:'À vista',obs:'Cliente optou por adiar a alteração.'},
  {num:'0142',cliente:'c2',molde:'M-1061',tipo:'construcao',valor:242000,data:'2026-08-14',validade:'2026-09-13',status:'enviado',
   itens:[{d:'Projeto e engenharia',q:1,vu:31000},{d:'Aço e insertos',q:1,vu:52000},{d:'Usinagem CNC',q:1,vu:98000},{d:'EDM',q:1,vu:32000},{d:'Câmara quente 16 pontos',q:1,vu:29000}],
   desconto:0,prazo:'70 dias úteis',pagto:'30% / 40% / 30%',obs:'Molde 16 cavidades para conector elétrico.'},
  {num:'0141',cliente:'c4',molde:'M-0977',tipo:'manutencao',valor:4100,data:'2026-08-11',validade:'2026-08-26',status:'aprovado',
   itens:[{d:'Manutenção preventiva programada',q:1,vu:2600},{d:'Substituição de molas',q:8,vu:65},{d:'Proteção anticorrosiva',q:1,vu:980}],
   desconto:0,prazo:'5 dias úteis',pagto:'À vista',obs:''},
  {num:'0140',cliente:'c5',molde:'M-1055',tipo:'manutencao',valor:3300,data:'2026-08-07',validade:'2026-08-22',status:'cancelado',
   itens:[{d:'Manutenção corretiva',q:1,vu:3300}],desconto:0,prazo:'4 dias úteis',pagto:'À vista',obs:'Cancelado a pedido do cliente.'},
  {num:'0139',cliente:'c3',molde:'M-1090',tipo:'usinagem',valor:12750,data:'2026-08-04',validade:'2026-08-19',status:'aprovado',
   itens:[{d:'Usinagem de cavidade adicional',q:1,vu:8500},{d:'Ajuste e try-out',q:1,vu:4250}],desconto:0,prazo:'11 dias úteis',pagto:'50% / 50%',obs:''},
  {num:'0138',cliente:'c1',molde:'M-1048',tipo:'manutencao',valor:0,data:'2026-09-02',validade:'2026-09-17',status:'rascunho',
   itens:[{d:'Diagnóstico inicial',q:1,vu:0}],desconto:0,prazo:'',pagto:'',obs:'Rascunho — aguardando definição de escopo.'}
];
/* Advance company data */
const ADVANCE = {nome:'Advance Tecnologia em Moldes',cnpj:'18.402.556/0001-33',end:'Rua da Indústria, 480 — Distrito Industrial · Embu das Artes · SP · 06817-000',fone:'(11) 4704-3200',email:'comercial@advancetecnologia.com',site:'advancetecnologia.com'};

/* helpers */
const fmtBRL=(n)=>n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtBRLc=(n)=>'R$ '+fmtBRL(n);
const fmtDate=(iso)=>{if(!iso)return '—';const[y,m,d]=iso.split('-');return `${d}/${m}/${y}`;};
const orcTotal=(o)=>o.itens.reduce((s,i)=>s+i.q*i.vu,0)-(o.desconto||0);
const orcSubtotal=(o)=>o.itens.reduce((s,i)=>s+i.q*i.vu,0);
