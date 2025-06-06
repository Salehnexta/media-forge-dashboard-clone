
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Zap, BarChart3, MessageSquare, Users, 
  Target, Shield, ArrowLeft, Star, CheckCircle, TrendingUp,
  Rocket, Brain, Globe, Clock, Award, Lightbulb, Crown,
  DollarSign, Calendar, Gauge, Link, Database, Settings
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
              <img src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" alt="Morvo Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Morvo</h1>
              <p className="text-xs text-gray-500">الذكاء الاصطناعي يقود نموك التسويقي</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">المميزات</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">كيف يعمل</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">الأسعار</a>
            <a href="#integrations" className="text-gray-600 hover:text-blue-600 transition-colors">التكاملات</a>
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
              جرِّب مجانًا الآن
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Saudi Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="text-lg">🇸🇦</span>
              تطوير سعودي 100٪ معتمد على أحدث تقنيات الذكاء الاصطناعي
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Morvo – الذكاء الاصطناعي
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> يقود نموك </span>
              التسويقي
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              منصة واحدة تُخطِّط، تُنفِّذ، وتُحلِّل، لتجعل التسويق يعمل بكفاءة ذاتية بينما تركز أنت على الابتكار والتوسّع.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4"
              >
                جرِّب مجانًا الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
              >
                احجز استشارة سريعة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Morvo Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا Morvo؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              الحل الوحيد الذي يجمع التخطيط والتنفيذ والتحليل في نظام ذكي واحد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">أتمتة شاملة</h3>
              <p className="text-gray-600 text-center mb-4">
                تخطيط ↔ تنفيذ ↔ تحليلات في نظام واحد
              </p>
              <p className="text-sm text-blue-600 text-center font-medium">
                وفّر الوقت والموارد، وحافظ على الاتساق
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">ذكاء متكيف</h3>
              <p className="text-gray-600 text-center mb-4">
                مبني على CrewAI + MCP + A2A
              </p>
              <p className="text-sm text-purple-600 text-center font-medium">
                أداء يتحسن ذاتيًا أسبوعًا بعد أسبوع
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تكلفة مُخفَّضة</h3>
              <p className="text-gray-600 text-center mb-4">
                أقل من 3٪ من تكلفة فريق داخلي
              </p>
              <p className="text-sm text-green-600 text-center font-medium">
                استثمر الوفورات في الابتكار والنمو
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">جاهزية عالمية</h3>
              <p className="text-gray-600 text-center mb-4">
                يدعم العربية والإنجليزية و20 تكاملاً جاهزًا
              </p>
              <p className="text-sm text-orange-600 text-center font-medium">
                توسع إقليميًا وعالميًا دون قيود
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              كيف تعمل المنصة؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              أربع خطوات بسيطة للوصول إلى التسويق الذكي المؤتمت بالكامل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Link className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. ربط سريع</h3>
              <p className="text-gray-600">
                وصِّل حساباتك ومصادر بياناتك خلال أقل من 5 دقائق
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. تحديد الأهداف</h3>
              <p className="text-gray-600">
                اختر مؤشرات الأداء الرئيسية (KPIs) والأولويات
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. تشغيل تلقائي</h3>
              <p className="text-gray-600">
                Morvo ينشئ المحتوى، يطلق الحملات، ويتعلّم من النتائج
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">4. تحليل وتحسين</h3>
              <p className="text-gray-600">
                تقارير لحظية وتوصيات فورية لزيادة العائد
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              التقنيات التي تقود Morvo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مبني على أحدث معايير الذكاء الاصطناعي والأتمتة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">A2A – Agent-to-Agent Protocol</h3>
              <p className="text-blue-800 mb-4">
                معيار مفتوح يتيح للـ Agents التخاطب والتنسيق فيما بينهم عبر أي بنية تحتية
              </p>
              <p className="text-sm text-blue-700 font-medium">
                يضمن تعاون Morvo مع Bots وRPA وعملاء ذكاء آخرين بدون أكواد تكامل خاصة
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">MCP – Model Context Protocol</h3>
              <p className="text-green-800 mb-4">
                قناة ثنائية آمنة بين مصادر بياناتك وأي نموذج ذكاء اصطناعي
              </p>
              <p className="text-sm text-green-700 font-medium">
                يُنهي عزلة البيانات ويُسرّع التحسين اللحظي
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">CrewAI Framework</h3>
              <p className="text-purple-800 mb-4">
                إطار مفتوح وخفيف لتنسيق فرق Agents عالية الأداء
              </p>
              <p className="text-sm text-purple-700 font-medium">
                يمكّن Morvo من تشغيل "أطقم" متخصصة (إعلانات، محتوى، تحليلات) حول أهدافك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              الباقات والأسعار
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اختر الباقة المناسبة لحجم عملك وطموحاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Trial */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">تجربة مجانية</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">0 ر.س</div>
                <div className="text-gray-600">50 توكن شهرياً</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">إنشاء وإدارة حملات حتى 50 توكن</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">تكامل مع 3 قنوات إعلانية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">لوحة تحكم أساسية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">دعم عبر البريد الإلكتروني</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">ابدأ التجربة المجانية</Button>
              <p className="text-center text-sm text-gray-500 mt-3">مناسب للتجربة الأولية</p>
            </div>

            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">599 ر.س</div>
                <div className="text-gray-600">10,000 توكن شهرياً</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">تكامل مع 10 منصات</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">2 مستخدمين</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">تقارير أسبوعية PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">دعم محادثة مباشر</span>
                </li>
              </ul>
              <Button className="w-full">اختر Starter</Button>
              <p className="text-center text-sm text-gray-500 mt-3">متاجر ناشئة وشركات صغيرة</p>
            </div>

            {/* Growth - Most Popular */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">الأكثر شعبية</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">999 ر.س</div>
                <div className="text-gray-600">30,000 توكن شهرياً</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">جميع المنصات الـ20 جاهزة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">5 مستخدمين</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">توصيات تحسين فورية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">تقارير يومية وتنبؤ بالاتجاهات</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">اختر Growth</Button>
              <p className="text-center text-sm text-gray-500 mt-3">شركات متوسطة وتنمو بسرعة</p>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">تواصل معنا</div>
                <div className="text-gray-600">توكن غير محدود</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">تكامل مخصّص عبر MCP وA2A</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">مستخدمون غير محدودين</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">مدير حساب مخصص</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700 text-sm">اتفاقية مستوى خدمة (SLA)</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">تواصل معنا</Button>
              <p className="text-center text-sm text-gray-500 mt-3">الشركات الكبرى والمجموعات</p>
            </div>
          </div>

          {/* Annual Discount Note */}
          <div className="text-center mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">خصم 10٪ عند الدفع السنوي مقدماً</h4>
            <p className="text-blue-800">
              Starter: 6,469 ر.س سنوياً • Growth: 10,789 ر.س سنوياً
            </p>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              المقارنة المالية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              وفّر أكثر من 90٪ من تكلفة الحلول التقليدية
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right font-semibold">الخيار</th>
                  <th className="px-6 py-4 text-center font-semibold">التكلفة الشهرية</th>
                  <th className="px-6 py-4 text-center font-semibold">ماذا يشمل</th>
                  <th className="px-6 py-4 text-center font-semibold">التوفير مقابل Morvo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 font-bold text-blue-900">Morvo – Growth</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">999 ر.س</td>
                  <td className="px-6 py-4 text-center text-blue-800">تخطيط ↔ تنفيذ ↔ تحليلات مؤتمتة بالكامل</td>
                  <td className="px-6 py-4 text-center text-blue-600 font-bold">—</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">أدوات SaaS مجمعة</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">5,584 ر.س</td>
                  <td className="px-6 py-4 text-center text-gray-600">SEO، CRM، سوشيال – يحتاج ربط وصيانة</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">↓ 82٪</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">وكالة تسويق عالمية</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">13,125 ر.س</td>
                  <td className="px-6 py-4 text-center text-gray-600">خدمات كاملة مع تقارير</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">↓ 92٪</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">وكالة سعودية متوسطة</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">15,000 - 60,000 ر.س</td>
                  <td className="px-6 py-4 text-center text-gray-600">خبرة محلية وحضور ميداني</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">{"↓ >93٪"}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">فريق داخلي (5 وظائف)</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">46,500+ ر.س</td>
                  <td className="px-6 py-4 text-center text-gray-600">رواتب + مزايا</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">↓ 98٪</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 font-medium">
              <strong>النتيجة:</strong> Morvo يقدم نطاق عمل وكالة متكاملة ومرونة SaaS عالمية بتكلفة تقل عن تكلفة فاتورة قهوة الموظفين شهريًا.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              تكامل فوري مع أهم 20 منصة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              جميعها قابلة للربط عبر OAuth خلال دقائق بفضل بروتوكولي A2A و MCP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Ads & Social */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">إعلانات & سوشيال</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>1. Google Ads</li>
                <li>2. Meta Ads</li>
                <li>3. X/Twitter</li>
                <li>4. LinkedIn Ads</li>
                <li>5. TikTok Ads</li>
              </ul>
            </div>

            {/* E-commerce & Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">متاجر & دفع</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>6. Shopify</li>
                <li>7. WooCommerce</li>
                <li>8. BigCommerce</li>
                <li>9. Stripe</li>
                <li>10. PayPal</li>
              </ul>
            </div>

            {/* Analytics & SEO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">تحليلات & SEO</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>11. Google Analytics 4</li>
                <li>12. SEMrush</li>
                <li>13. Ahrefs</li>
                <li>14. Mention</li>
                <li>15. Brandwatch</li>
              </ul>
            </div>

            {/* Automation & Data */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">أتمتة & بيانات</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>16. Zapier</li>
                <li>17. Supabase</li>
                <li>18. Slack</li>
                <li>19. Mailchimp</li>
                <li>20. HubSpot</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Morvo Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              قصة Morvo باختصار
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2023: ولادة الفكرة</h3>
              <p className="text-gray-600">
                في الرياض – حلم أتمتة التسويق بالكامل
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2024: بناء النواة</h3>
              <p className="text-gray-600">
                باستخدام CrewAI + MCP وتبني بروتوكول A2A
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2025: الإطلاق العالمي</h3>
              <p className="text-gray-600">
                إطلاق Morvo كأول منصة تسويق تعمل 24/7 بالذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            انضم إلى الثورة التسويقية السعودية الآن!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            كن جزءاً من المستقبل واطلق قوة الذكاء الاصطناعي في تسويقك اليوم
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              ابدأ تجربتك المجانية
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              احجز استشارة مع خبرائنا
            </Button>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
            <span className="text-lg">🇸🇦</span>
            تطوير سعودي 100٪ معتمد على أحدث تقنيات الذكاء الاصطناعي
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
