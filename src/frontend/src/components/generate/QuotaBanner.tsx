import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useGetEntitlements } from '../../hooks/useQueries';

export default function QuotaBanner() {
  const { data: entitlements, isLoading } = useGetEntitlements();

  if (isLoading || !entitlements) {
    return null;
  }

  const isPremium = entitlements.plan === 'premium';
  const remaining = entitlements.remainingFreeGenerations;

  if (isPremium) {
    return (
      <Alert className="border-primary/50 bg-primary/5">
        <Sparkles className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default">Premium</Badge>
            <span>Unlimited generations available</span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (remaining === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>You've used all your free generations.</span>
          <Link to="/account">
            <Button size="sm" variant="outline">
              Upgrade to Premium
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={remaining <= 1 ? 'border-yellow-500/50 bg-yellow-500/5' : ''}>
      <AlertCircle className={`h-4 w-4 ${remaining <= 1 ? 'text-yellow-600' : ''}`} />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={remaining <= 1 ? 'outline' : 'secondary'}>Free Plan</Badge>
          <span>
            {remaining} free generation{remaining !== 1 ? 's' : ''} remaining
          </span>
        </div>
        {remaining <= 1 && (
          <Link to="/account">
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
}
