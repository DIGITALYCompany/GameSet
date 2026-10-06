import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function AuthCallbackPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    return hash.get('error_description') || query.get('error_description') || '';
  });
  useEffect(() => {
    if (error || loading) return;
    if (user) { window.history.replaceState(null, '', '/auth/callback'); navigate('/account', { replace: true }); }
    else setError('The sign-in link is invalid or expired. Please try again.');
  }, [error, loading, user, navigate]);
  return <Layout><div className="mx-auto max-w-md px-4 py-16"><p role={error ? 'alert' : 'status'} className="text-ink-muted">{error || 'Completing your sign-in…'}</p>{error && <Link to="/auth" className="focus-ring mt-4 inline-block rounded text-accent-purple-light">Back to sign in</Link>}</div></Layout>;
}

export function ResetPasswordPage() {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [linkError] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    return hash.get('error_description') || query.get('error_description') || '';
  });
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    if (password !== confirmation) { setError('The passwords do not match.'); return; }
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) setError(updateError.message);
      else { setDone(true); setPassword(''); setConfirmation(''); }
    } catch { setError('Unable to update your password. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Layout><div className="mx-auto max-w-md px-4 py-12"><div className="rounded-3xl border border-white/10 bg-base-surface p-6"><h1 className="font-display text-2xl font-semibold text-ink">Choose a new password</h1>{loading ? <p role="status" className="mt-4 text-ink-muted">Checking your reset link…</p> : linkError || !user ? <><p role="alert" className="mt-4 text-sm text-ink-muted">{linkError || 'Open the link from your reset email. If it has expired, request a new one.'}</p><Link to="/auth" className="focus-ring mt-5 inline-block rounded text-accent-purple-light">Back to sign in</Link></> : done ? <><p role="status" className="mt-4 text-accent-green">Your password has been updated.</p><Link to="/account" className="focus-ring mt-5 inline-block rounded text-accent-purple-light">Go to your account</Link></> : <form onSubmit={submit} className="mt-6 space-y-4">{error && <p role="alert" className="text-sm text-accent-red">{error}</p>}<Input label="New password" name="new-password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} /><Input label="Confirm password" name="confirm-password" type="password" autoComplete="new-password" required minLength={6} value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={busy} /><Button type="submit" variant="primary" fullWidth disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</Button></form>}</div></div></Layout>;
}
