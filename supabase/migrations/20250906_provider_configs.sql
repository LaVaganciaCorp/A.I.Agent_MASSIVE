-- provider_configs secure storage for provider keys and metadata
create table if not exists public.provider_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  provider text not null,
  endpoint text,
  model text,
  headers jsonb,
  azure jsonb,
  enc_api_key text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.provider_configs enable row level security;

create policy if not exists "provider_configs_own_rows"
  on public.provider_configs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists provider_configs_user_idx on public.provider_configs (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists tg_provider_configs_updated_at on public.provider_configs;

create trigger tg_provider_configs_updated_at
before update on public.provider_configs
for each row execute function public.set_updated_at();

