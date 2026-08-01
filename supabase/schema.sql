-- STRUNG · The Tennis String Manager — schema Supabase (Postgres)
-- Para usar: crie um projeto em supabase.com, cole este SQL no SQL Editor,
-- e depois troque a camada src/lib/store.ts por chamadas @supabase/supabase-js.

create extension if not exists "uuid-ossp";

create table players (
  id uuid primary key default uuid_generate_v4(),
  owner uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  level text,
  style text,
  hours_per_week numeric,
  court text,
  ball text,
  notes text,
  created_at timestamptz default now()
);

create table racquets (
  id uuid primary key default uuid_generate_v4(),
  owner uuid references auth.users(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  brand text not null,
  model text not null,
  head_size numeric,
  weight numeric,
  pattern text,
  grip_size text,
  notes text,
  archived boolean default false,
  created_at timestamptz default now()
);

create table stock_items (
  id uuid primary key default uuid_generate_v4(),
  owner uuid references auth.users(id) on delete cascade,
  string_name text not null,
  gauge text,
  kind text check (kind in ('Rolo','Set')),
  total_meters numeric not null,
  remaining_meters numeric not null,
  cost numeric not null,
  created_at timestamptz default now()
);

create table string_jobs (
  id uuid primary key default uuid_generate_v4(),
  owner uuid references auth.users(id) on delete cascade,
  racquet_id uuid references racquets(id) on delete cascade,
  date timestamptz not null default now(),
  string_name text not null,
  gauge text,
  hybrid boolean default false,
  cross_string_name text,
  tension_main numeric not null,
  tension_cross numeric,
  meters_used numeric,
  stock_item_id uuid references stock_items(id) on delete set null,
  string_cost numeric,
  labor_price numeric,
  total_charged numeric,
  broke_at timestamptz,
  -- avaliação do jogador (1–5)
  fb_control int check (fb_control between 1 and 5),
  fb_power int check (fb_power between 1 and 5),
  fb_spin int check (fb_spin between 1 and 5),
  fb_comfort int check (fb_comfort between 1 and 5),
  fb_durability int check (fb_durability between 1 and 5),
  fb_comment text,
  fb_rated_at timestamptz,
  notes text
);

create table settings (
  owner uuid primary key references auth.users(id) on delete cascade,
  business_name text default 'Alex Pretti Tennis',
  tension_unit text default 'kg' check (tension_unit in ('kg','lb')),
  default_labor numeric default 40,
  default_meters numeric default 12
);

-- RLS: cada usuário só vê os próprios dados
alter table players enable row level security;
alter table racquets enable row level security;
alter table stock_items enable row level security;
alter table string_jobs enable row level security;
alter table settings enable row level security;

create policy "own players" on players for all using (owner = auth.uid()) with check (owner = auth.uid());
create policy "own racquets" on racquets for all using (owner = auth.uid()) with check (owner = auth.uid());
create policy "own stock" on stock_items for all using (owner = auth.uid()) with check (owner = auth.uid());
create policy "own jobs" on string_jobs for all using (owner = auth.uid()) with check (owner = auth.uid());
create policy "own settings" on settings for all using (owner = auth.uid()) with check (owner = auth.uid());

create index idx_racquets_player on racquets(player_id);
create index idx_jobs_racquet on string_jobs(racquet_id);
create index idx_jobs_date on string_jobs(date desc);
