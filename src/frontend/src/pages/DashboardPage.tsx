import SavedProposalsList from '../components/dashboard/SavedProposalsList';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';

export default function DashboardPage() {
  return (
    <>
      <ProfileSetupModal />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Saved Proposals</h1>
          <p className="text-muted-foreground">
            View and manage your previously generated proposals
          </p>
        </div>

        <SavedProposalsList />
      </div>
    </>
  );
}
