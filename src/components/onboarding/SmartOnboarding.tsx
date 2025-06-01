
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
import { Loader2, Brain, Target, Rocket, CheckCircle, Building2, TrendingUp, Wallet, Upload } from 'lucide-react';
import { SalesDataStep } from './SalesDataStep';
import { BudgetStep } from './BudgetStep';
import { DocumentUploadStep } from './DocumentUploadStep';

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

interface SalesData {
  annual_revenue: string;
  monthly_average_sales: string;
  top_selling_products: string[];
  sales_channels: string[];
  customer_acquisition_cost: string;
  customer_lifetime_value: string;
  conversion_rate: string;
  sales_team_size: string;
  sales_process_description: string;
}

interface BudgetData {
  total_marketing_budget: string;
  monthly_marketing_budget: string;
  budget_allocation: Record<string, number>;
  budget_period: string;
  priority_channels: string[];
  budget_constraints: string;
  expected_roi: string;
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
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    industry: '',
    description: '',
    website: '',
    size: '',
    location: '',
    founded: ''
  });

  const [salesData, setSalesData] = useState<SalesData>({
    annual_revenue: '',
    monthly_average_sales: '',
    top_selling_products: [],
    sales_channels: [],
    customer_acquisition_cost: '',
    customer_lifetime_value: '',
    conversion_rate: '',
    sales_team_size: '',
    sales_process_description: ''
  });

  const [budgetData, setBudgetData] = useState<BudgetData>({
    total_marketing_budget: '',
    monthly_marketing_budget: '',
    budget_allocation: {},
    budget_period: 'monthly',
    priority_channels: [],
    budget_constraints: '',
    expected_roi: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  const totalSteps = 6;
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
      // حفظ بيانات الشركة
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          user_id: user.id
        })
        .select()
        .single();

      if (companyError) throw companyError;
      setCompanyId(company.id);

      // حفظ بيانات المبيعات
      if (salesData.annual_revenue || salesData.monthly_average_sales) {
        const { error: salesError } = await supabase
          .from('sales_data')
          .insert({
            company_id: company.id,
            user_id: user.id,
            annual_revenue: salesData.annual_revenue ? parseFloat(salesData.annual_revenue) : null,
            monthly_average_sales: salesData.monthly_average_sales ? parseFloat(salesData.monthly_average_sales) : null,
            top_selling_products: salesData.top_selling_products,
            sales_channels: salesData.sales_channels,
            customer_acquisition_cost: salesData.customer_acquisition_cost ? parseFloat(salesData.customer_acquisition_cost) : null,
            customer_lifetime_value: salesData.customer_lifetime_value ? parseFloat(salesData.customer_lifetime_value) : null,
            conversion_rate: salesData.conversion_rate ? parseFloat(salesData.conversion_rate) : null,
            sales_team_size: salesData.sales_team_size ? parseInt(salesData.sales_team_size) : null,
            sales_process_description: salesData.sales_process_description
          });

        if (salesError) throw salesError;
      }

      // حفظ بيانات الميزانية
      if (budgetData.total_marketing_budget || budgetData.monthly_marketing_budget) {
        const { error: budgetError } = await supabase
          .from('budget_info')
          .insert({
            company_id: company.id,
            user_id: user.id,
            total_marketing_budget: budgetData.total_marketing_budget ? parseFloat(budgetData.total_marketing_budget) : null,
            monthly_marketing_budget: budgetData.monthly_marketing_budget ? parseFloat(budgetData.monthly_marketing_budget) : null,
            budget_allocation: budgetData.budget_allocation,
            budget_period: budgetData.budget_period,
            priority_channels: budgetData.priority_channels,
            budget_constraints: budgetData.budget_constraints,
            expected_roi: budgetData.expected_roi ? parseFloat(budgetData.expected_roi) : null
          });

        if (budgetError) throw budgetError;
      }

      toast.success('تم حفظ بيانات الشركة بنجاح!');
      
      // بدء التحليل الذكي
      setAnalyzing(true);
      setCurrentStep(6);
      
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

      // إكمال عملية التسجيل
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
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات الشركة الأساسية</h2>
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
        return <SalesDataStep salesData={salesData} onSalesDataChange={setSalesData} />;

      case 4:
        return <BudgetStep budgetData={budgetData} onBudgetDataChange={setBudgetData} />;

      case 5:
        return (
          <DocumentUploadStep 
            userId={user.id} 
            companyId={companyId}
            onFilesChange={setUploadedFiles}
          />
        );

      case 6:
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
                {analyzing ? 'جاري التحليل الشامل...' : 'تم إكمال التحليل! 🎉'}
              </h2>
              <p className="text-gray-600">
                {analyzing 
                  ? 'نحن نحلل جميع البيانات والملفات باستخدام أحدث تقنيات الذكاء الاصطناعي'
                  : 'مرحباً بك في Morvo! ستجد التحليل المفصل والتوصيات في لوحة التحكم'
                }
              </p>
            </div>
            
            {analyzing && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>تحليل بيانات الشركة والسوق...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>معالجة بيانات المبيعات والميزانية...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>تحليل الملفات المرفوعة...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>إنشاء التوصيات المخصصة...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>إعداد لوحة التحكم الشخصية...</span>
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
      case 3:
      case 4:
      case 5:
        return true; // الخطوات الاختيارية
      default:
        return false;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return Building2;
      case 2: return Target;
      case 3: return TrendingUp;
      case 4: return Wallet;
      case 5: return Upload;
      case 6: return Brain;
      default: return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
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
            
            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
              >
                التالي
              </Button>
            ) : currentStep === 5 ? (
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
                  'ابدأ التحليل الشامل'
                )}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
