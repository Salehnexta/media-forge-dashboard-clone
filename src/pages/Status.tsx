
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Wifi } from "lucide-react";

const Status = () => {
  const systemStatus = [
    {
      service: "المنصة الرئيسية",
      status: "operational",
      uptime: "99.9%",
      responseTime: "120ms",
      icon: Server,
      description: "جميع خدمات المنصة تعمل بشكل طبيعي"
    },
    {
      service: "التحليل الذكي",
      status: "operational", 
      uptime: "99.8%",
      responseTime: "2.3s",
      icon: Activity,
      description: "خدمات الذكاء الاصطناعي والتحليل متاحة"
    },
    {
      service: "قاعدة البيانات",
      status: "operational",
      uptime: "100%",
      responseTime: "45ms",
      icon: Database,
      description: "قاعدة البيانات تعمل بكفاءة عالية"
    },
    {
      service: "واجهة برمجة التطبيقات",
      status: "maintenance",
      uptime: "98.5%",
      responseTime: "180ms",
      icon: Wifi,
      description: "صيانة مجدولة - قد تحدث بطء مؤقت"
    }
  ];

  const incidents = [
    {
      date: "2024-05-20",
      title: "بطء في خدمة التحليل",
      status: "resolved",
      duration: "45 دقيقة",
      description: "تم حل مشكلة بطء في خدمة التحليل الذكي بسبب حمولة عالية على الخوادم",
      severity: "minor"
    },
    {
      date: "2024-05-15",
      title: "صيانة مجدولة للخوادم",
      status: "completed",
      duration: "2 ساعة",
      description: "تم إجراء صيانة مجدولة لتحديث أنظمة الأمان وتحسين الأداء",
      severity: "maintenance"
    },
    {
      date: "2024-05-10",
      title: "انقطاع جزئي في الخدمة",
      status: "resolved",
      duration: "20 دقيقة",
      description: "انقطاع مؤقت في بعض الخدمات بسبب مشكلة في الشبكة، تم الحل بسرعة",
      severity: "major"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "maintenance":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "issue":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">يعمل بشكل طبيعي</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">صيانة</Badge>;
      case "issue":
        return <Badge className="bg-red-100 text-red-800">مشكلة</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "minor":
        return <Badge className="bg-blue-100 text-blue-800">طفيف</Badge>;
      case "major":
        return <Badge className="bg-orange-100 text-orange-800">مهم</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800">حرج</Badge>;
      case "maintenance":
        return <Badge className="bg-purple-100 text-purple-800">صيانة</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  return (
    <PageLayout
      title="حالة الخدمة"
      description="تابع حالة جميع خدمات منصة Morvo والتحديثات المباشرة"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "حالة الخدمة" }
      ]}
    >
      <div className="container mx-auto px-6">
        {/* Overall Status */}
        <section className="mb-16">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">
                جميع الأنظمة تعمل بشكل طبيعي
              </CardTitle>
              <CardDescription className="text-green-700">
                آخر تحديث: اليوم، 2:30 م بتوقيت الرياض
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* System Status */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            حالة الخدمات
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {systemStatus.map((system, index) => {
              const Icon = system.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{system.service}</CardTitle>
                      </div>
                      {getStatusIcon(system.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(system.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-right">
                      {system.description}
                    </CardDescription>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">وقت التشغيل:</span>
                        <span className="font-semibold text-green-600 mr-2">{system.uptime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">وقت الاستجابة:</span>
                        <span className="font-semibold text-blue-600 mr-2">{system.responseTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            الأحداث الأخيرة
          </h3>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        {getSeverityBadge(incident.severity)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{incident.date}</span>
                        <span>المدة: {incident.duration}</span>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        incident.status === 'resolved' || incident.status === 'completed'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {incident.status === 'resolved' ? 'تم الحل' : 
                       incident.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-right leading-relaxed">
                    {incident.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            تلقى تحديثات الحالة
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            اشترك في تحديثات حالة الخدمة لتبقى على اطلاع بأي تغييرات أو صيانة مجدولة
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            اشترك في التحديثات
          </button>
        </section>
      </div>
    </PageLayout>
  );
};

export default Status;
