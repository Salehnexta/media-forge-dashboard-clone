
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "الباقة الأساسية",
      price: "مجاني",
      amount: 0,
      period: "",
      description: "للشركات الناشئة والأفراد",
      features: [
        "تحليل ذكي أساسي",
        "3 تحليلات شهرياً",
        "تقارير أساسية",
        "دعم عبر البريد الإلكتروني"
      ],
      popular: false,
      buttonText: "ابدأ مجاناً",
      buttonLink: "/auth"
    },
    {
      name: "الباقة المتقدمة",
      price: "299",
      amount: 299,
      period: "شهرياً",
      description: "للشركات الصغيرة والمتوسطة",
      features: [
        "تحليل ذكي متقدم",
        "تحليلات غير محدودة",
        "تقارير تفصيلية",
        "إدارة الحملات",
        "دعم على مدار الساعة",
        "تكامل مع أدوات التسويق"
      ],
      popular: true,
      buttonText: "ابدأ الاشتراك",
      buttonLink: "/payment?plan=الباقة المتقدمة&amount=299"
    },
    {
      name: "باقة المؤسسات",
      price: "تواصل معنا",
      amount: 0,
      period: "",
      description: "للشركات الكبيرة والمؤسسات",
      features: [
        "جميع مميزات الباقة المتقدمة",
        "حلول مخصصة",
        "مدير حساب مختص",
        "تدريب فريق العمل",
        "تكامل مخصص",
        "اتفاقية مستوى الخدمة SLA"
      ],
      popular: false,
      buttonText: "تواصل معنا",
      buttonLink: "/contact"
    }
  ];

  return (
    <PageLayout
      title="خطط الأسعار"
      description="اختر الباقة المناسبة لاحتياجاتك وابدأ رحلتك مع التسويق الذكي"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الأسعار" }
      ]}
    >
      <div className="container mx-auto px-6">
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 right-6 bg-blue-500">
                    الأكثر شعبية
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="py-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 mr-2">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to={plan.buttonLink}>
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Payment Security Section */}
        <section className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">دفع آمن ومضمون</h3>
            <p className="text-gray-600 mb-6">
              نستخدم أحدث تقنيات الأمان لحماية بياناتك المالية
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold">تشفير SSL</h4>
                <p className="text-sm text-gray-600">جميع المعاملات محمية بتشفير 256-bit</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold">دفع سريع</h4>
                <p className="text-sm text-gray-600">معالجة فورية للدفعات</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold">ضمان الاسترداد</h4>
                <p className="text-sm text-gray-600">ضمان استرداد خلال 30 يوم</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Pricing;
