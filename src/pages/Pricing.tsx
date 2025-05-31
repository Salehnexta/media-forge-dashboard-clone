
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
      period: "",
      description: "للشركات الناشئة والأفراد",
      features: [
        "تحليل ذكي أساسي",
        "3 تحليلات شهرياً",
        "تقارير أساسية",
        "دعم عبر البريد الإلكتروني"
      ],
      popular: false,
      buttonText: "ابدأ مجاناً"
    },
    {
      name: "الباقة المتقدمة",
      price: "299",
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
      buttonText: "ابدأ التجربة"
    },
    {
      name: "باقة المؤسسات",
      price: "تواصل معنا",
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
      buttonText: "تواصل معنا"
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
                    <Link to={plan.name === "باقة المؤسسات" ? "/contact" : "/auth"}>
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Pricing;
