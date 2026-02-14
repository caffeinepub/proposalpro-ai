import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useSaveProposal } from '../../hooks/useQueries';
import { type ProposalInput, type ProposalOutput } from '../../backend';
import { toast } from 'sonner';

interface SaveProposalButtonProps {
  input: ProposalInput;
  output: ProposalOutput;
}

export default function SaveProposalButton({ input, output }: SaveProposalButtonProps) {
  const saveMutation = useSaveProposal();

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({ input, output });
      toast.success('Proposal saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save proposal');
    }
  };

  return (
    <Button onClick={handleSave} disabled={saveMutation.isPending}>
      {saveMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Proposal
        </>
      )}
    </Button>
  );
}
