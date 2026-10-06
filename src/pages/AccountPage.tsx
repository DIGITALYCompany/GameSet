import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  Clock,
  Crown,
  Gamepad2,
  LayoutDashboard,
  Loader2,
  Settings,
  UserRound,
} from "lucide-react";
import { SetupSection } from "@/components/account/SetupSection";
import { Layout } from "@/components/layout/Layout";
import {
  Avatar,
  type CloudTest,
  type ProfileData,
} from "@/components/account/AccountUI";
import { OverviewSection } from "@/components/account/OverviewSection";
import { ProfileSection } from "@/components/account/ProfileSection";
import { GamesSection } from "@/components/account/GamesSection";
import { HistorySection } from "@/components/account/HistorySection";
import { PlanSection, TierBadge } from "@/components/account/PlanSection";
import { SettingsSection } from "@/components/account/SettingsSection";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { saveSelectedGame } from "@/lib/storage";
import { cn } from "@/utils/cn";
import type { AimTrainingScore } from "@/types";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "setup", label: "My setup", icon: Bookmark },
  { id: "games", label: "My games", icon: Gamepad2 },
  { id: "history", label: "History", icon: Clock },
  { id: "premium", label: "Plan", icon: Crown },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type Tab = (typeof TABS)[number]["id"];

const EMPTY_PROFILE: ProfileData = {
  username: "",
  subscription_tier: "free",
  subscription_status: null,
  avatar_emoji: null,
  main_game_id: null,
};

export function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: Tab = TABS.some((t) => t.id === requested)
    ? (requested as Tab)
    : "overview";

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [tests, setTests] = useState<CloudTest[]>([]);
  const [aimScores, setAimScores] = useState<AimTrainingScore[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const userId = user?.id;

  const loadAll = useCallback(async () => {
    if (!userId) return;
    setDataLoading(true);
    try {
      const [p, t, g, a] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "username, subscription_tier, subscription_status, avatar_emoji, main_game_id",
          )
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("cloud_test_results")
          .select(
            "id, game_id, game_name, dpi, sensitivity, edpi, cm360, rounds, initial_sensitivity, fov, created_at",
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_games")
          .select("game_id")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("aim_training_scores")
          .select(
            "id, game_mode, score, accuracy, avg_reaction_ms, duration_seconds, created_at",
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      setLoadError(Boolean(p.error || t.error || g.error || a.error));
      if (p.data)
        setProfile({
          ...EMPTY_PROFILE,
          ...(p.data as ProfileData),
          username: (p.data as ProfileData).username ?? "",
        });
      if (t.data) setTests(t.data as CloudTest[]);
      if (g.data)
        setFollowed(g.data.map((d: { game_id: string }) => d.game_id));
      if (a.data) setAimScores(a.data as AimTrainingScore[]);
    } catch {
      setLoadError(true);
    } finally {
      setDataLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      const next = new URLSearchParams(window.location.search);
      next.delete("tab");
      navigate(`/setup?${next}`, { replace: true });
      return;
    }
    loadAll();
  }, [userId, loading, navigate, loadAll]);

  const saveProfile = async (patch: Partial<ProfileData>) => {
    if (!user) return false;
    const allowed: Partial<
      Pick<ProfileData, "username" | "avatar_emoji" | "main_game_id">
    > = {};
    if ("username" in patch) allowed.username = patch.username;
    if ("avatar_emoji" in patch) allowed.avatar_emoji = patch.avatar_emoji;
    if ("main_game_id" in patch) allowed.main_game_id = patch.main_game_id;
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...allowed, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("id")
      .maybeSingle();
    if (error || !data) return false;
    setProfile((prev) => ({ ...prev, ...allowed }));
    return true;
  };

  const deleteTest = async (id: string) => {
    const { error } = await supabase
      .from("cloud_test_results")
      .delete()
      .eq("id", id);
    if (error) return false;
    setTests((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  const unfollow = async (gameId: string) => {
    if (!user) return false;
    const { error } = await supabase
      .from("user_games")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);
    if (error) return false;
    setFollowed((prev) => prev.filter((id) => id !== gameId));
    return true;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const switchTab = (next: Tab) => {
    setSearchParams(next === "overview" ? {} : { tab: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-ink-dim" />
        </div>
      </Layout>
    );
  }

  const isPremium = profile.subscription_tier !== "free";
  const testCounts = tests.reduce<Record<string, number>>((acc, t) => {
    acc[t.game_id] = (acc[t.game_id] || 0) + 1;
    return acc;
  }, {});
  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Layout>
      <div className="relative">

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar value={profile.avatar_emoji} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {profile.username || "Player"}
                </h1>
                <TierBadge tier={profile.subscription_tier} />
              </div>
              <p className="mt-1.5 text-sm text-ink-muted">
                {user.email}
                {joined && (
                  <span className="text-ink-dim"> · Member since {joined}</span>
                )}
              </p>
            </div>
          </header>

          {loadError && (
            <div
              role="alert"
              className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-accent-red/20 bg-accent-red/[0.06] px-4 py-3 text-sm"
            >
              <span className="text-ink">
                Some of your data could not be loaded.
              </span>
              <button
                type="button"
                onClick={loadAll}
                className="font-medium text-accent-red hover:underline focus-ring rounded"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
            <nav
              aria-label="Account sections"
              className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0"
            >
              <ul className="flex gap-1 lg:sticky lg:top-24 lg:flex-col">
                {TABS.map(({ id, label, icon: Icon }) => {
                  const active = tab === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => switchTab(id)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-ring",
                          active
                            ? "bg-white/[0.06] text-ink"
                            : "text-ink-muted hover:bg-white/[0.03] hover:text-ink",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 hidden h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent-purple transition-opacity lg:block",
                            active ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active
                              ? "text-accent-purple-light"
                              : "text-ink-dim group-hover:text-ink-muted",
                          )}
                        />
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div key={tab} className="min-w-0 animate-fade-in">
              {tab === "setup" ? (
                <SetupSection />
              ) : dataLoading ? (
                <div className="space-y-4">
                  <div className="h-44 animate-pulse rounded-2xl bg-white/[0.03]" />
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 animate-pulse rounded-xl bg-white/[0.03]"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {tab === "overview" && (
                    <OverviewSection
                      tests={tests}
                      aimScores={aimScores}
                      followedCount={followed.length}
                      onOpenHistory={() => switchTab("history")}
                    />
                  )}
                  {tab === "profile" && (
                    <ProfileSection
                      profile={profile}
                      email={user.email ?? ""}
                      onSave={saveProfile}
                    />
                  )}
                  {tab === "games" && (
                    <GamesSection
                      followedIds={followed}
                      testCounts={testCounts}
                      isPremium={isPremium}
                      onQuickStart={(id) => {
                        saveSelectedGame(id);
                        navigate("/sensitivity");
                      }}
                      onUnfollow={unfollow}
                    />
                  )}
                  {tab === "history" && (
                    <HistorySection
                      tests={tests}
                      aimScores={aimScores}
                      isPremium={isPremium}
                      onDeleteTest={deleteTest}
                    />
                  )}
                  {tab === "premium" && (
                    <PlanSection
                      tier={profile.subscription_tier}
                      status={profile.subscription_status}
                    />
                  )}
                  {tab === "settings" && (
                    <SettingsSection
                      isPremium={isPremium}
                      onSignOut={handleSignOut}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
