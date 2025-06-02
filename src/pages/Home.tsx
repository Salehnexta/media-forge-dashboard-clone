
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
              مورفو الذكاء الاصطناعي
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> الخارق</span>
              <br />
              <span className="text-4xl md:text-5xl">يتولى عمل فريق تسويق كامل</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              ذكاء اصطناعي متفرد يعمل بقوة فريق تسويق متكامل. مورفو يجمع خبرات إنشاء المحتوى وإدارة الحملات والتحليل في نظام واحد قوي يتفوق على جميع الحلول التقليدية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4"
              >
                اطلق قوة مورفو الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
              >
                شاهد مورفو في العمل
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>ذكاء اصطناعي يعمل 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>يحل محل فريق تسويق كامل</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>متخصص في السوق العربي</span>
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
              مورفو يتولى جميع مهام التسويق بذكاء خارق
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ذكاء اصطناعي متفرد يجمع قدرات إنشاء المحتوى وإدارة الحملات والتحليل في نظام واحد قوي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">إبداع المحتوى</h3>
              <p className="text-gray-600 text-center mb-4">
                مورفو ينشئ محتوى عربي أصيل ومتنوع بذكاء خارق يفهم ثقافة السوق المحلي
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">إدارة الحملات</h3>
              <p className="text-gray-600 text-center mb-4">
                مورفو يخطط وينفذ ويحسن الحملات التسويقية بأتمتة كاملة وذكاء متقدم
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">التحليل الذكي</h3>
              <p className="text-gray-600 text-center mb-4">
                مورفو يحلل البيانات ويقدم رؤى عميقة وتوصيات قوية لتحسين الأداء
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">التحسين المستمر</h3>
              <p className="text-gray-600 text-center mb-4">
                مورفو يتعلم من كل حملة ويحسن الأداء باستمرار لتحقيق أفضل النتائج
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
              مورفو يحل محل فريق تسويق كامل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ذكاء اصطناعي واحد يجمع خبرات متعددة ويعمل بكفاءة تفوق أي فريق تسويق تقليدي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">استراتيجي ماهر</h3>
              <p className="text-gray-600 text-center">
                مورفو يضع الاستراتيجيات الشاملة ويحدد الأولويات بذكاء استراتيجي متقدم
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">منفذ خبير</h3>
              <p className="text-gray-600 text-center">
                مورفو ينفذ الحملات بدقة عالية وسرعة فائقة مع مراقبة مستمرة للنتائج
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">مبدع متفوق</h3>
              <p className="text-gray-600 text-center">
                مورفو يبتكر محتوى إبداعي فريد يجذب الجمهور ويحقق أهدافك التسويقية
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">محلل بيانات</h3>
              <p className="text-gray-600 text-center">
                مورفو يحلل البيانات بعمق ويقدم توصيات ذكية قائمة على أدلة قوية
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
              قدرات مورفو الخارقة في التسويق
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
                  <h3 className="text-2xl font-bold text-gray-900">قدرات إنشاء المحتوى</h3>
                  <p className="text-gray-600">مورفو الذكاء الاصطناعي الخارق</p>
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
                  <h3 className="text-2xl font-bold text-gray-900">قدرات إدارة الحملات</h3>
                  <p className="text-gray-600">مورفو الذكاء الاصطناعي الخارق</p>
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
              نجاحات مورفو تفوقت على المنافسين
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
                "بعد تجربة العديد من الأنظمة العالمية، وجدنا أن مورفو هو الذكاء الاصطناعي الوحيد الذي يفهم حقاً السوق السعودي."
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
                "مورفو تمكن من تخفيض تكلفة الاستحواذ على العملاء مع زيادة جودة العملاء المستهدفين مقارنة بجميع الأنظمة المنافسة."
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
            اطلق قوة مورفو الخارقة اليوم
          </h2>
          <p className="text-xl mb-8 opacity-90">
            اكتشف كيف يمكن لمورفو الذكاء الاصطناعي الخارق أن يحل محل فريق تسويق كامل ويحقق نتائج تفوق توقعاتك
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Brain className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold mb-2">تحليل مجاني للمنافسين</h3>
              <p className="text-sm opacity-90">مورفو يحلل منافسيك ويضع خطة للتفوق عليهم</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Clock className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold mb-2">خطة محتوى لـ 3 أشهر</h3>
              <p className="text-sm opacity-90">عند اشتراكك في الباقة السنوية</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold mb-2">ضمان التفوق</h3>
              <p className="text-sm opacity-90">مورفو يضمن نتائج أفضل من أي منصة منافسة</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              اطلق قوة مورفو الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              شاهد مورفو في العمل
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-75">
            مورفو - الذكاء الاصطناعي الخارق الأكثر تقدمًا في المملكة العربية السعودية
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
