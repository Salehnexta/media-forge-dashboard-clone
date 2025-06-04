
import { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave?: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

const stepLabels = ['التحليل', 'الاستراتيجية', 'السوق المستهدف', 'المحتوى'];

export const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSave,
  canGoNext,
  canGoPrevious,
  isLoading = false,
  nextLabel = 'التالي',
  previousLabel = 'السابق'
}: OnboardingLayoutProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">إعداد منصة مورفو</h1>
                <p className="text-slate-600">الخطوة {currentStep} من {totalSteps}: {stepLabels[currentStep - 1]}</p>
              </div>
            </div>
            {onSave && (
              <Button variant="ghost" onClick={onSave} className="text-slate-600">
                حفظ والمتابعة لاحقاً
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-slate-500">
              {stepLabels.map((label, index) => (
                <span 
                  key={index}
                  className={`${index + 1 <= currentStep ? 'text-blue-600 font-medium' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 sticky bottom-0">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || isLoading}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{previousLabel}</span>
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 space-x-reverse"
          >
            <span>{isLoading ? 'جاري المعالجة...' : nextLabel}</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
