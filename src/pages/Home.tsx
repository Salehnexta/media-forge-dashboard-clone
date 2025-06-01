import { ArrowLeft, BarChart3, Users, Target, TrendingUp, Star, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "تحليل شامل بالذكاء الاصطناعي",
      description: "تحليل دقيق لشركتك، المنافسين، والسوق باستخدام أحدث تقنيات الذكاء الاصطناعي."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "دراسة متعمقة للمنافسين",
      description: "اكتشف نقاط قوة وضعف منافسيك، وحصصهم السوقية، واستراتيجياتهم التسويقية."
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "استراتيجيات تسويقية مخصصة",
      description: "خطط تسويقية مصممة خصيصاً لشركتك وأهدافك، بناءً على تحليلات دقيقة."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "توصيات قابلة للتنفيذ",
      description: "نصائح وإرشادات عملية لتحسين أدائك التسويقي وزيادة مبيعاتك."
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      title: "المدير التنفيذي لشركة تقنية",
      quote: "منصة مورفو غيرت طريقة تفكيرنا في التسويق. التحليلات الدقيقة والتوصيات العملية ساعدتنا على تحقيق نمو كبير في فترة قصيرة.",
      image: "https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "ليلى خالد",
      title: "صاحبة مشروع تجارة إلكترونية",
      quote: "كنت أواجه صعوبة في فهم السوق والمنافسين. مورفو قدمت لي رؤية واضحة واستراتيجيات تسويقية فعالة ساعدتني على زيادة مبيعاتي وتحقيق أهدافي.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d29tYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "سالم عبدالله",
      title: "مدير تسويق في شركة عقارية",
      quote: "مورفو ساعدتنا على فهم احتياجات عملائنا بشكل أفضل وتصميم حملات تسويقية أكثر فعالية. النتائج كانت مذهلة وزادت من عائد الاستثمار بشكل كبير.",
      image: "https://images.unsplash.com/photo-1534528741702-a0cfae57fca9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const stats = [
    { label: "زيادة في المبيعات", value: "45%" },
    { label: "نمو في العملاء الجدد", value: "60%" },
    { label: "تحسين في عائد الاستثمار", value: "35%" },
    { label: "زيادة في الوعي بالعلامة التجارية", value: "50%" }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-cairo" dir="rtl">
        
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-blue-100 text-blue-800">
              <Sparkles className="w-4 h-4 ml-2" />
              الآن متاح - تحليل مجاني بالذكاء الاصطناعي
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              منصة <span className="text-blue-600">مورفو</span> للتسويق الذكي
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              نظام متكامل يجمع بين الذكاء الاصطناعي وخبرة التسويق لتحليل شركتك وبناء استراتيجيات تسويقية فعالة تحقق نتائج استثنائية
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate('/free-analysis')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-4"
              >
                جرب التحليل المجاني
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/pricing')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
              >
                عرض الباقات
              </Button>
            </div>

            {/* Free Analysis Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 max-w-4xl mx-auto mb-20">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">احصل على تحليل مجاني لشركتك الآن!</h3>
              <p className="text-green-800 mb-6">
                تحليل شامل بالذكاء الاصطناعي يشمل دراسة المنافسين، تحليل السوق، واستراتيجية تسويقية مخصصة - مجاناً 100%
              </p>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-800">تحليل الشركة</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-800">دراسة المنافسين</span>
                </div>
                <div className="flex flex-col items-center">
                  <Target className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-800">استراتيجية مخصصة</span>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-800">خطة تنفيذية</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              الميزات الرئيسية
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              إحصائيات النجاح
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              آراء عملائنا
            </h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ml-4"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              ابدأ رحلتك نحو التسويق الذكي اليوم
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              انضم إلى منصة مورفو وحقق نتائج تسويقية استثنائية بفضل الذكاء الاصطناعي والتحليلات الدقيقة.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4"
            >
              عرض الباقات والأسعار
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Home;
