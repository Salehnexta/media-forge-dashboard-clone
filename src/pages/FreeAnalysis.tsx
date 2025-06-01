
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles, BarChart3, Users, Target, TrendingUp } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

const FreeAnalysis = () => {
  const [website, setWebsite] = useState('');
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    if (website.trim()) {
      // توجيه المستخدم إلى صفحة التسجيل مع تمرير رابط الموقع
      navigate(`/auth?website=${encodeURIComponent(website)}&type=free-analysis`);
    }
  };

  const benefits = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "تحليل الشركة والمنافسين",
      description: "دراسة شاملة لموقعك ومقارنة مع أقوى المنافسين في السوق"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: "تحليل السوق والفرص",
      description: "اكتشاف الفرص الذهبية والاتجاهات الجديدة في مجال عملك"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "استراتيجية تسويقية مخصصة",
      description: "خطة تسويقية مدروسة ومصممة خصيصاً لشركتك وأهدافك"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "خطة عمل تنفيذية",
      description: "خطوات واضحة وقابلة للتنفيذ لتحقيق نتائج ملموسة"
    }
  ];

  return (
    <PageLayout
      title="التحليل التسويقي المجاني"
      description="احصل على تحليل شامل لشركتك مجاناً"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "التحليل المجاني" }
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 ml-2" />
              <span className="font-semibold">مجاني 100%</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              نظام التحليل التسويقي الذكي
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              تحليل شامل بالذكاء الاصطناعي باستخدام Perplexity AI و GPT-4o
            </p>

            {/* Website Input */}
            <Card className="max-w-2xl mx-auto mb-12 shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">ابدأ تحليل شركتك</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موقع الشركة الإلكتروني
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="text-lg py-3"
                  />
                </div>
                
                <Button 
                  onClick={handleStartAnalysis}
                  disabled={!website.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                >
                  ابدأ التحليل الذكي
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">ما ستحصل عليه:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Care Message */}
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">نهتم براحتك! 💚</h3>
              <p className="text-green-800 text-lg leading-relaxed">
                سنقوم بتحليل كل شيء تلقائياً لتوفر وقتك ومجهودك. فقط أدخل رابط موقعك ودعنا نتولى الباقي!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default FreeAnalysis;
