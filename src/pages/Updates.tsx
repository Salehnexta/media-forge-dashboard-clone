
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Zap, Bug, Plus } from "lucide-react";

const Updates = () => {
  const updates = [
    {
      version: "2.1.0",
      date: "2024-05-25",
      type: "ميزة جديدة",
      title: "تحليل المنافسين المتقدم",
      description: "إضافة أدوات جديدة لتحليل استراتيgiات المنافسين بشكل أكثر تفصيلاً",
      features: [
        "مراقبة المحتوى التنافسي",
        "تحليل الأسعار والعروض",
        "مقارنة الأداء على المنصات الاجتماعية"
      ],
      icon: Plus,
      color: "green"
    },
    {
      version: "2.0.5",
      date: "2024-05-15",
      type: "تحسينات",
      title: "تحسين سرعة التحليل",
      description: "تحسينات جوهرية في سرعة معالجة البيانات وإنتاج التقارير",
      features: [
        "تسريع التحليل بنسبة 40%",
        "تحسين واجهة المستخدم",
        "تحسين استقرار النظام"
      ],
      icon: Zap,
      color: "blue"
    },
    {
      version: "2.0.4",
      date: "2024-05-05",
      type: "إصلاحات",
      title: "إصلاحات مهمة",
      description: "إصلاح مجموعة من المشاكل التقنية وتحسين الأداء العام",
      features: [
        "إصلاح مشكلة في التقارير",
        "تحسين دقة التحليل",
        "إصلاح مشاكل في التكامل"
      ],
      icon: Bug,
      color: "orange"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ميزة جديدة":
        return "bg-green-50 text-green-600 border-green-200";
      case "تحسينات":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "إصلاحات":
        return "bg-orange-50 text-orange-600 border-orange-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <PageLayout
      title="آخر التحديثات"
      description="تابع أحدث التطويرات والمميزات الجديدة في منصة Morvo"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "التحديثات" }
      ]}
    >
      <div className="container mx-auto px-6">
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
              نطور المنصة باستمرار
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              مواكبة أحدث التطويرات
            </h2>
          </div>

          <div className="space-y-8">
            {updates.map((update, index) => {
              const Icon = update.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          update.color === 'green' ? 'bg-green-100' :
                          update.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            update.color === 'green' ? 'text-green-600' :
                            update.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{update.title}</CardTitle>
                            <Badge className={getTypeColor(update.type)}>
                              {update.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{update.date}</span>
                            <Badge variant="outline" className="text-xs">
                              v{update.version}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-lg leading-relaxed text-right mb-6">
                      {update.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">المميزات الجديدة:</h4>
                      <ul className="space-y-2">
                        {update.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Updates;
