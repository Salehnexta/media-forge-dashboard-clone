
import { PageLayout } from "@/components/layout/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqCategories = [
    {
      title: "الأسئلة العامة",
      questions: [
        {
          question: "ما هي منصة Morvo؟",
          answer: "Morvo هي منصة تسويق ذكية تستخدم الذكاء الاصطناعي لتحليل الشركات والأسواق والمنافسين، وتقدم استراتيجيات تسويقية مخصصة لمساعدة الشركات على النمو وتحقيق أهدافها التسويقية."
        },
        {
          question: "كيف يعمل التحليل الذكي؟",
          answer: "يستخدم التحليل الذكي تقنيات GPT-4 و Perplexity AI لتحليل موقعك ونشاطك التجاري، دراسة المنافسين في السوق، وتحديد الفرص والتحديات، ثم ينتج استراتيجية تسويقية شاملة مع خطة تنفيذ واضحة."
        },
        {
          question: "هل يمكنني استخدام المنصة مجاناً؟",
          answer: "نعم، نوفر باقة مجانية تتيح لك إجراء 3 تحليلات شهرياً مع تقارير أساسية. كما يمكنك الترقية للباقات المدفوعة للحصول على مميزات إضافية وتحليلات غير محدودة."
        }
      ]
    },
    {
      title: "الحساب والاشتراك",
      questions: [
        {
          question: "كيف أنشئ حساباً جديداً؟",
          answer: "يمكنك إنشاء حساب جديد من خلال النقر على 'إنشاء حساب' في الصفحة الرئيسية، ثم ملء البيانات المطلوبة. ستحصل على رسالة تأكيد عبر البريد الإلكتروني لتفعيل حسابك."
        },
        {
          question: "كيف يمكنني تغيير خطة اشتراكي؟",
          answer: "يمكنك تغيير خطة اشتراكك في أي وقت من خلال الذهاب إلى إعدادات الحساب ثم قسم 'الاشتراك'. ستطبق التغييرات فوراً وسيتم حساب الفرق في الدورة القادمة."
        },
        {
          question: "ما هي طرق الدفع المتاحة؟",
          answer: "نقبل جميع البطاقات الائتمانية الرئيسية (Visa, MasterCard, American Express) بالإضافة إلى Apple Pay و Google Pay. جميع المعاملات مؤمنة ومشفرة."
        }
      ]
    },
    {
      title: "الاستخدام والمميزات",
      questions: [
        {
          question: "كم من الوقت يستغرق التحليل؟",
          answer: "عادة ما يستغرق التحليل الكامل بين 5-10 دقائق حسب حجم وتعقيد نشاطك التجاري. ستحصل على تحديثات مباشرة أثناء عملية التحليل."
        },
        {
          question: "هل يمكنني تصدير التقارير؟",
          answer: "نعم، يمكنك تصدير جميع التقارير بصيغ PDF, Excel, أو PowerPoint. كما يمكنك مشاركة التقارير مباشرة مع فريق عملك أو عملائك."
        },
        {
          question: "هل تدعم المنصة اللغة العربية بالكامل؟",
          answer: "نعم، منصة Morvo مصممة خصيصاً للسوق العربي وتدعم اللغة العربية بالكامل مع تخطيط RTL وتحليل محتوى عربي متقدم."
        }
      ]
    },
    {
      title: "الأمان والخصوصية",
      questions: [
        {
          question: "كيف تحمون بياناتي؟",
          answer: "نستخدم أعلى معايير الأمان مع تشفير SSL 256-bit وتخزين البيانات في خوادم آمنة. لا نشارك بياناتك مع أي طرف ثالث ونلتزم بقوانين حماية البيانات الدولية."
        },
        {
          question: "هل يمكنني حذف بياناتي؟",
          answer: "نعم، يمكنك حذف حسابك وجميع بياناتك في أي وقت من خلال إعدادات الحساب. سيتم حذف جميع البيانات نهائياً خلال 30 يوماً من طلب الحذف."
        }
      ]
    }
  ];

  return (
    <PageLayout
      title="الأسئلة الشائعة"
      description="إجابات شاملة على الأسئلة الأكثر شيوعاً حول منصة Morvo"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الأسئلة الشائعة" }
      ]}
    >
      <div className="container mx-auto px-6">
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
              إجابات سريعة ومفيدة
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              الأسئلة الأكثر شيوعاً
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تجد هنا إجابات على معظم الأسئلة التي قد تخطر ببالك حول استخدام منصة Morvo
            </p>
          </div>

          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {category.title}
              </h3>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border border-gray-200 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-right hover:no-underline">
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-right text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </section>

        {/* Contact Support */}
        <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            لم تجد إجابة لسؤالك؟
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            فريق الدعم الخاص بنا متاح على مدار الساعة للإجابة على أي استفسارات إضافية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/support">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                تواصل مع الدعم
              </button>
            </Link>
            <Link to="/help-center">
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                مركز المساعدة
              </button>
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQ;
