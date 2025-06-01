
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { OnboardingSystem } from '@/components/auth/OnboardingSystem';
import { FreeAnalysisOnboarding } from '@/components/onboarding/FreeAnalysisOnboarding';
import { toast } from 'sonner';

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [showFreeAnalysis, setShowFreeAnalysis] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // التحقق من وجود معاملات التحليل المجاني
  const isFreeAnalysis = searchParams.get('type') === 'free-analysis';

  useEffect(() => {
    // Handle email verification from URL fragments
    const handleEmailVerification = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && refreshToken && type === 'signup') {
        setVerifying(true);
        console.log('Processing email verification...');
        
        try {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            toast.error('خطأ في تأكيد البريد الإلكتروني');
          } else if (data.session) {
            console.log('Email verified successfully');
            toast.success('تم تأكيد البريد الإلكتروني بنجاح!');
            // Clear the URL hash
            window.history.replaceState(null, '', window.location.pathname);
            
            // إذا كان المستخدم جاء من التحليل المجاني، أظهر نموذج البيانات
            if (isFreeAnalysis) {
              setShowFreeAnalysis(true);
            } else {
              navigate('/dashboard');
            }
            return;
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast.error('حدث خطأ أثناء التحقق من البريد الإلكتروني');
        } finally {
          setVerifying(false);
        }
      }
    };

    handleEmailVerification();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // إذا كان المستخدم مسجل دخول وجاء من التحليل المجاني
        if (session?.user && !verifying) {
          if (isFreeAnalysis) {
            setShowFreeAnalysis(true);
          } else {
            navigate('/dashboard');
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user && !verifying) {
        if (isFreeAnalysis) {
          setShowFreeAnalysis(true);
        } else {
          navigate('/dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.hash, verifying, isFreeAnalysis]);

  const handleFreeAnalysisComplete = () => {
    navigate('/ai-analysis');
  };

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-600">
            {verifying ? 'جاري تأكيد البريد الإلكتروني...' : 'جاري التحميل...'}
          </p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم مسجل دخول ويريد التحليل المجاني
  if (user && showFreeAnalysis) {
    return <FreeAnalysisOnboarding user={user} onComplete={handleFreeAnalysisComplete} />;
  }

  return <OnboardingSystem />;
};

export default Auth;
