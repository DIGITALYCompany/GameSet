import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export async function signInWithProvider(provider: 'google' | 'discord') {
  if (!isSupabaseConfigured) return { error: 'Account services are not configured yet.' };
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } });
    return { error: error?.message ?? null };
  } catch { return { error: 'Unable to connect. Please try again.' }; }
}

export async function requestPasswordReset(email: string) {
  if (!isSupabaseConfigured) return { error: 'Account services are not configured yet.' };
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` });
    return { error: error?.message ?? null };
  } catch { return { error: 'Unable to send the reset request. Please try again.' }; }
}
