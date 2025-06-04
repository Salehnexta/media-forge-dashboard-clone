
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  loading: boolean;
  analyzing: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const OnboardingNavigation = ({
  currentStep,
  totalSteps,
  canProceed,
  loading,
  analyzing,
  onBack,
  onNext,
  onSubmit
}: OnboardingNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1 || loading || analyzing}
      >
        السابق
      </Button>
      
      {currentStep < 5 ? (
        <Button
          onClick={onNext}
          disabled={!canProceed || loading}
        >
          التالي
        </Button>
      ) : currentStep === 5 ? (
        <Button
          onClick={onSubmit}
          disabled={loading || !canProceed}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              جاري البدء...
            </>
          ) : (
            'ابدأ التحليل الشامل'
          )}
        </Button>
      ) : null}
    </div>
  );
};
