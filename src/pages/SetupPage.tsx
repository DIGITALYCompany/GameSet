import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bookmark, Cloud, Crosshair, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";

export function SetupPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  useEffect(() => {
    if (user) {
      const next = new URLSearchParams(params);
      next.set("tab", "setup");
      navigate(`/account?${next}`, { replace: true });
    }
  }, [user, navigate, params]);
  const openAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">YOUR GAMESET ACCOUNT / MY SETUP</p>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
              Your settings.
              <br />
              <span className="hero-gradient">Always with you.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              Make GameSet your home base. Keep your game setups, crosshairs and
              favorite tools together in your account.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={loading || !!user}
                onClick={() => openAuth("signup")}
                className="arena-primary focus-ring disabled:opacity-40"
              >
                Create my account
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="arena-secondary focus-ring"
              >
                I already have an account
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
              <Check className="h-3.5 w-3.5 text-accent-green" /> Your tools
              stay free to use without an account.
            </p>
          </div>
          <div className="rounded-2xl border border-accent-purple/25 bg-base-surface p-6 sm:p-8">
            <p className="eyebrow">ONE ACCOUNT. YOUR ENTIRE LOADOUT.</p>
            <div className="mt-6 space-y-5">
              {[
                {
                  icon: Crosshair,
                  title: "A setup for every game",
                  text: "Save your DPI, sensitivity, crosshair and personal notes.",
                },
                {
                  icon: Bookmark,
                  title: "Your tools, one click away",
                  text: "Pin your favorites and pick up where you left off.",
                },
                {
                  icon: Cloud,
                  title: "Ready across devices",
                  text: "Keep your loadouts with your account when cloud services are connected.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl border border-white/[0.08] bg-black/15 p-4"
                >
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-accent-purple-light" />
                  <div>
                    <h2 className="text-sm font-semibold text-ink">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              PERSONAL SETTINGS. BUILT AROUND YOU.
            </p>
          </div>
        </div>
      </section>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </Layout>
  );
}
