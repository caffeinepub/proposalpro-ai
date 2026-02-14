import { useEffect, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, isInitializing, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, navigate]);

  // Clear cache on logout
  useEffect(() => {
    const handleClear = async () => {
      await clear();
      queryClient.clear();
    };

    return () => {
      // Cleanup if needed
    };
  }, [clear, queryClient]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return null;
  }

  return <>{children}</>;
}
