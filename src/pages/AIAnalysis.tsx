
import { AIAnalysisSystem } from '@/components/morvo/AIAnalysisSystem';
import { PageLayout } from '@/components/layout/PageLayout';

const AIAnalysis = () => {
  return (
    <PageLayout
      title="التحليل الذكي"
      description="نظام التحليل الذكي المتقدم لتحليل السوق والمنافسين"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "التحليل الذكي" }
      ]}
      actionButton={{
        label: "ابدأ تحليل جديد",
        href: "/ai-analysis"
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-cairo" dir="rtl">
        <div className="container mx-auto py-8">
          <AIAnalysisSystem />
        </div>
      </div>
    </PageLayout>
  );
};

export default AIAnalysis;
