import { useState } from "react";
import { useLocation } from "react-router-dom";
import { GAMES } from "@/data/games";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { SiteGrid } from "@/components/ui/SiteGrid";
import { PageBreadcrumbs } from "./PageBreadcrumbs";

interface LayoutProps {
  children: React.ReactNode;
  /** When true, hides the navbar, footer, and mobile nav for focused experiences */
  focused?: boolean;
}

export function Layout({ children, focused }: LayoutProps) {
  const { pathname } = useLocation();
  const ambientColor =
    GAMES.find((game) => pathname === `/games/${game.slug}`)?.color ||
    "#8E3BFF";
  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => setAuthOpen(true);

  if (focused) {
    return (
      <div className="relative isolate min-h-screen bg-base-bg">
        <SiteGrid />
        <div className="pb-20 md:pb-0">{children}</div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div
      className="relative isolate flex min-h-screen flex-col bg-base-bg"
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 650px at 50% 0%, ${ambientColor}18, transparent 75%)`,
      }}
    >
      <SiteGrid />
      <Navbar onOpenAuth={openAuth} />
      <main className="flex-1 pb-20 md:pb-0">
        <PageBreadcrumbs />
        {children}
      </main>
      <Footer />
      <MobileNav onOpenAuth={openAuth} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
