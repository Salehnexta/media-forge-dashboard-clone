
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, BarChart3, Users, Zap, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Product = () => {
  const features = [
    {
      icon: Brain,
      title: "الذكاء الاصطناعي المتقدم",
      description: "تحليل ذكي للسوق والمنافسين باستخدام أحدث تقنيات GPT-4 و Perplexity AI"
    },
    {
      icon: Target,
      title: "استراتيجيات مخصصة",
      description: "خطط تسويقية مصممة خصيصاً لنشاطك التجاري وجمهورك المستهدف"
    },
    {
      icon: BarChart3,
      title: "تحليلات شاملة",
      description: "مراقبة الأداء وتحليل البيانات مع تقارير تفاعلية وإحصائيات دقيقة"
    },
    {
      icon: Users,
      title: "إدارة فريق التسويق",
      description: "أدوات تعاونية لفريق التسويق مع توزيع المهام ومتابعة التقدم"
    },
    {
      icon: Zap,
      title: "تنفيذ سريع",
      description: "من التحليل إلى التنفيذ في دقائق معدودة مع خطط عمل واضحة"
    },
    {
      icon: Shield,
      title: "أمان البيانات",
      description: "حماية قصوى لبياناتك مع تشفير متقدم وامتثال للمعايير الدولية"
    }
  ];

  const benefits = [
    "توفير 80% من الوقت في تحليل السوق",
    "زيادة كفاءة الحملات التسويقية بنسبة 60%",
    "تحسين معدل التحويل بنسبة 45%",
    "خفض تكلفة الحصول على العملاء بنسبة 35%"
  ];

  return (
    <PageLayout
      title="منصة Morvo للتسويق الذكي"
      description="اكتشف قوة الذكاء الاصطناعي في التسويق مع منصة Morvo - حلولك المتكاملة لتحليل السوق وبناء الاستراتيجيات الفعالة"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "المنتج" }
      ]}
      actionButton={{
        label: "جرب المنصة مجاناً",
        href: "/auth",
        variant: "default"
      }}
    >
      <div className="container mx-auto px-6">
        {/* Product Overview */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <img 
                      src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" 
                      alt="Morvo Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">منصة Morvo</h3>
                  <p className="text-gray-600">فريق التسويق الذكي المتكامل</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                منصة التسويق الذكي
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                حول أعمالك إلى قصة نجاح مع قوة الذكاء الاصطناعي
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                منصة Morvo تجمع بين تحليل الذكاء الاصطناعي المتقدم وخبرة التسويق الاستراتيجي لتوفر لك حلولاً متكاملة 
                تساعدك على فهم السوق، تحليل المنافسين، وبناء استراتيجيات تسويقية فعالة في دقائق معدودة.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              مميزات المنصة الرئيسية
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف كيف تساعدك منصة Morvo في تحقيق أهدافك التسويقية بكفاءة وذكاء
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-right">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-right leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              كيف تعمل المنصة؟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ثلاث خطوات بسيطة للحصول على استراتيجية تسويقية متكاملة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">أدخل بيانات شركتك</h3>
              <p className="text-gray-600">
                أدخل رابط موقعك أو معلومات أساسية عن نشاطك التجاري
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">تحليل ذكي شامل</h3>
              <p className="text-gray-600">
                الذكاء الاصطناعي يحلل شركتك والسوق والمنافسين بدقة عالية
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">خطة عمل جاهزة</h3>
              <p className="text-gray-600">
                احصل على استراتيجية تسويقية متكاملة مع خطة تنفيذ واضحة
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            هل أنت مستعد لثورة تسويقية؟
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            ابدأ رحلتك مع منصة Morvo اليوم واكتشف كيف يمكن للذكاء الاصطناعي 
            أن يحول استراتيجيتك التسويقية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/auth">
                ابدأ التجربة المجانية
                <ArrowLeft className="w-5 h-5 mr-2 rotate-180" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/ai-analysis">
                جرب التحليل الذكي
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Product;
