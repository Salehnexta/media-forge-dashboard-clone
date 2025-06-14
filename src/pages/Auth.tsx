
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Auth component mounted, checking session...');
    
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        console.log('Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check result:', { session, error });
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        if (session) {
          console.log('User already logged in, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', { event, session });
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting auth process:', { isLogin, email });
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with email:', email);
        
        // Test if Supabase client is working
        const healthCheck = await supabase.from('clients').select('count').limit(1);
        console.log('Supabase health check:', healthCheck);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        
        console.log('Login attempt result:', { data, error });
        
        if (error) {
          console.error('Login error details:', {
            message: error.message,
            status: error.status,
            code: error.code,
            name: error.name
          });
          throw error;
        }
        
        console.log('Login successful:', data);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في منصة Morvo",
        });
      } else {
        console.log('Attempting signup with email:', email);
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        console.log('Signup result:', { data, error });
        
        if (error) {
          console.error('Signup error details:', {
            message: error.message,
            status: error.status,
            code: error.code
          });
          throw error;
        }
        
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'حدث خطأ غير متوقع';
      
      // More specific error handling
      if (error.message?.includes('Invalid API key')) {
        errorMessage = 'خطأ في الإعدادات - مفتاح API غير صحيح';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'بيانات الدخول غير صحيحة';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'يرجى تفعيل حسابك من البريد الإلكتروني أولاً';
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'محاولات كثيرة، يرجى المحاولة لاحقاً';
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      } else if (error.message?.includes('Unable to validate email address')) {
        errorMessage = 'عنوان البريد الإلكتروني غير صحيح';
      } else if (error.message?.includes('Network request failed')) {
        errorMessage = 'خطأ في الاتصال بالشبكة';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في المصادقة",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add some test functionality to debug
  const testConnection = async () => {
    console.log('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.auth.getUser();
      console.log('Current user:', { data, error });
      
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .limit(1);
      console.log('Database test:', { clients, clientsError });
    } catch (err) {
      console.error('Connection test failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" 
              alt="Morvo Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'ادخل إلى حسابك للوصول إلى منصة Morvo' 
              : 'أنشئ حساباً جديداً للبدء مع Morvo'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-right"
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : null}
              {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800"
            >
              {isLogin 
                ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' 
                : 'لديك حساب بالفعل؟ سجل الدخول'
              }
            </Button>
          </div>
          
          {/* Debug button - remove in production */}
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              className="text-xs"
            >
              اختبار الاتصال
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
