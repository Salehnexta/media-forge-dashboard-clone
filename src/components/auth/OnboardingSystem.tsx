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
import { Progress } from '@/components/ui/progress';

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

  // Mock AI Analysis Function
  const runAIAnalysis = async (website: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const tasks = [
      'تحليل الموقع الإلكتروني...',
      'جاري البحث عن معلومات الشركة...',
      'تحليل المنافسين في السوق...',
      'دراسة اتجاهات الصناعة...',
      'تحليل الجمهور المستهدف...',
      'إنشاء التوصيات المخصصة...'
    ];

    for (let i = 0; i < tasks.length; i++) {
      setCurrentAnalysisTask(tasks[i]);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisProgress(((i + 1) / tasks.length) * 100);
    }

    // Mock analysis results
    setUserData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        name: 'شركة التقنية المتقدمة',
        industry: 'التكنولوجيا والبرمجيات',
        location: 'الرياض، السعودية',
        size: '50-100 موظف',
        founded: '2018',
        description: 'شركة متخصصة في تطوير الحلول التقنية المبتكرة'
      },
      analysis: {
        competitors: [
          { name: 'شركة النجاح التقني', website: 'najah-tech.com', strengths: ['الخبرة الطويلة', 'قاعدة عملاء كبيرة'] },
          { name: 'مؤسسة الابتكار الرقمي', website: 'digital-innovation.sa', strengths: ['التقنيات الحديثة', 'فريق متخصص'] },
          { name: 'شركة المستقبل للتطوير', website: 'future-dev.com', strengths: ['الأسعار التنافسية', 'الدعم الفني'] }
        ],
        marketInsights: {
          marketSize: '2.5 مليار ريال سعودي',
          growthRate: '15% سنوياً',
          opportunities: [
            'التوجه نحو التحول الرقمي في المملكة',
            'زيادة الاستثمار في التقنية',
            'برامج رؤية 2030'
          ],
          challenges: [
            'المنافسة الشديدة',
            'نقص المواهب المتخصصة',
            'التطور السريع في التقنية'
          ]
        },
        recommendations: [
          'التركيز على التسويق الرقمي عبر LinkedIn',
          'إنشاء محتوى تقني متخصص',
          'الاستفادة من معارض التقنية المحلية',
          'بناء شراكات استراتيجية مع الشركات الكبرى'
        ]
      }
    }));

    setIsAnalyzing(false);
    setCurrentStep('analysis-review');
  };

  // Social Media Connection Functions
  const connectSocialAccount = async (platform: keyof UserData['socialAccounts']) => {
    // Mock OAuth flow
    const mockTokens = {
      facebook: { 
        accessToken: 'mock_fb_token_123', 
        pageId: 'page_123',
        permissions: ['إدارة المنشورات على الصفحات', 'قراءة بيانات التفاعل', 'عرض قائمة الصفحات']
      },
      instagram: { 
        accessToken: 'mock_ig_token_456', 
        accountId: 'ig_account_456',
        permissions: ['النشر على الحساب', 'قراءة بيانات التفاعل']
      },
      twitter: { 
        accessToken: 'mock_tw_token_789', 
        userId: 'tw_user_789',
        permissions: ['نشر التغريدات', 'قراءة البيانات']
      },
      linkedin: { 
        accessToken: 'mock_li_token_101', 
        pageId: 'li_page_101',
        permissions: ['النشر على الصفحات', 'إدارة المحتوى المهني']
      },
      youtube: { 
        accessToken: 'mock_yt_token_102', 
        channelId: 'yt_channel_102',
        permissions: ['رفع الفيديوهات', 'قراءة الإحصائيات']
      }
    };

    setUserData(prev => ({
      ...prev,
      socialAccounts: {
        ...prev.socialAccounts,
        [platform]: {
          connected: true,
          ...mockTokens[platform]
        }
      }
    }));
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

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="text-white w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              مرحباً {userData.firstName}! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              نحن متحمسون لانضمامك إلى عائلة Morvo. دعنا نساعدك في إعداد حسابك وتخصيص تجربتك التسويقية.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">تحليل شركتك</h3>
                <p className="text-sm text-gray-600">سنحلل شركتك والسوق بالذكاء الاصطناعي</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ربط حساباتك</h3>
                <p className="text-sm text-gray-600">اربط حسابات التواصل الاجتماعي</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ابدأ التسويق</h3>
                <p className="text-sm text-gray-600">ابدأ في إنشاء حملاتك التسويقية</p>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('company-analysis')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              ابدأ الإعداد
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Company Analysis Setup
  if (currentStep === 'company-analysis') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            <ProgressBar current={1} total={5} />
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">تحليل شركتك بالذكاء الاصطناعي</h2>
                <p className="text-gray-600">أدخل موقع شركتك وسنقوم بتحليل شامل لأعمالك والسوق المحيط</p>
              </div>

              {!isAnalyzing ? (
                <form onSubmit={(e) => { e.preventDefault(); runAIAnalysis(userData.company.website); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      موقع الشركة الإلكتروني *
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={userData.company.website}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          company: { ...prev.company, website: e.target.value }
                        }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                        placeholder="https://example.com"
                        dir="ltr"
                        required
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      سنقوم بتحليل موقعك لجمع معلومات عن شركتك، المنافسين، والسوق
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">ما سنحلله لك:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• معلومات شركتك الأساسية</li>
                          <li>• تحليل المنافسين في السوق</li>
                          <li>• اتجاهات الصناعة والفرص</li>
                          <li>• توصيات تسويقية مخصصة</li>
                          <li>• تحليل الحضور الرقمي</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('welcome')}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ArrowRight className="w-5 h-5" />
                      السابق
                    </button>
                    
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      بدء التحليل
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">جاري التحليل...</h3>
                  <p className="text-gray-600 mb-6">{currentAnalysisTask}</p>
                  
                  <Progress value={analysisProgress} className="w-full mb-4" />
                  
                  <p className="text-sm text-gray-500">
                    هذا قد يستغرق دقيقة أو دقيقتين...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis Review
  if (currentStep === 'analysis-review') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <ProgressBar current={2} total={5} />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">تحليل شركتك جاهز! ✨</h2>
              <p className="text-gray-600">راجع المعلومات وأكد صحتها أو قم بتعديلها</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">معلومات الشركة</h3>
                  <button
                    onClick={() => setEditingSection(editingSection === 'company' ? null : 'company')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {editingSection === 'company' ? 'حفظ' : 'تعديل'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">اسم الشركة</label>
                    {editingSection === 'company' ? (
                      <input
                        value={userData.company.name}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          company: { ...prev.company, name: e.target.value }
                        }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                        dir="rtl"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{userData.company.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">المجال</label>
                    <p className="text-gray-900 mt-1">{userData.company.industry}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">الموقع</label>
                    <p className="text-gray-900 mt-1">{userData.company.location}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">حجم الشركة</label>
                    <p className="text-gray-900 mt-1">{userData.company.size}</p>
                  </div>
                </div>
              </div>

              {/* Competitors */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">المنافسون الرئيسيون</h3>
                <div className="space-y-4">
                  {userData.analysis.competitors.map((competitor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{competitor.website}</p>
                      <div className="flex flex-wrap gap-2">
                        {competitor.strengths.map((strength, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Insights */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">رؤى السوق</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">حجم السوق</label>
                    <p className="text-gray-900 mt-1">{userData.analysis.marketInsights.marketSize}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">معدل النمو</label>
                    <p className="text-gray-900 mt-1">{userData.analysis.marketInsights.growthRate}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">الفرص المتاحة</label>
                    <ul className="mt-2 space-y-1">
                      {userData.analysis.marketInsights.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">التوصيات التسويقية</h3>
                <div className="space-y-3">
                  {userData.analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-900">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('company-analysis')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>
              
              <button
                onClick={() => setCurrentStep('social-connect')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                التالي
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Social Media Connection
  if (currentStep === 'social-connect') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <ProgressBar current={3} total={5} />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">ربط حسابات التواصل الاجتماعي</h2>
              <p className="text-gray-600">اربط حساباتك لنتمكن من النشر وجمع البيانات التحليلية</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">مهم جداً!</h4>
                  <p className="text-sm text-yellow-800">
                    ربط حساباتك يمكّن المنصة من النشر نيابة عنك وجمع بيانات الأداء والتفاعل. 
                    جميع البيانات محفوظة بأمان ولن تُستخدم إلا لتحسين حملاتك التسويقية.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Facebook */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Facebook className="w-10 h-10 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                      <p className="text-sm text-gray-600">النشر على الصفحات وجمع الإحصائيات</p>
                    </div>
                  </div>
                  {userData.socialAccounts.facebook.connected ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">متصل</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectSocialAccount('facebook')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      ربط الحساب
                    </button>
                  )}
                </div>
                
                {userData.socialAccounts.facebook.connected && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">الصلاحيات المطلوبة:</h4>
                    <div className="space-y-1">
                      {userData.socialAccounts.facebook.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Instagram className="w-10 h-10 text-pink-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                      <p className="text-sm text-gray-600">النشر على الحساب وجمع الإحصائيات</p>
                    </div>
                  </div>
                  {userData.socialAccounts.instagram.connected ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">متصل</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectSocialAccount('instagram')}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                    >
                      ربط الحساب
                    </button>
                  )}
                </div>
                
                {userData.socialAccounts.instagram.connected && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">الصلاحيات المطلوبة:</h4>
                    <div className="space-y-1">
                      {userData.socialAccounts.instagram.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Twitter */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Twitter className="w-10 h-10 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Twitter</h3>
                      <p className="text-sm text-gray-600">النشر والتفاعل مع المتابعين</p>
                    </div>
                  </div>
                  {userData.socialAccounts.twitter.connected ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">متصل</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectSocialAccount('twitter')}
                      className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                    >
                      ربط الحساب
                    </button>
                  )}
                </div>
                
                {userData.socialAccounts.twitter.connected && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">الصلاحيات المطلوبة:</h4>
                    <div className="space-y-1">
                      {userData.socialAccounts.twitter.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* LinkedIn */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Linkedin className="w-10 h-10 text-blue-700" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">LinkedIn</h3>
                      <p className="text-sm text-gray-600">النشر المهني وإدارة الصفحات</p>
                    </div>
                  </div>
                  {userData.socialAccounts.linkedin.connected ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">متصل</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectSocialAccount('linkedin')}
                      className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
                    >
                      ربط الحساب
                    </button>
                  )}
                </div>
                
                {userData.socialAccounts.linkedin.connected && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">الصلاحيات المطلوبة:</h4>
                    <div className="space-y-1">
                      {userData.socialAccounts.linkedin.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Youtube className="w-10 h-10 text-red-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">YouTube</h3>
                      <p className="text-sm text-gray-600">رفع الفيديوهات وإدارة القناة</p>
                    </div>
                  </div>
                  {userData.socialAccounts.youtube.connected ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">متصل</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectSocialAccount('youtube')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      ربط الحساب
                    </button>
                  )}
                </div>
                
                {userData.socialAccounts.youtube.connected && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">الصلاحيات المطلوبة:</h4>
                    <div className="space-y-1">
                      {userData.socialAccounts.youtube.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('analysis-review')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('permissions')}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  تخطي
                </button>
                
                <button
                  onClick={() => setCurrentStep('permissions')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  التالي
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Permissions Review
  if (currentStep === 'permissions') {
    const connectedAccounts = Object.entries(userData.socialAccounts).filter(([_, account]) => account.connected);
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <ProgressBar current={4} total={5} />
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">مراجعة الصلاحيات</h2>
              <p className="text-gray-600">راجع الصلاحيات التي ستحصل عليها منصة Morvo</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">الحسابات المتصلة ({connectedAccounts.length})</h3>
              
              {connectedAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">لم يتم ربط أي حساب</h4>
                  <p className="text-gray-600 mb-4">يمكنك ربط حساباتك لاحقاً من الإعدادات</p>
                  <button
                    onClick={() => setCurrentStep('social-connect')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ربط الحسابات الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {connectedAccounts.map(([platform, account]) => {
                    const platformConfig = {
                      facebook: { icon: Facebook, name: 'Facebook', color: 'text-blue-600' },
                      instagram: { icon: Instagram, name: 'Instagram', color: 'text-pink-600' },
                      twitter: { icon: Twitter, name: 'Twitter', color: 'text-blue-400' },
                      linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'text-blue-700' },
                      youtube: { icon: Youtube, name: 'YouTube', color: 'text-red-600' }
                    }[platform as keyof typeof userData.socialAccounts];

                    const Icon = platformConfig?.icon || Users;

                    return (
                      <div key={platform} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Icon className={`w-8 h-8 ${platformConfig?.color}`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{platformConfig?.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>متصل بنجاح</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">الصلاحيات الممنوحة:</h5>
                          <div className="space-y-2">
                            {account.permissions?.map((permission, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>{permission}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">حماية البيانات</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• جميع البيانات مشفرة ومحفوظة بأمان</li>
                    <li>• لن نصل إلى رسائلك الخاصة أو معلوماتك الشخصية</li>
                    <li>• يمكنك إلغاء الصلاحيات في أي وقت</li>
                    <li>• نلتزم بأعلى معايير الخصوصية والأمان</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('social-connect')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>
              
              <button
                onClick={() => setCurrentStep('complete')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                إنهاء الإعداد
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="text-white w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 تهانينا! تم إعداد حسابك بنجاح
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              مرحباً بك في عائلة Morvo! فريق التسويق الذكي جاهز لمساعدتك
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">تحليل الشركة</h3>
                <p className="text-sm text-gray-600">تم تحليل شركتك والسوق بالذكاء الاصطناعي</p>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">الحسابات المتصلة</h3>
                <p className="text-sm text-gray-600">
                  {Object.values(userData.socialAccounts).filter(account => account.connected).length} منصة متصلة
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">جاهز للبدء</h3>
                <p className="text-sm text-gray-600">يمكنك الآن البدء في إنشاء حملاتك</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
              <h4 className="font-semibold mb-2">ما التالي؟</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>إنشاء أول حملة تسويقية</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>إنشاء محتوى بالذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>تحديد الجمهور المستهدف</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>مراقبة الأداء والتحليلات</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              الدخول إلى لوحة التحكم
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
