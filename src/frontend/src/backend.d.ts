import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ProposalOutput {
    shortDmPitch: string;
    coldEmailPitch: string;
    upworkFreeProposal: string;
    pricingBreakdown: string;
}
export interface ProposalInput {
    portfolioLink: string;
    experienceLevel: string;
    skills: string;
    clientJobDescription: string;
}
export interface SavedProposal {
    id: bigint;
    output: ProposalOutput;
    userId: Principal;
    timestamp: Time;
    input: ProposalInput;
}
export interface UserProfile {
    plan: SubscriptionPlan;
    remainingFreeGenerations: bigint;
    totalGenerations: bigint;
}
export enum SubscriptionPlan {
    premium = "premium",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminGetUserSubscriptionStatus(user: Principal): Promise<{
        plan: SubscriptionPlan;
        remainingFreeGenerations: bigint;
        totalGenerations: bigint;
    } | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProposal(id: bigint): Promise<void>;
    generateProposal(input: ProposalInput, _output: ProposalOutput): Promise<ProposalOutput>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProposalById(id: bigint): Promise<SavedProposal | null>;
    getSavedProposals(): Promise<Array<SavedProposal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSubscriptionStatus(): Promise<{
        plan: SubscriptionPlan;
        remainingFreeGenerations: bigint;
        totalGenerations: bigint;
    }>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProposal(input: ProposalInput, output: ProposalOutput): Promise<bigint>;
    upgradeToPremium(): Promise<void>;
}
