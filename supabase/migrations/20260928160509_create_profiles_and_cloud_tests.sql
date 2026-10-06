/*
# Create profiles and cloud_test_results tables

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, nullable, display name shown in the portal)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

- `cloud_test_results`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users with cascade delete)
  - `game_id` (text, not null — which FPS game)
  - `game_name` (text, not null — denormalized for display)
  - `dpi` (integer, not null)
  - `sensitivity` (numeric, not null)
  - `edpi` (numeric, not null)
  - `cm360` (numeric, not null)
  - `rounds` (integer, not null)
  - `initial_sensitivity` (numeric, not null)
  - `fov` (integer, nullable)
  - `created_at` (timestamptz, default now())

2. Security
- Both tables have RLS enabled.
- `profiles`: users can read and update only their own profile row.
- `cloud_test_results`: users can CRUD only their own test results (owner-scoped via user_id DEFAULT auth.uid()).
- All policies scoped TO authenticated with auth.uid() ownership checks.
- user_id has DEFAULT auth.uid() so inserts from the client succeed even when user_id is omitted.
*/

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
