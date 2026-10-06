/*
# Lock subscription fields, auto-create profiles, enforce free follow limit

1. Security fixes
- `profiles`: signed-in users could previously edit EVERY column of their own row,
  including `subscription_tier`, `subscription_status` and `subscription_expires_at`
  (i.e. grant themselves Pro/Elite for free). Write privileges are now limited to
  the user-editable columns: `username`, `avatar_emoji`, `main_game_id`, `updated_at`.
  Subscription columns can only be changed server-side (e.g. a future payment webhook).
- The `anon` (signed-out) role loses all table privileges on the four app tables.
  No anon policies existed, so nothing it legitimately used is affected.

2. New behaviour
- `handle_new_user` trigger on `auth.users`: creates an empty `profiles` row for
  each new account, so every user always has a profile (tier defaults to 'free').
- Backfill: creates the missing profile rows for existing users.
- `enforce_follow_limit` trigger on `user_games`: free-plan users cannot follow
  more than 3 games, enforced in the database instead of only in the browser.

3. Notes
- No data is removed or altered; only privileges, triggers and missing rows added.
*/

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
