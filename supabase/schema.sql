create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text,
  company text,
  phone text,
  email text
);

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  project text,
  problem_type text,
  description text,
  status text,
  opened_at timestamp,
  resolved_at timestamp,
  responsible text
);

create table if not exists ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references tickets(id),
  sender text,
  timestamp timestamp
);

create table if not exists weekly_reports (
  id uuid primary key default gen_random_uuid(),
  start_date date,
  end_date date,
  responsible text,
  comments text,
  avg_response numeric,
  avg_resolution numeric
);

create table if not exists risk_clients (
  id uuid primary key default gen_random_uuid(),
  client text,
  project text,
  problem text,
  next_step text,
  deadline date,
  status text
);

create table if not exists installations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  project text,
  installed_at timestamp,
  owner text,
  status text
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  title text,
  stage text,
  value numeric,
  expected_close date
);
