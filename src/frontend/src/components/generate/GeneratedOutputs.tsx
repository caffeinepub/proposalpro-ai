import { useState, useEffect } from 'react';
import EditableOutputSection from './EditableOutputSection';
import { type ProposalOutput } from '../../backend';

interface GeneratedOutputsProps {
  output: ProposalOutput;
  onOutputsEdited: (outputs: ProposalOutput) => void;
}

export default function GeneratedOutputs({ output, onOutputsEdited }: GeneratedOutputsProps) {
  const [upworkProposal, setUpworkProposal] = useState(output.upworkFreeProposal || '');
  const [coldEmail, setColdEmail] = useState(output.coldEmailPitch || '');
  const [shortDM, setShortDM] = useState(output.shortDmPitch || '');
  const [pricing, setPricing] = useState(output.pricingBreakdown || '');

  // Update local state when output prop changes
  useEffect(() => {
    setUpworkProposal(output.upworkFreeProposal || '');
    setColdEmail(output.coldEmailPitch || '');
    setShortDM(output.shortDmPitch || '');
    setPricing(output.pricingBreakdown || '');
  }, [output]);

  // Notify parent of edits
  useEffect(() => {
    onOutputsEdited({
      upworkFreeProposal: upworkProposal,
      coldEmailPitch: coldEmail,
      shortDmPitch: shortDM,
      pricingBreakdown: pricing,
    });
  }, [upworkProposal, coldEmail, shortDM, pricing, onOutputsEdited]);

  return (
    <div className="space-y-6">
      <EditableOutputSection
        title="Upwork Proposal"
        content={upworkProposal}
        onContentChange={setUpworkProposal}
      />
      <EditableOutputSection
        title="Cold Email Pitch"
        content={coldEmail}
        onContentChange={setColdEmail}
      />
      <EditableOutputSection
        title="Short DM Pitch"
        content={shortDM}
        onContentChange={setShortDM}
      />
      <EditableOutputSection
        title="Pricing Breakdown"
        content={pricing}
        onContentChange={setPricing}
      />
    </div>
  );
}
