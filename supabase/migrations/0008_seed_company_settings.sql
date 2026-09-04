-- Advance — Fase 1: dados da empresa (linha única, editável em Configurações).
insert into public.company_settings (
  id, legal_name, document, address, phone, email, website,
  logo_url, quote_default_validity_days, quote_default_payment_terms
) values (
  1,
  'Advance Tecnologia em Moldes',
  '18.402.556/0001-33',
  'Rua da Indústria, 480 — Distrito Industrial · Embu das Artes · SP · 06817-000',
  '(11) 4704-3200',
  'comercial@advancetecnologia.com',
  'advancetecnologia.com',
  '/brand/logo-advance-blue.png',
  15,
  '50% na aprovação · 50% na entrega'
)
on conflict (id) do nothing;
