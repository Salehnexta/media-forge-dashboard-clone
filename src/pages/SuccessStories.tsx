
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, TrendingUp, Users, Target } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      company: "متجر النور للإلكترونيات",
      industry: "التجارة الإلكترونية",
      result: "زيادة المبيعات بنسبة 150%",
      description: "تمكنت شركة النور من مضاعفة مبيعاتها خلال 6 أشهر باستخدام استراتيجيات التسويق الذكي من منصة Morvo",
      metrics: [
        { label: "زيادة المبيعات", value: "150%" },
        { label: "تحسين معدل التحويل", value: "85%" },
        { label: "انخفاض تكلفة العميل", value: "40%" }
      ]
    },
    {
      company: "مطاعم الذواقة",
      industry: "المطاعم والضيافة",
      result: "توسع إلى 5 فروع جديدة",
      description: "استطاعت سلسلة مطاعم الذواقة تحديد أفضل المواقع للتوسع وجذب عملاء جدد بفعالية",
      metrics: [
        { label: "زيادة العملاء", value: "200%" },
        { label: "فروع جديدة", value: "5" },
        { label: "تحسين الوعي بالعلامة", value: "120%" }
      ]
    },
    {
      company: "أكاديمية التعلم الرقمي",
      industry: "التعليم والتدريب",
      result: "نمو الطلاب بنسبة 300%",
      description: "حققت الأكاديمية نمواً استثنائياً في عدد الطلاب من خلال استراتيجيات التسويق المستهدفة",
      metrics: [
        { label: "زيادة الطلاب", value: "300%" },
        { label: "تحسين معدل الإنجاز", value: "75%" },
        { label: "رضا الطلاب", value: "95%" }
      ]
    }
  ];

  return (
    <PageLayout
      title="قصص النجاح"
      description="اكتشف كيف ساعدت منصة Morvo الشركات على تحقيق نتائج استثنائية في التسويق الرقمي"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "قصص النجاح" }
      ]}
    >
      <div className="container mx-auto px-6">
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
              نتائج حقيقية من عملاء حقيقيين
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              شركاء النجاح يحكون قصصهم
            </h2>
          </div>

          <div className="space-y-12">
            {stories.map((story, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-2xl text-right">{story.company}</CardTitle>
                      <Badge variant="outline" className="mt-2">{story.industry}</Badge>
                    </div>
                    <Quote className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="bg-gradient-to-l from-blue-50 to-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-600 mb-2">{story.result}</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed text-right mb-6">
                    {story.description}
                  </CardDescription>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {story.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                        <div className="text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default SuccessStories;
