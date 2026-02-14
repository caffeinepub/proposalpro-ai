import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Trash2, FileText } from 'lucide-react';
import { useGetSavedProposals, useDeleteProposal } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { timestampToDate } from '../../utils/number';
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

export default function SavedProposalsList() {
  const { data: proposals, isLoading } = useGetSavedProposals();
  const deleteMutation = useDeleteProposal();

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Proposal deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete proposal');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved proposals yet</h3>
          <p className="text-muted-foreground mb-6">
            Generate your first proposal to see it here
          </p>
          <Link to="/generate">
            <Button>Generate Proposal</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => {
        const date = timestampToDate(proposal.timestamp);
        const title = proposal.input.clientJobDescription.slice(0, 80) + '...';

        return (
          <Card key={proposal.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>{date.toLocaleDateString()}</span>
                      <Badge variant="outline">{proposal.input.experienceLevel}</Badge>
                      <span className="text-xs">{proposal.input.skills}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link to="/proposal/$proposalId" params={{ proposalId: proposal.id.toString() }}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
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
                        <AlertDialogAction
                          onClick={() => handleDelete(proposal.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
