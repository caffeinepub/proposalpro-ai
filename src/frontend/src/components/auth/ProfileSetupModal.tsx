import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface ProfileFormData {
  name: string;
}

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

  const isAuthenticated = !!identity;

  useEffect(() => {
    // Only show modal if authenticated, profile is fetched, and no profile exists
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setOpen(true);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // The name parameter is not used by the backend but we accept it for UX
      await saveMutation.mutateAsync(data.name);
      toast.success('Profile created successfully!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to ProposalPro AI!</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
