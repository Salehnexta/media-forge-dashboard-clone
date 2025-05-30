
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, Building, Globe, 
  Facebook, Twitter, Instagram, Youtube, Linkedin, 
  ArrowRight, ArrowLeft, Check, X, RefreshCw, 
  Search, Sparkles, Target, TrendingUp, Shield,
  CheckCircle, AlertCircle, ExternalLink, Copy,
  Zap, BarChart3, Users, MessageSquare, Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type OnboardingStep = 
  | 'auth-choice' 
  | 'login' 
  | 'register' 
  | 'forgot-password' 
  | 'email-verification'
  | 'welcome' 
  | 'company-analysis'
  | 'analysis-review'
  | 'social-connect' 
  | 'permissions'
  | 'dashboard-preview'
  | 'complete';

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  company: {
    name: string;
    website: string;
    industry: string;
    location: string;
    size: string;
    founded: string;
    description: string;
  };
  
  analysis: {
    competitors: Array<{
      name: string;
      website: string;
      strengths: string[];
    }>;
    marketInsights: {
      marketSize: string;
      growthRate: string;
      opportunities: string[];
      challenges: string[];
    };
    recommendations: string[];
  };
  
  socialAccounts: {
    facebook: { connected: boolean; pageId?: string; accessToken?: string; permissions?: string[] };
    instagram: { connected: boolean; accountId?: string; accessToken?: string; permissions?: string[] };
    twitter: { connected: boolean; userId?: string; accessToken?: string; permissions?: string[] };
    linkedin: { connected: boolean; pageId?: string; accessToken?: string; permissions?: string[] };
    youtube: { connected: boolean; channelId?: string; accessToken?: string; permissions?: string[] };
  };
}

export function OnboardingSystem() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('auth-choice');
  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: {
      name: '',
      website: '',
      industry: '',
      location: '',
      size: '',
      founded: '',
      description: ''
    },
    analysis: {
      competitors: [],
      marketInsights: {
        marketSize: '',
        growthRate: '',
        opportunities: [],
        challenges: []
      },
      recommendations: []
    },
    socialAccounts: {
      facebook: { connected: false },
      instagram: { connected: false },
      twitter: { connected: false },
      linkedin: { connected: false },
      youtube: { connected: false }
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisTask, setCurrentAnalysisTask] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Header Component
  const Header = ({ showBackButton = false }: { showBackButton?: boolean }) => (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => setCurrentStep('auth-choice')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">منصة Morvo</h1>
              <p className="text-xs text-gray-500">فريق التسويق الذكي المتكامل</p>
            </div>
          </div>
        </div>
        
        {(currentStep === 'login' || currentStep === 'register') && (
          <div className="text-sm text-gray-600">
            {currentStep === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button 
              onClick={() => setCurrentStep(currentStep === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:text-blue-700 font-medium mr-2"
            >
              {currentStep === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>
          </div>
        )}
      </div>
    </header>
  );

  // Progress Bar Component
  const ProgressBar = ({ current, total }: { current: number; total: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div 
        className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(current / total) * 100}%` }}
      />
      <div className="text-center mt-2 text-sm text-gray-600">
        خطوة {current} من {total}
      </div>
    </div>
  );

  // Authentication Functions
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "تحقق من بريدك الإلكتروني لتأكيد الحساب",
        });
        setCurrentStep('email-verification');
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في منصة Morvo",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast({
          title: "خطأ",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم إرسال رابط إعادة التعيين",
          description: "تحقق من بريدك الإلكتروني",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Choice Screen
  if (currentStep === 'auth-choice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Sparkles className="text-white w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">مرحباً بك في منصة Morvo</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                منصة التسويق الذكي المتكامل التي تساعدك على إدارة حملاتك التسويقية بذكاء اصطناعي متقدم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">إدارة ذكية</h3>
                <p className="text-gray-600 text-center">
                  إدارة جميع حساباتك على وسائل التواصل من مكان واحد بذكاء اصطناعي
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تحليلات متقدمة</h3>
                <p className="text-gray-600 text-center">
                  احصل على رؤى عميقة حول أداء حملاتك وجمهورك المستهدف
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">محتوى إبداعي</h3>
                <p className="text-gray-600 text-center">
                  اكتب وصمم محتوى جذاب باستخدام الذكاء الاصطناعي المتطور
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button
                onClick={() => setCurrentStep('register')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                إنشاء حساب جديد
              </button>
              <button
                onClick={() => setCurrentStep('login')}
                className="flex-1 bg-white text-gray-700 py-4 px-8 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                تسجيل الدخول
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                بالمتابعة، أنت توافق على 
                <a href="#" className="text-blue-600 hover:text-blue-700 mx-1">شروط الخدمة</a>
                و
                <a href="#" className="text-blue-600 hover:text-blue-700 mx-1">سياسة الخصوصية</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Form
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header showBackButton />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك مجدداً</h2>
                <p className="text-gray-600">سجل دخولك للوصول إلى لوحة التحكم</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل بريدك الإلكتروني"
                      dir="rtl"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userData.password}
                      onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل كلمة المرور"
                      dir="rtl"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    نسيت كلمة المرور؟
                  </button>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="mr-2 text-sm text-gray-700">تذكرني</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Register Form
  if (currentStep === 'register') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header showBackButton />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h2>
                <p className="text-gray-600">انضم إلى منصة Morvo وابدأ رحلتك التسويقية</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="الاسم الأول"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="الاسم الأخير"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل بريدك الإلكتروني"
                      dir="rtl"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="رقم الهاتف"
                      dir="rtl"
                      required
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userData.password}
                      onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="كلمة المرور"
                      dir="rtl"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="أعد إدخال كلمة المرور"
                    dir="rtl"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-right">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                    <span className="mr-2 text-sm text-gray-700">
                      أوافق على <a href="#" className="text-blue-600 hover:text-blue-700">شروط الخدمة</a> و <a href="#" className="text-blue-600 hover:text-blue-700">سياسة الخصوصية</a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forgot Password
  if (currentStep === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header showBackButton />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">نسيت كلمة المرور؟</h2>
              <p className="text-gray-600 mb-6">
                أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل بريدك الإلكتروني"
                      dir="rtl"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep('login')}
                  className="w-full text-blue-600 hover:text-blue-700 py-2 text-center text-sm"
                >
                  العودة إلى تسجيل الدخول
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email Verification
  if (currentStep === 'email-verification') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">تأكيد البريد الإلكتروني</h2>
              <p className="text-gray-600 mb-6">
                لقد أرسلنا رابط التأكيد إلى
                <br />
                <span className="font-semibold text-gray-900">{userData.email}</span>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  تحقق من بريدك الإلكتروني وانقر على رابط التأكيد لتفعيل حسابك. 
                  قد يستغرق الأمر بضع دقائق حتى يصل الإيميل.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  متابعة إلى لوحة التحكم
                </button>

                <button
                  type="button"
                  className="w-full text-blue-600 hover:text-blue-700 py-2 text-center text-sm"
                >
                  إعادة إرسال الإيميل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
