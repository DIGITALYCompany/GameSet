import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crosshair, Repeat, Target, Radar, Plus, Users, ArrowRight, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AuthModal } from '@/components/auth/AuthModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getGameBySlug } from '@/data/games';
import { saveSelectedGame } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/utils/cn';

export function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = slug ? getGameBySlug(slug) : undefined;

  const [followed, setFollowed] = useState(false);
  const [followedLoading, setFollowedLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const checkFollowed = useCallback(async () => {
    if (!user || !game) {
      setFollowed(false);
      return;
    }
    const { data } = await supabase
      .from('user_games')
      .select('game_id')
      .eq('user_id', user.id)
      .eq('game_id', game.id)
      .maybeSingle();
    setFollowed(!!data);
  }, [user, game]);

  useEffect(() => {
    checkFollowed();
  }, [checkFollowed]);

  if (!game) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-ink">Game not found</h1>
          <p className="mt-2 text-ink-muted">This game doesn't exist in our database.</p>
          <Link to="/games" className="mt-6 inline-block">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Browse all games
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleFollow = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setFollowedLoading(true);
    setFollowError(null);
    const { error } = followed
      ? await supabase.from('user_games').delete().eq('user_id', user.id).eq('game_id', game.id)
      : await supabase.from('user_games').insert({ game_id: game.id });
    setFollowedLoading(false);
    if (error) {
      setFollowError(
        error.message.includes('follow_limit_reached')
          ? 'Free plan is limited to 3 games. Unfollow one or upgrade.'
          : 'Could not update. Please try again.'
      );
      return;
    }
    setFollowed(!followed);
  };

  const handleQuickStart = () => {
    saveSelectedGame(game.id);
    navigate('/sensitivity');
  };

  const gameTools = [
    { icon: Crosshair, label: 'Sensitivity Finder', desc: 'Calibrate your aim', route: '/sensitivity' },
    { icon: Repeat, label: 'Sensitivity Converter', desc: 'Convert from another game', route: '/tools/sensitivity-converter' },
    { icon: Target, label: 'Flick Trainer', desc: 'Warm up your flicks', route: '/tools/aim-trainer' },
    { icon: Radar, label: 'Tracking Trainer', desc: 'Train target tracking', route: '/tools/tracking-trainer' },
    { icon: Plus, label: 'Crosshair Generator', desc: 'Design your crosshair', route: '/tools/crosshair-generator' },
  ];

  return (
    <Layout>
      {/* Hero header with game color accent */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${game.color}, transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            All games
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-display font-bold"
                style={{ backgroundColor: `${game.color}20`, color: game.color }}
              >
                {game.name.split(/[\s/]+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                    {game.name}
                  </h1>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: `${game.color}20`, color: game.color }}
                  >
                    {game.genre}
                  </span>
                  <span className="text-sm text-ink-muted">{game.tagline}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                variant={followed ? 'secondary' : 'primary'}
                size="md"
                onClick={handleFollow}
                disabled={followedLoading}
              >
                <Heart className={cn('h-4 w-4', followed && 'fill-current')} />
                {followed ? 'Following' : 'Follow Game'}
              </Button>
              {followError && <p role="alert" className="max-w-[260px] text-xs text-accent-red sm:text-right">{followError}</p>}
              <Button variant="ghost" size="sm" onClick={handleQuickStart}>
                <Crosshair className="h-4 w-4" />
                Quick start sensitivity test
              </Button>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            {game.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Stats row */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Sensitivity Scale" value={game.sensDisplay} />
          <StatCard label="Recommended Range" value={`${game.recommendedRange.min} – ${game.recommendedRange.max}`} />
          <StatCard label="Default Sens" value={String(game.defaultSens)} />
          <StatCard label="FOV Support" value={game.hasFov ? 'Yes' : 'No'} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Pro presets */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent-purple" />
              <h2 className="font-display text-xl font-bold text-ink">Pro Player Settings</h2>
            </div>
            <p className="mb-5 text-sm text-ink-muted">
              Reference settings from top competitive players. Use these as a starting point for your own calibration.
            </p>
            <div className="space-y-3">
              {game.proPresets.map((preset) => (
                <Card key={preset.player} hover className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{preset.player}</p>
                    <p className="text-xs text-ink-dim">{preset.team}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <PresetStat label="DPI" value={String(preset.dpi)} />
                    <PresetStat label="Sens" value={String(preset.sensitivity)} />
                    <PresetStat label="eDPI" value={String(preset.edpi)} accent />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tools for this game */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-accent-purple" />
              <h2 className="font-display text-xl font-bold text-ink">Tools for {game.name}</h2>
            </div>
            <p className="mb-5 text-sm text-ink-muted">
              Jump into any tool pre-configured for this game.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {gameTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.label}
                    to={tool.route}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-base-surface p-4 shadow-card transition-all duration-300 ease-smooth hover:border-white/10 hover:bg-base-surface-2 hover:-translate-y-[2px] hover:shadow-card-hover"
                    onClick={() => saveSelectedGame(game.id)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/15 to-accent-magenta/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow-sm">
                      <Icon className="h-5 w-5 text-accent-purple" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{tool.label}</p>
                      <p className="text-xs text-ink-muted">{tool.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-dim transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pro preset converter CTA */}
        <Card className="mt-10 overflow-hidden" noPadding>
          <div className="relative grid gap-0 sm:grid-cols-[1fr_auto]">
            <div className="p-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Want to try a pro's sensitivity?
              </h3>
              <p className="mt-1.5 text-sm text-ink-muted">
                Pick any preset above and use the converter to match it at your own DPI. Or run the Sensitivity Finder to discover your own perfect value.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border p-6 sm:border-l sm:border-t-0">
              <Link to="/tools/sensitivity-converter">
                <Button variant="secondary" size="md">
                  <Repeat className="h-4 w-4" />
                  Converter
                </Button>
              </Link>
              <Link to="/sensitivity">
                <Button variant="primary" size="md" onClick={() => saveSelectedGame(game.id)}>
                  <Crosshair className="h-4 w-4" />
                  Find My Sens
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Layout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-base-surface p-4 shadow-card transition-all duration-300 hover:border-white/10 hover:bg-base-surface-2">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">{label}</p>
      <p className="mt-1.5 font-mono text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function PresetStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <p className="text-xs text-ink-dim">{label}</p>
      <p className={cn('font-mono text-sm font-bold', accent ? 'text-accent-purple' : 'text-ink')}>{value}</p>
    </div>
  );
}
