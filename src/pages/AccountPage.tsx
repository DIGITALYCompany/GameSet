import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Crosshair, ArrowRight, Mail, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/utils/helpers';
import { round } from '@/utils/calculations';
import { saveSelectedGame } from '@/lib/storage';
import type { GameId } from '@/types';

interface CloudTest {
  id: string;
  game_id: string;
  game_name: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  rounds: number;
  initial_sensitivity: number;
  fov: number | null;
  created_at: string;
}

export function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const [tests, setTests] = useState<CloudTest[]>([]);
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const loadTests = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('cloud_test_results')
      .select('id, game_id, game_name, dpi, sensitivity, edpi, cm360, rounds, initial_sensitivity, fov, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setTests(data as CloudTest[]);
    }
  }, [user]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle();
    if (data?.username) {
      setUsername(data.username);
      setSavedUsername(data.username);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/auth', { state: { from: '/account' } });
      return;
    }
    loadTests();
    loadProfile();
  }, [user, loading, navigate, loadTests, loadProfile]);

  const handleSaveName = async () => {
    if (!user || !username.trim()) return;
    setSavingName(true);
    await supabase
      .from('profiles')
      .upsert({ id: user.id, username: username.trim() });
    setSavedUsername(username.trim());
    setNameSaved(true);
    setSavingName(false);
    window.setTimeout(() => setNameSaved(false), 2000);
  };

  const handleDeleteTest = async (id: string) => {
    await supabase.from('cloud_test_results').delete().eq('id', id);
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleQuickStart = (gameId: string) => {
    saveSelectedGame(gameId);
    navigate('/sensitivity');
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-ink-muted">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Account
            </h1>
            <p className="mt-2 text-base text-ink-muted">
              Manage your profile and synced test history.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile section */}
        <Card className="mb-6">
          <h2 className="font-display text-lg font-semibold text-ink">Profile</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Display name"
                name="username"
                placeholder="Player1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSaveName}
              disabled={savingName || !username.trim() || username.trim() === savedUsername}
            >
              {nameSaved ? 'Saved!' : 'Save Name'}
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Joined {formatDateTime(user.created_at)}
            </span>
          </div>
        </Card>

        {/* Quick start */}
        <Card className="mb-6">
          <h2 className="font-display text-lg font-semibold text-ink">Quick Start</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Jump straight into a sensitivity test for your game.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['valorant', 'cs2', 'apex', 'cod'] as GameId[]).map((gid) => (
              <button
                key={gid}
                onClick={() => handleQuickStart(gid)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-base-surface-2 px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-white/15 hover:text-ink focus-ring"
              >
                {gid === 'cs2' ? 'CS2' : gid.charAt(0).toUpperCase() + gid.slice(1)}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </Card>

        {/* Cloud test history */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Synced Test History
          </h2>
          <span className="text-sm text-ink-dim">{tests.length} results</span>
        </div>

        {tests.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-base-surface-3">
              <Crosshair className="h-6 w-6 text-ink-dim" />
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              No synced tests yet. Complete a test and save it to sync here.
            </p>
            <Link to="/sensitivity" className="mt-4">
              <Button variant="primary" size="sm">
                <Crosshair className="h-4 w-4" />
                Find Your Sensitivity
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <Card
                key={test.id}
                hover
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-base-surface-3">
                    <Crosshair className="h-5 w-5 text-accent-purple" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      {test.game_name}
                    </p>
                    <p className="text-xs text-ink-dim">
                      {formatDateTime(test.created_at)} · {test.rounds} rounds
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-5">
                  <div>
                    <p className="text-xs text-ink-dim">Sens</p>
                    <p className="font-mono text-sm font-bold text-ink">
                      {round(Number(test.sensitivity), 2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-dim">eDPI</p>
                    <p className="font-mono text-sm font-bold text-ink">
                      {round(Number(test.edpi), 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-dim">cm/360</p>
                    <p className="font-mono text-sm font-bold text-ink">
                      {round(Number(test.cm360), 1)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="shrink-0 rounded-md p-2 text-ink-dim transition-colors hover:bg-red-500/10 hover:text-red-400 focus-ring"
                  aria-label="Delete test"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
