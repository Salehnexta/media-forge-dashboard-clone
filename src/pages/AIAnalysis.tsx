
import { AIAnalysisSystem } from '@/components/morvo/AIAnalysisSystem';
import { Footer } from '@/components/layout/Footer';

const AIAnalysis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-cairo" dir="rtl">
      <div className="container mx-auto py-8">
        <AIAnalysisSystem />
      </div>
      <Footer />
    </div>
  );
};

export default AIAnalysis;
