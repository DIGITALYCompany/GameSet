import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string })?.from ?? '/account';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fn = mode === 'signin' ? signIn : signUp;
    const { error: err } = await fn(email.trim(), password);

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    navigate(redirectTo);
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {mode === 'signin'
              ? 'Sign in to sync your test history across devices.'
              : 'Create an account to save and sync your results to the cloud.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/5 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="player@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {mode === 'signin' ? (
              <>
                <LogIn className="h-5 w-5" />
                {loading ? 'Signing in...' : 'Sign In'}
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                {loading ? 'Creating account...' : 'Create Account'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-ink-muted">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="font-medium text-accent-purple transition-colors hover:text-accent-magenta focus-ring rounded-md"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-ink-dim">
          GAMESET is a product by DIGITALY Games.{' '}
          <Link to="/privacy" className="underline hover:text-ink-muted">
            Privacy Policy
          </Link>
        </p>
      </div>
    </Layout>
  );
}
