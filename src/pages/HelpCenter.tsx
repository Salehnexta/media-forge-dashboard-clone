
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Video, FileText, Lightbulb, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const categories = [
    {
      icon: Book,
      title: "البدء مع Morvo",
      description: "كل ما تحتاجه للبدء",
      articles: 12,
      topics: [
        "إنشاء حساب جديد",
        "إعداد الملف الشخصي",
        "التحليل الأول",
        "فهم التقارير"
      ]
    },
    {
      icon: Settings,
      title: "إعدادات الحساب",
      description: "إدارة حسابك وإعداداته",
      articles: 8,
      topics: [
        "تغيير كلمة المرور",
        "إعدادات الأمان",
        "إدارة الاشتراك",
        "تحديث بيانات الدفع"
      ]
    },
    {
      icon: Lightbulb,
      title: "التحليل الذكي",
      description: "كيفية استخدام أدوات التحليل",
      articles: 15,
      topics: [
        "فهم نتائج التحليل",
        "تخصيص التحليل",
        "تصدير التقارير",
        "مشاركة النتائج"
      ]
    },
    {
      icon: Users,
      title: "إدارة الفريق",
      description: "دعوة الأعضاء وإدارة الصلاحيات",
      articles: 6,
      topics: [
        "إضافة أعضاء جدد",
        "تحديد الصلاحيات",
        "مراقبة النشاط",
        "إعدادات الفريق"
      ]
    }
  ];

  const popularArticles = [
    "كيفية إجراء أول تحليل ذكي",
    "فهم تقارير تحليل المنافسين",
    "إعداد لوحة المعلومات الشخصية",
    "تصدير النتائج بصيغ مختلفة",
    "دعوة أعضاء الفريق وإدارتهم"
  ];

  return (
    <PageLayout
      title="مركز المساعدة"
      description="كل ما تحتاج لمعرفته عن استخدام منصة Morvo بكفاءة"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "مركز المساعدة" }
      ]}
    >
      <div className="container mx-auto px-6">
        {/* Search Section */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              كيف يمكننا مساعدتك؟
            </h2>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="ابحث في المقالات والأدلة..." 
                className="pl-12 pr-12 py-4 text-lg"
              />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            الفئات الرئيسية
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {category.articles} مقال
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-right mt-3">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.topics.map((topic, topicIndex) => (
                        <Link 
                          key={topicIndex}
                          to="#"
                          className="block text-blue-600 hover:text-blue-800 transition-colors text-sm"
                        >
                          • {topic}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                المقالات الأكثر شعبية
              </h3>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Link 
                    key={index}
                    to="#"
                    className="block p-4 border rounded-lg hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{article}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                فيديوهات تعليمية
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center">
                  <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    دورة Morvo الشاملة
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    تعلم كيفية استخدام جميع مميزات المنصة خطوة بخطوة
                  </p>
                  <Badge className="bg-blue-500">
                    20 فيديو تعليمي
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            لم تجد ما تبحث عنه؟
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            فريق الدعم الخاص بنا متاح على مدار الساعة لمساعدتك في أي استفسار
          </p>
          <Link to="/support">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              تواصل مع الدعم
            </button>
          </Link>
        </section>
      </div>
    </PageLayout>
  );
};

export default HelpCenter;
