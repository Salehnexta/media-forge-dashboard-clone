
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Building2, Users, Target, Globe } from 'lucide-react';

interface FreeAnalysisOnboardingProps {
  user: User;
  onComplete: () => void;
}

const industries = [
  'التجارة الإلكترونية',
  'التكنولوجيا',
  'الصحة والجمال',
  'التعليم',
  'الضيافة والسياحة',
  'العقارات',
  'الخدمات المالية',
  'التصنيع',
  'الخدمات الاستشارية',
  'أخرى'
];

const companySizes = [
  { value: 1, label: '1-10 موظفين (شركة ناشئة)' },
  { value: 50, label: '11-50 موظف (شركة صغيرة)' },
  { value: 200, label: '51-200 موظف (شركة متوسطة)' },
  { value: 500, label: '201-500 موظف (شركة كبيرة)' },
  { value: 1000, label: '500+ موظف (مؤسسة كبيرة)' }
];

export const FreeAnalysisOnboarding = ({ user, onComplete }: FreeAnalysisOnboardingProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // معلومات الشركة الأساسية
  const [companyData, setCompanyData] = useState({
    company_name: '',
    industry: '',
    company_size: 0,
    years_in_business: 0,
    headquarters: '',
    company_description: '',
    website_url: searchParams.get('website') || '',
    target_markets: [] as string[]
  });

  // معلومات الجمهور المستهدف
  const [audienceData, setAudienceData] = useState({
    segment_type: '',
    demographics: {},
    pain_points: [] as string[],
    decision_makers: [] as string[]
  });

  // أهداف العمل
  const [goalsData, setGoalsData] = useState({
    short_term_objectives: {},
    long_term_goals: {},
    key_performance_indicators: [] as string[]
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // حفظ معلومات الشركة
      const { data: companyProfile, error: companyError } = await supabase
        .from('company_profiles')
        .insert({
          ...companyData,
          user_id: user.id,
          target_markets: companyData.target_markets.length > 0 ? companyData.target_markets : null
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // حفظ معلومات الجمهور المستهدف
      if (audienceData.segment_type) {
        const { error: audienceError } = await supabase
          .from('target_audiences')
          .insert({
            company_id: companyProfile.id,
            segment_type: audienceData.segment_type,
            demographics: audienceData.demographics,
            pain_points: audienceData.pain_points.length > 0 ? audienceData.pain_points : null,
            decision_makers: audienceData.decision_makers.length > 0 ? audienceData.decision_makers : null
          });

        if (audienceError) throw audienceError;
      }

      // حفظ الأهداف
      if (Object.keys(goalsData.short_term_objectives).length > 0 || Object.keys(goalsData.long_term_goals).length > 0) {
        const { error: goalsError } = await supabase
          .from('business_goals')
          .insert({
            company_id: companyProfile.id,
            short_term_objectives: goalsData.short_term_objectives,
            long_term_goals: goalsData.long_term_goals,
            key_performance_indicators: goalsData.key_performance_indicators.length > 0 ? goalsData.key_performance_indicators : null
          });

        if (goalsError) throw goalsError;
      }

      toast.success('تم حفظ بيانات شركتك بنجاح!');
      navigate('/ai-analysis');
      onComplete();
    } catch (error: any) {
      console.error('Error saving company data:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Building2 className="w-6 h-6 ml-3" />
                معلومات الشركة الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الشركة *</label>
                <Input
                  value={companyData.company_name}
                  onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                  placeholder="اسم شركتك"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">المجال/الصناعة *</label>
                <Select value={companyData.industry} onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مجال عملك" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">حجم الشركة *</label>
                <Select value={companyData.company_size.toString()} onValueChange={(value) => setCompanyData({ ...companyData, company_size: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حجم شركتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">سنوات العمل</label>
                <Input
                  type="number"
                  value={companyData.years_in_business}
                  onChange={(e) => setCompanyData({ ...companyData, years_in_business: parseInt(e.target.value) || 0 })}
                  placeholder="عدد سنوات العمل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">موقع المقر الرئيسي</label>
                <Input
                  value={companyData.headquarters}
                  onChange={(e) => setCompanyData({ ...companyData, headquarters: e.target.value })}
                  placeholder="المدينة، البلد"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Globe className="w-6 h-6 ml-3" />
                وصف الشركة والموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">رابط الموقع الإلكتروني</label>
                <Input
                  type="url"
                  value={companyData.website_url}
                  onChange={(e) => setCompanyData({ ...companyData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">وصف مختصر للشركة</label>
                <Textarea
                  value={companyData.company_description}
                  onChange={(e) => setCompanyData({ ...companyData, company_description: e.target.value })}
                  placeholder="اكتب وصفاً مختصراً عن نشاط شركتك ومنتجاتها/خدماتها"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الأسواق المستهدفة</label>
                <Input
                  value={companyData.target_markets.join(', ')}
                  onChange={(e) => setCompanyData({ 
                    ...companyData, 
                    target_markets: e.target.value.split(',').map(m => m.trim()).filter(m => m) 
                  })}
                  placeholder="مثال: السعودية، الإمارات، مصر (افصل بفاصلة)"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-6 h-6 ml-3" />
                الجمهور المستهدف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">نوع العملاء</label>
                <Select value={audienceData.segment_type} onValueChange={(value) => setAudienceData({ ...audienceData, segment_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع عملائك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">أعمال إلى أعمال (B2B)</SelectItem>
                    <SelectItem value="B2C">أعمال إلى مستهلك (B2C)</SelectItem>
                    <SelectItem value="Both">كلاهما</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">التحديات التي يواجهها عملاؤك</label>
                <Textarea
                  value={audienceData.pain_points.join('\n')}
                  onChange={(e) => setAudienceData({ 
                    ...audienceData, 
                    pain_points: e.target.value.split('\n').filter(p => p.trim()) 
                  })}
                  placeholder="اكتب كل تحدي في سطر منفصل"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">صناع القرار في الشركات العميلة (للB2B)</label>
                <Input
                  value={audienceData.decision_makers.join(', ')}
                  onChange={(e) => setAudienceData({ 
                    ...audienceData, 
                    decision_makers: e.target.value.split(',').map(d => d.trim()).filter(d => d) 
                  })}
                  placeholder="مثال: المدير التنفيذي، مدير التسويق (افصل بفاصلة)"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="w-6 h-6 ml-3" />
                أهداف العمل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">الأهداف قصيرة المدى (6 أشهر)</label>
                <Textarea
                  value={Object.values(goalsData.short_term_objectives).join('\n')}
                  onChange={(e) => {
                    const objectives = e.target.value.split('\n').filter(o => o.trim());
                    const objectivesObj = objectives.reduce((acc, obj, index) => ({
                      ...acc,
                      [`objective_${index + 1}`]: obj
                    }), {});
                    setGoalsData({ ...goalsData, short_term_objectives: objectivesObj });
                  }}
                  placeholder="اكتب كل هدف في سطر منفصل"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الأهداف طويلة المدى (سنة أو أكثر)</label>
                <Textarea
                  value={Object.values(goalsData.long_term_goals).join('\n')}
                  onChange={(e) => {
                    const goals = e.target.value.split('\n').filter(g => g.trim());
                    const goalsObj = goals.reduce((acc, goal, index) => ({
                      ...acc,
                      [`goal_${index + 1}`]: goal
                    }), {});
                    setGoalsData({ ...goalsData, long_term_goals: goalsObj });
                  }}
                  placeholder="اكتب كل هدف في سطر منفصل"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">مؤشرات الأداء المهمة لك</label>
                <Input
                  value={goalsData.key_performance_indicators.join(', ')}
                  onChange={(e) => setGoalsData({ 
                    ...goalsData, 
                    key_performance_indicators: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                  })}
                  placeholder="مثال: المبيعات، العملاء الجدد، الزيارات (افصل بفاصلة)"
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return companyData.company_name && companyData.industry && companyData.company_size > 0;
      case 2:
        return true; // اختياري
      case 3:
        return true; // اختياري
      case 4:
        return true; // اختياري
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12" dir="rtl">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">معلومات شركتك للتحليل الذكي</h1>
          <p className="text-gray-600">نحتاج بعض المعلومات عن شركتك لنقدم لك تحليلاً دقيقاً ومخصصاً</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>الخطوة {currentStep} من {totalSteps}</span>
            <span>{Math.round(progress)}% مكتمل</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronRight className="w-4 h-4 ml-2" />
            السابق
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {currentStep === totalSteps ? 'ابدأ التحليل' : 'التالي'}
            {currentStep < totalSteps && <ChevronLeft className="w-4 h-4 mr-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
