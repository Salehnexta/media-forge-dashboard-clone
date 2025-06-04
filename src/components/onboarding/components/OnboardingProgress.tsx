
import { Progress } from '@/components/ui/progress';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-4">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-600 mt-2">الخطوة {currentStep} من {totalSteps}</p>
    </div>
  );
};
