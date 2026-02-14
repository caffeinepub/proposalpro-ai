import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { useGetEntitlements, useUpgradeToPremium } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function PlanCard() {
  const { data: entitlements, isLoading } = useGetEntitlements();
  const upgradeMutation = useUpgradeToPremium();

  const handleUpgrade = async () => {
    try {
      await upgradeMutation.mutateAsync();
      toast.success('Successfully upgraded to Premium!');
    } catch (error: any) {
      if (error.message.includes('Already on Premium')) {
        toast.info('You are already on the Premium plan');
      } else {
        toast.error(error.message || 'Failed to upgrade');
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!entitlements) {
    return null;
  }

  const isPremium = entitlements.plan === 'premium';
  const remaining = entitlements.remainingFreeGenerations;
  const total = entitlements.totalGenerations;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant={isPremium ? 'default' : 'secondary'}>
              {isPremium ? 'Premium' : 'Free'}
            </Badge>
          </div>
          <CardDescription>
            {isPremium
              ? 'Unlimited proposal generations'
              : `${remaining} free generation${remaining !== 1 ? 's' : ''} remaining`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Generations</span>
              <span className="font-medium">{total}</span>
            </div>
            {!isPremium && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Free</span>
                <span className="font-medium">{remaining}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {isPremium ? 'Premium Features' : 'Free Plan Features'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Upwork proposals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Cold email pitches</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Short DM pitches</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Pricing breakdowns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Save & edit proposals</span>
              </li>
              {isPremium && (
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Unlimited generations</span>
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Card */}
      {!isPremium && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Upgrade to Premium</CardTitle>
            </div>
            <CardDescription>Unlock unlimited proposal generations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Premium Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited proposal generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Export to multiple formats</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">Development Mode</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Click below to instantly upgrade
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleUpgrade}
                disabled={upgradeMutation.isPending}
              >
                {upgradeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Developer Upgrade
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a development-safe upgrade for testing purposes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle>Premium Active</CardTitle>
            <CardDescription>You're enjoying unlimited access</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Thank you for being Premium!</h3>
            <p className="text-sm text-muted-foreground">
              Generate unlimited proposals and grow your freelance business
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
