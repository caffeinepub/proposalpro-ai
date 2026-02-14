import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useGenerateProposal } from '../../hooks/useQueries';
import { type ProposalInput, type ProposalOutput } from '../../backend';
import { toast } from 'sonner';
import { useGetEntitlements } from '../../hooks/useQueries';

interface GenerateFormProps {
  onSuccess: (input: ProposalInput, output: ProposalOutput) => void;
}

interface FormData {
  clientJobDescription: string;
  skills: string;
  experienceLevel: string;
  portfolioLink: string;
}

export default function GenerateForm({ onSuccess }: GenerateFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const generateMutation = useGenerateProposal();
  const { data: entitlements } = useGetEntitlements();
  const [experienceLevel, setExperienceLevel] = useState('');

  const canGenerate = entitlements?.plan === 'premium' || (entitlements?.remainingFreeGenerations ?? 0) > 0;

  const onSubmit = async (data: FormData) => {
    if (!canGenerate) {
      toast.error('No generations remaining. Please upgrade to Premium.');
      return;
    }

    const input: ProposalInput = {
      clientJobDescription: data.clientJobDescription,
      skills: data.skills,
      experienceLevel: data.experienceLevel,
      portfolioLink: data.portfolioLink,
    };

    // Generate deterministic output based on inputs
    const output: ProposalOutput = {
      upworkFreeProposal: generateUpworkProposal(input),
      coldEmailPitch: generateColdEmail(input),
      shortDmPitch: generateShortDM(input),
      pricingBreakdown: generatePricingBreakdown(input),
    };

    try {
      const result = await generateMutation.mutateAsync({ input, output });
      onSuccess(input, result);
      toast.success('Proposal generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate proposal');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>
          Fill in the details below to generate your customized proposals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientJobDescription">Client Job Description *</Label>
            <Textarea
              id="clientJobDescription"
              placeholder="Paste the job description or project requirements here..."
              rows={6}
              {...register('clientJobDescription', { required: 'Job description is required' })}
            />
            {errors.clientJobDescription && (
              <p className="text-sm text-destructive">{errors.clientJobDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Your Skills *</Label>
            <Input
              id="skills"
              placeholder="e.g., React, Node.js, UI/UX Design, Content Writing"
              {...register('skills', { required: 'Skills are required' })}
            />
            {errors.skills && (
              <p className="text-sm text-destructive">{errors.skills.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level *</Label>
            <Select
              value={experienceLevel}
              onValueChange={(value) => {
                setExperienceLevel(value);
                setValue('experienceLevel', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="expert">Expert (5+ years)</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register('experienceLevel', { required: 'Experience level is required' })} />
            {errors.experienceLevel && (
              <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioLink">Portfolio Link</Label>
            <Input
              id="portfolioLink"
              type="url"
              placeholder="https://yourportfolio.com"
              {...register('portfolioLink')}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={generateMutation.isPending || !canGenerate}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Proposals
              </>
            )}
          </Button>

          {!canGenerate && (
            <p className="text-sm text-center text-destructive">
              You've used all your free generations. Upgrade to Premium for unlimited access.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// Helper functions to generate content
function generateUpworkProposal(input: ProposalInput): string {
  const experienceTextMap: Record<string, string> = {
    beginner: 'emerging professional',
    intermediate: 'experienced specialist',
    expert: 'seasoned expert',
  };
  
  const experienceText = experienceTextMap[input.experienceLevel] || 'professional';
  const portfolioText = input.portfolioLink 
    ? 'You can view examples of my work at ' + input.portfolioLink + '.' 
    : 'I would be happy to share relevant work samples upon request.';

  const proposal = 'Dear Hiring Manager,\n\n' +
    'I am excited to submit my proposal for your project. After carefully reviewing your requirements, I believe I am an excellent fit for this opportunity.\n\n' +
    '**Why I\'m the Right Choice:**\n\n' +
    'With my expertise in ' + input.skills + ', I am confident I can deliver exceptional results for your project. As an ' + experienceText + ', I have successfully completed similar projects and understand the nuances required to meet your specific needs.\n\n' +
    '**My Approach:**\n\n' +
    input.clientJobDescription.slice(0, 200) + '... I will approach this project with attention to detail, clear communication, and a commitment to exceeding your expectations.\n\n' +
    '**Relevant Experience:**\n\n' +
    'My background in ' + input.skills + ' has equipped me with the technical skills and problem-solving abilities necessary to tackle the challenges outlined in your job description. ' + portfolioText + '\n\n' +
    'I am available to start immediately and look forward to discussing how I can contribute to your project\'s success.\n\n' +
    'Best regards';

  return proposal;
}

function generateColdEmail(input: ProposalInput): string {
  const firstSkill = input.skills.split(',')[0].trim();
  const portfolioText = input.portfolioLink 
    ? 'You can see examples of my work here: ' + input.portfolioLink
    : 'I\'d be happy to share relevant case studies and examples.';

  const email = 'Subject: Expert ' + firstSkill + ' Services for Your Business\n\n' +
    'Hi [Name],\n\n' +
    'I came across your company and was impressed by [specific detail about their business]. I specialize in ' + input.skills + ' and help businesses like yours achieve their goals through high-quality deliverables.\n\n' +
    'I noticed you might benefit from expertise in areas related to: ' + input.clientJobDescription.slice(0, 150) + '...\n\n' +
    'With my background as an ' + input.experienceLevel + ' professional, I\'ve helped clients overcome similar challenges and would love to explore how I can add value to your team.\n\n' +
    portfolioText + '\n\n' +
    'Would you be open to a brief call to discuss potential collaboration?\n\n' +
    'Best regards,\n[Your Name]';

  return email;
}

function generateShortDM(input: ProposalInput): string {
  const firstSkill = input.skills.split(',')[0].trim();
  const jobSnippet = input.clientJobDescription.slice(0, 80);
  const portfolioText = input.portfolioLink 
    ? 'Check out my work: ' + input.portfolioLink
    : 'Happy to share my portfolio!';

  const dm = 'Hi! I saw your post about ' + jobSnippet + '... I specialize in ' + firstSkill + ' and would love to help. ' + portfolioText + ' Interested in chatting?';

  return dm;
}

function generatePricingBreakdown(input: ProposalInput): string {
  interface RateInfo {
    hourly: number;
    project: number;
  }

  const rates: Record<string, RateInfo> = {
    beginner: { hourly: 25, project: 500 },
    intermediate: { hourly: 50, project: 1500 },
    expert: { hourly: 100, project: 3500 },
  };

  const rate = rates[input.experienceLevel] || rates.intermediate;
  const firstSkill = input.skills.split(',')[0].trim();
  const recommendedApproach = rate.project < 1000 
    ? 'starting with an hourly arrangement' 
    : 'a project-based fee';

  const breakdown = '**Pricing Breakdown Suggestion**\n\n' +
    'Based on your ' + input.experienceLevel + ' experience level and skills in ' + input.skills + ', here\'s a recommended pricing structure:\n\n' +
    '**Hourly Rate:** $' + rate.hourly + '/hour\n' +
    '- Suitable for ongoing work or projects with evolving scope\n' +
    '- Provides flexibility for both parties\n\n' +
    '**Project-Based Pricing:** Starting at $' + rate.project + '\n' +
    '- Fixed scope projects\n' +
    '- Includes revisions and final delivery\n' +
    '- Payment milestones: 30% upfront, 40% mid-project, 30% on completion\n\n' +
    '**Value-Based Pricing:** Custom quote\n' +
    '- For high-impact projects where ROI is measurable\n' +
    '- Pricing tied to business outcomes\n\n' +
    '**Recommended Approach:**\n' +
    'For the project described, I suggest ' + recommendedApproach + ' to ensure clear expectations and deliverables. We can discuss the best structure based on your specific needs and timeline.\n\n' +
    'Note: Rates are competitive for ' + input.experienceLevel + '-level professionals in the ' + firstSkill + ' space.';

  return breakdown;
}
