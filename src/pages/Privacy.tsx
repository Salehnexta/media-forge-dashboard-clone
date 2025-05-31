
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Users, Database, Settings } from "lucide-react";

const Privacy = () => {
  const privacyPrinciples = [
    {
      icon: Shield,
      title: "الحماية الشاملة",
      description: "نستخدم أحدث تقنيات التشفير لحماية بياناتك"
    },
    {
      icon: Eye,
      title: "الشفافية الكاملة",
      description: "نوضح لك بالضبط كيف نستخدم بياناتك"
    },
    {
      icon: Lock,
      title: "التحكم الكامل",
      description: "أنت تتحكم في بياناتك ويمكنك حذفها في أي وقت"
    },
    {
      icon: Users,
      title: "عدم المشاركة",
      description: "لا نبيع أو نشارك بياناتك مع أطراف ثالثة"
    }
  ];

  const sections = [
    {
      title: "1. المعلومات التي نجمعها",
      icon: Database,
      content: `
        نجمع المعلومات التالية لتقديم خدماتنا:
        
        • معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف
        • معلومات الشركة: اسم الشركة، النشاط التجاري، الموقع الإلكتروني
        • بيانات الاستخدام: كيفية تفاعلك مع المنصة والمميزات المستخدمة
        • المعلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل
        • ملفات تعريف الارتباط: لتحسين تجربة الاستخدام وتذكر تفضيلاتك
      `
    },
    {
      title: "2. كيف نستخدم معلوماتك",
      icon: Settings,
      content: `
        نستخدم معلوماتك للأغراض التالية:
        
        • تقديم خدمات التحليل الذكي والتسويق
        • تخصيص تجربتك وتحسين المنصة
        • التواصل معك بخصوص حسابك والخدمات
        • إرسال تحديثات مهمة وعروض ذات صلة
        • ضمان الأمان ومنع الاحتيال
        • الامتثال للمتطلبات القانونية
      `
    },
    {
      title: "3. مشاركة المعلومات",
      icon: Users,
      content: `
        لا نبيع أو نؤجر معلوماتك الشخصية. قد نشارك معلومات محدودة مع:
        
        • مقدمي الخدمات الموثوقين (مثل خدمات الدفع والاستضافة)
        • السلطات القانونية عند الطلب الرسمي
        • في حالة دمج أو استحواذ (مع إشعارك مسبقاً)
        
        جميع الأطراف الثالثة ملزمة بحماية معلوماتك وفقاً لمعاييرنا العالية.
      `
    },
    {
      title: "4. أمان البيانات",
      icon: Shield,
      content: `
        نطبق إجراءات أمنية صارمة:
        
        • تشفير SSL/TLS لجميع عمليات نقل البيانات
        • تشفير البيانات المخزنة على خوادمنا
        • مراقبة مستمرة للأنشطة المشبوهة
        • نسخ احتياطية منتظمة ومؤمنة
        • تدريب فريق العمل على أفضل ممارسات الأمان
        • اختبارات أمنية دورية من قبل خبراء خارجيين
      `
    },
    {
      title: "5. حقوقك في البيانات",
      icon: Lock,
      content: `
        تتمتع بالحقوق التالية:
        
        • الوصول: طلب نسخة من بياناتك الشخصية
        • التصحيح: تحديث أو تصحيح معلوماتك
        • الحذف: طلب حذف بياناتك (الحق في النسيان)
        • التقييد: تقييد معالجة بياناتك
        • النقل: الحصول على بياناتك بصيغة قابلة للنقل
        • الاعتراض: الاعتراض على استخدام بياناتك لأغراض معينة
      `
    },
    {
      title: "6. الاحتفاظ بالبيانات",
      icon: Database,
      content: `
        نحتفظ بمعلوماتك طالما كان:
        
        • حسابك نشطاً أو تستخدم خدماتنا
        • مطلوباً لأغراض تجارية مشروعة
        • مطلوباً بموجب القانون
        
        عند حذف الحساب، نحذف بياناتك خلال 30 يوماً، باستثناء ما هو مطلوب قانونياً.
      `
    },
    {
      title: "7. ملفات تعريف الارتباط",
      icon: Settings,
      content: `
        نستخدم أنواع مختلفة من ملفات تعريف الارتباط:
        
        • ضرورية: لعمل المنصة الأساسي
        • وظيفية: لتذكر تفضيلاتك
        • تحليلية: لفهم كيفية استخدام المنصة
        • تسويقية: لعرض محتوى مخصص
        
        يمكنك إدارة تفضيلات ملفات تعريف الارتباط في إعدادات المتصفح.
      `
    },
    {
      title: "8. تحديثات السياسة",
      icon: Settings,
      content: `
        قد نحدث هذه السياسة من وقت لآخر:
        
        • سنشعرك بأي تغييرات جوهرية
        • ستجد دائماً أحدث نسخة على موقعنا
        • التاريخ في أعلى الصفحة يوضح آخر تحديث
        • استمرار الاستخدام يعني قبول التحديثات
      `
    }
  ];

  return (
    <PageLayout
      title="سياسة الخصوصية"
      description="كيف نحمي خصوصيتك ونتعامل مع بياناتك في منصة Morvo"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "سياسة الخصوصية" }
      ]}
    >
      <div className="container mx-auto px-6">
        {/* Privacy Principles */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
              آخر تحديث: 25 مايو 2024
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              التزامنا بخصوصيتك
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              في Morvo، نؤمن بأن خصوصيتك حق أساسي. هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {privacyPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{principle.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="mb-16">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-blue-900 text-right">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 leading-relaxed text-right whitespace-pre-line">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact and Rights */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-center">اتصل بمسؤول حماية البيانات</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                لأي أسئلة حول خصوصيتك أو لممارسة حقوقك في البيانات
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>البريد الإلكتروني:</strong> privacy@morvo.com</p>
                <p><strong>الهاتف:</strong> +966 11 234 5678</p>
                <p><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl text-center text-green-800">ممارسة حقوقك</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-green-700">
                يمكنك ممارسة حقوقك في البيانات في أي وقت
              </p>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  طلب نسخة من بياناتي
                </button>
                <button className="w-full border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-50 transition-colors">
                  حذف بياناتي
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Info */}
        <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            أسئلة حول خصوصيتك؟
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            فريق حماية البيانات متاح للإجابة على أي استفسارات حول خصوصيتك وحقوقك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              تواصل معنا
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              الشروط والأحكام
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Privacy;
