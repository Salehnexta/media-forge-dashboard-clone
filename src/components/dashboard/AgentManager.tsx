
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Activity, 
  BarChart3, 
  Brain, 
  Zap, 
  Users, 
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
  status: 'active' | 'idle' | 'training';
  performance: number;
  totalTasks: number;
  completedTasks: number;
  specialties: string[];
  context: string;
}

const agents: Agent[] = [
  {
    id: 'strategic',
    name: 'سارة الاستراتيجية',
    role: 'المدير الاستراتيجي',
    avatar: '👩‍💼',
    color: 'bg-blue-500',
    description: 'خبيرة التخطيط والاستراتيجية طويلة المدى',
    status: 'active',
    performance: 94,
    totalTasks: 156,
    completedTasks: 147,
    specialties: ['التخطيط الاستراتيجي', 'تحليل السوق', 'دراسة المنافسين'],
    context: 'متخصصة في وضع الخطط الاستراتيجية وتحليل السوق والمنافسين'
  },
  {
    id: 'creative',
    name: 'ليلى الإبداعية',
    role: 'مبدعة المحتوى',
    avatar: '🎨',
    color: 'bg-purple-500',
    description: 'متخصصة في إنتاج المحتوى الإبداعي والتصميم',
    status: 'active',
    performance: 89,
    totalTasks: 203,
    completedTasks: 181,
    specialties: ['كتابة المحتوى', 'التصميم الإبداعي', 'الأفكار المبتكرة'],
    context: 'خبيرة في إنتاج المحتوى الإبداعي والمرئي للعلامات التجارية'
  },
  {
    id: 'analyst',
    name: 'أحمد المحلل',
    role: 'محلل البيانات',
    avatar: '📊',
    color: 'bg-green-500',
    description: 'خبير تحليل البيانات والإحصائيات',
    status: 'active',
    performance: 97,
    totalTasks: 89,
    completedTasks: 86,
    specialties: ['تحليل البيانات', 'التقارير', 'مؤشرات الأداء'],
    context: 'متخصص في تحليل البيانات واستخراج الرؤى المفيدة للأعمال'
  },
  {
    id: 'social',
    name: 'نور السوشال',
    role: 'مديرة وسائل التواصل',
    avatar: '📱',
    color: 'bg-pink-500',
    description: 'متخصصة في إدارة وسائل التواصل الاجتماعي',
    status: 'idle',
    performance: 91,
    totalTasks: 278,
    completedTasks: 253,
    specialties: ['إدارة المنصات', 'المحتوى الاجتماعي', 'التفاعل'],
    context: 'خبيرة في إدارة جميع منصات التواصل الاجتماعي وزيادة التفاعل'
  },
  {
    id: 'executor',
    name: 'خالد المنفذ',
    role: 'مدير الحملات',
    avatar: '🚀',
    color: 'bg-orange-500',
    description: 'خبير تنفيذ الحملات الإعلانية والتسويقية',
    status: 'training',
    performance: 85,
    totalTasks: 134,
    completedTasks: 114,
    specialties: ['إدارة الحملات', 'الإعلانات المدفوعة', 'تحسين الأداء'],
    context: 'متخصص في تنفيذ وإدارة الحملات الإعلانية على جميع المنصات'
  }
];

export const AgentManager = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'training':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'idle':
        return 'في الانتظار';
      case 'training':
        return 'قيد التدريب';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة الوكلاء</h2>
          <p className="text-gray-600 mt-1">إدارة ومراقبة أداء فريق الذكاء الاصطناعي</p>
        </div>
        <Button className="gap-2">
          <Brain className="w-4 h-4" />
          تدريب جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                فريق الوكلاء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAgent.id === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${agent.color} text-white text-lg`}>
                          {agent.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        {getStatusIcon(agent.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {agent.role}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${agent.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{agent.performance}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Agent Details */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="performance">الأداء</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
              <TabsTrigger value="activity">النشاط</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedAgent.avatar}</span>
                      {selectedAgent.name}
                    </CardTitle>
                    <p className="text-gray-600">{selectedAgent.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedAgent.status)}
                      <span className="text-sm font-medium">
                        {getStatusLabel(selectedAgent.status)}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">التخصصات</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedAgent.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">معدل الأداء</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedAgent.performance} className="flex-1" />
                        <span className="text-sm font-medium">{selectedAgent.performance}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      إحصائيات الأداء
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedAgent.totalTasks}
                        </p>
                        <p className="text-sm text-gray-600">إجمالي المهام</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedAgent.completedTasks}
                        </p>
                        <p className="text-sm text-gray-600">المهام المكتملة</p>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round((selectedAgent.completedTasks / selectedAgent.totalTasks) * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">معدل الإنجاز</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الأداء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">تحليل الأداء قادم قريباً</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    إعدادات الوكيل
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'حفظ' : 'تعديل'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">اسم الوكيل</label>
                    <Input
                      value={selectedAgent.name}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">الدور</label>
                    <Input
                      value={selectedAgent.role}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">السياق والتخصص</label>
                    <Textarea
                      value={selectedAgent.context}
                      disabled={!isEditing}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    سجل النشاط
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">سجل النشاط قادم قريباً</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
