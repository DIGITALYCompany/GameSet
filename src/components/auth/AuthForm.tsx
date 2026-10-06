import { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { requestPasswordReset, signInWithProvider } from '@/lib/auth';

export function AuthForm({ initialMode = 'signin', onSuccess }: { initialMode?: 'signin' | 'signup'; onSuccess: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const changeMode = (next: typeof mode) => { setMode(next); setError(''); setMessage(''); setPassword(''); };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setMessage(''); setBusy(true);
    try {
      if (mode === 'reset') {
        const result = await requestPasswordReset(email.trim());
        if (result.error) setError(result.error);
        else setMessage('If an account exists for this address, you will receive a password reset link. Check your inbox and spam folder.');
        return;
      }
      const result = await (mode === 'signin' ? signIn : signUp)(email.trim(), password);
      if (result.error) setError(result.error);
      else if (result.confirmationRequired) setMessage('Check your inbox for a confirmation link before signing in. If you already have an account, sign in instead.');
      else onSuccess();
    } catch { setError('Unable to reach account services. Please try again.'); }
    finally { setBusy(false); }
  }

  async function handleProvider(provider: 'google' | 'discord') {
    setBusy(true); setError(''); setMessage('');
    const result = await signInWithProvider(provider);
    if (result.error) setError(result.error);
    setBusy(false);
  }

  return (
    <div>
      <div className="mb-7 text-center"><div className="flex justify-center"><Logo size="md" /></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-purple-light">Your player space</p><h1 className="mt-2 font-display text-2xl font-semibold text-ink">{mode === 'reset' ? 'Forgot your password?' : mode === 'signin' ? 'Welcome back.' : 'Make it your GameSet.'}</h1><p className="mt-2 text-sm leading-relaxed text-ink-muted">{mode === 'reset' ? 'Enter your email to receive a secure reset link.' : 'Your games, your settings, your progress. All in one place.'}</p></div>
      {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 p-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-red" /><p className="text-sm text-accent-red">{error}</p></div>}
      {message && <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-accent-green/25 bg-accent-green/10 p-4"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" /><p className="text-sm leading-relaxed text-ink">{message}</p></div>}
      {mode !== 'reset' && <><div className="grid grid-cols-2 gap-3"><Button disabled={busy} onClick={() => void handleProvider('google')}><span aria-hidden="true" className="font-bold text-ink">G</span> Google</Button><Button disabled={busy} onClick={() => void handleProvider('discord')} className="border-indigo-400/20 bg-indigo-500/10"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-indigo-300"><path d="M19.7 5.3a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-5.4 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.5 9.4.7 13.4 1.1 17.3a18 18 0 0 0 5.4 2.7l1.1-1.8-1.7-.8.4-.3a13 13 0 0 0 11.4 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.4-3.2-12ZM8.5 14.9c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" /></svg>Discord</Button></div><div className="mt-3 flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"><span className="font-semibold tracking-wider text-ink-dim">DIGITALY ID</span><span className="text-ink-dim">Coming later</span></div><div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-ink-dim"><span className="h-px flex-1 bg-white/10" />or continue with email<span className="h-px flex-1 bg-white/10" /></div></>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" name="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="player@example.com" required autoComplete="email" disabled={busy} />
        {mode !== 'reset' && <div><Input label="Password" type="password" name="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 6 characters" required minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} disabled={busy} />{mode === 'signin' && <button type="button" disabled={busy} onClick={() => changeMode('reset')} className="focus-ring mt-2 rounded text-xs text-accent-purple-light hover:text-ink">Forgot password?</button>}</div>}
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={busy || Boolean(message)}>{busy ? 'Please wait…' : mode === 'reset' ? 'Send reset link' : mode === 'signin' ? 'Sign in' : 'Create account'}<ArrowRight className="h-4 w-4" /></Button>
      </form>
      <div className="mt-5 text-center text-sm text-ink-muted">{mode === 'reset' ? <button type="button" disabled={busy} onClick={() => changeMode('signin')} className="focus-ring inline-flex items-center gap-2 rounded text-ink"><ArrowLeft className="h-4 w-4" />Back to sign in</button> : <>{mode === 'signin' ? 'New here?' : 'Already have an account?'} <button type="button" disabled={busy} onClick={() => changeMode(mode === 'signin' ? 'signup' : 'signin')} className="focus-ring rounded font-medium text-accent-purple-light">{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></>}</div>
      <p className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-ink-dim"><ShieldCheck className="h-3.5 w-3.5" />Your player data stays private.</p>
    </div>
  );
}
