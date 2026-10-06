import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/auth/AuthForm';

export function AuthPage() {
  const navigate = useNavigate();
  return <Layout><div className="mx-auto max-w-md px-4 py-12"><div className="rounded-3xl border border-white/10 bg-base-surface p-6"><AuthForm onSuccess={() => navigate('/account', { replace: true })} /></div></div></Layout>;
}
