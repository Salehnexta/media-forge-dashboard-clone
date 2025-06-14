
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, BarChart3, Users, Target, TrendingUp, Mail, Search, Eye, Zap } from 'lucide-react';
import { MorvoChat } from '@/components/dashboard/MorvoChat';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
  color: string;
}

const Dashboard = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const agents: Agent[] = [
    {
      id: 'master_agent',
      name: 'الوكيل الرئيسي',
      description: 'منسق المحادثات ومدير تجربة العملاء',
      icon: <Target className="w-6 h-6" />,
      endpoint: 'master_agent',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'analytics_agent',
      name: 'وكيل التحليلات',
      description: 'تحليل البيانات والذكاء التجاري',
      icon: <BarChart3 className="w-6 h-6" />,
      endpoint: 'analytics_agent',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'social_media_agent',
      name: 'وكيل وسائل التواصل',
      description: 'استراتيجية وإدارة وسائل التواصل الاجتماعي',
      icon: <Users className="w-6 h-6" />,
      endpoint: 'social_media_agent',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'seo_agent',
      name: 'وكيل تحسين محركات البحث',
      description: 'تحسين محركات البحث والكلمات المفتاحية',
      icon: <Search className="w-6 h-6" />,
      endpoint: 'seo_agent',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'brand_monitoring_agent',
      name: 'وكيل مراقبة العلامة التجارية',
      description: 'مراقبة السمعة وإدارة الأزمات',
      icon: <Eye className="w-6 h-6" />,
      endpoint: 'brand_monitoring_agent',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'paid_ads_agent',
      name: 'وكيل الإعلانات المدفوعة',
      description: 'إدارة وتحسين الحملات الإعلانية',
      icon: <TrendingUp className="w-6 h-6" />,
      endpoint: 'paid_ads_agent',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'email_marketing_agent',
      name: 'وكيل التسويق بالبريد الإلكتروني',
      description: 'حملات البريد الإلكتروني والأتمتة',
      icon: <Mail className="w-6 h-6" />,
      endpoint: 'email_marketing_agent',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'content_management_agent',
      name: 'وكيل إدارة المحتوى',
      description: 'إنشاء وإدارة المحتوى التسويقي',
      icon: <MessageCircle className="w-6 h-6" />,
      endpoint: 'content_management_agent',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'competitor_analysis_agent',
      name: 'وكيل تحليل المنافسين',
      description: 'البحث التنافسي والتحليل الاستراتيجي',
      icon: <Zap className="w-6 h-6" />,
      endpoint: 'competitor_analysis_agent',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  if (selectedAgent) {
    return (
      <MorvoChat 
        agent={selectedAgent} 
        user={null} 
        onBack={() => setSelectedAgent(null)}
        onLogout={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <img 
                  src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" 
                  alt="Morvo Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">منصة Morvo AI</h1>
                <p className="text-sm text-gray-600">مرحباً بك في منصة Morvo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            اختر الوكيل المناسب لاحتياجاتك
          </h2>
          <p className="text-xl text-gray-600">
            9 وكلاء ذكيين متخصصين في مختلف جوانب التسويق الرقمي
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedAgent(agent)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {agent.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-right">
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-right text-gray-600">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  بدء المحادثة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            البدء السريع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">ابدأ مع الوكيل الرئيسي</h4>
              <p className="text-gray-600 text-sm">
                الوكيل الرئيسي سيساعدك في تحديد احتياجاتك وتوجيهك للوكيل المناسب
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">احصل على تحليلات فورية</h4>
              <p className="text-gray-600 text-sm">
                وكيل التحليلات سيقدم لك رؤى عميقة حول أداء حملاتك التسويقية
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">طور استراتيجيتك</h4>
              <p className="text-gray-600 text-sm">
                تعاون مع الوكلاء المتخصصين لبناء استراتيجية تسويق شاملة
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
