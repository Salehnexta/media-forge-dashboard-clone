
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
        console.log('Attempting login with email:', email);
        result = await signIn(email, password);
      } else {
        console.log('Attempting signup with email:', email);
        result = await signUp(email, password);
      }

      if (result.error) {
        let errorMessage = 'حدث خطأ غير متوقع';
        
        if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = 'بيانات الدخول غير صحيحة';
        } else if (result.error.message?.includes('Email not confirmed')) {
          errorMessage = 'يرجى تفعيل حسابك من البريد الإلكتروني أولاً';
        } else if (result.error.message?.includes('User not found')) {
          errorMessage = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني';
        } else if (result.error.message?.includes('Password should be at least 6 characters')) {
          errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        } else if (result.error.message?.includes('Unable to validate email address')) {
          errorMessage = 'عنوان البريد الإلكتروني غير صحيح';
        } else if (result.error.message?.includes('Network request failed')) {
          errorMessage = 'خطأ في الاتصال بالشبكة';
        } else if (result.error.message?.includes('Invalid API key')) {
          errorMessage = 'خطأ في إعدادات المصادقة. يرجى المحاولة لاحقاً';
        }
        
        toast({
          title: "خطأ في المصادقة",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك في منصة Morvo",
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
          });
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "خطأ في المصادقة",
        description: "حدث خطأ غير متوقع",
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
                autoComplete="email"
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
                autoComplete={isLogin ? "current-password" : "new-password"}
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
