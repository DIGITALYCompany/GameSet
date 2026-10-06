import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  LogOut,
  Target,
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
import { useWorkspace } from "@/hooks/useWorkspace";
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
  const { status: workspaceStatus } = useWorkspace();
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
      navigate("/auth", { replace: true });
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
    window.dispatchEvent(new Event("gameset:profile-updated"));
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
      <div className="account-dashboard relative">

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
          <header className="grid gap-5 rounded-3xl border border-white/[0.12] bg-[#12121b] p-5 shadow-xl sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar value={profile.avatar_emoji} size="md" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-purple-light">Player dashboard</p>
                <div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="max-w-[220px] truncate font-display text-2xl font-semibold tracking-tight text-ink sm:max-w-none sm:text-3xl">Hey, {profile.username || "Player"}.</h1>{!dataLoading && <TierBadge tier={profile.subscription_tier} />}</div>
                <p className="mt-2 text-xs text-ink-muted">{joined ? `Member since ${joined}` : "Your personal player space"}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 lg:border-0 lg:pt-0">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-ink-muted"><span className={cn("h-1.5 w-1.5 rounded-full", workspaceStatus === "synced" ? "bg-accent-green" : workspaceStatus === "error" ? "bg-accent-orange" : "bg-ink-dim")} />{workspaceStatus === "synced" ? "Workspace synced" : workspaceStatus === "error" ? "Workspace sync issue" : workspaceStatus === "syncing" ? "Syncing workspace?" : "Loading workspace?"}</span>
              <button type="button" onClick={() => switchTab("profile")} className="focus-ring rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-ink hover:bg-white/5">Edit profile</button>
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

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[210px_1fr]">
            <nav
              aria-label="Account sections"
              className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 lg:sticky lg:top-24 lg:overflow-visible lg:p-3"
            >
              <ul className="flex gap-1 lg:flex-col">
                {TABS.map(({ id, label, icon: Icon }) => {
                  const active = tab === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => switchTab(id)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 focus-ring",
                          active
                            ? "bg-accent-purple/15 text-ink shadow-[inset_0_0_0_1px_rgba(165,107,255,0.25)]"
                            : "text-ink-muted hover:bg-white/[0.03] hover:text-ink",
                        )}
                      >
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
              <div className="mt-5 hidden border-t border-white/10 pt-4 lg:block">
                <Link to="/tools/aim-trainer" className="focus-ring flex items-center gap-2 rounded-xl p-3 text-xs font-medium text-ink-muted hover:bg-white/5"><Target className="h-4 w-4" />Quick training<ArrowRight className="ml-auto h-3 w-3" /></Link>
                <button type="button" onClick={handleSignOut} className="focus-ring flex w-full items-center gap-2 rounded-xl p-3 text-xs text-ink-dim hover:bg-white/5"><LogOut className="h-4 w-4" />Sign out</button>
              </div>
            </nav>

            <div key={tab} className="min-w-0 animate-fade-in motion-reduce:animate-none">
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
                      followedIds={followed}
                      onOpenSetup={() => switchTab("setup")}
                      onOpenGames={() => switchTab("games")}
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
