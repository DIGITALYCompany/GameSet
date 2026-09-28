import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  /** When true, hides the navbar, footer, and mobile nav for focused experiences */
  focused?: boolean;
}

export function Layout({ children, focused }: LayoutProps) {
  if (focused) {
    return (
      <div className="min-h-screen bg-base-bg">
        <div className="pb-20 md:pb-0">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-bg">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
