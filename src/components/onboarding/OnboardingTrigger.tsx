
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedSmartOnboarding } from './EnhancedSmartOnboarding';

interface OnboardingTriggerProps {
  user: User;
  children: React.ReactNode;
}

export const OnboardingTrigger = ({ user, children }: OnboardingTriggerProps) => {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, [user.id]);

  const checkOnboardingStatus = async () => {
    try {
      // التحقق من وجود شركات للمستخدم
      const { data: companies, error } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error checking onboarding status:', error);
        setNeedsOnboarding(false);
      } else {
        // إذا لم توجد شركات، المستخدم يحتاج onboarding
        setNeedsOnboarding(!companies || companies.length === 0);
      }
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      setNeedsOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <EnhancedSmartOnboarding user={user} onComplete={handleOnboardingComplete} />;
  }

  return <>{children}</>;
};
