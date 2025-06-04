
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { OnboardingProgress } from './components/OnboardingProgress';
import { CompanyInfoStep } from './components/CompanyInfoStep';
import { AdditionalInfoStep } from './components/AdditionalInfoStep';
import { CompletionStep } from './components/CompletionStep';
import { OnboardingNavigation } from './components/OnboardingNavigation';
import { SalesDataStep } from './SalesDataStep';
import { BudgetStep } from './BudgetStep';
import { DocumentUploadStep } from './DocumentUploadStep';

interface RefactoredSmartOnboardingProps {
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

export const RefactoredSmartOnboarding = ({ user, onComplete }: RefactoredSmartOnboardingProps) => {
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
        return <CompanyInfoStep companyData={companyData} onInputChange={handleInputChange} />;
      case 2:
        return <AdditionalInfoStep companyData={companyData} onInputChange={handleInputChange} />;
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
        return <CompletionStep analyzing={analyzing} />;
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
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
        </CardHeader>
        
        <CardContent className="p-8">
          {renderStep()}
          
          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            canProceed={canProceed()}
            loading={loading}
            analyzing={analyzing}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};
