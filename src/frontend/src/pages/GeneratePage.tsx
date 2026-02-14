import { useState } from 'react';
import GenerateForm from '../components/generate/GenerateForm';
import GeneratedOutputs from '../components/generate/GeneratedOutputs';
import QuotaBanner from '../components/generate/QuotaBanner';
import SaveProposalButton from '../components/generate/SaveProposalButton';
import { type ProposalInput, type ProposalOutput } from '../backend';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';

export default function GeneratePage() {
  const [generatedOutput, setGeneratedOutput] = useState<ProposalOutput | null>(null);
  const [currentInput, setCurrentInput] = useState<ProposalInput | null>(null);
  const [editedOutputs, setEditedOutputs] = useState<ProposalOutput | null>(null);

  const handleGenerateSuccess = (input: ProposalInput, output: ProposalOutput) => {
    setCurrentInput(input);
    setGeneratedOutput(output);
    setEditedOutputs(output);
  };

  const handleOutputsEdited = (outputs: ProposalOutput) => {
    setEditedOutputs(outputs);
  };

  return (
    <>
      <ProfileSetupModal />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Generate Proposal</h1>
          <p className="text-muted-foreground">
            Enter your details to generate professional proposals and pitches
          </p>
        </div>

        <QuotaBanner />

        <GenerateForm onSuccess={handleGenerateSuccess} />

        {generatedOutput && editedOutputs && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Generated Content</h2>
              {currentInput && (
                <SaveProposalButton input={currentInput} output={editedOutputs} />
              )}
            </div>
            <GeneratedOutputs
              output={generatedOutput}
              onOutputsEdited={handleOutputsEdited}
            />
          </div>
        )}
      </div>
    </>
  );
}
