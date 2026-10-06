-- One private workspace per account. Guest workspaces stay in device storage.
create table if not exists public.player_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  setups jsonb not null default '[]'::jsonb check (jsonb_typeof(setups) = 'array' and jsonb_array_length(setups) <= 8 and octet_length(setups::text) <= 100000),
  favorites text[] not null default '{}' check (cardinality(favorites) <= 30),
  updated_at timestamptz not null default now()
);
alter table public.player_workspaces enable row level security;
revoke all on public.player_workspaces from anon, authenticated;
grant select, insert, update, delete on public.player_workspaces to authenticated;
create policy "workspace_select_owner" on public.player_workspaces for select to authenticated using ((select auth.uid()) = user_id);
create policy "workspace_insert_owner" on public.player_workspaces for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "workspace_update_owner" on public.player_workspaces for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "workspace_delete_owner" on public.player_workspaces for delete to authenticated using ((select auth.uid()) = user_id);
