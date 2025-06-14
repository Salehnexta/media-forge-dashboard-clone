import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { OnboardingStep1 } from './steps/OnboardingStep1';
import { OnboardingStep2 } from './steps/OnboardingStep2';
import { OnboardingStep3 } from './steps/OnboardingStep3';
import { OnboardingStep4 } from './steps/OnboardingStep4';

interface EnhancedSmartOnboardingProps {
  user: User;
  onComplete?: () => void;
}

export interface OnboardingData {
  // صفحة 1: تحليل الموقع وملف الشركة
  websiteUrl: string;
  websiteAnalysisStatus: 'pending' | 'analyzing' | 'completed' | 'error';
  autoDiscoveredData: any;
  dataApprovalStatus: Record<string, boolean>;
  companyNameAr: string;
  industry: string;
  companySize: '1-10' | '11-50' | '51-200' | '200+';
  businessType: 'B2B' | 'B2C' | 'كلاهما';
  locationCountry: string;
  locationCity: string;
  yearsInBusiness: 'أقل من سنة' | '1-3 سنوات' | '3-5 سنوات' | '5+ سنوات';

  // صفحة 2: استراتيجية التسويق والأهداف
  teamSize: 'أنا فقط' | '2-5 أشخاص' | '6-10 أشخاص' | '10+ أشخاص';
  experienceLevel: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';
  monthlyBudget: 'أقل من 5000 ريال' | '5000-15000 ريال' | '15000-50000 ريال' | '50000+ ريال';
  primaryGoals: Array<'زيادة الوعي بالعلامة التجارية' | 'توليد العملاء المحتملين' | 'زيادة المبيعات' | 'الاحتفاظ بالعملاء' | 'توسيع النطاق الجغرافي' | 'إطلاق منتجات جديدة'>;
  keyKPIs: Array<'زيارات الموقع' | 'التفاعل على وسائل التواصل' | 'معدل فتح الإيميل' | 'معدل التحويل' | 'عائد الإنفاق الإعلاني' | 'ذكر العلامة التجارية'>;
  campaignFrequency: 'أسبوعياً' | 'كل أسبوعين' | 'شهرياً' | 'ربع سنوي' | 'حسب الحاجة';
  automationLevel: 'أتمتة كاملة' | 'أتمتة جزئية' | 'مراجعة يدوية';
  approvalWorkflow: 'نشر تلقائي' | 'موافقة سريعة' | 'موافقة الفريق' | 'موافقة العميل';

  // صفحة 3: السوق المستهدف والحضور الرقمي
  primaryMarkets: Array<'السعودية' | 'الإمارات' | 'الكويت' | 'البحرين' | 'قطر' | 'عمان' | 'دول خليجية أخرى' | 'منطقة الشرق الأوسط'>;
  targetCities: string[];
  targetAgeGroups: Array<'18-25' | '26-35' | '36-45' | '46-55' | '55+'>;
  targetGender: 'ذكور' | 'إناث' | 'كلاهما';
  incomeLevel: 'دخل منخفض' | 'دخل متوسط' | 'دخل عالي' | 'جميع المستويات';
  socialAccounts: {
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    tiktok: string;
    snapchat: string;
    youtube: string;
  };
  competitors: Array<{ name: string; website: string; }>;
  competitiveAdvantages: string;
  websitePlatform: 'WordPress' | 'Shopify' | 'مخصص' | 'Wix' | 'أخرى';
  currentTools: string[];

  // صفحة 4: تفضيلات المحتوى والحملات
  contentLanguages: 'عربي فقط' | 'عربي وإنجليزي';
  contentTypes: Array<'مقالات المدونة' | 'منشورات وسائل التواصل' | 'فيديوهات' | 'إنفوجرافيك' | 'دراسات حالة' | 'نشرات إخبارية' | 'ندوات عبر الإنترنت'>;
  brandPersonality: 'مهني' | 'ودود' | 'موثوق' | 'إبداعي' | 'تقليدي' | 'عصري';
  communicationTone: 'رسمي' | 'شبه رسمي' | 'محادثة' | 'مرح';
  preferredChannels: Array<'وسائل التواصل الاجتماعي' | 'تحسين محركات البحث' | 'إعلانات جوجل' | 'التسويق عبر البريد الإلكتروني' | 'تسويق المحتوى' | 'التسويق عبر المؤثرين' | 'التسويق بالفيديو'>;
  analyticsConsent: boolean;
  trackingConsent: boolean;
  dataPrivacyConsent: boolean;
  subscriptionPlan: 'المبتدئ' | 'المحترف' | 'المؤسسة';
  immediateStart: boolean;
  onboardingCall: boolean;
}

export const EnhancedSmartOnboarding = ({ user, onComplete }: EnhancedSmartOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    // صفحة 1
    websiteUrl: '',
    websiteAnalysisStatus: 'pending',
    autoDiscoveredData: null,
    dataApprovalStatus: {},
    companyNameAr: '',
    industry: '',
    companySize: '1-10',
    businessType: 'B2B',
    locationCountry: 'السعودية',
    locationCity: '',
    yearsInBusiness: '1-3 سنوات',

    // صفحة 2
    teamSize: 'أنا فقط',
    experienceLevel: 'متوسط',
    monthlyBudget: '5000-15000 ريال',
    primaryGoals: [],
    keyKPIs: [],
    campaignFrequency: 'شهرياً',
    automationLevel: 'أتمتة جزئية',
    approvalWorkflow: 'موافقة سريعة',

    // صفحة 3
    primaryMarkets: ['السعودية'],
    targetCities: [],
    targetAgeGroups: [],
    targetGender: 'كلاهما',
    incomeLevel: 'جميع المستويات',
    socialAccounts: {
      instagram: '',
      twitter: '',
      linkedin: '',
      facebook: '',
      tiktok: '',
      snapchat: '',
      youtube: ''
    },
    competitors: [],
    competitiveAdvantages: '',
    websitePlatform: 'WordPress',
    currentTools: [],

    // صفحة 4
    contentLanguages: 'عربي فقط',
    contentTypes: [],
    brandPersonality: 'مهني',
    communicationTone: 'شبه رسمي',
    preferredChannels: [],
    analyticsConsent: false,
    trackingConsent: false,
    dataPrivacyConsent: false,
    subscriptionPlan: 'المبتدئ',
    immediateStart: false,
    onboardingCall: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDataChange = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const handleAnalyzeWebsite = async (websiteUrl: string) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      websiteUrl, 
      websiteAnalysisStatus: 'analyzing' 
    }));

    try {
      const { data, error } = await supabase.functions.invoke('analyze-website-perplexity', {
        body: { website: websiteUrl }
      });

      if (error) throw error;

      setOnboardingData(prev => ({
        ...prev,
        websiteAnalysisStatus: 'completed',
        autoDiscoveredData: data.data
      }));

      toast.success('تم تحليل الموقع بنجاح! 🎉');
    } catch (error: any) {
      console.error('Website analysis error:', error);
      setOnboardingData(prev => ({ 
        ...prev, 
        websiteAnalysisStatus: 'error' 
      }));
      toast.error('فشل في تحليل الموقع. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // إنشاء عميل جديد بدلاً من شركة
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: onboardingData.companyNameAr,
          user_id: user.id
        })
        .select()
        .single();

      if (clientError) throw clientError;
      setClientId(client.id);

      // حفظ بيانات التحليل في content_sources_data
      if (onboardingData.autoDiscoveredData) {
        const { error: discoveryError } = await supabase
          .from('content_sources_data')
          .insert({
            client_id: client.id,
            source_type: 'website_analysis',
            data: {
              website_url: onboardingData.websiteUrl,
              analysis_data: onboardingData.autoDiscoveredData,
              company_info: {
                name: onboardingData.companyNameAr,
                industry: onboardingData.industry,
                size: onboardingData.companySize,
                location: `${onboardingData.locationCity}, ${onboardingData.locationCountry}`,
                team_size: onboardingData.teamSize,
                experience_level: onboardingData.experienceLevel,
                monthly_budget: onboardingData.monthlyBudget,
                primary_goals: onboardingData.primaryGoals,
                key_kpis: onboardingData.keyKPIs,
                primary_markets: onboardingData.primaryMarkets,
                social_accounts: onboardingData.socialAccounts,
                competitors: onboardingData.competitors,
                preferred_channels: onboardingData.preferredChannels
              }
            }
          });

        if (discoveryError) {
          console.error('Discovery data save error:', discoveryError);
        }
      }

      toast.success('تم إكمال إعداد حسابك بنجاح! 🎉');
      
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/dashboard');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Onboarding submission error:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            data={onboardingData}
            onDataChange={handleDataChange}
            onAnalyzeWebsite={handleAnalyzeWebsite}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            data={onboardingData}
            onDataChange={handleDataChange}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            data={onboardingData}
            onDataChange={handleDataChange}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            data={onboardingData}
            onDataChange={handleDataChange}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.companyNameAr.trim() && onboardingData.industry;
      case 2:
        return onboardingData.primaryGoals.length > 0;
      case 3:
        return onboardingData.primaryMarkets.length > 0;
      case 4:
        return onboardingData.dataPrivacyConsent && onboardingData.preferredChannels.length > 0;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'تحليل الموقع وملف الشركة';
      case 2: return 'استراتيجية التسويق والأهداف';
      case 3: return 'السوق المستهدف والحضور الرقمي';
      case 4: return 'تفضيلات المحتوى والحملات';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center border-b">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">م</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك في مورفو AI</h1>
            <p className="text-gray-600">دعنا نعد لك تجربة تسويقية مخصصة</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">الخطوة {currentStep} من {totalSteps}</span>
              <span className="text-sm text-gray-500">{getStepTitle()}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {renderStep()}
          
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              السابق
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                التالي
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    إكمال الإعداد
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
