import { useState } from 'react';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { SiteGrid } from '@/components/ui/SiteGrid';

interface LayoutProps {
  children: React.ReactNode;
  /** When true, hides the navbar, footer, and mobile nav for focused experiences */
  focused?: boolean;
}

export function Layout({ children, focused }: LayoutProps) {
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
    <div className="relative isolate flex min-h-screen flex-col bg-base-bg">
      <SiteGrid />
      <Navbar onOpenAuth={openAuth} />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav onOpenAuth={openAuth} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
