import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  onboardingProfileSchema,
  onboardingRiskSchema,
  onboardingGoalsSchema,
  OnboardingProfileData,
  OnboardingRiskData,
  OnboardingGoalsData,
} from '@/utils/validation';

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleComplete = () => {
    toast({
      title: 'Onboarding complete!',
      description: 'Welcome to TradeShift. Let us get started.',
    });
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle>Welcome to TradeShift</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        {currentStep === 1 && <ProfileStep onNext={() => setCurrentStep(2)} onSkip={handleSkip} />}
        {currentStep === 2 && (
          <RiskAssessmentStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onSkip={handleSkip}
          />
        )}
        {currentStep === 3 && (
          <InvestmentGoalsStep
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            onSkip={handleSkip}
          />
        )}
        {currentStep === 4 && (
          <BrokerageConnectionStep
            onComplete={handleComplete}
            onBack={() => setCurrentStep(3)}
            onSkip={handleSkip}
          />
        )}
      </Card>
    </div>
  );
}

function ProfileStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingProfileData>({
    resolver: zodResolver(onboardingProfileSchema),
  });

  const onSubmit = () => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        <CardDescription>
          Tell us a bit about yourself to personalize your experience
        </CardDescription>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
          <Input id="phoneNumber" type="tel" {...register('phoneNumber')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address (optional)</Label>
          <Input id="address" {...register('address')} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onSkip}>
          Skip
        </Button>
        <Button type="submit">Continue</Button>
      </CardFooter>
    </form>
  );
}

function RiskAssessmentStep({
  onNext,
  onBack,
  onSkip,
}: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingRiskData>({
    resolver: zodResolver(onboardingRiskSchema),
  });

  const onSubmit = () => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-6">
        <CardDescription>
          Help us understand your investment profile
        </CardDescription>

        <div className="space-y-3">
          <Label>Investment Experience</Label>
          <RadioGroup onValueChange={(value) => setValue('investmentExperience', value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="exp-beginner" />
              <Label htmlFor="exp-beginner" className="font-normal">
                Beginner - New to investing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="exp-intermediate" />
              <Label htmlFor="exp-intermediate" className="font-normal">
                Intermediate - Some experience
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="exp-advanced" />
              <Label htmlFor="exp-advanced" className="font-normal">
                Advanced - Experienced investor
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Risk Tolerance</Label>
          <RadioGroup onValueChange={(value) => setValue('riskTolerance', value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conservative" id="risk-conservative" />
              <Label htmlFor="risk-conservative" className="font-normal">
                Conservative - Preserve capital
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="risk-moderate" />
              <Label htmlFor="risk-moderate" className="font-normal">
                Moderate - Balanced approach
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aggressive" id="risk-aggressive" />
              <Label htmlFor="risk-aggressive" className="font-normal">
                Aggressive - Maximum growth
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Investment Horizon</Label>
          <RadioGroup onValueChange={(value) => setValue('investmentHorizon', value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="horizon-short" />
              <Label htmlFor="horizon-short" className="font-normal">
                Short-term (Less than 3 years)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="horizon-medium" />
              <Label htmlFor="horizon-medium" className="font-normal">
                Medium-term (3-10 years)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="long" id="horizon-long" />
              <Label htmlFor="horizon-long" className="font-normal">
                Long-term (10+ years)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </CardFooter>
    </form>
  );
}

function InvestmentGoalsStep({
  onNext,
  onBack,
  onSkip,
}: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingGoalsData>({
    resolver: zodResolver(onboardingGoalsSchema),
  });

  const assetClasses = ['Stocks', 'Bonds', 'ETFs', 'Cryptocurrencies', 'Options', 'Commodities'];

  const toggleAsset = (asset: string) => {
    const newSelection = selectedAssets.includes(asset)
      ? selectedAssets.filter((a) => a !== asset)
      : [...selectedAssets, asset];
    setSelectedAssets(newSelection);
    setValue('assetClasses', newSelection);
  };

  const onSubmit = () => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-6">
        <CardDescription>Define your investment objectives</CardDescription>

        <div className="space-y-3">
          <Label>Primary Investment Goal</Label>
          <RadioGroup onValueChange={(value) => setValue('primaryGoal', value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="growth" id="goal-growth" />
              <Label htmlFor="goal-growth" className="font-normal">
                Growth - Build wealth over time
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="goal-income" />
              <Label htmlFor="goal-income" className="font-normal">
                Income - Generate regular returns
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preservation" id="goal-preservation" />
              <Label htmlFor="goal-preservation" className="font-normal">
                Preservation - Protect capital
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="speculation" id="goal-speculation" />
              <Label htmlFor="goal-speculation" className="font-normal">
                Speculation - High-risk opportunities
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetReturn">Target Annual Return (%)</Label>
          <Input
            id="targetReturn"
            type="number"
            min="0"
            max="100"
            {...register('targetReturn', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-3">
          <Label>Asset Classes of Interest</Label>
          <div className="grid grid-cols-2 gap-3">
            {assetClasses.map((asset) => (
              <div key={asset} className="flex items-center space-x-2">
                <Checkbox
                  id={asset}
                  checked={selectedAssets.includes(asset)}
                  onCheckedChange={() => toggleAsset(asset)}
                />
                <label htmlFor={asset} className="text-sm font-normal">
                  {asset}
                </label>
              </div>
            ))}
          </div>
          {errors.assetClasses && (
            <p className="text-sm text-destructive">{errors.assetClasses.message}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </CardFooter>
    </form>
  );
}

function BrokerageConnectionStep({
  onComplete,
  onBack,
  onSkip,
}: {
  onComplete: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <CardContent className="space-y-4">
        <CardDescription>
          Connect your brokerage accounts to start tracking your portfolio
        </CardDescription>
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Brokerage connection integration will be implemented in a later phase
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" disabled>
              Connect Robinhood
            </Button>
            <Button variant="outline" disabled>
              Connect TD Ameritrade
            </Button>
            <Button variant="outline" disabled>
              Connect E*TRADE
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
          <Button onClick={onComplete}>Get Started</Button>
        </div>
      </CardFooter>
    </>
  );
}
