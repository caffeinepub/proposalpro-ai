import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ProposalInput, type ProposalOutput, type SavedProposal, type UserProfile, SubscriptionPlan } from '../backend';
import { toNumber } from '../utils/number';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      
      // Create a new profile with default values
      const profile: UserProfile = {
        plan: SubscriptionPlan.free,
        remainingFreeGenerations: BigInt(10),
        totalGenerations: BigInt(0),
      };
      
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Normalized entitlements interface for UI consumption
export interface NormalizedEntitlements {
  plan: 'free' | 'premium';
  remainingFreeGenerations: number;
  totalGenerations: number;
}

// Entitlements Query - returns normalized numbers for UI
export function useGetEntitlements() {
  const { actor, isFetching } = useActor();

  return useQuery<NormalizedEntitlements | null>({
    queryKey: ['entitlements'],
    queryFn: async () => {
      if (!actor) return null;
      const status = await actor.getUserSubscriptionStatus();
      
      // Normalize bigint values to numbers for safe UI usage
      return {
        plan: Object.keys(status.plan)[0] as 'free' | 'premium',
        remainingFreeGenerations: toNumber(status.remainingFreeGenerations),
        totalGenerations: toNumber(status.totalGenerations),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// Generate Proposal Mutation
export function useGenerateProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ input, output }: { input: ProposalInput; output: ProposalOutput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateProposal(input, output);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entitlements'] });
    },
  });
}

// Upgrade to Premium Mutation
export function useUpgradeToPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.upgradeToPremium();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entitlements'] });
    },
  });
}

// Saved Proposals Queries
export function useGetSavedProposals() {
  const { actor, isFetching } = useActor();

  return useQuery<SavedProposal[]>({
    queryKey: ['savedProposals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSavedProposals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProposalById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<SavedProposal | null>({
    queryKey: ['proposal', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProposalById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ input, output }: { input: ProposalInput; output: ProposalOutput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveProposal(input, output);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProposals'] });
    },
  });
}

export function useDeleteProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProposal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal'] });
    },
  });
}
