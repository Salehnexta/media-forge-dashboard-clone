
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone, Clock, Users, Book } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "دردشة مباشرة",
      description: "تحدث مع فريق الدعم فوراً",
      availability: "24/7",
      response: "فوري",
      action: "بدء المحادثة"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      description: "أرسل استفسارك عبر البريد",
      availability: "24/7",
      response: "خلال ساعتين",
      action: "إرسال رسالة"
    },
    {
      icon: Phone,
      title: "المكالمة الهاتفية",
      description: "تواصل مباشر مع المختصين",
      availability: "9 ص - 6 م",
      response: "فوري",
      action: "اتصل الآن"
    }
  ];

  return (
    <PageLayout
      title="الدعم والمساعدة"
      description="فريق دعم متخصص على مدار الساعة لمساعدتك في كل خطوة"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الدعم" }
      ]}
    >
      <div className="container mx-auto px-6">
        {/* Quick Support Options */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ساعات العمل:</span>
                        <Badge variant="outline">{option.availability}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وقت الاستجابة:</span>
                        <Badge variant="secondary">{option.response}</Badge>
                      </div>
                    </div>
                    <Button className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                أرسل لنا رسالة
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="الاسم الأول" />
                  <Input placeholder="اسم العائلة" />
                </div>
                <Input placeholder="البريد الإلكتروني" type="email" />
                <Input placeholder="رقم الهاتف" type="tel" />
                <Input placeholder="موضوع الرسالة" />
                <Textarea 
                  placeholder="تفاصيل الاستفسار أو المشكلة..."
                  rows={6}
                />
                <Button size="lg" className="w-full">
                  إرسال الرسالة
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  مصادر مساعدة إضافية
                </h3>
                <div className="space-y-4">
                  <Link to="/help-center" className="block p-4 border rounded-lg hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <Book className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">مركز المساعدة</h4>
                        <p className="text-gray-600 text-sm">أدلة شاملة ومقالات مفيدة</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/faq" className="block p-4 border rounded-lg hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">الأسئلة الشائعة</h4>
                        <p className="text-gray-600 text-sm">إجابات سريعة للأسئلة الشائعة</p>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold">أوقات الدعم</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>الأحد - الخميس: 9:00 ص - 6:00 م</p>
                      <p>الدردشة المباشرة: 24/7</p>
                      <p>البريد الإلكتروني: 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Support;
