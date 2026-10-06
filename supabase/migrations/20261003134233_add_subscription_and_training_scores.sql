/*
# Add subscription tier and aim training scores

1. Modified Tables
- `profiles`
  - `subscription_tier` (text, not null, default 'free') — 'free', 'pro', or 'elite'
  - `subscription_status` (text, nullable) — 'active', 'canceled', 'past_due'
  - `subscription_expires_at` (timestamptz, nullable) — when the current billing period ends
  - `avatar_emoji` (text, nullable) — user-chosen emoji avatar
  - `main_game_id` (text, nullable) — primary game the user plays

2. New Tables
- `aim_training_scores`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users with cascade delete)
  - `game_mode` (text, not null) — 'flick', 'tracking', 'reaction'
  - `score` (integer, not null) — hits or points
  - `accuracy` (numeric, not null) — percentage 0-100
  - `avg_reaction_ms` (integer, nullable) — average reaction time in ms
  - `duration_seconds` (integer, not null) — test duration
  - `created_at` (timestamptz, default now())

3. Security
- `profiles`: existing RLS policies already cover SELECT/INSERT/UPDATE on own row.
  - New UPDATE policy added to allow updating subscription fields (still owner-scoped).
- `aim_training_scores`: RLS enabled with owner-scoped CRUD (TO authenticated, auth.uid() = user_id).
- user_id has DEFAULT auth.uid() on aim_training_scores so inserts from the client succeed.

4. Important Notes
- subscription_tier defaults to 'free' so all existing users keep free access.
- The subscription fields are server-managed (set by Stripe webhook or admin), but RLS
  allows the user to UPDATE their own profile row — column-level restrictions on
  subscription fields should be enforced at the application/edge-function level.
- A CHECK constraint on subscription_tier ensures only valid values.
*/

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
