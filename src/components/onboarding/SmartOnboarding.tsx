
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Brain, Target, Rocket, CheckCircle } from 'lucide-react';

interface SmartOnboardingProps {
  user: User;
  onComplete?: () => void;
}

interface CompanyData {
  name: string;
  industry: string;
  description: string;
  website: string;
  size: string;
  location: string;
  founded: string;
}

const industryOptions = [
  'تكنولوجيا المعلومات',
  'التجارة الإلكترونية',
  'التعليم',
  'الصحة والطب',
  'المالية والمصرفية',
  'العقارات',
  'الطعام والمشروبات',
  'الأزياء والجمال',
  'السياحة والسفر',
  'الخدمات المهنية',
  'التصنيع',
  'أخرى'
];

const companySizes = [
  'مؤسسة فردية (1 شخص)',
  'شركة صغيرة (2-10 أشخاص)',
  'شركة متوسطة (11-50 شخص)',
  'شركة كبيرة (51-200 شخص)',
  'شركة كبيرة جداً (أكثر من 200 شخص)'
];

export const SmartOnboarding = ({ user, onComplete }: SmartOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    industry: '',
    description: '',
    website: '',
    size: '',
    location: '',
    founded: ''
  });
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save company data
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          user_id: user.id
        })
        .select()
        .single();

      if (companyError) throw companyError;

      toast.success('تم حفظ بيانات الشركة بنجاح!');
      
      // Start AI analysis
      setAnalyzing(true);
      setCurrentStep(4);
      
      const { data: analysisResult, error: analysisError } = await supabase.functions
        .invoke('analyze-company', {
          body: { companyId: company.id, userId: user.id }
        });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        toast.error('حدث خطأ في التحليل، ولكن تم حفظ بيانات الشركة');
      } else {
        toast.success('تم إكمال التحليل الذكي بنجاح! 🎉');
      }

      // Complete onboarding
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/dashboard');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Error in onboarding:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">أهلاً بك في Morvo! 🎉</h2>
              <p className="text-gray-600">دعنا نتعرف على شركتك لنقدم لك أفضل الخدمات</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الشركة *</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="اسم شركتك"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="industry">الصناعة *</Label>
                <Select value={companyData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصناعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">وصف الشركة</Label>
                <Textarea
                  id="description"
                  value={companyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="صف نشاط شركتك والخدمات التي تقدمها"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات إضافية</h2>
              <p className="text-gray-600">هذه المعلومات ستساعدنا في تقديم تحليل أكثر دقة</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="website">الموقع الإلكتروني</Label>
                <Input
                  id="website"
                  value={companyData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              
              <div>
                <Label htmlFor="size">حجم الشركة</Label>
                <Select value={companyData.size} onValueChange={(value) => handleInputChange('size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حجم الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    value={companyData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="المدينة، البلد"
                  />
                </div>
                
                <div>
                  <Label htmlFor="founded">سنة التأسيس</Label>
                  <Input
                    id="founded"
                    value={companyData.founded}
                    onChange={(e) => handleInputChange('founded', e.target.value)}
                    placeholder="2024"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">جاهز للتحليل الذكي!</h2>
              <p className="text-gray-600">سنقوم بتحليل شركتك والسوق باستخدام الذكاء الاصطناعي</p>
            </div>
            
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">ما سنقوم بتحليله:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    تحليل المنافسين في السوق
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    اتجاهات السوق والفرص المتاحة
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    استراتيجيات التسويق المناسبة
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    توصيات مخصصة لشركتك
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ملخص بيانات شركتك:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>الاسم:</strong> {companyData.name}</p>
                <p><strong>الصناعة:</strong> {companyData.industry}</p>
                {companyData.website && <p><strong>الموقع:</strong> {companyData.website}</p>}
                {companyData.size && <p><strong>الحجم:</strong> {companyData.size}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {analyzing ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {analyzing ? 'جاري التحليل...' : 'تم إكمال التحليل! 🎉'}
              </h2>
              <p className="text-gray-600">
                {analyzing 
                  ? 'نحن نحلل شركتك والسوق باستخدام أحدث تقنيات الذكاء الاصطناعي'
                  : 'مرحباً بك في Morvo! ستجد التحليل المفصل في لوحة التحكم'
                }
              </p>
            </div>
            
            {analyzing && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>تحليل السوق والمنافسين...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>إنشاء التوصيات المخصصة...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>إعداد لوحة التحكم...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return companyData.name.trim() && companyData.industry;
      case 2:
        return true; // Optional fields
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">الخطوة {currentStep} من {totalSteps}</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading || analyzing}
            >
              السابق
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
              >
                التالي
              </Button>
            ) : currentStep === 3 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري البدء...
                  </>
                ) : (
                  'ابدأ التحليل الذكي'
                )}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
