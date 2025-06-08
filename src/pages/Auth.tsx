
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Brain } from 'lucide-react';

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle URL fragments (password reset tokens)
    const handleAuthFragment = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && refreshToken && type === 'recovery') {
        // Set the session with the tokens from URL
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error setting session:', error);
            toast.error('خطأ في استعادة كلمة المرور');
          } else {
            console.log('Password reset session set successfully');
            toast.success('تم تسجيل الدخول بنجاح! يمكنك الآن تغيير كلمة المرور');
            // Clear the URL fragment
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard');
          }
        });
      }
    };

    // Check for auth fragments first
    handleAuthFragment();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle different auth events
        if (event === 'SIGNED_IN' && session?.user) {
          toast.success('تم تسجيل الدخول بنجاح!');
          navigate('/dashboard');
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.success('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
        } else if (event === 'USER_UPDATED') {
          toast.success('تم تحديث بياناتك بنجاح');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // User is already authenticated, redirect to dashboard
    navigate('/dashboard');
    return null;
  }

  // Get the correct redirect URL for this environment
  const getRedirectUrl = () => {
    // Use the current window location origin (works for both localhost and deployed URLs)
    return `${window.location.origin}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-md sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مورفو AI
            </h1>
            <p className="text-gray-600 mt-2">منصة التسويق الذكي</p>
          </div>
          
          <SupabaseAuth 
            supabaseClient={supabase} 
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600'
                },
                input: {
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  padding: '12px 16px',
                  fontSize: '16px'
                },
                message: {
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px'
                }
              }
            }} 
            providers={[]}
            redirectTo={getRedirectUrl()}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'تسجيل الدخول',
                  loading_button_label: 'جاري تسجيل الدخول...',
                  link_text: 'هل لديك حساب؟ سجل دخولك'
                },
                sign_up: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'إنشاء حساب',
                  loading_button_label: 'جاري إنشاء الحساب...',
                  link_text: 'ليس لديك حساب؟ أنشئ حساباً جديداً'
                },
                forgotten_password: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'إرسال تعليمات الاستعادة',
                  loading_button_label: 'جاري الإرسال...',
                  link_text: 'نسيت كلمة المرور؟',
                  confirmation_text: 'تحقق من بريدك الإلكتروني لرابط استعادة كلمة المرور'
                },
                update_password: {
                  password_label: 'كلمة المرور الجديدة',
                  password_confirmation_label: 'تأكيد كلمة المرور',
                  button_label: 'تحديث كلمة المرور',
                  loading_button_label: 'جاري التحديث...'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
