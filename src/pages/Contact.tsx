
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, MessageCircle, Users } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "info@morvo.com",
      description: "نرد خلال ساعتين"
    },
    {
      icon: Phone,
      title: "رقم الهاتف",
      value: "+966 11 234 5678",
      description: "الأحد - الخميس، 9 ص - 6 م"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      description: "منطقة الملك عبدالله المالي"
    }
  ];

  const departments = [
    {
      icon: Users,
      title: "المبيعات",
      description: "لمناقشة الباقات والأسعار",
      contact: "sales@morvo.com"
    },
    {
      icon: MessageCircle,
      title: "الدعم التقني",
      description: "لحل المشاكل التقنية",
      contact: "support@morvo.com"
    },
    {
      icon: Users,
      title: "الشراكات",
      description: "للاستفسار عن الشراكات",
      contact: "partnerships@morvo.com"
    }
  ];

  return (
    <PageLayout
      title="تواصل معنا"
      description="نحن هنا لمساعدتك! تواصل معنا عبر القنوات المختلفة أو أرسل لنا رسالة مباشرة"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "تواصل معنا" }
      ]}
    >
      <div className="container mx-auto px-6">
        {/* Contact Info */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-2">{info.value}</p>
                    <CardDescription>{info.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Form and Departments */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                أرسل لنا رسالة
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="الاسم الأول" required />
                  <Input placeholder="اسم العائلة" required />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="البريد الإلكتروني" type="email" required />
                  <Input placeholder="رقم الهاتف" type="tel" />
                </div>
                
                <Input placeholder="اسم الشركة" />
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">المبيعات</SelectItem>
                    <SelectItem value="support">الدعم التقني</SelectItem>
                    <SelectItem value="partnerships">الشراكات</SelectItem>
                    <SelectItem value="general">استفسار عام</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input placeholder="موضوع الرسالة" required />
                
                <Textarea 
                  placeholder="تفاصيل رسالتك..."
                  rows={6}
                  required
                />
                
                <Button size="lg" className="w-full">
                  إرسال الرسالة
                </Button>
              </form>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                الأقسام المختصة
              </h3>
              <div className="space-y-6">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{dept.title}</CardTitle>
                            <CardDescription>{dept.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-600 font-medium">{dept.contact}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Working Hours */}
              <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <CardTitle>ساعات العمل</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>الأحد - الخميس:</span>
                      <span className="font-medium">9:00 ص - 6:00 م</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الجمعة - السبت:</span>
                      <span className="font-medium">مغلق</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الدعم عبر الإنترنت:</span>
                      <span className="font-medium text-green-600">24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">موقعنا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">خريطة الموقع</p>
                  <p className="text-sm text-gray-500">الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
};

export default Contact;
