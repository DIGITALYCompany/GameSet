/*
# Create user_games table for "My Games" preference

1. New Tables
- `user_games`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users with cascade delete)
  - `game_id` (text, not null — which FPS game the user follows)
  - `created_at` (timestamptz, default now())
  - Unique constraint on (user_id, game_id) to prevent duplicates

2. Security
- RLS enabled on `user_games`.
- Owner-scoped CRUD: each authenticated user can only manage their own game preferences.
- All policies scoped TO authenticated with auth.uid() ownership checks.
- user_id has DEFAULT auth.uid() so inserts from the client succeed even when user_id is omitted.
*/

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
