create extension if not exists "pgcrypto";

create table if not exists weekly_reports (
  id uuid primary key default gen_random_uuid(),
  meeting_info jsonb not null,
  indicators jsonb not null,
  chamados jsonb not null default '[]'::jsonb,
  mensagens_chamado jsonb not null default '[]'::jsonb,
  pesquisa_satisfacao jsonb not null default '[]'::jsonb,
  clientes_risco jsonb not null default '[]'::jsonb,
  observacoes_gerais text,
  instalacoes_recentes jsonb not null default '[]'::jsonb,
  oportunidades_comerciais jsonb not null default '[]'::jsonb,
  dificuldades jsonb not null,
  acoes_melhoria jsonb not null default '[]'::jsonb,
  prioridades_proxima_semana jsonb not null default '[]'::jsonb,
  contato_proativo jsonb not null default '[]'::jsonb,
  resumo_final jsonb not null,
  registro_ata jsonb not null
);
