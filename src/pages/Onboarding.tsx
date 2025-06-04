
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingStep1 } from '@/components/onboarding/steps/OnboardingStep1';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface OnboardingData {
  // Step 1 data
  websiteUrl?: string;
  websiteAnalysisStatus?: 'pending' | 'analyzing' | 'completed' | 'error';
  autoDiscoveredData?: any;
  dataApprovalStatus?: Record<string, boolean>;
  companyNameAr?: string;
  companyNameEn?: string;
  industry?: string;
  companySize?: string;
  businessType?: string;
  locationCountry?: string;
  locationCity?: string;
  yearsInBusiness?: string;
  businessDescription?: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    locationCountry: 'Saudi Arabia'
  });

  const totalSteps = 4;

  useEffect(() => {
    // Check if user is authenticated
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/register');
        return;
      }
      setUser(session.user);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/register');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!(onboardingData.companyNameAr && onboardingData.companyNameEn && onboardingData.industry);
      case 2:
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - save all data and complete onboarding
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save current progress to companies table
      const { error } = await supabase
        .from('companies')
        .upsert({
          user_id: user.id,
          name: onboardingData.companyNameEn || '',
          company_name_ar: onboardingData.companyNameAr || '',
          company_name_en: onboardingData.companyNameEn || '',
          website: onboardingData.websiteUrl,
          industry: onboardingData.industry,
          size: onboardingData.companySize,
          business_type: onboardingData.businessType,
          location: onboardingData.locationCountry,
          location_city: onboardingData.locationCity,
          years_in_business: onboardingData.yearsInBusiness,
          auto_discovered_data: onboardingData.autoDiscoveredData || {},
          data_approved: false
        });

      if (error) {
        console.error('Save error:', error);
        toast.error('حدث خطأ أثناء حفظ البيانات');
        return;
      }

      toast.success('تم حفظ التقدم بنجاح');
      navigate('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save final onboarding data to companies table
      const { error: companyError } = await supabase
        .from('companies')
        .upsert({
          user_id: user.id,
          name: onboardingData.companyNameEn || '',
          company_name_ar: onboardingData.companyNameAr || '',
          company_name_en: onboardingData.companyNameEn || '',
          website: onboardingData.websiteUrl,
          industry: onboardingData.industry,
          size: onboardingData.companySize,
          business_type: onboardingData.businessType,
          location: onboardingData.locationCountry,
          location_city: onboardingData.locationCity,
          years_in_business: onboardingData.yearsInBusiness,
          auto_discovered_data: onboardingData.autoDiscoveredData || {},
          data_approved: true
        });

      if (companyError) {
        console.error('Company save error:', companyError);
        toast.error('حدث خطأ أثناء حفظ بيانات الشركة');
        return;
      }

      // Try to update profiles table if it exists
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            registration_completed: true
          })
          .eq('id', user.id);

        if (profileError) {
          console.log('Profile update not available, continuing...');
        }
      } catch (profileError) {
        console.log('Profiles table not available, continuing...');
      }

      toast.success('مرحباً بك في مورفو! تم إكمال الإعداد بنجاح 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Complete error:', error);
      toast.error('حدث خطأ أثناء إكمال الإعداد');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            data={onboardingData}
            onDataChange={setOnboardingData}
          />
        );
      case 2:
        return <div className="text-center p-8">الخطوة 2 - قريباً</div>;
      case 3:
        return <div className="text-center p-8">الخطوة 3 - قريباً</div>;
      case 4:
        return <div className="text-center p-8">الخطوة 4 - قريباً</div>;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSave={handleSave}
      canGoNext={canGoNext()}
      canGoPrevious={currentStep > 1}
      isLoading={isLoading}
      nextLabel={currentStep === totalSteps ? 'إكمال الإعداد' : 'التالي'}
    >
      {renderCurrentStep()}
    </OnboardingLayout>
  );
};

export default Onboarding;
