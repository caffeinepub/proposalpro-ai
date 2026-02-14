import PlanCard from '../components/account/PlanCard';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';

export default function AccountPage() {
  return (
    <>
      <ProfileSetupModal />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Account & Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view usage statistics
          </p>
        </div>

        <PlanCard />
      </div>
    </>
  );
}
