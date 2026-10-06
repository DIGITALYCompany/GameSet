import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, LogIn, UserPlus, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export function AuthModal({
  open,
  onClose,
  initialMode = "signin",
}: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setConfirmationEmail("");
    setEmail("");
    setPassword("");
    setError("");
    setLoading(false);
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!open) reset();
    else setMode(initialMode);
  }, [open, reset, initialMode]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fn = mode === "signin" ? signIn : signUp;
    const { error: err, confirmationRequired } = await fn(email.trim(), password);
    setLoading(false);

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    if (confirmationRequired) {
      setConfirmationEmail(email.trim());
      return;
    }

    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signin" ? "Sign in" : "Create account"}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-base-surface shadow-2xl animate-pop overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-lg p-2 text-ink-dim transition-colors hover:bg-base-surface-2 hover:text-ink focus-ring"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-6 pt-8">
          <div className="mb-6 text-center">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              {mode === "signin"
                ? "Sign in to sync your test history across devices."
                : "Create an account to save and sync your results to the cloud."}
            </p>
          </div>

        {confirmationEmail && (
          <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-accent-green/30 bg-accent-green/10 p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent-green" />
            <div><p className="text-sm font-semibold text-ink">Check your email</p><p className="mt-1 break-words text-sm text-ink-muted">If confirmation is needed for {confirmationEmail}, you will receive a link. Check your inbox and spam folder, then sign in. If you already have an account, sign in instead.</p></div>
          </div>
        )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-accent-red/30 bg-accent-red/5 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-red" />
                <p role="alert" className="text-sm text-accent-red">{error}</p>
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
              autoFocus
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
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading || Boolean(confirmationEmail)}
            >
              {mode === "signin" ? (
                <>
                  <LogIn className="h-5 w-5" />
                  {loading ? "Signing in..." : "Sign In"}
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  {loading ? "Creating account..." : "Create Account"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-ink-muted">
              {mode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                setConfirmationEmail("");
                }}
                className="font-medium text-accent-purple transition-colors hover:text-accent-magenta focus-ring rounded-lg"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
