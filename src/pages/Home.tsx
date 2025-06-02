
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Zap, BarChart3, MessageSquare, Users, 
  Target, Shield, ArrowLeft, Star, CheckCircle, TrendingUp,
  Rocket, Brain, Globe, Clock, Award, Lightbulb
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

const Home = () => {
  const navigate = useNavigate();

  const Header = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">منصة Morvo</h1>
              <p className="text-xs text-gray-500">المنصة الذكية لإنشاء المحتوى وإدارة الحملات</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">المميزات</a>
            <a href="#comparison" className="text-gray-600 hover:text-blue-600 transition-colors">مقارنة</a>
            <a href="#capabilities" className="text-gray-600 hover:text-blue-600 transition-colors">القدرات</a>
            <a href="#success" className="text-gray-600 hover:text-blue-600 transition-colors">النجاحات</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              تسجيل الدخول
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              ابدأ مجاناً
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              منصة مورفو الذكية
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> لإنشاء المحتوى</span>
              <br />
              <span className="text-4xl md:text-5xl">وإدارة الحملات التسويقية</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              تفوق على منافسيك مع أدوات تسويقية متقدمة مدعومة بالذكاء الاصطناعي. نظام متكامل يتفوق على الحلول التقليدية في السوق السعودي والخليجي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4"
              >
                احصل على تحليل مجاني للمنافسين
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
              >
                احجز عرض توضيحي شخصي
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>خطة محتوى 3 أشهر مجاناً</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>ضمان التفوق على المنافسين</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>دعم محلي باللغة العربية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              إنشاء محتوى متميز بسرعة غير مسبوقة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              محتوى عربي أصيل ومتنوع يحافظ على هوية علامتك التجارية عبر جميع المنصات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">محتوى عربي أصيل</h3>
              <p className="text-gray-600 text-center mb-4">
                إنشاء محتوى باللغة العربية الفصحى أو اللهجات المحلية بما يناسب جمهورك
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تنوع المحتوى</h3>
              <p className="text-gray-600 text-center mb-4">
                منشورات مواقع التواصل، مقالات المدونة، نصوص إعلانية، وصف المنتجات
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">اتساق العلامة التجارية</h3>
              <p className="text-gray-600 text-center mb-4">
                المحافظة على صوت وأسلوب علامتك التجارية في جميع المحتويات
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تخصيص حسب المنصات</h3>
              <p className="text-gray-600 text-center mb-4">
                محتوى مخصص لكل منصة بالمقاسات والصيغ المناسبة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Management Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              إدارة الحملات التسويقية بكفاءة عالية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              أتمتة كاملة وتحسين مستمر لتحقيق أفضل النتائج من استثماراتك التسويقية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">أتمتة كاملة</h3>
              <p className="text-gray-600 text-center">
                تخطيط وتنفيذ ومتابعة الحملات عبر جميع المنصات من لوحة تحكم واحدة
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">جدولة ذكية</h3>
              <p className="text-gray-600 text-center">
                جدولة المحتوى في أوقات التفاعل المثالية المبنية على تحليل جمهورك
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تحسين مستمر</h3>
              <p className="text-gray-600 text-center">
                تحسين تلقائي للحملات بناءً على الأداء والنتائج بتقنيات الذكاء الاصطناعي
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">اختبارات A/B متقدمة</h3>
              <p className="text-gray-600 text-center">
                تجربة متغيرات مختلفة للإعلانات والمحتوى لتحقيق أفضل النتائج
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا مورفو تتفوق على الأنظمة الأخرى؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مقارنة شاملة توضح تفوق منصة مورفو على المنافسين في السوق
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right font-semibold">الميزة</th>
                  <th className="px-6 py-4 text-center font-semibold">منصة مورفو</th>
                  <th className="px-6 py-4 text-center font-semibold">المنافسون التقليديون</th>
                  <th className="px-6 py-4 text-center font-semibold">منصات عالمية أخرى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">إنشاء محتوى عربي</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      محتوى عربي أصيل مخصص
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-600">❌ محتوى مترجم متوسط الجودة</td>
                  <td className="px-6 py-4 text-center text-yellow-600">⚠️ محتوى عام غير مخصص</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">فهم الثقافة المحلية</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      مصمم للسوق السعودي
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-600">❌ توجه عام غير مخصص</td>
                  <td className="px-6 py-4 text-center text-red-600">❌ يفتقر للفهم المحلي</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">العائد على الاستثمار</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      تحسين 40-60%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-yellow-600">⚠️ تحسين 10-20%</td>
                  <td className="px-6 py-4 text-center text-yellow-600">⚠️ تحسين 20-30%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">الدعم الفني</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      دعم محلي عربي/إنجليزي
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-yellow-600">⚠️ دعم محدود</td>
                  <td className="px-6 py-4 text-center text-red-600">❌ إنجليزي فقط</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              قدرات فريدة في مجال إنشاء المحتوى وإدارة الحملات
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Content Creation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">نورة (M4)</h3>
                  <p className="text-gray-600">خبيرة استراتيجية المحتوى</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">إنشاء خطط محتوى متكاملة لمدة 3-6 شهور قادمة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">تحليل اتجاهات المحتوى في السوق المحلي والإقليمي</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">تحسين SEO تلقائي بالكلمات المفتاحية المناسبة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">توليد أفكار محتوى مبتكرة بناءً على تحليل الجمهور</span>
                </li>
              </ul>
            </div>

            {/* Campaign Management */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">محمد (M3)</h3>
                  <p className="text-gray-600">خبير تحسين الحملات</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">توزيع تلقائي للميزانية بناءً على أداء كل منصة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">تحليل المنافسين وتقديم توصيات للتفوق عليهم</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">تقارير أداء متطورة وقياس دقيق للـ ROI</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">تحليل تكلفة الاستحواذ على العملاء (CAC)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              نجاحات تفوقت على المنافسين
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-green-800 font-semibold">شركة رائدة في قطاع التجزئة</div>
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                "بعد تجربة العديد من الأنظمة العالمية، وجدنا أن مورفو هي المنصة الوحيدة التي تفهم حقاً السوق السعودي."
              </blockquote>
              <div className="text-3xl font-bold text-green-600 mb-2">+78%</div>
              <div className="text-gray-600">زيادة في معدلات التفاعل خلال الشهر الأول</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-blue-800 font-semibold">عميل من القطاع المالي</div>
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                "قمنا بتخفيض تكلفة الاستحواذ على العملاء مع زيادة جودة العملاء المستهدفين مقارنة بالأنظمة المنافسة."
              </blockquote>
              <div className="text-3xl font-bold text-blue-600 mb-2">-45%</div>
              <div className="text-gray-600">تخفيض في تكلفة الاستحواذ على العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            استعد للتفوق على منافسيك اليوم
          </h2>
          <p className="text-xl mb-8 opacity-90">
            اكتشف كيف يمكن لمنصة مورفو أن تساعدك في التفوق على منافسيك من خلال إنشاء محتوى متميز وإدارة حملات فعّالة
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Brain className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold mb-2">تحليل مجاني للمنافسين</h3>
              <p className="text-sm opacity-90">احصل على تحليل تفصيلي لمحتوى وحملات منافسيك</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Clock className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold mb-2">خطة محتوى لـ 3 أشهر</h3>
              <p className="text-sm opacity-90">عند اشتراكك في الباقة السنوية</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold mb-2">ضمان التفوق</h3>
              <p className="text-sm opacity-90">نضمن نتائج أفضل من أي منصة منافسة أو استرداد المبلغ</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              احجز عرض توضيحي شخصي الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              ابدأ التجربة المجانية
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-75">
            مورفو - المنصة التسويقية الأكثر تقدمًا في المملكة العربية السعودية
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
