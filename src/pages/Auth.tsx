
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
        console.log('Attempting login...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        console.log('Login result:', { data, error });
        
        if (error) throw error;
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في منصة Morvo",
        });
      } else {
        console.log('Attempting signup...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        console.log('Signup result:', { data, error });
        
        if (error) throw error;
        
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "خطأ في المصادقة",
        description: error.message || 'حدث خطأ غير متوقع',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
