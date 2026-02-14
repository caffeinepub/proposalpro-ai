import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trash2, Copy } from 'lucide-react';
import { useGetProposalById, useDeleteProposal } from '../hooks/useQueries';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProposalDetailPage() {
  const { proposalId } = useParams({ from: '/authenticated/proposal/$proposalId' });
  const navigate = useNavigate();
  const { data: proposal, isLoading } = useGetProposalById(BigInt(proposalId));
  const deleteMutation = useDeleteProposal();

  const handleDelete = async () => {
    if (!proposal) return;
    try {
      await deleteMutation.mutateAsync(proposal.id);
      toast.success('Proposal deleted successfully');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete proposal');
    }
  };

  const handleCopy = async (content: string, label: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success(`${label} copied to clipboard`);
    } else {
      toast.error('Failed to copy');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-semibold mb-2">Proposal not found</h3>
            <p className="text-muted-foreground mb-6">
              This proposal may have been deleted or doesn't exist
            </p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const date = new Date(Number(proposal.timestamp) / 1000000);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this proposal? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <span>Created {date.toLocaleDateString()}</span>
              <Badge variant="outline">{proposal.input.experienceLevel}</Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {proposal.input.clientJobDescription}
            </p>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <p className="text-sm text-muted-foreground">{proposal.input.skills}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Experience Level</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {proposal.input.experienceLevel}
              </p>
            </div>
          </div>
          {proposal.input.portfolioLink && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Portfolio</h3>
                <a
                  href={proposal.input.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {proposal.input.portfolioLink}
                </a>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Generated Content</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Upwork Proposal</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(proposal.output.upworkFreeProposal, 'Upwork Proposal')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {proposal.output.upworkFreeProposal}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Cold Email Pitch</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(proposal.output.coldEmailPitch, 'Cold Email')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {proposal.output.coldEmailPitch}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Short DM Pitch</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(proposal.output.shortDmPitch, 'DM Pitch')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {proposal.output.shortDmPitch}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Pricing Breakdown</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(proposal.output.pricingBreakdown, 'Pricing Breakdown')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {proposal.output.pricingBreakdown}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
