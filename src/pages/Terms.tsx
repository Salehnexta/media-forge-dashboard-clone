
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Terms = () => {
  const sections = [
    {
      title: "1. تعريف المصطلحات",
      content: `
        في هذه الشروط والأحكام:
        • "المنصة" تعني منصة Morvo للتسويق الذكي
        • "المستخدم" يعني أي شخص يستخدم المنصة
        • "الخدمات" تعني جميع الخدمات المقدمة عبر المنصة
        • "المحتوى" يعني أي نص أو صور أو بيانات أو معلومات أخرى
      `
    },
    {
      title: "2. قبول الشروط",
      content: `
        باستخدام منصة Morvo، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
        إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
        
        نحتفظ بحق تعديل هذه الشروط في أي وقت، وسيتم إشعارك بأي تغييرات مهمة.
      `
    },
    {
      title: "3. استخدام المنصة",
      content: `
        يحق لك استخدام المنصة للأغراض التجارية المشروعة فقط. يُمنع استخدام المنصة لـ:
        • أي أنشطة غير قانونية أو احتيالية
        • انتهاك حقوق الملكية الفكرية
        • نشر محتوى مسيء أو ضار
        • محاولة اختراق أو إتلاف النظام
      `
    },
    {
      title: "4. الحسابات والاشتراكات",
      content: `
        • يجب تقديم معلومات دقيقة وحديثة عند إنشاء حساب
        • أنت مسؤول عن الحفاظ على سرية معلومات حسابك
        • يتم تحديد رسوم الاشتراك وفقاً للباقة المختارة
        • يمكن إلغاء الاشتراك في أي وقت مع سياسة استرداد واضحة
      `
    },
    {
      title: "5. الملكية الفكرية",
      content: `
        • جميع حقوق الملكية الفكرية للمنصة محفوظة لشركة Morvo
        • المحتوى الذي تقوم بإنشاؤه يبقى ملكك
        • نحصل على ترخيص لاستخدام المحتوى لتحسين خدماتنا
        • يُمنع نسخ أو توزيع المنصة دون إذن
      `
    },
    {
      title: "6. الخصوصية وحماية البيانات",
      content: `
        • نلتزم بحماية خصوصيتك وفقاً لسياسة الخصوصية
        • نستخدم بياناتك لتحسين الخدمات المقدمة
        • لا نشارك بياناتك مع أطراف ثالثة دون موافقتك
        • يمكنك طلب حذف بياناتك في أي وقت
      `
    },
    {
      title: "7. المسؤولية وإخلاء المسؤولية",
      content: `
        • نسعى لتقديم خدمة موثوقة لكن لا نضمن عدم انقطاع الخدمة
        • لا نتحمل مسؤولية أي أضرار غير مباشرة
        • استخدام المنصة على مسؤوليتك الشخصية
        • نحتفظ بحق تعليق أو إنهاء الحسابات التي تنتهك الشروط
      `
    },
    {
      title: "8. الدفع والاسترداد",
      content: `
        • جميع الرسوم مستحقة الدفع مقدماً
        • نقبل طرق الدفع المختلفة المعلنة على المنصة
        • يمكن طلب استرداد خلال 14 يوم من الاشتراك
        • قد تطبق رسوم إضافية على بعض الخدمات المتقدمة
      `
    },
    {
      title: "9. القانون المطبق",
      content: `
        • تخضع هذه الشروط لقوانين المملكة العربية السعودية
        • أي نزاع يتم حله وفقاً للقوانين المحلية
        • تختص المحاكم السعودية بالنظر في أي نزاعات
        • نسعى لحل النزاعات بطريقة ودية قبل اللجوء للقضاء
      `
    },
    {
      title: "10. التواصل والإشعارات",
      content: `
        • سيتم إرسال الإشعارات المهمة عبر البريد الإلكتروني المسجل
        • يمكنك تحديث معلومات التواصل في إعدادات الحساب
        • للاستفسارات، يرجى التواصل عبر support@morvo.com
        • نلتزم بالرد على الاستفسارات خلال 24 ساعة
      `
    }
  ];

  return (
    <PageLayout
      title="الشروط والأحكام"
      description="اقرأ شروط وأحكام استخدام منصة Morvo للتسويق الذكي"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الشروط والأحكام" }
      ]}
    >
      <div className="container mx-auto px-6">
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
              آخر تحديث: 25 مايو 2024
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              شروط استخدام منصة Morvo
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة Morvo. 
              استخدامك للمنصة يعني موافقتك على هذه الشروط.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900 text-right">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 leading-relaxed text-right whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            أسئلة حول الشروط والأحكام؟
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            إذا كان لديك أي استفسارات حول هذه الشروط والأحكام، لا تتردد في التواصل معنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              تواصل معنا
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              سياسة الخصوصية
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Terms;
