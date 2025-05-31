
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Target, BarChart3, Users, MessageSquare, Calendar,
  Globe, Shield, Zap, Eye, TrendingUp, Search,
  Smartphone, Monitor, PieChart, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  const featureCategories = [
    {
      title: "تحليل الذكاء الاصطناعي",
      description: "قوة الذكاء الاصطناعي في خدمة استراتيجيتك التسويقية",
      features: [
        {
          icon: Brain,
          title: "تحليل الشركة الذكي",
          description: "تحليل شامل لنشاطك التجاري باستخدام GPT-4 و Perplexity AI لفهم نقاط القوة والضعف والفرص المتاحة",
          badge: "جديد"
        },
        {
          icon: Search,
          title: "تحليل المنافسين",
          description: "دراسة متعمقة للمنافسين في السوق مع تحليل استراتيجياتهم ونقاط تميزهم وثغراتهم",
          badge: "متقدم"
        },
        {
          icon: Target,
          title: "تحديد الجمهور المستهدف",
          description: "تحليل دقيق لجمهورك المثالي مع تحديد خصائصهم الديموغرافية وسلوكياتهم الشرائية",
          badge: "ذكي"
        },
        {
          icon: TrendingUp,
          title: "تحليل اتجاهات السوق",
          description: "مراقبة اتجاهات السوق الحالية والمستقبلية لاتخاذ قرارات تسويقية مدروسة",
          badge: "توقعات"
        }
      ]
    },
    {
      title: "إدارة الحملات التسويقية",
      description: "أدوات شاملة لتخطيط وتنفيذ ومراقبة حملاتك التسويقية",
      features: [
        {
          icon: Calendar,
          title: "تخطيط الحملات",
          description: "خطط حملاتك التسويقية مع جدولة المحتوى وتوزيع المهام على فريق العمل",
          badge: "منظم"
        },
        {
          icon: Globe,
          title: "إدارة المنصات الاجتماعية",
          description: "إدارة متكاملة لجميع منصات التواصل الاجتماعي من مكان واحد مع جدولة المنشورات",
          badge: "متعدد المنصات"
        },
        {
          icon: MessageSquare,
          title: "إنشاء المحتوى الذكي",
          description: "مساعد ذكي لإنشاء محتوى تسويقي جذاب ومتوافق مع هوية علامتك التجارية",
          badge: "إبداعي"
        },
        {
          icon: Users,
          title: "إدارة فريق التسويق",
          description: "أدوات تعاونية لفريق التسويق مع توزيع المهام ومتابعة الأداء والتقدم",
          badge: "تعاوني"
        }
      ]
    },
    {
      title: "التحليلات والتقارير",
      description: "رؤى عميقة وتقارير تفاعلية لقياس نجاح استراتيجيتك",
      features: [
        {
          icon: BarChart3,
          title: "لوحة معلومات تفاعلية",
          description: "لوحة تحكم شاملة تعرض جميع مؤشرات الأداء الرئيسية في مكان واحد",
          badge: "شامل"
        },
        {
          icon: PieChart,
          title: "تقارير مفصلة",
          description: "تقارير دقيقة عن أداء الحملات مع تحليل ROI وكفاءة كل قناة تسويقية",
          badge: "مفصل"
        },
        {
          icon: Eye,
          title: "مراقبة الأداء المباشر",
          description: "مراقبة فورية لأداء حملاتك مع تنبيهات ذكية عند الحاجة لتعديلات",
          badge: "فوري"
        },
        {
          icon: TrendingUp,
          title: "تحليل الاتجاهات",
          description: "تحليل اتجاهات الأداء على المدى الطويل مع توقعات مستقبلية",
          badge: "تنبؤي"
        }
      ]
    },
    {
      title: "الأمان والموثوقية",
      description: "حماية متقدمة وموثوقية عالية لبياناتك التسويقية",
      features: [
        {
          icon: Shield,
          title: "تشفير البيانات",
          description: "حماية شاملة لبياناتك مع تشفير متقدم وامتثال للمعايير الدولية للأمان",
          badge: "آمن"
        },
        {
          icon: Zap,
          title: "أداء سريع",
          description: "معالجة سريعة للبيانات مع استجابة فورية وتحميل سريع للتقارير",
          badge: "سريع"
        },
        {
          icon: Monitor,
          title: "دعم متعدد الأجهزة",
          description: "تصميم متجاوب يعمل بسلاسة على جميع الأجهزة من الهاتف إلى سطح المكتب",
          badge: "متجاوب"
        },
        {
          icon: Smartphone,
          title: "تطبيق الهاتف المحمول",
          description: "تطبيق مخصص للهواتف الذكية لمتابعة حملاتك وإدارة أعمالك أثناء التنقل",
          badge: "قريباً"
        }
      ]
    }
  ];

  return (
    <PageLayout
      title="مميزات منصة Morvo"
      description="اكتشف جميع المميزات والأدوات التي تجعل من Morvo الخيار الأمثل لاحتياجاتك التسويقية"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "المميزات" }
      ]}
      actionButton={{
        label: "ابدأ استخدام المميزات",
        href: "/auth",
        variant: "default"
      }}
    >
      <div className="container mx-auto px-6">
        {/* Overview Section */}
        <section className="mb-16 text-center">
          <Badge variant="secondary" className="text-blue-600 bg-blue-50 mb-6">
            مميزات شاملة ومتقدمة
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            كل ما تحتاجه للنجاح في التسويق الرقمي
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            منصة Morvo تجمع بين قوة الذكاء الاصطناعي والأدوات التسويقية المتقدمة 
            لتوفر لك تجربة متكاملة تساعدك على تحقيق أهدافك بكفاءة وذكاء
          </p>
        </section>

        {/* Features Categories */}
        {featureCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {category.title}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {category.features.map((feature, featureIndex) => {
                const Icon = feature.icon;
                return (
                  <Card key={featureIndex} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-right text-xl">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-right leading-relaxed text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {/* Integration Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                تكامل سلس مع أدواتك المفضلة
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                تتكامل منصة Morvo مع أكثر من 50 أداة وخدمة لتوفر لك تجربة موحدة
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[
                "Google Analytics", "Facebook Ads", "Instagram", "Twitter",
                "LinkedIn", "YouTube", "WhatsApp", "Telegram",
                "Mailchimp", "HubSpot", "Salesforce", "Zapier"
              ].map((tool, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">{tool.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            جرب جميع المميزات مجاناً
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            ابدأ تجربتك المجانية اليوم واكتشف كيف يمكن لمنصة Morvo أن تحول 
            استراتيجيتك التسويقية إلى قصة نجاح
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/auth">
                ابدأ التجربة المجانية
                <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/how-it-works">
                تعلم كيف تعمل المنصة
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Features;
