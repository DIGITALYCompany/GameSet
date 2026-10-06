-- GAMESET: run this complete file in Supabase SQL Editor.
BEGIN;
SET LOCAL search_path = public;


CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS cloud_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id text NOT NULL,
  game_name text NOT NULL,
  dpi integer NOT NULL,
  sensitivity numeric NOT NULL,
  edpi numeric NOT NULL,
  cm360 numeric NOT NULL,
  rounds integer NOT NULL,
  initial_sensitivity numeric NOT NULL,
  fov integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cloud_test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tests" ON cloud_test_results;
CREATE POLICY "select_own_tests"
  ON cloud_test_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tests" ON cloud_test_results;
CREATE POLICY "insert_own_tests"
  ON cloud_test_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tests" ON cloud_test_results;
CREATE POLICY "delete_own_tests"
  ON cloud_test_results FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Index for listing a user's tests sorted by date
CREATE INDEX IF NOT EXISTS idx_cloud_tests_user_created
  ON cloud_test_results (user_id, created_at DESC);



CREATE TABLE IF NOT EXISTS user_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user_games" ON user_games;
CREATE POLICY "select_own_user_games"
  ON user_games FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_user_games" ON user_games;
CREATE POLICY "insert_own_user_games"
  ON user_games FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_user_games" ON user_games;
CREATE POLICY "delete_own_user_games"
  ON user_games FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_games_user
  ON user_games (user_id, created_at DESC);



-- Add subscription columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier text NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS avatar_emoji text,
  ADD COLUMN IF NOT EXISTS main_game_id text;

-- Create aim training scores table
CREATE TABLE IF NOT EXISTS aim_training_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  game_mode text NOT NULL CHECK (game_mode IN ('flick', 'tracking', 'reaction')),
  score integer NOT NULL,
  accuracy numeric NOT NULL DEFAULT 0,
  avg_reaction_ms integer,
  duration_seconds integer NOT NULL DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE aim_training_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_aim_scores" ON aim_training_scores;
CREATE POLICY "select_own_aim_scores"
  ON aim_training_scores FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_aim_scores" ON aim_training_scores;
CREATE POLICY "insert_own_aim_scores"
  ON aim_training_scores FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_aim_scores" ON aim_training_scores;
CREATE POLICY "delete_own_aim_scores"
  ON aim_training_scores FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_aim_scores_user_created
  ON aim_training_scores (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_aim_scores_user_mode
  ON aim_training_scores (user_id, game_mode, created_at DESC);



REVOKE ALL ON profiles, cloud_test_results, user_games, aim_training_scores FROM anon;

REVOKE INSERT, UPDATE ON profiles FROM authenticated;
GRANT INSERT (id, username, avatar_emoji, main_game_id) ON profiles TO authenticated;
GRANT UPDATE (username, avatar_emoji, main_game_id, updated_at) ON profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (id)
SELECT u.id FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

CREATE OR REPLACE FUNCTION public.enforce_follow_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_tier text;
  v_count integer;
BEGIN
  SELECT subscription_tier INTO v_tier FROM profiles WHERE id = NEW.user_id;
  IF COALESCE(v_tier, 'free') = 'free' THEN
    SELECT count(*) INTO v_count FROM user_games WHERE user_id = NEW.user_id;
    IF v_count >= 3 THEN
      RAISE EXCEPTION 'follow_limit_reached' USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_follow_limit() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS user_games_follow_limit ON user_games;
CREATE TRIGGER user_games_follow_limit
  BEFORE INSERT ON user_games
  FOR EACH ROW EXECUTE FUNCTION public.enforce_follow_limit();

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
drop policy if exists "workspace_select_owner" on public.player_workspaces;
create policy "workspace_select_owner" on public.player_workspaces for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "workspace_insert_owner" on public.player_workspaces;
create policy "workspace_insert_owner" on public.player_workspaces for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "workspace_update_owner" on public.player_workspaces;
create policy "workspace_update_owner" on public.player_workspaces for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "workspace_delete_owner" on public.player_workspaces;
create policy "workspace_delete_owner" on public.player_workspaces for delete to authenticated using ((select auth.uid()) = user_id);

-- Explicit privileges, independent of project default grants.
REVOKE ALL ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT (id, username, avatar_emoji, main_game_id) ON public.profiles TO authenticated;
GRANT UPDATE (username, avatar_emoji, main_game_id, updated_at) ON public.profiles TO authenticated;
REVOKE ALL ON public.cloud_test_results, public.user_games, public.aim_training_scores FROM authenticated;
GRANT SELECT, INSERT, DELETE ON public.cloud_test_results, public.user_games, public.aim_training_scores TO authenticated;

COMMIT;

-- Verification: expect 5 rows, all with rowsecurity = true.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'cloud_test_results', 'user_games', 'aim_training_scores', 'player_workspaces')
ORDER BY tablename;