import { type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import UserMenu from '../auth/UserMenu';
import { FileText, LayoutDashboard, CreditCard } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/generate" className="flex items-center gap-3">
              <img 
                src="/assets/generated/proposalpro-icon.dim_256x256.png" 
                alt="ProposalPro AI" 
                className="h-8 w-8"
              />
              <img 
                src="/assets/generated/proposalpro-logo.dim_512x128.png" 
                alt="ProposalPro AI" 
                className="h-7"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link to="/generate">
                <Button
                  variant={isActive('/generate') ? 'secondary' : 'ghost'}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generate
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/account">
                <Button
                  variant={isActive('/account') ? 'secondary' : 'ghost'}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Account
                </Button>
              </Link>
            </nav>
          </div>

          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ProposalPro AI • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
