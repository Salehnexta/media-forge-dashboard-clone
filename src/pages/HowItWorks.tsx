
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, Brain, Target, BarChart3, 
  CheckCircle, ArrowRight, Play, Download,
  Clock, Users, Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "أدخل بيانات شركتك",
      description: "ابدأ بإدخال رابط موقعك الإلكتروني أو معلومات أساسية عن نشاطك التجاري. يمكنك أيضاً رفع ملفات أو وثائق إضافية.",
      details: [
        "رابط الموقع الإلكتروني",
        "نوع النشاط التجاري",
        "المنتجات أو الخدمات",
        "السوق المستهدف (اختياري)"
      ],
      time: "2-3 دقائق"
    },
    {
      number: "02",
      icon: Brain,
      title: "التحليل الذكي الشامل",
      description: "يقوم الذكاء الاصطناعي بتحليل شركتك والسوق والمنافسين باستخدام أحدث تقنيات GPT-4 و Perplexity AI للحصول على فهم عميق.",
      details: [
        "تحليل نشاطك التجاري",
        "دراسة المنافسين الرئيسيين",
        "تحليل اتجاهات السوق",
        "تحديد الفرص والتحديات"
      ],
      time: "3-5 دقائق"
    },
    {
      number: "03",
      icon: Target,
      title: "بناء الاستراتيجية المخصصة",
      description: "بناءً على التحليل، يتم إنشاء استراتيجية تسويقية مخصصة تماماً لشركتك مع تحديد الجمهور المستهدف والقنوات الأمثل.",
      details: [
        "تحديد الجمهور المستهدف",
        "اختيار القنوات التسويقية المناسبة",
        "تحديد الرسائل الأساسية",
        "وضع الأهداف والمؤشرات"
      ],
      time: "2-3 دقائق"
    },
    {
      number: "04",
      icon: BarChart3,
      title: "خطة العمل التنفيذية",
      description: "احصل على خطة عمل تفصيلية مع الخطوات التنفيذية، الجدول الزمني، الميزانية المقترحة، ومؤشرات قياس النجاح.",
      details: [
        "خطة تنفيذية مرحلية",
        "جدول زمني واضح",
        "تقدير الميزانية",
        "مؤشرات الأداء الرئيسية"
      ],
      time: "1-2 دقيقة"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "توفير الوقت",
      description: "من أسابيع إلى دقائق",
      value: "95% توفير في الوقت"
    },
    {
      icon: Users,
      title: "خبرة متقدمة",
      description: "خبرة فريق تسويق كامل",
      value: "خبرة 10+ سنوات"
    },
    {
      icon: Zap,
      title: "نتائج فورية",
      description: "استراتيجية جاهزة للتنفيذ",
      value: "خطة كاملة في 10 دقائق"
    }
  ];

  return (
    <PageLayout
      title="كيف تعمل منصة Morvo"
      description="تعلم كيف تحصل على استراتيجية تسويقية متكاملة في 4 خطوات بسيطة باستخدام قوة الذكاء الاصطناعي"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "كيف تعمل المنصة" }
      ]}
      actionButton={{
        label: "جرب الآن",
        href: "/ai-analysis",
        variant: "default"
      }}
    >
      <div className="container mx-auto px-6">
        {/* Overview Section */}
        <section className="mb-16 text-center">
          <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
            عملية بسيطة وفعالة
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            من الفكرة إلى الاستراتيجية في 4 خطوات
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اكتشف كيف تحول منصة Morvo عملية التخطيط التسويقي من مهمة معقدة تستغرق أسابيع 
            إلى عملية بسيطة تكتمل في دقائق معدودة
          </p>
        </section>

        {/* Benefits Quick Overview */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 mb-3">{benefit.description}</p>
                  <Badge variant="secondary" className="text-blue-600 bg-white">
                    {benefit.value}
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>

        {/* Steps Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              خطوات العملية التفصيلية
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تابع معنا كيف تعمل كل خطوة في عملية بناء استراتيجيتك التسويقية
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {step.time}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <Icon className="w-8 h-8 text-blue-600" />
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        {step.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900">ما يتم في هذه المرحلة:</h4>
                      <div className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 h-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <Icon className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">المرحلة {step.number}</h4>
                        <p className="text-gray-600">{step.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Demo Section */}
        <section className="mb-16">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">
                شاهد العملية عملياً
              </CardTitle>
              <CardDescription className="text-lg">
                جرب التحليل الذكي بنفسك واكتشف كيف تعمل المنصة في الواقع
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">تجربة مجانية كاملة</h4>
                  <p className="text-gray-600 text-sm">
                    جرب جميع المميزات دون الحاجة لبطاقة ائتمانية
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">نتائج فورية</h4>
                  <p className="text-gray-600 text-sm">
                    احصل على استراتيجية كاملة في أقل من 10 دقائق
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/ai-analysis">
                    ابدأ التحليل الذكي
                    <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link to="/features">
                    اكتشف المميزات
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              أسئلة شائعة حول العملية
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">كم من الوقت تستغرق العملية الكاملة؟</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-right">
                  العملية الكاملة من إدخال البيانات إلى الحصول على الاستراتيجية تستغرق بين 8-15 دقيقة حسب تعقيد نشاطك التجاري.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">هل أحتاج لخبرة تقنية؟</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-right">
                  لا على الإطلاق! العملية مصممة لتكون بسيطة ومفهومة لأي شخص، حتى لو لم يكن لديه خبرة تقنية سابقة.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">ما مدى دقة التحليل؟</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-right">
                  نستخدم أحدث تقنيات الذكاء الاصطناعي مع قواعد بيانات محدثة لضمان دقة التحليل بنسبة تزيد عن 90%.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">هل يمكنني تعديل الاستراتيجية؟</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-right">
                  نعم، يمكنك تعديل وتخصيص الاستراتيجية حسب احتياجاتك، كما يمكنك إجراء تحليل جديد في أي وقت.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            هل أنت مستعد للبدء؟
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            ابدأ رحلتك مع منصة Morvo اليوم واحصل على استراتيجية تسويقية 
            متكاملة في دقائق معدودة
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link to="/ai-analysis">
              ابدأ التحليل الآن
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
            </Link>
          </Button>
        </section>
      </div>
    </PageLayout>
  );
};

export default HowItWorks;
