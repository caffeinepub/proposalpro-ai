import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { FileText, Mail, MessageSquare, DollarSign, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/generate' });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          <Button onClick={login} disabled={isLoggingIn}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Generate Winning Proposals in Seconds
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ProposalPro AI helps freelancers create professional client proposals, cold emails, and pitches powered by intelligent templates.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={login} disabled={isLoggingIn} className="text-lg px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              {isLoggingIn ? 'Signing in...' : 'Get Started Free'}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            3 free proposals • No credit card required
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Upwork Proposals</h3>
            <p className="text-sm text-muted-foreground">
              Tailored proposals that stand out and win projects
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Cold Email Pitches</h3>
            <p className="text-sm text-muted-foreground">
              Professional outreach emails that get responses
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Short DM Pitches</h3>
            <p className="text-sm text-muted-foreground">
              Concise messages perfect for social platforms
            </p>
          </div>

          <div className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Pricing Breakdown</h3>
            <p className="text-sm text-muted-foreground">
              Smart pricing suggestions based on your experience
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
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
